variable "dynamodb_table_stack_name" {
  type = string
}

variable "project_name" {
  type = string
}

resource "aws_dynamodb_table" "terraform_state_lock" {
  # Name of dynamodb table must be unique globally
  name           = "${var.project_name}-${var.dynamodb_table_stack_name}-terraform-state"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name = "TerraformStateLockTable"
  }
}
