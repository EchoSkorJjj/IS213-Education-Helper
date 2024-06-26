import logging
import os
import time
from PyPDF2 import PdfReader
from io import BytesIO
import tempfile
import subprocess
import fitz
from utilities import detect_locale
from nltk.stem import PorterStemmer
from nltk.stem import WordNetLemmatizer
import nltk

nltk.download('wordnet')
nltk.download('omw-1.4')
lemmatizer = WordNetLemmatizer()
stemmer = PorterStemmer()

# Setup logging based on the environment
environment = os.getenv("ENVIRONMENT_MODE", "development")
logging_level = logging.INFO if environment.lower() == "production" else logging.DEBUG
logging.basicConfig(
    level=logging_level, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

def log_time(func):
    """
    Decorator to measure and log the time taken by any function.
    """
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        logging.info(f"{func.__name__} took {end_time - start_time} seconds to execute.")
        return result
    return wrapper

@log_time
def process_pdf_file(input_pdf_bytes, generateType, fileName, fileId):
    logging.info(f"Starting processing for file: {fileId}")
    
    # Check the file size before processing
    max_file_size = 15 * 1024 * 1024  # 5 MB
    if len(input_pdf_bytes) > max_file_size:
        logging.error(f"File {fileId} exceeds the maximum allowed size of 5 MB.")
        raise ValueError(f"File {fileId} is too large to process.")
    
    # Remove signatures before OCR
    input_pdf_bytes_no_sign = remove_signatures(input_pdf_bytes)

    try:
        input_stream = BytesIO(input_pdf_bytes_no_sign)
        texts, temp_pdf_path = ocr_pdf(input_stream)
        metadata = generate_metadata(generateType, fileName, temp_pdf_path, texts)
    except Exception as e:
        logging.error(
            "Error in processing: %s",
            e,
            exc_info=environment.lower() == "development",
        )
        raise
    finally:
        # Secure cleanup of the temporary file
        if temp_pdf_path and os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)
            logging.debug("Temporary file removed.")
    return texts, metadata


@log_time
def remove_signatures(input_pdf_bytes):
    """
    Removes digital signatures from a PDF file.

    Args:
        input_pdf_bytes (bytes): The content of the PDF file as a byte stream.

    Returns:
        bytes: The content of the modified PDF file as a byte stream without digital signatures.
    """
    # Create a PDF document object from bytes
    pdf = fitz.open(stream=input_pdf_bytes, filetype="pdf")
    
    # Save the PDF document back to a bytes object, effectively removing signatures
    output_bytes = pdf.tobytes()
    pdf.close()
    
    logging.info("Digital signatures removed from the PDF.")
    return output_bytes

@log_time
def ocr_pdf(input_stream):
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_output:
        input_data = input_stream.getvalue()
        if not input_data:
            raise ValueError("Input PDF data is empty")

        ocrmypdf_cmd = [
            "ocrmypdf",
            "-l",
            "eng",
            "--optimize",
            "0",
            "--fast-web-view",
            "0",
            "--skip-text",
            "--skip-big",
            "2",
            "--output-type",
            "pdf",
            "-",
            tmp_output.name,
        ]
        process = subprocess.run(
            ocrmypdf_cmd,
            input=input_data,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        if process.returncode != 0:
            raise Exception(f"OCR command failed: {process.stderr.decode()}")

        logging.debug("OCR processing completed.")
        return extract_text_from_pdf(tmp_output.name), tmp_output.name

@log_time
def process_text(text, process_flag=True):
    """
    Process the text by lemmatizing and stemming if process_flag is True.

    Args:
        text (str): Text content to process.
        process_flag (bool): Flag to control whether to apply text processing.

    Returns:
        str: The original or processed text depending on the process_flag.
    """
    if process_flag:
        # Lemmatization
        words = text.split()
        lemmatized_text = ' '.join([lemmatizer.lemmatize(word) for word in words])

        # Stemming
        stemmed_text = ' '.join([stemmer.stem(word) for word in lemmatized_text.split()])
        return stemmed_text
    else:
        return text

@log_time
def extract_text_from_pdf(pdf_path):
    texts = []
    try:
        doc = fitz.open(pdf_path)  # Open the PDF with fitz
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)  # Load the current page
            raw_text = page.get_text() 
            processed_text = process_text(raw_text, True)  
            texts.append({"pageId": page_num + 1, "content": processed_text,})
 
    finally:
        doc.close()  # Make sure to close the document to free resources
    return texts


@log_time
def generate_metadata(generateType, fileName, pdf_path, texts):
    locale = detect_locale(" ".join([text["content"] for text in texts]))
    metadata = {
        "title": os.path.basename(fileName),
        "generateType": os.path.basename(generateType),
        "pageCount": len(texts),
        "filesize": os.path.getsize(pdf_path),
        "locale": locale,
    }
    logging.debug("Metadata generated.")
    return metadata
