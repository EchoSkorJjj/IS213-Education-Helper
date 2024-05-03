output "cloudfront_waf_web_acl_id" {
  value = aws_wafv2_web_acl.cloudfront_waf_web_acl.id
}

output "cloudfront_waf_web_acl_arn" {
  value = aws_wafv2_web_acl.cloudfront_waf_web_acl.arn
}