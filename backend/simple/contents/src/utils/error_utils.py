import logging
import traceback

def construct_key_error(key: str) -> KeyError:
    return KeyError(f"KeyError: {key}")

def construct_error_message(message: str, e: Exception) -> str:
    return f"{message}: {e}"

def handle_error(context, error_message, status, e):
    traceback.print_exc()
    full_error_message = construct_error_message(error_message, e)
    logging.error(full_error_message)
    context.abort(status, full_error_message)