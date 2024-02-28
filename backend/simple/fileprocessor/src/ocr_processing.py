import logging
import os
from PyPDF2 import PdfReader
from io import BytesIO
import tempfile
import subprocess
from utilities import detect_locale

# Determine the running environment
environment = os.getenv('ENVIRONMENT_MODE', 'development')

# Setup logging based on the environment
if environment.lower() == 'production':
    logging_level = logging.INFO  # Less verbose for production
else:
    logging_level = logging.DEBUG  # More detailed logging for development

logging.basicConfig(level=logging_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

def process_pdf_file(input_pdf_bytes, filename):
    logging.info(f"Starting OCR processing for file: {filename}")
    temp_pdf_path = None
    try:
        input_stream = BytesIO(input_pdf_bytes)
        texts, temp_pdf_path = ocr_pdf(input_stream)
        metadata = generate_metadata(filename, temp_pdf_path, texts)
    except Exception as e:
        # Log error without exposing sensitive details
        logging.error("Error in OCR processing: %s", e, exc_info=environment.lower() == 'development')
        raise
    finally:
        # Cleanup temporary file securely
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
    pdf_file = open(pdf_path, 'rb')
    reader = PdfReader(pdf_file)
    for page_num, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or "Error extracting text"
        texts.append({"pageId": page_num, "content": text})
    pdf_file.close()
    return texts

def generate_metadata(filename, pdf_path, texts):
    locale = detect_locale(' '.join([text["content"] for text in texts]))
    metadata = {
        "title": os.path.basename(filename),
        "pageCount": len(texts),
        "filesize": os.path.getsize(pdf_path),
        "locale": locale
    }
    logging.debug("Metadata generated.")
    return metadata
