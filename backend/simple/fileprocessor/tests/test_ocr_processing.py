import pytest
from unittest.mock import patch, MagicMock
from io import BytesIO
import os
import ocr_processing


# Testing ocr_pdf
@patch("src.ocr_processing.subprocess.run")
@patch("src.ocr_processing.tempfile.NamedTemporaryFile")
def test_ocr_pdf(mock_named_tempfile, mock_subprocess_run):
    # Setup mock for NamedTemporaryFile
    mock_file = MagicMock()
    mock_named_tempfile.return_value.__enter__.return_value = mock_file
    mock_file.name = "temp_file_path.pdf"
    
    # Setup mock for subprocess.run to simulate successful OCR
    mock_subprocess_run.return_value.returncode = 0
    
    with patch("src.ocr_processing.extract_text_from_pdf", return_value=[{"pageId": 1, "content": "Test content"}]) as mock_extract_text:
        # Prepare test data
        input_stream = BytesIO(b"pdf data")
        
        # Call the function under test
        texts, temp_pdf_path = ocr_processing.ocr_pdf(input_stream)
        
        # Verify
        assert texts == [{"pageId": 1, "content": "Test content"}]
        assert temp_pdf_path == "temp_file_path.pdf"
        mock_extract_text.assert_called_once_with("temp_file_path.pdf")

# Testing extract_text_from_pdf
def test_extract_text_from_pdf():
    # Assuming fitz.open and page.get_text are what we're mocking
    with patch("src.ocr_processing.fitz.open") as mock_fitz_open:
        # Setup mock PDF and page
        mock_pdf = mock_fitz_open.return_value
        mock_page = MagicMock()
        mock_pdf.load_page.return_value = mock_page
        mock_page.get_text.return_value = "Sample text on page"
        
        # Simulate a PDF with one page
        mock_pdf.__len__.return_value = 1
        
        # Call the function under test
        texts = ocr_processing.extract_text_from_pdf("dummy_path.pdf")
        
        # Assertions
        assert len(texts) == 1
        assert texts[0]["content"] == "Sample text on page"

# Testing generate_metadata
@patch("src.ocr_processing.detect_locale", return_value="en-US")
@patch("src.ocr_processing.os.path.getsize", return_value=1024)
def test_generate_metadata(mock_getsize, mock_detect_locale):
    # Prepare test data
    generateType = "testType"
    fileName = "testFile.pdf"
    pdf_path = "/fake/path/testFile.pdf"
    texts = [{"pageId": 1, "content": "Test content"}]
    
    # Call the function under test
    metadata = ocr_processing.generate_metadata(generateType, fileName, pdf_path, texts)
    
    # Assertions
    assert metadata["title"] == "testFile.pdf"
    assert metadata["generateType"] == "testType"
    assert metadata["pageCount"] == 1
    assert metadata["filesize"] == 1024
    assert metadata["locale"] == "en-US"

@pytest.fixture
def input_pdf_bytes():
    return b"PDF content"

@pytest.fixture
def expected_metadata():
    return {
        "title": "testFile.pdf",
        "generateType": "testType",
        "pageCount": 1,
        "filesize": 1024,
        "locale": "en-US",
    }

# Integration Test for process_pdf_file
@patch("src.ocr_processing.remove_signatures")
@patch("src.ocr_processing.ocr_pdf", return_value=([], "temp_pdf_path"))
@patch("src.ocr_processing.generate_metadata")
@patch("src.ocr_processing.os.remove")
def test_process_pdf_file_integration(mock_remove, mock_ocr_pdf, mock_generate_metadata, mock_os_remove, input_pdf_bytes, expected_metadata):
    mock_generate_metadata.return_value = expected_metadata
    
    # Call the function under test
    texts, metadata = ocr_processing.process_pdf_file(input_pdf_bytes, "testType", "testFile.pdf", "FileID")
    
    # Assertions
    assert metadata == expected_metadata
    mock_remove.assert_called_once_with(input_pdf_bytes)
    mock_ocr_pdf.assert_called()
    mock_generate_metadata.assert_called()
    mock_os_remove.assert_called_with("temp_pdf_path")
