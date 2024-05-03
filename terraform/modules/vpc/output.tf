output "aws_vpc_id" {
  value = aws_vpc.main_vpc.id
}

output "public_subnet_1_id" {
  value = aws_subnet.public_subnet_1.id
}

output "public_subnet_2_id" {
  value = aws_subnet.public_subnet_2.id
}

output "eks_private_subnet_1_id" {
  value = aws_subnet.eks_private_subnet_1.id
}

output "eks_private_subnet_2_id" {
  value = aws_subnet.eks_private_subnet_2.id
}

output "database_private_subnet_1_id" {
  value = aws_subnet.database_private_subnet_1.id
}

output "database_private_subnet_2_id" {
  value = aws_subnet.database_private_subnet_2.id
}