import boto3
from botocore.exceptions import ClientError
from config.settings import get_config
from utils.logger import get_logger

config = get_config()
logger = get_logger(__name__)

s3_client = boto3.client('s3')
bucket_name = config.S3_BUCKET_NAME

def upload_to_s3(user_id, note_id, file_content):
    s3_object_key = f"{user_id}/{note_id}"
    try:
        s3_client.put_object(Bucket=bucket_name, Key=s3_object_key, Body=file_content)
    except ClientError as e:
        logger.error(f'AWS S3 upload failed: {e}', exc_info=True)
        raise

def retrieve_from_s3(user_id, note_id):
    s3_object_key = f"{user_id}/{note_id}"
    try:
        s3_response = s3_client.get_object(Bucket=bucket_name, Key=s3_object_key)
        return s3_response['Body'].read()
    except ClientError as e:
        logger.error(f'AWS S3 retrieval failed: {e}', exc_info=True)
        raise
