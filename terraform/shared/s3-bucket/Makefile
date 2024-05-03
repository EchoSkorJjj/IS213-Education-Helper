.PHONY: deploy-s3-bucket destroy-s3-bucket apply-s3-bucket plan-s3-bucket

deploy-s3-bucket:
	@echo "Deploying s3-bucket..."
	@terraform init && terraform apply -auto-approve
	@echo "s3-bucket deployment initiated."

destroy-s3-bucket:
	@echo "Destroying s3-bucket..."
	@terraform destroy -auto-approve
	@echo "s3-bucket destruction initiated."

apply-s3-bucket:
	@echo "Applying s3-bucket..."
	@terraform apply -auto-approve
	@echo "s3-bucket application initiated."

plan-s3-bucket:
	@echo "planning s3-bucket"
	@terraform plan
	@echo "s3-bucket application plan. Run make apply to apply changes."