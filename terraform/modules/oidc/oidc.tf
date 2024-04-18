variable "eks_cluster_services_identity" {}

data "tls_certificate" "eks_tls_certificate"{
 url = var.eks_cluster_services_identity[0].oidc[0].issuer
}
resource "aws_iam_openid_connect_provider" "eks_oidc" {
  url = var.eks_cluster_services_identity[0].oidc[0].issuer

  client_id_list = [
    "sts.amazonaws.com"
  ]

  thumbprint_list = [data.tls_certificate.eks_tls_certificate.certificates[0].sha1_fingerprint]
}
