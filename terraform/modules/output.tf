output "aws_route53_zone_name" {
  value = module.route53.aws_route53_zone_name
}

output "aws_route53_zone_id" {
  value = module.route53.aws_route53_zone_id
}

output "aws_route53_name_servers" {
  value = module.route53.aws_route53_name_servers
}

output "aws_acm_certificate_arn" {
  value = module.acm.aws_acm_certificate_arn
}

output "aws_acm_alb_certificate_arn" {
  value = module.acm.aws_acm_alb_certificate_arn
}

output "frontend_s3_bucket_id" {
  value = module.s3.frontend_s3_bucket_id
}

output "frontend_s3_bucket_arn" {
  value = module.s3.frontend_s3_bucket_arn
}

output "frontend_s3_bucket_regional_domain_name" {
  value = module.s3.frontend_s3_bucket_regional_domain_name
}

output "notes_s3_bucket_id" {
  value = module.s3.notes_s3_bucket_id
}

output "notes_s3_bucket_arn" {
  value = module.s3.notes_s3_bucket_arn
}

output "notes_s3_bucket_regional_domain_name" {
  value = module.s3.notes_s3_bucket_regional_domain_name
}

output "eks_ecr_arn" {
    value = module.ecr.eks_ecr_arn
}

output "eks_ecr_id" {
    value = module.ecr.eks_ecr_id
}

output "eks_ecr_url" {
    value = module.ecr.eks_ecr_url
}

output "cloudfront_waf_web_acl_id" {
  value = module.waf.cloudfront_waf_web_acl_id
}

output "cloudfront_waf_web_acl_arn" {
  value = module.waf.cloudfront_waf_web_acl_arn
} 

output "cloudfront_domain_name" {
  value = module.cloudfront.cloudfront_domain_name
}

output "aws_vpc_id" {
  value = module.vpc.aws_vpc_id
}

output "public_subnet_1_id" {
  value = module.vpc.public_subnet_1_id
}

output "public_subnet_2_id" {
  value = module.vpc.public_subnet_2_id
}

output "eks_private_subnet_1_id" {
  value = module.vpc.eks_private_subnet_1_id
}

output "eks_private_subnet_2_id" {
  value = module.vpc.eks_private_subnet_2_id
}

output "database_private_subnet_1_id" {
  value = module.vpc.database_private_subnet_1_id
}

output "database_private_subnet_2_id" {
  value = module.vpc.database_private_subnet_2_id
}

output "eks_cluster_security_group_id" {
  value = module.eks.eks_cluster_security_group_id
}

output "eks_cluster_services_arn" {
  value = module.eks.eks_cluster_services_arn
}

output "eks_cluster_services_endpoint" {
  value = module.eks.eks_cluster_services_endpoint
}

output "eks_cluster_services_name" {
  value = module.eks.eks_cluster_services_name
}

output "eks_cluster_services_identity" {
  value = module.eks.eks_cluster_services_identity
}

output "eks_cluster_services_certificate_authority" {
  value = module.eks.eks_cluster_services_certificate_authority
}

output "eks_node_group_arn" {
  value = module.eks-node-group.eks_node_group_arn
}

output "eks_node_group_id" {
  value = module.eks-node-group.eks_node_group_id
}

output "eks_node_group_resources" {
  value = module.eks-node-group.eks_node_group_resources
}

output "oidc_arn" {
  value = module.oidc.oidc_arn
}

output "oidc_url" {
  value = module.oidc.oidc_url
}

output "mq_instances" {
  value = module.mq.mq_instances
}

output "redis_cluster_replication_group_primary_endpoint_address" {
  value = module.elasticache-redis.redis_cluster_replication_group_primary_endpoint_address
}

output "redis_cluster_replication_group_reader_endpoint_address" {
  value = module.elasticache-redis.redis_cluster_replication_group_reader_endpoint_address
}