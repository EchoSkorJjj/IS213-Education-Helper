variable "project_name" {}

provider "aws" {
  region = "us-east-1"
  alias  = "us_east_1"
}

resource "aws_wafv2_web_acl" "cloudfront_waf_web_acl" {
  provider    = aws.us_east_1
  name        = "${var.project_name}-cloudfront-waf-web-acl"
  description = "Managed rules for CloudFront."
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  # Common Rule Set
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"

        rule_action_override {
          name = "SizeRestrictions_BODY"

          action_to_use {
            allow {
            }
          }
        }
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesCommonRuleSet"
      sampled_requests_enabled   = true
    }
  }

  # SQL Injection Rule Set
  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 2
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesSQLiRuleSet"
      sampled_requests_enabled   = true
    }
  }

  # IP Reputation List
  rule {
    name     = "AWS-AWSManagedRulesAmazonIpReputationList"
    priority = 3
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesAmazonIpReputationList"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWS-AWSManagedRulesAmazonIpReputationList"
      sampled_requests_enabled   = true
    }
  }

  # Known Bad Inputs Rule Set
  rule {
    name     = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
    priority = 4
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
      sampled_requests_enabled   = true
    }
  }

  # TODO: Add bot protection
  # association_config - (Optional) Specifies custom configurations for the associations between the web ACL and protected resources. See association_config below for details.
  # captcha_config - (Optional) Specifies how AWS WAF should handle CAPTCHA evaluations on the ACL level (used by AWS Bot Control). See captcha_config below for details.
  # challenge_config - (Optional) Specifies how AWS WAF should handle Challenge evaluations on the ACL level (used by AWS Bot Control). See challenge_config below for details.

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "cloudfrontWAFMetric"
    sampled_requests_enabled   = true
  }
}

resource "aws_cloudwatch_log_group" "cloudfront_waf_web_acl_loggroup" {
  provider    = aws.us_east_1
  name              = "aws-waf-logs-${var.project_name}"
  retention_in_days = 30
}

resource "aws_wafv2_web_acl_logging_configuration" "cloudfront_waf_web_acl_logging" {
  provider    = aws.us_east_1
  log_destination_configs = [aws_cloudwatch_log_group.cloudfront_waf_web_acl_loggroup.arn]
  resource_arn            = aws_wafv2_web_acl.cloudfront_waf_web_acl.arn
  depends_on = [
    aws_wafv2_web_acl.cloudfront_waf_web_acl,
    aws_cloudwatch_log_group.cloudfront_waf_web_acl_loggroup
  ]
}