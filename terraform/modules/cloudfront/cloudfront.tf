# ACM
variable "acm_certificate_validation" {}
variable "acm_certificate_arn" {}

# S3 Bucket
variable "frontend_s3_bucket_id" {}
variable "frontend_s3_bucket_arn" {}
variable "frontend_s3_bucket_regional_domain_name" {}

# Route53
variable "app_domain_name" {}
variable "app_domain_zone_id" {}

# WAF
variable "cloudfront_waf_web_acl_arn" {}

variable "project_name" {}

resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "${var.project_name}-frontend OAI"
}

resource "aws_cloudfront_distribution" "cf_distribution" {
  enabled         = true
  is_ipv6_enabled = true
  default_root_object = "index.html"
  aliases = [var.app_domain_name]

  origin {
    domain_name = var.frontend_s3_bucket_regional_domain_name
    origin_id   = var.frontend_s3_bucket_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  origin {
    # TODO: Need to change domain name
    domain_name = "alb.eduhelper.info"
    origin_id   = "eks-alb"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.1", "TLSv1.2"]
    }

    custom_header {
      name  = "X-Allow"
      value = "super_secret_token" # Replace with secure token retrieval method
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/api/v1/*"
    allowed_methods  = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "eks-alb"

    forwarded_values {
      query_string = true
      headers      = ["Host", "*"]

      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "allow-all"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.frontend_s3_bucket_id
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    min_ttl                = 0
    # default_ttl            = 3600
    default_ttl            = 30
    max_ttl                = 86400
    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }
  }

  lifecycle {
    prevent_destroy = false
  }

  price_class = "PriceClass_All"

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  retain_on_delete = true

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # When using WAFv2, you need to specify the the ARN 
  # not the ID to web_acl_id in aws_cloudfront_distribution see the below links for more information
  # https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution#web_acl_id
  # https://github.com/hashicorp/terraform-provider-aws/issues/13902
  web_acl_id = var.cloudfront_waf_web_acl_arn

  # Need to wait for the ACM CNAME record in route 53 hosted zone to propagate
  depends_on = [var.acm_certificate_validation]
}

resource "aws_route53_record" "cf_dns" {
  zone_id = var.app_domain_zone_id
  name    = var.app_domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cf_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.cf_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

data "aws_iam_policy_document" "frontend_s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${var.frontend_s3_bucket_arn}/*"]
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.oai.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend_bucket_policy" {
  bucket = var.frontend_s3_bucket_id
  policy = data.aws_iam_policy_document.frontend_s3_policy.json

  depends_on = [ aws_cloudfront_distribution.cf_distribution ]
}