output "postgres_instance_arn" {
  value = aws_db_instance.postgresql_master.arn
  description = "The Amazon Resource Name (ARN) of the PostgreSQL instance."
}

output "postgres_instance_endpoint_address" {
  value = aws_db_instance.postgresql_master.address
  description = "The connection endpoint for the PostgreSQL database instance."
}
