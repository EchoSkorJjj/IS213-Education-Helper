variable "dynamodb_table_stack_name" {}
variable "s3_bucket_stack_name" {}
variable "project_name" {}

module "dynamodb-table" {
  source = "./dynamodb-table"
  dynamodb_table_stack_name = var.dynamodb_table_stack_name
  project_name = var.project_name
}

module "s3-bucket" {
  source = "./s3-bucket"
  s3_bucket_stack_name = var.s3_bucket_stack_name
  project_name = var.project_name
}