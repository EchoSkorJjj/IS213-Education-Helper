variable "app_domain" {}

resource "aws_route53_zone" "primary" {
  name = var.app_domain
}