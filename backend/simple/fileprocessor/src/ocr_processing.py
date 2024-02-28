# ocr_processing.py
import logging
from PyPDF2 import PdfReader
from io import BytesIO
import tempfile
import subprocess
import os
from utilities import generate_json_response, detect_locale

def process_pdf_file(input_pdf_bytes, filename):
    try:
        input_stream = BytesIO(input_pdf_bytes)
        texts, temp_pdf_path = ocr_pdf(input_stream)
        metadata = generate_metadata(filename, temp_pdf_path, texts)
        
        if os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)
        
        return texts, metadata
    except Exception as e:
        logging.error(f"Error in OCR processing for file {filename}: {str(e)}", exc_info=True)
        raise

def ocr_pdf(input_stream):
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_output:
        ocrmypdf_cmd = ["ocrmypdf", "-l", "eng", "--force-ocr", "--output-type", "pdf", "-", tmp_output.name]
        process = subprocess.run(ocrmypdf_cmd, input=input_stream.read(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        if process.returncode != 0:
            logging.error(f"OCR command failed: {process.stderr.decode()}")
            raise Exception(f"OCR failed for file {tmp_output.name}: {process.stderr.decode()}")
        
        texts = extract_text_from_pdf(tmp_output.name)
        return texts, tmp_output.name

def extract_text_from_pdf(pdf_path):
    texts = []
    with open(pdf_path, 'rb') as pdf_file:
        reader = PdfReader(pdf_file)
        for page_num, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or "Error extracting text"
            texts.append({"pageId": page_num, "content": text})
    return texts

def generate_metadata(filename, pdf_path, texts):
    locale = detect_locale(' '.join([text["content"] for text in texts]))
    metadata = {
        "title": os.path.basename(filename),
        "pageCount": len(texts),
        "filesize": os.path.getsize(pdf_path),
        "locale": locale
    }
    return metadata
