output "eks_cluster_security_group_id" {
  value = aws_eks_cluster.eks_cluster_services.vpc_config[0].cluster_security_group_id
}

output "eks_cluster_services_arn" {
  value = aws_eks_cluster.eks_cluster_services.arn  
}

output "eks_cluster_services_endpoint" {
  value = aws_eks_cluster.eks_cluster_services.endpoint
}

output "eks_cluster_services_name" {
  value = aws_eks_cluster.eks_cluster_services.name
}

output "eks_cluster_services_identity" {
  value = aws_eks_cluster.eks_cluster_services.identity
}

output "eks_cluster_services_certificate_authority" {
  value = aws_eks_cluster.eks_cluster_services.certificate_authority
}