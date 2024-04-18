variable "app_domain_zone_id" {}
variable "alb_acm_certificate_arn" {}

// TODO: update each time ALB is recreated

# resource "aws_route53_record" "alb_alias" {
#   zone_id = var.app_domain_zone_id
#   name    = "alb.eduhelper.info"
#   type    = "A"
#   alias {
#     name                   = "k8s-itsag2t2-k8salb-5258e4088d-1415904993.ap-southeast-1.elb.amazonaws.com"
#     zone_id                = "Z1LMS91P8CMLE5"
#     evaluate_target_health = true
#   }
# }