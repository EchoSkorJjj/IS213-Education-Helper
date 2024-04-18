variable "project_name" {}
variable "environment" {}

variable "aws_vpc_id" {}

variable "eks_cluster_security_group_id" {}

variable "database_private_subnet_1_id" {}
variable "database_private_subnet_2_id" {}

variable "app_domain_zone_id" {}

data "aws_secretsmanager_secret" "elasticache_credentials" {
  name = "elasticache_credentials"
}

data "aws_secretsmanager_secret_version" "current_elasticache_credentials" {
  secret_id = data.aws_secretsmanager_secret.elasticache_credentials.id
}

resource "aws_elasticache_subnet_group" "redis_subnet_group" {
  name       = "${var.project_name}-redis-subnet-group-${var.environment}"
  # subnet_ids = [var.database_private_subnet_1_id, var.database_private_subnet_2_id]
  subnet_ids = [var.database_private_subnet_1_id]

  tags = {
    Name        = "${var.project_name}-redis-subnet-group-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_elasticache_replication_group" "redis_cluster_replication_group" {
  replication_group_id       = "${var.project_name}-redis-cluster-${var.environment}"
  description                = "ElastiCache Redis replication group for ${var.project_name} in ${var.environment}"
  node_type                  = "cache.t4g.medium"
  port                       = 6379
  parameter_group_name       = "default.redis7"
  automatic_failover_enabled = false
  multi_az_enabled           = false
  engine_version             = "7.1"
  transit_encryption_enabled = true
  auth_token = jsondecode(data.aws_secretsmanager_secret_version.current_elasticache_credentials.secret_string)["elasticache_auth_token"]

  subnet_group_name    = aws_elasticache_subnet_group.redis_subnet_group.name
  security_group_ids   = [aws_security_group.redis_sg.id]

  # Primary
  num_cache_clusters = 1

  tags = {
    Name        = "${var.project_name}-redis-replication-group-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_security_group" "redis_sg" {
  name        = "${var.project_name}-redis-cluster-sg-${var.environment}"
  description = "Security group for ElastiCache"
  vpc_id = var.aws_vpc_id

  ingress {
    from_port = 6379
    to_port   = 6379
    protocol  = "tcp"
    security_groups = [ var.eks_cluster_security_group_id ]
  }

  ingress {
    from_port = 6379
    to_port   = 6379
    protocol  = "tcp"
    security_groups = [ "sg-0287d0f475a97bc39" ]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_route53_record" "redis_cluster_endpoint_cname" {
  zone_id = var.app_domain_zone_id
  name    = "redis-cluster.eduhelper.info"
  type    = "CNAME"
  ttl     = "300"
  records = [aws_elasticache_replication_group.redis_cluster_replication_group.primary_endpoint_address]
}