variable "project_name" {}
variable "environment" {}

variable "aws_vpc_id" {}

variable "eks_cluster_security_group_id" {}

variable "database_private_subnet_1_id" {}
variable "database_private_subnet_2_id" {}

variable "availability_zone_1" {}

variable "app_domain_zone_id" {}

data "aws_secretsmanager_secret" "postgres_credentials" {
  name = "rds_postgres_credentials"
}

data "aws_secretsmanager_secret_version" "current_postgres_credentials" {
  secret_id = data.aws_secretsmanager_secret.postgres_credentials.id
}

resource "aws_db_subnet_group" "private_db_subnet_group" {
  name       = "${var.project_name}-private-db-subnet-group-${var.environment}"
  subnet_ids = [var.database_private_subnet_1_id, var.database_private_subnet_2_id]

  tags = {
    Name        = "${var.project_name}-private-db-subnet-group-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_rds_cluster" "aurora_cluster" {
  cluster_identifier        = "${var.project_name}-aurora-cluster-${var.environment}"
  engine                    = "aurora-postgresql"
  engine_version            = "15.4"
  database_name             = "eduhelperdb"
  master_username           = jsondecode(data.aws_secretsmanager_secret_version.current_postgres_credentials.secret_string)["postgresql_username"]
  master_password           = jsondecode(data.aws_secretsmanager_secret_version.current_postgres_credentials.secret_string)["postgresql_password"]
  skip_final_snapshot       = true
  db_subnet_group_name      = aws_db_subnet_group.private_db_subnet_group.name
  vpc_security_group_ids    = [aws_security_group.aurora_sg.id]

  tags = {
    Environment = var.environment
  }
}

resource "aws_rds_cluster_instance" "aurora_cluster_instance_replica_1" {
  identifier         = "${var.project_name}-aurora-cluster-instance-replica-1-${var.environment}"
  cluster_identifier = aws_rds_cluster.aurora_cluster.id
  instance_class     = "db.r5.large"
  availability_zone  = var.availability_zone_1
  engine             = aws_rds_cluster.aurora_cluster.engine
  engine_version     = aws_rds_cluster.aurora_cluster.engine_version
  db_subnet_group_name = aws_db_subnet_group.private_db_subnet_group.name
  publicly_accessible = false
}

resource "aws_security_group" "aurora_sg" {
  name        = "${var.project_name}-aurora-cluster-sg-${var.environment}"
  description = "Security group for Aurora cluster"
  vpc_id = var.aws_vpc_id

  ingress {
    from_port = 5432
    to_port   = 5432
    protocol  = "tcp"
    security_groups = [ var.eks_cluster_security_group_id ]
  }

  ingress {
    from_port = 5432
    to_port   = 5432
    protocol  = "tcp"
    security_groups = [ "sg-0c5678e4b9c677010" ]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_route53_record" "aurora_primary_endpoint_cname" {
  zone_id = var.app_domain_zone_id
  name    = "postgres-primary.eduhelper.info"
  type    = "CNAME"
  ttl     = "300"
  records = [aws_rds_cluster.aurora_cluster.endpoint]
}