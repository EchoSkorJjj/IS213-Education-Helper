output "frontend_s3_bucket_id" {
  value = aws_s3_bucket.static_frontend_bucket.id
}

output "frontend_s3_bucket_arn" {
  value = aws_s3_bucket.static_frontend_bucket.arn
}

output "frontend_s3_bucket_regional_domain_name" {
  value = aws_s3_bucket.static_frontend_bucket.bucket_regional_domain_name
}
 
output "notes_s3_bucket_id" {
  value = aws_s3_bucket.notes_bucket.id
}

output "notes_s3_bucket_arn" {
  value = aws_s3_bucket.notes_bucket.arn
}

output "notes_s3_bucket_regional_domain_name" {
  value = aws_s3_bucket.notes_bucket.bucket_regional_domain_name
}