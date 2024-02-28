# utilities.py
import json
from langdetect import detect

def detect_locale(text):
    """
    Detect the primary language of the given text.
    """
    try:
        # Use langdetect to determine the locale of the text
        locale = detect(text)
        return locale
    except Exception as e:
        # Log and return unknown in case of any error
        print(f"Error detecting locale: {e}")
        return "unknown"

def generate_json_response(file_id, filename, texts, metadata):
    """
    Generate a JSON response structure for the processed file.
    """
    pages = [{"pageId": text["pageId"], "content": text["content"]} for text in texts]
    json_response = {
        "fileId": file_id,
        "metadata": {
            "title": metadata["title"],
            "pageCount": metadata["pageCount"],
            "filesize": metadata["filesize"],
            "locale": metadata["locale"]
        },
        "pages": pages
    }
    return json.dumps(json_response, indent=4, ensure_ascii=False)
