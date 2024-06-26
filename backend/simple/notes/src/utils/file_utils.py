import boto3
import fitz
import io

from botocore.exceptions import ClientError
from config.settings import get_config
from utils.logger import get_logger

config = get_config()
logger = get_logger(__name__)

s3_client = boto3.client('s3')
bucket_name = config.S3_BUCKET_NAME

def get_file_metadata(file_content):
    file_stream = io.BytesIO(file_content)
    content_length_in_bytes = len(file_content)
    doc = fitz.open(stream=file_stream, filetype='pdf')
    num_pages = len(doc)
    doc.close()

    return content_length_in_bytes, num_pages

def upload_to_s3(user_id, file_id, file_content):
    s3_object_key = f"{user_id}/{file_id}"
    try:
        s3_client.put_object(
            Bucket=bucket_name,
            Key=s3_object_key,
            Body=file_content,
        )

    except ClientError as e:
        logger.error(f'AWS S3 upload failed: {e}', exc_info=True)
        raise

def retrieve_from_s3(user_id, file_id):
    s3_object_key = f"{user_id}/{file_id}"
    try:
        s3_response = s3_client.get_object(Bucket=bucket_name, Key=s3_object_key)
        return s3_response['Body'].read()

    except ClientError as e:
        logger.error(f'AWS S3 retrieval failed: {e}', exc_info=True)
        raise
