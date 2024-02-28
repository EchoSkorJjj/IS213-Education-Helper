# ocr_processing.py
import logging
from PyPDF2 import PdfReader
from io import BytesIO
import tempfile
import subprocess
import os
from utilities import generate_json_response, detect_locale

def process_pdf_file(input_pdf_bytes, filename):
    """
    Perform OCR on the input PDF bytes and extract text.
    """
    try:
        # Convert bytes to a stream for processing
        input_stream = BytesIO(input_pdf_bytes)
        
        # Perform OCR and text extraction
        texts, temp_pdf_path = ocr_pdf(input_stream)
        
        # Generate metadata
        metadata = generate_metadata(filename, temp_pdf_path, texts)
        
        # Cleanup temporary file
        if os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)
        
        return texts, metadata
    except Exception as e:
        logging.error(f"Error processing PDF file: {e}")
        raise

def ocr_pdf(input_stream):
    """
    Use OCR to convert PDF stream to searchable text and extract the text.
    """
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_output:
        # Run OCR on the PDF
        ocrmypdf_cmd = ["ocrmypdf", "-l", "eng", "--force-ocr", "--output-type", "pdf", "-", tmp_output.name]
        process = subprocess.run(ocrmypdf_cmd, input=input_stream.read(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        if process.returncode != 0:
            raise Exception(f"OCR failed: {process.stderr.decode()}")
        
        # Extract text from the OCR-processed PDF
        texts = extract_text_from_pdf(tmp_output.name)
        
    return texts, tmp_output.name

def extract_text_from_pdf(pdf_path):
    """
    Extract text from each page of the PDF, correctly handling page IDs.
    """
    texts = []
    with open(pdf_path, 'rb') as pdf_file:
        reader = PdfReader(pdf_file)
        # Use enumerate to get the page number (index) along with the page object
        for page_num, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or "Error extracting text"
            # Use page_num for pageId, which starts from 1
            texts.append({"pageId": page_num, "content": text})
    return texts


def generate_metadata(filename, pdf_path, texts):
    """
    Generate metadata for the processed PDF.
    """
    locale = detect_locale(' '.join([text["content"] for text in texts]))
    metadata = {
        "title": os.path.basename(filename),
        "pageCount": len(texts),
        "filesize": os.path.getsize(pdf_path),
        "locale": locale
    }
    return metadata
