output "eks_node_group_arn" {
    value = aws_eks_node_group.eks_node_group.arn
}

output "eks_node_group_id" {
    value = aws_eks_node_group.eks_node_group.id
}

output "eks_node_group_resources" {
    value = aws_eks_node_group.eks_node_group.resources
}