variable "project_name" {}
variable "environment" {}

variable "aws_vpc_id" {}

variable "eks_private_subnet_1_id" {}
variable "eks_private_subnet_2_id" {}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["eks.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

# Create a IAM role for EKS cluster
resource "aws_iam_role" "eks_cluster_services_role" {
  name               = "${var.project_name}-eks-cluster-services-role-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy_attachment" "EKS_AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_services_role.name
}

resource "aws_iam_role_policy_attachment" "EKS_AmazonEKSVPCResourceController" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = aws_iam_role.eks_cluster_services_role.name
}

# AWS creates eks cluster security group by default which cannot be changed
resource "aws_eks_cluster" "eks_cluster_services" {
  name     = "${var.project_name}-eks-cluster-${var.environment}"
  role_arn = aws_iam_role.eks_cluster_services_role.arn
  version  = 1.29

  vpc_config {
    subnet_ids = [var.eks_private_subnet_1_id, var.eks_private_subnet_2_id]
    endpoint_private_access = true
    endpoint_public_access  = false
  }

  # Ensure that IAM Role permissions are created before and deleted after EKS Cluster handling.
  # Otherwise, EKS will not be able to properly delete EKS managed EC2 infrastructure such as Security Groups.
  depends_on = [
    aws_iam_role_policy_attachment.EKS_AmazonEKSClusterPolicy,
    aws_iam_role_policy_attachment.EKS_AmazonEKSVPCResourceController,
  ]
}