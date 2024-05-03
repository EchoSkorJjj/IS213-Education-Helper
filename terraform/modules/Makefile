.PHONY: deploy-all destroy-api-gateway apply-all plan-all

deploy-all:
	@echo "Deploying all..."
	@terraform init -reconfigure && terraform apply -auto-approve
	@echo "all deployment initiated."

destroy-all:
	@echo "Destroying all..."
	@terraform destroy -auto-approve
	@echo "all destruction initiated."

apply-all:
	@echo "Applying all..."
	@terraform apply -auto-approve
	@echo "all application initiated."

plan-all:
	@echo "planning all..."
	@terraform plan
	@echo "all application plan. Run make apply to apply changes."


# terraform destroy -target=module.elasticache-redis
# terraform destroy -target=module.aurora-postgresql
