output "redis_cluster_replication_group_arn" {
  value = aws_elasticache_replication_group.redis_cluster_replication_group.arn
}

output "redis_cluster_replication_group_configuration_endpoint_address" {
  value = aws_elasticache_replication_group.redis_cluster_replication_group.configuration_endpoint_address
}

# Only if Cluster mode is disabled
# output "redis_cluster_replication_group_primary_endpoint_address" {
#   value = aws_elasticache_replication_group.redis_cluster_replication_group.primary_endpoint_address
# }

# output "redis_cluster_replication_group_reader_endpoint_address" {
#   value = aws_elasticache_replication_group.redis_cluster_replication_group.reader_endpoint_address
# }