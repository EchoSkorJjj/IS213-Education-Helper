import logging
import os
from PyPDF2 import PdfReader
from io import BytesIO
import tempfile
import subprocess
from utilities import detect_locale

# Setup based on the environment
environment = os.getenv('ENVIRONMENT_MODE', 'development')
logging_level = logging.INFO if environment.lower() == 'production' else logging.DEBUG
logging.basicConfig(level=logging_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

def process_pdf_file(input_pdf_bytes, generateType, fileId):
    logging.info(f"Starting OCR processing for file: {fileId}")
    # Check the file size before processing
    max_file_size = 5 * 1024 * 1024  # 5 MB
    if len(input_pdf_bytes) > max_file_size:
        logging.error(f"File {fileId} exceeds the maximum allowed size of 5 MB.")
        raise ValueError(f"File {fileId} is too large to process.")

    try:
        input_stream = BytesIO(input_pdf_bytes)
        texts, temp_pdf_path = ocr_pdf(input_stream)
        metadata = generate_metadata(generateType, temp_pdf_path, texts)
    except Exception as e:
        logging.error("Error in OCR processing: %s", e, exc_info=environment.lower() == 'development')
        raise
    finally:
        # Secure cleanup of the temporary file
        if temp_pdf_path and os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)
            logging.debug("Temporary file removed.")
    return texts, metadata

def ocr_pdf(input_stream):
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_output:
        input_data = input_stream.read()
        if not input_data:
            raise ValueError("Input PDF data is empty")
        
        ocrmypdf_cmd = ["ocrmypdf", "-l", "eng", "--force-ocr", "--output-type", "pdf", "-", tmp_output.name]
        process = subprocess.run(ocrmypdf_cmd, input=input_data, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        if process.returncode != 0:
            raise Exception(f"OCR command failed: {process.stderr.decode()}")
        
        logging.debug("OCR processing completed.")
        return extract_text_from_pdf(tmp_output.name), tmp_output.name

def extract_text_from_pdf(pdf_path):
    texts = []
    try:
        pdf_file = open(pdf_path, 'rb')
        reader = PdfReader(pdf_file)
        for page_num, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or "Error extracting text"
            texts.append({"pageId": page_num, "content": text})
    finally:
        pdf_file.close()
    return texts

def generate_metadata(generateType, pdf_path, texts):
    locale = detect_locale(' '.join([text["content"] for text in texts]))
    metadata = {
        "title": os.path.basename(generateType),
        "pageCount": len(texts),
        "filesize": os.path.getsize(pdf_path),
        "locale": locale
    }
    logging.debug("Metadata generated.")
    return metadata
