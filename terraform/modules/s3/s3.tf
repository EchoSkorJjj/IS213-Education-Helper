variable "project_name" {}
variable "aws_region" {}

resource "aws_s3_bucket" "static_frontend_bucket" {
  bucket = "${var.project_name}-frontend-bucket"
  force_destroy = true

  object_lock_enabled = false

  tags = {
    Name = "${var.project_name}-frontend-bucket"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "static_frontend_bucket_encryption" {
  bucket = aws_s3_bucket.static_frontend_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "AES256"
    }
  }
}

resource "aws_s3_bucket_website_configuration" "static_frontend_bucket_website" {
  bucket = aws_s3_bucket.static_frontend_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "static_frontend_bucket_block_public_access" {
  bucket = aws_s3_bucket.static_frontend_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "notes_bucket" {
  bucket = "${var.project_name}-notes-bucket"
  force_destroy = true

  object_lock_enabled = false

  tags = {
    Name = "${var.project_name}-notes-bucket"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "notes_bucket_encryption" {
  bucket = aws_s3_bucket.notes_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "notes_bucket_block_public_access" {
  bucket = aws_s3_bucket.notes_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}