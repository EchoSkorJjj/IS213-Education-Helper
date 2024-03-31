import logging
import re 
import json
def preprocess_json_string(response_string):
    # Fix missing commas between key-value pairs within the same object
    # Targets end of a string value or object/array followed by a key without an intervening comma
    response_string = re.sub(r'(?<=[}\]"0-9])\s*(?="{)', ',', response_string)
    
    formatted_response = re.sub(r',\s*}', '}', response_string)
    formatted_response = re.sub(r'}\s*{', '},{', formatted_response)
    formatted_response = re.sub(r'^\[\s*', '', formatted_response)
    formatted_response = re.sub(r'\s*\]$', '', formatted_response)
    formatted_response = re.sub(r'(?<=[}\]"0-9])\s+(?=")', ', ', formatted_response)

    # Normalize object boundaries to ensure they can be correctly identified
    formatted_response = re.sub(r',\s*}', '}', formatted_response)
    formatted_response = re.sub(r'}\s*{', '},{', formatted_response)
    formatted_response = re.sub(r'"\s*\n\s*"', '",\n"', formatted_response)

    return formatted_response

def extract_and_validate_json_objects(response_string):
    response_string = preprocess_json_string(response_string)

    objects = []
    obj_start = 0
    depth = 0
    in_string = False
    escape = False

    # Iterate over the response string character by character
    for i, char in enumerate(response_string):
        if char == '"' and not escape:
            in_string = not in_string
        elif char in ['{', '['] and not in_string:
            if depth == 0:
                obj_start = i
            depth += 1
        elif char in ['}', ']'] and not in_string:
            depth -= 1
            if depth == 0 and obj_start is not None:
                try:
                    obj = json.loads(response_string[obj_start:i+1])
                    objects.append(obj)
                except json.JSONDecodeError as e:
                    logging.error(f"JSON parsing error: {e} at position {i}")
        elif char == '\\' and in_string:
            escape = not escape
        else:
            escape = False

    return objects