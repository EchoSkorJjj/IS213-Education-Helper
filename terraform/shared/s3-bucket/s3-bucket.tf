variable "s3_bucket_stack_name" {
  default = "s3-bucket"
}

variable "project_name" {}

resource "aws_s3_bucket" "terraform_state_s3_bucket" {
  # Name of s3 bucket must be unique globally
  bucket = "${var.project_name}-${var.s3_bucket_stack_name}-terraform-state"
  force_destroy = true

  object_lock_enabled = false
}

resource "aws_s3_bucket_versioning" "terraform_state_s3_bucket_versioning" {
  bucket = aws_s3_bucket.terraform_state_s3_bucket.id
  versioning_configuration {
    // When this is enabled, you have to remove all the object
    // inside the bucket before deleting the bucket itself
    status = "Enabled"
  }
}
