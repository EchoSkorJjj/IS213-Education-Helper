.PHONY: deploy-dynamodb-table destroy-dynamodb-table apply-dynamodb-table plan-dynamodb-table

deploy-dynamodb-table:
	@echo "Deploying dynamodb-table..."
	@terraform init && terraform apply -auto-approve
	@echo "dynamodb-table deployment initiated."

destroy-dynamodb-table:
	@echo "Destroying dynamodb-table..."
	@terraform destroy -auto-approve
	@echo "dynamodb-table destruction initiated."

apply-dynamodb-table:
	@echo "Applying dynamodb-table..."
	@terraform apply -auto-approve
	@echo "dynamodb-table application initiated."

plan-dynamodb-table:
	@echo "planning dynamodb-table"
	@terraform plan
	@echo "dynamodb-table application plan. Run make apply to apply changes."