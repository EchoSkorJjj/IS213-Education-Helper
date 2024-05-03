output "eks_ecr_arn" {
    value = aws_ecr_repository.eks_ecr.arn
}

output "eks_ecr_id" {
    value = aws_ecr_repository.eks_ecr.id
}

output "eks_ecr_url" {
    value = aws_ecr_repository.eks_ecr.repository_url
}