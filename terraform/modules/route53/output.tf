output "aws_route53_zone_name" {
  value = aws_route53_zone.primary.name
}

output "aws_route53_zone_id" {
  value = aws_route53_zone.primary.zone_id
}

output "aws_route53_name_servers" {
  value = aws_route53_zone.primary.name_servers
}