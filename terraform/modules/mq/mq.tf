variable "aws_vpc_id" {}

variable "project_name" {}
variable "environment" {}

variable "eks_private_subnet_1_id" {}
variable "eks_private_subnet_2_id" {}

variable "eks_cluster_security_group_id" {}

data "aws_secretsmanager_secret" "mq_credentials" {
  name = "mq_credentials"
}

data "aws_secretsmanager_secret_version" "current_mq_credentials" {
  secret_id = data.aws_secretsmanager_secret.mq_credentials.id
}

resource "aws_security_group" "sg" {
  vpc_id = var.aws_vpc_id

  ingress {
    description = "Allow MQ traffic"
    from_port   = 5672
    to_port     = 5672
    protocol    = "tcp"
    security_groups = [ var.eks_cluster_security_group_id ]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_mq_broker" "mq" {
  broker_name = "${var.project_name}-mq-${var.environment}"

  engine_type        = "RabbitMQ"
  engine_version     = "3.11.28"
  host_instance_type = "mq.m5.large"
  security_groups    = [aws_security_group.sg.id]
  deployment_mode    = "CLUSTER_MULTI_AZ"
  subnet_ids         = [ var.eks_private_subnet_1_id, var.eks_private_subnet_2_id ]

  user {
    username             = jsondecode(data.aws_secretsmanager_secret_version.current_mq_credentials.secret_string)["mq_username"]
    password             = jsondecode(data.aws_secretsmanager_secret_version.current_mq_credentials.secret_string)["mq_password"]
  }
}