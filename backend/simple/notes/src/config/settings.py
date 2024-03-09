import os

class Config:
    DEBUG = False
    PORT = os.getenv('PORT', '50052')
    S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME', 'eduhelper-s3notes-bucket')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

def get_config():
    environment = os.getenv('ENVIRONMENT', 'development').lower()
    if environment == 'production':
        return ProductionConfig()
    return DevelopmentConfig()
