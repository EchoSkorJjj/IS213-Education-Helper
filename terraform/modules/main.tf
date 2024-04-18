variable "environment" {}  
variable "project_name" {}
variable "aws_region" {}
variable "app_domain" {}

provider "aws" {
  region = var.aws_region
}

provider "helm" {
  kubernetes {
    host                   = module.eks.eks_cluster_services_endpoint
    cluster_ca_certificate = base64decode(module.eks.eks_cluster_services_certificate_authority[0].data)
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      args        = ["eks", "get-token", "--cluster-name", module.eks.eks_cluster_services_name]
      command     = "aws"
    }
  }
}

# Fetch the first two available Availability Zones
data "aws_availability_zones" "available" {
  state = "available"
}

// Please dont change this backend configuration
// If you do need to change it, you either need to migrate or keep current config
// If you do migrate you will get tons of "this" already exists error unless you change the names like from development to staging
terraform {
  backend "s3" {
    bucket = "esd-eduhelper-s3-bucket-terraform-state"
    key                  = "terraform.tfstate"
    workspace_key_prefix = "workspaces"
    region               = "ap-southeast-1"
    dynamodb_table = "esd-eduhelper-dynamodb-table-terraform-state"
    encrypt        = true
  }
}

module "route53" {
  source = "./route53"

  app_domain = var.app_domain
}

module "acm" {
  source = "./acm"

  app_domain_name = module.route53.aws_route53_zone_name
  app_domain_zone_id = module.route53.aws_route53_zone_id
}

module "s3" {
  source = "./s3"

  project_name = var.project_name
  aws_region = var.aws_region
}

module "ecr" {
  source = "./ecr"

  project_name = var.project_name
  environment = var.environment
}

module "cloudfront" {
  source = "./cloudfront"

  # ACM
  acm_certificate_validation = module.acm.certificate_validation
  acm_certificate_arn = module.acm.aws_acm_certificate_arn

  # S3 Bucket
  frontend_s3_bucket_id = module.s3.frontend_s3_bucket_id
  frontend_s3_bucket_arn = module.s3.frontend_s3_bucket_arn
  frontend_s3_bucket_regional_domain_name = module.s3.frontend_s3_bucket_regional_domain_name

  # Route53
  app_domain_name = module.route53.aws_route53_zone_name
  app_domain_zone_id = module.route53.aws_route53_zone_id

  # WAF
  cloudfront_waf_web_acl_arn = module.waf.cloudfront_waf_web_acl_arn

  project_name = var.project_name

  depends_on = [ module.s3, module.waf ]
}

module "waf" {
  source = "./waf"

  project_name = var.project_name
}

module "vpc" {
  source = "./vpc"

  aws_region  = var.aws_region
  project_name = var.project_name
  environment  = var.environment

  availability_zone_1 = data.aws_availability_zones.available.names[0]
  availability_zone_2 = data.aws_availability_zones.available.names[1]
}

module "eks" {
  source = "./eks"

  project_name = var.project_name
  environment  = var.environment

  aws_vpc_id = module.vpc.aws_vpc_id

  eks_private_subnet_1_id = module.vpc.eks_private_subnet_1_id
  eks_private_subnet_2_id = module.vpc.eks_private_subnet_2_id

  depends_on = [ module.vpc ]
}

module "eks-node-group" {
  source = "./eks-node-group"

  aws_region  = var.aws_region
  project_name = var.project_name
  environment  = var.environment

  aws_vpc_id = module.vpc.aws_vpc_id

  notes_s3_bucket_arn = module.s3.notes_s3_bucket_arn

  eks_private_subnet_1_id = module.vpc.eks_private_subnet_1_id
  eks_private_subnet_2_id = module.vpc.eks_private_subnet_2_id

  eks_cluster_services_name = module.eks.eks_cluster_services_name

  depends_on = [ module.s3 ]
}

module "oidc" {
  source = "./oidc"

  eks_cluster_services_identity = module.eks.eks_cluster_services_identity
}

module "alb" {
  source = "./alb"

  project_name = var.project_name
  environment  = var.environment

  # Route53
  app_domain_zone_id = module.route53.aws_route53_zone_id

  # ACM
  alb_acm_certificate_arn = module.acm.aws_acm_alb_certificate_arn

  oidc_arn = module.oidc.oidc_arn
  oidc_url = module.oidc.oidc_url

  aws_vpc_id = module.vpc.aws_vpc_id

  eks_cluster_services_name = module.eks.eks_cluster_services_name

  depends_on = [ module.eks, module.acm.alb_certificate_validation ]
}

module "mq" {
  source = "./mq"

  project_name = var.project_name
  environment = var.environment

  aws_vpc_id  = module.vpc.aws_vpc_id

  eks_cluster_security_group_id = module.eks.eks_cluster_security_group_id

  eks_private_subnet_1_id = module.vpc.eks_private_subnet_1_id
  eks_private_subnet_2_id = module.vpc.eks_private_subnet_2_id
}

module "elasticache-redis" {
  source = "./elasticache-redis"

  project_name = var.project_name
  environment = var.environment

  aws_vpc_id  = module.vpc.aws_vpc_id

  eks_cluster_security_group_id = module.eks.eks_cluster_security_group_id

  database_private_subnet_1_id = module.vpc.database_private_subnet_1_id
  database_private_subnet_2_id = module.vpc.database_private_subnet_2_id

  app_domain_zone_id = module.route53.aws_route53_zone_id
}

module "rds-postgresql" {
  source = "./rds-postgresql"

  project_name = var.project_name
  environment = var.environment

  aws_vpc_id  = module.vpc.aws_vpc_id

  eks_cluster_security_group_id = module.eks.eks_cluster_security_group_id

  database_private_subnet_1_id = module.vpc.database_private_subnet_1_id
  database_private_subnet_2_id = module.vpc.database_private_subnet_2_id

  app_domain_zone_id = module.route53.aws_route53_zone_id
} 