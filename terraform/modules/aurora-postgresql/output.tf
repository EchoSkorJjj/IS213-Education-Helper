output "aurora_cluster_arn" {
  value = aws_rds_cluster.aurora_cluster.arn
}

output "aurora_cluster_primary_endpoint_address" {
  value = aws_rds_cluster.aurora_cluster.endpoint
}

output "aurora_cluster_reader_endpoint_address" {
  value = aws_rds_cluster.aurora_cluster.reader_endpoint
}

output "aurora_cluster_instance_arn_1" {
  value = aws_rds_cluster_instance.aurora_cluster_instance_replica_1.arn
}

output "aurora_cluster_instance_arn_2" {
  value = aws_rds_cluster_instance.aurora_cluster_instance_replica_2.arn
}

# Debugging purposes
# Connect to this specific replica
# output "aurora_cluster_instance_1_endpoint_address" {
#   value = aws_rds_cluster_instance.aurora_cluster_instance_replica_1.endpoint
# }

# output "aurora_cluster_instance_2_endpoint_address" {
#   value = aws_rds_cluster_instance.aurora_cluster_instance_replica_2.endpoint
# }