variable "aws_region" {}
variable "project_name" {}
variable "environment" {}

variable "availability_zone_1" {}
variable "availability_zone_2" {}

# Create a VPC
resource "aws_vpc" "main_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name        = "${var.project_name}-vpc-${var.environment}"
    Environment = var.environment
  }
}

# Internet Gateway support
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main_vpc.id
}

# Fetch the first two available Availability Zones
data "aws_availability_zones" "available" {
  state = "available"
}

# AZ 1
resource "aws_subnet" "public_subnet_1" {
  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = var.availability_zone_1
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-1"
    "kubernetes.io/role/elb" = 1
    "kubernetes.io/cluster/${var.project_name}-eks-cluster-${var.environment}" = "shared"
  }
}

# Shared means this subnet can be used by other aws resources
# Set to "owned" if this subnet is only used by EKS
# The tags are added as per AWS EKS documentation
# https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html
resource "aws_subnet" "eks_private_subnet_1" {
  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = var.availability_zone_1

  tags = {
    Name = "eks-private-subnet-1"
    "kubernetes.io/role/internal-elb" = 1
    "kubernetes.io/cluster/${var.project_name}-eks-cluster-${var.environment}" = "shared"
  }
}

resource "aws_subnet" "database_private_subnet_1" {
  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = var.availability_zone_1

  tags = {
    Name = "database-private-subnet-1"
  }
}

# AZ 2
resource "aws_subnet" "public_subnet_2" {
  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = var.availability_zone_2
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-2"
    "kubernetes.io/role/elb" = 1
    "kubernetes.io/cluster/${var.project_name}-eks-cluster-${var.environment}" = "shared"
  }
}

resource "aws_subnet" "eks_private_subnet_2" {
  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = "10.0.5.0/24"
  availability_zone = var.availability_zone_2

  tags = {
    Name = "eks-private-subnet-2"
    "kubernetes.io/role/internal-elb" = 1
    "kubernetes.io/cluster/${var.project_name}-eks-cluster-${var.environment}" = "shared"
  }
}

resource "aws_subnet" "database_private_subnet_2" {
  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = "10.0.6.0/24"
  availability_zone = var.availability_zone_2

  tags = {
    Name = "database-private-subnet-2"
  }
}

# AZ 1
# Nat Gateways
resource "aws_eip" "nat_eip_1" {
  domain = "vpc"

  depends_on = [aws_internet_gateway.gw]
}

resource "aws_nat_gateway" "nat_gw_1" {
  allocation_id = aws_eip.nat_eip_1.id
  subnet_id     = aws_subnet.public_subnet_1.id

  tags = {
    Name = "gw-NAT-1"
  }

  depends_on = [aws_internet_gateway.gw]
}

# AZ 2
resource "aws_eip" "nat_eip_2" {
  domain = "vpc"

  depends_on = [aws_internet_gateway.gw]
}

resource "aws_nat_gateway" "nat_gw_2" {
  allocation_id = aws_eip.nat_eip_2.id
  subnet_id     = aws_subnet.public_subnet_2.id

  tags = {
    Name = "gw-NAT-2"
  }

  depends_on = [aws_internet_gateway.gw]
}

# AZ 1
# Public route table
resource "aws_route_table" "public_rt_1" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

# Associate public route table with public subnets
resource "aws_route_table_association" "public_rta_1" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.public_rt_1.id
}

# Private route table
resource "aws_route_table" "private_rt_1" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw_1.id
  }
}

# Associate private route table with private subnets
resource "aws_route_table_association" "private_rta_1" {
  subnet_id      = aws_subnet.eks_private_subnet_1.id
  route_table_id = aws_route_table.private_rt_1.id
}

# AZ 2
resource "aws_route_table" "public_rt_2" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

# Associate public route table with public subnets
resource "aws_route_table_association" "public_rta_2" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_rt_2.id
}

# Private route table
resource "aws_route_table" "private_rt_2" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw_2.id
  }
}

# Associate private route table with private subnets
resource "aws_route_table_association" "private_rta_2" {
  subnet_id      = aws_subnet.eks_private_subnet_2.id
  route_table_id = aws_route_table.private_rt_2.id
}

# NACL for EKS Subnet
resource "aws_network_acl" "eks_nacl" {
  vpc_id = aws_vpc.main_vpc.id
  subnet_ids = [aws_subnet.eks_private_subnet_1.id, aws_subnet.eks_private_subnet_2.id]

  tags = {
    Name = "${var.project_name}-eks-nacl-1-${var.environment}"
  }
}

# Inbound rule to allow traffic from ALB in public subnet 1
resource "aws_network_acl_rule" "inbound_from_alb_public_1" {
  network_acl_id = aws_network_acl.eks_nacl.id
  rule_number    = 100
  rule_action    = "allow"
  egress         = false
  protocol       = "tcp"
  from_port      = 8080
  to_port        = 8080
  cidr_block     = aws_subnet.public_subnet_1.cidr_block
}

# Inbound rule to allow traffic from ALB in public subnet 2
resource "aws_network_acl_rule" "inbound_from_alb_public_2" {
  network_acl_id = aws_network_acl.eks_nacl.id
  rule_number    = 110
  rule_action    = "allow"
  egress         = false
  protocol       = "tcp"
  from_port      = 8080
  to_port        = 8080
  cidr_block     = aws_subnet.public_subnet_2.cidr_block
}

# Inbound rule to allow traffic from EKS in private subnet 1
resource "aws_network_acl_rule" "inbound_from_eks_api_1" {
  network_acl_id = aws_network_acl.eks_nacl.id
  rule_number    = 120
  rule_action    = "allow"
  egress         = false
  protocol       = "tcp"
  from_port      = 0
  to_port        = 65535
  cidr_block     = aws_subnet.eks_private_subnet_1.cidr_block
}

# Inbound rule to allow traffic from EKS in private subnet 2
resource "aws_network_acl_rule" "inbound_from_eks_api_2" {
  network_acl_id = aws_network_acl.eks_nacl.id
  rule_number    = 130
  rule_action    = "allow"
  egress         = false
  protocol       = "tcp"
  from_port      = 0
  to_port        = 65535
  cidr_block     = aws_subnet.eks_private_subnet_2.cidr_block
}

# Inbound rule to allow responses from external services on ephemeral ports for google oauth
resource "aws_network_acl_rule" "inbound_from_external" {
  network_acl_id = aws_network_acl.eks_nacl.id
  rule_number    = 300
  rule_action    = "allow"
  egress         = false
  protocol       = "-1"
  from_port      = 0
  to_port        = 65535
  cidr_block     = "0.0.0.0/0"
}

# Allow ALL outbound traffic
resource "aws_network_acl_rule" "outbound_all" {
  network_acl_id = aws_network_acl.eks_nacl.id
  rule_number    = 290
  rule_action    = "allow"
  egress         = true
  protocol       = "-1"
  from_port      = 0
  to_port        = 65535
  cidr_block     = "0.0.0.0/0"
}

# NACL for Database Subnet
resource "aws_network_acl" "database_nacl" {
  vpc_id = aws_vpc.main_vpc.id
  subnet_ids = [aws_subnet.database_private_subnet_1.id, aws_subnet.database_private_subnet_2.id]

  tags = {
    Name = "${var.project_name}-database-nacl-1-${var.environment}"
  }
}

# Allow inbound PostgreSQL traffic from the private subnet in AZ 1
resource "aws_network_acl_rule" "inbound_postgres_private_1" {
  network_acl_id = aws_network_acl.database_nacl.id
  rule_number    = 100
  rule_action    = "allow"
  egress         = false
  protocol       = "tcp"
  from_port      = 5432
  to_port        = 5432
  cidr_block     = aws_subnet.eks_private_subnet_1.cidr_block
}

# Allow inbound PostgreSQL traffic from the private subnet in AZ 2
resource "aws_network_acl_rule" "inbound_postgres_private_2" {
  network_acl_id = aws_network_acl.database_nacl.id
  rule_number    = 110
  rule_action    = "allow"
  egress         = false
  protocol       = "tcp"
  from_port      = 5432
  to_port        = 5432
  cidr_block     = aws_subnet.eks_private_subnet_2.cidr_block
}

# Allow inbound Redis traffic from the private subnet in AZ 1
resource "aws_network_acl_rule" "inbound_redis_private_1" {
  network_acl_id = aws_network_acl.database_nacl.id
  rule_number    = 120
  rule_action    = "allow"
  egress         = false
  protocol       = "tcp"
  from_port      = 6379
  to_port        = 6379
  cidr_block     = aws_subnet.eks_private_subnet_1.cidr_block
}

# Allow inbound Redis traffic from the private subnet in AZ 2
resource "aws_network_acl_rule" "inbound_redis_private_2" {
  network_acl_id = aws_network_acl.database_nacl.id
  rule_number    = 130
  rule_action    = "allow"
  egress         = false
  protocol       = "tcp"
  from_port      = 6379
  to_port        = 6379
  cidr_block     = aws_subnet.eks_private_subnet_2.cidr_block
}

# Allow inbound PostgreSQL traffic from the public subnet in AZ 1
resource "aws_network_acl_rule" "inbound_postgres_public_1" {
  network_acl_id = aws_network_acl.database_nacl.id
  rule_number    = 140
  rule_action    = "allow"
  egress         = false
  protocol       = "tcp"
  from_port      = 5432
  to_port        = 5432
  cidr_block     = aws_subnet.public_subnet_1.cidr_block
}

# Allow inbound PostgreSQL traffic from the public subnet in AZ 2
resource "aws_network_acl_rule" "inbound_postgres_public_2" {
  network_acl_id = aws_network_acl.database_nacl.id
  rule_number    = 150
  rule_action    = "allow"
  egress         = false
  protocol       = "tcp"
  from_port      = 5432
  to_port        = 5432
  cidr_block     = aws_subnet.public_subnet_2.cidr_block
}

# Allow inbound Redis traffic from the public subnet in AZ 1
resource "aws_network_acl_rule" "inbound_redis_public_1" {
  network_acl_id = aws_network_acl.database_nacl.id
  rule_number    = 160
  rule_action    = "allow"
  egress         = false
  protocol       = "tcp"
  from_port      = 6379
  to_port        = 6379
  cidr_block     = aws_subnet.public_subnet_1.cidr_block
}

# Allow inbound Redis traffic from the public subnet in AZ 2
resource "aws_network_acl_rule" "inbound_redis_public_2" {
  network_acl_id = aws_network_acl.database_nacl.id
  rule_number    = 170
  rule_action    = "allow"
  egress         = false
  protocol       = "tcp"
  from_port      = 6379
  to_port        = 6379
  cidr_block     = aws_subnet.public_subnet_2.cidr_block
}

# Allow all outbound traffic from Database Subnet AZ 1
resource "aws_network_acl_rule" "outbound_all_database_1" {
  network_acl_id = aws_network_acl.database_nacl.id
  rule_number    = 200
  rule_action    = "allow"
  egress         = true
  protocol       = "-1"
  from_port      = 1024
  to_port        = 65535
  cidr_block     = "0.0.0.0/0"
}

# Allow all outbound traffic from Database Subnet AZ 2
resource "aws_network_acl_rule" "outbound_all_database_2" {
  network_acl_id = aws_network_acl.database_nacl.id
  rule_number    = 210
  rule_action    = "allow"
  egress         = true
  protocol       = "-1"
  from_port      = 1024
  to_port        = 65535
  cidr_block     = "0.0.0.0/0"
}
