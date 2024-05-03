output "aws_acm_certificate_arn" {
  value = aws_acm_certificate.cert.arn
}

output "certificate_validation" {
  value = aws_acm_certificate_validation.cert
}

output "aws_acm_alb_certificate_arn" {
  value = aws_acm_certificate.alb_cert.arn
}

output "alb_certificate_validation" {
  value = aws_acm_certificate_validation.alb_cert
}