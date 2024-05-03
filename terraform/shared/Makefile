.PHONY: deploy-shared destroy-shared apply-shared


deploy-shared:
	@echo "Deploying shared..."
	@terraform init && terraform apply -auto-approve
	@echo "shared deployment initiated."

destroy-shared:
	@echo "Destroying shared..."
	@terraform destroy -auto-approve
	@echo "shared destruction initiated."

apply-shared:
	@echo "Applying shared..."
	@terraform apply -auto-approve
	@echo "shared application initiated."

plan-shared:
	@echo "planning shared..."
	@terraform plan
	@echo "shared application plan. Run make apply to apply changes."