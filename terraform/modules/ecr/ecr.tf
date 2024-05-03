variable "project_name" {}
variable "environment" {}

resource "aws_ecr_repository" "eks_ecr" {
  name                 = "${var.project_name}-eks-ecr-${var.environment}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}