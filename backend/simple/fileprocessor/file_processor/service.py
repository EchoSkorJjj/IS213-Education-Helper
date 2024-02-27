import subprocess
import os
import logging
from PyPDF2 import PdfReader
import asyncio
import json
from langdetect import detect
from io import BytesIO
import uuid
import shutil
import tempfile

import grpc
from concurrent import futures
import file_processor_pb2
import file_processor_pb2_grpc

# Securely configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class FileProcessorServicer(file_processor_pb2_grpc.FileProcessorServicer):
    async def ProcessFile(self, request, context):
        input_pdf_bytes = request.file
        file_id = request.fileId
        filename = request.filename
        texts, error = await ocr_pdf_and_extract_text(filename, 'eng', input_bytes=input_pdf_bytes)
        if texts:
            json_response = generate_json_response(file_id, filename, texts)
            response = json.loads(json_response)
            pages = [file_processor_pb2.Page(pageId=p["pageId"], content=p["content"]) for p in response["pages"]]
            metadata = file_processor_pb2.FileMetadata(title=response["metadata"]["title"],
                                                        pageCount=response["metadata"]["pageCount"],
                                                        filesize=response["metadata"]["filesize"],
                                                        locale=response["metadata"]["locale"])
            return file_processor_pb2.FileProcessResponse(fileId=file_id, metadata=metadata, pages=pages)
        else:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(error)
            return file_processor_pb2.FileProcessResponse()


# Validate and sanitize input PDF path
def secure_path(input_pdf):
    if not os.path.isfile(input_pdf) or not input_pdf.lower().endswith('.pdf'):
        raise ValueError("Invalid PDF file.")
    return os.path.abspath(input_pdf)

async def ocr_pdf_and_extract_text(input_pdf, lang='eng',input_bytes=None):
    """
    Perform OCR on a PDF file and extract text securely, without generating an output file.
    """
    try:
        input_pdf = secure_path(input_pdf)
    except ValueError as e:
        logging.error(f"Security check failed: {e}")
        return None, str(e)
    
    # comment the above line once grpc implemented

    # # Generate temporary file from the GRPC bytes
    # with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_input:
    #     tmp_input.write(input_bytes)
    #     tmp_input_path = tmp_input.name

    # # Use a temporary file to handle OCR output securely
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_output:
        ocrmypdf_cmd = ["ocrmypdf", "-l", lang, "--force-ocr", "--output-type", "pdf", input_pdf, tmp_output.name]
        # ocrmypdf_cmd = ["ocrmypdf", "-l", lang, "--force-ocr", "--output-type", "pdf", tmp_input_path, tmp_output.name] Uncomment when GRPC implemented

        try:
            process = await asyncio.create_subprocess_exec(*ocrmypdf_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = await process.communicate()
            if process.returncode == 0:
                logging.info(f"Successfully processed {input_pdf}.")
                # Securely read the OCR output from the temporary file
                with open(tmp_output.name, 'rb') as ocr_output:
                    texts = extract_text_from_stream(ocr_output)
                return texts, None
            else:
                error_message = f"Error processing {input_pdf}: {stderr.decode()}"
                logging.error(error_message)
                return None, error_message
        except Exception as e:
            logging.error(f"An unexpected error occurred: {e}")
            return None, str(e)
        finally:
            # Ensure temporary file is securely deleted
            os.remove(tmp_output.name)

def extract_text_from_stream(pdf_stream):
    """
    Securely extract text from a PDF stream.
    """
    try:
        reader = PdfReader(pdf_stream)
        texts = [page.extract_text() for page in reader.pages if page.extract_text()]
        return texts
    except Exception as e:
        logging.error(f"Failed to extract text from stream: {e}")
        return []

def generate_json_response(file_id, file_path, texts):
    """
    Generate a secure JSON response without needing to reference an output file path.
    """
    try:
        metadata = {
            "title": os.path.basename(file_path),
            "pageCount": len(texts),
            "filesize": os.path.getsize(file_path),
            "locale": detect(' '.join(texts)) if texts else "unknown"
        }
    except Exception as e:
        logging.error(f"Error generating metadata for {file_path}: {e}")
        metadata = {}

    response = {
        "fileId": file_id,
        "metadata": metadata,
        "pages": [{"pageId": idx + 1, "content": text or "Error extracting text"} for idx, text in enumerate(texts)]
    }
    
    return json.dumps(response, indent=4, ensure_ascii=False)

async def main():
    input_pdf = "example.pdf"
    input_pdf_bytes = b''  # This should be the actual bytes of the PDF file

    lang = "eng"
    file_id = str(uuid.uuid4())

    texts, error = await ocr_pdf_and_extract_text(input_pdf, lang)
    if texts:
        json_response = generate_json_response(file_id, input_pdf, texts)
        print(json_response)
    else:
        logging.error(f"OCR processing failed: {error}")

async def serve():
    server = grpc.aio.server()
    file_processor_pb2_grpc.add_FileProcessorServicer_to_server(FileProcessorServicer(), server)
    server.add_insecure_port('[::]:50051')
    await server.start()
    await server.wait_for_termination()

if __name__ == '__main__':
    asyncio.run(serve())
