variable "project_name" {}
variable "environment" {}

variable "aws_vpc_id" {}

variable "eks_cluster_security_group_id" {}

variable "database_private_subnet_1_id" {}
variable "database_private_subnet_2_id" {}

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

resource "aws_db_instance" "postgresql_master" {
  identifier           = "${var.project_name}-postgresql-${var.environment}"
  instance_class       = "db.t3.micro" 
  allocated_storage    = 20  
  max_allocated_storage = 1000  
  engine               = "postgres"
  engine_version       = "16.1"
  username             = jsondecode(data.aws_secretsmanager_secret_version.current_postgres_credentials.secret_string)["postgresql_username"]
  password             = jsondecode(data.aws_secretsmanager_secret_version.current_postgres_credentials.secret_string)["postgresql_password"]
  db_subnet_group_name = aws_db_subnet_group.private_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.postgres_sg.id]
  skip_final_snapshot  = true
  multi_az             = false  

  tags = {
    Environment = var.environment
  }
}

resource "aws_security_group" "postgres_sg" {
  name        = "${var.project_name}-postgres-sg-${var.environment}"
  description = "Security group for PostgreSQL"
  vpc_id      = var.aws_vpc_id

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

  ingress  {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
}

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_route53_record" "postgres_endpoint_cname" {
  zone_id = var.app_domain_zone_id
  name    = "postgres-primary.eduhelper.info"
  type    = "CNAME"
  ttl     = "300"
  records = [aws_db_instance.postgresql_master.address]
}
