variable "aws_region" {}
variable "project_name" {}
variable "environment" {}

variable "aws_vpc_id" {}

variable "logs_s3_bucket_arn" {}

variable "eks_private_subnet_1_id" {}
variable "eks_private_subnet_2_id" {}

variable "eks_cluster_services_name" {}

data "aws_caller_identity" "current" {}

# IAM role for node group to assume
resource "aws_iam_role" "node_group_role" {
  name = "${var.project_name}-node-group-role-${var.environment}"

  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_policy" "eks_msk_policy" {
  name        = "${var.project_name}-eks-msk-policy-${var.environment}"
  description = "Policy to allow EKS node group to interact with MSK cluster"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = "kafka:*",
        Resource = "*"
      }
    ],
  })
}

resource "aws_iam_policy" "eks_elasticsearch_policy" {
  name        = "${var.project_name}-eks-elasticsearch-policy-${var.environment}"
  description = "Policy to allow EKS node group to interact with Elasticsearch"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = "es:*",
      Resource = "arn:aws:es:${var.aws_region}:${data.aws_caller_identity.current.account_id}:domain/${var.project_name}-elasticsearch/*"
    }]
  })
}


resource "aws_iam_policy" "ses_send_email_policy" {
  name        = "${var.project_name}-ses-send-email-policy-${var.environment}"
  description = "Policy to allow sending emails via SES"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_iam_policy" "s3_read_write_policy" {
  name        = "${var.project_name}-s3-read-write-policy-${var.environment}"
  description = "Policy to allow S3 read and write access"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "${var.logs_s3_bucket_arn}/*"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "Node_Group_AmazonEKSWorkerNodePolicy" {
# Allows them to connect to EKS clusters
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.node_group_role.name
}

resource "aws_iam_role_policy_attachment" "Node_Group_AmazonEKS_CNI_Policy" {
# Service that Adds IP addresses to kubernetes nodes
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.node_group_role.name
}

resource "aws_iam_role_policy_attachment" "Node_Group_AmazonEC2ContainerRegistryReadOnly" {
# ECR for images if exists
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.node_group_role.name
}

resource "aws_iam_role_policy_attachment" "Node_Group_AmazonSESEmailToCheckers" {
  policy_arn = aws_iam_policy.ses_send_email_policy.arn
  role       = aws_iam_role.node_group_role.name
}

resource "aws_iam_role_policy_attachment" "Node_Group_AmazonS3ReadWriteAccessToLogsBucket" {
  policy_arn = aws_iam_policy.s3_read_write_policy.arn
  role       = aws_iam_role.node_group_role.name
}

resource "aws_iam_role_policy_attachment" "Node_Group_Elasticsearch_Policy" {
  policy_arn = aws_iam_policy.eks_elasticsearch_policy.arn
  role       = aws_iam_role.node_group_role.name
}

resource "aws_iam_role_policy_attachment" "Node_Group_MSK_Policy" {
  policy_arn = aws_iam_policy.eks_msk_policy.arn
  role       = aws_iam_role.node_group_role.name
}

resource "aws_eks_node_group" "eks_node_group" {
  cluster_name    = var.eks_cluster_services_name
  node_group_name = "${var.project_name}-node-group-${var.environment}"
  node_role_arn   = aws_iam_role.node_group_role.arn
  subnet_ids      = [var.eks_private_subnet_1_id, var.eks_private_subnet_2_id]

 scaling_config {
    desired_size = 4
    max_size     = 6  
    min_size     = 1 
  }

  update_config {
    max_unavailable = 1
  }

  ami_type = "AL2_ARM_64"
  instance_types = ["c7g.large"]
  capacity_type = "ON_DEMAND"
  depends_on = [
    aws_iam_role_policy_attachment.Node_Group_AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.Node_Group_AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.Node_Group_AmazonEC2ContainerRegistryReadOnly,
    aws_iam_role_policy_attachment.Node_Group_AmazonSESEmailToCheckers,
    aws_iam_role_policy_attachment.Node_Group_AmazonS3ReadWriteAccessToLogsBucket,
    aws_iam_role_policy_attachment.Node_Group_Elasticsearch_Policy,
    aws_iam_role_policy_attachment.Node_Group_MSK_Policy
  ]
}

resource "aws_security_group" "node_group_sg" {
  name = "${var.project_name}-node-group-sg-${var.environment}"
  description = "EKS Node Group Security Group"
  vpc_id      = var.aws_vpc_id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}