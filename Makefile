PROJECT_NAME = "esd"
LOCAL_DEPLOY_DIR = "deployment/docker"
NPM_SUBDIRS = backend/simple/user-storage client 

npm-install:
	@echo "Running npm install to set up Husky and other dependencies..."
	@if [ ! -d "node_modules" ]; then \
		npm install; \
	fi
	@echo "All npm dependencies installed."

# ---------------------------------------
# For deploying docker containers locally
# ---------------------------------------
dev/up: npm-install
	@docker compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
		up --build -d --remove-orphans

dev/nobuild/up: npm-install
	@docker-compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
		up -d

up: npm-install
	@docker compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.submission.yml \
		up --build -d --remove-orphans

nobuild/up: npm-install
	@docker-compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.submission.yml \
		up -d

# ---------------------------------
# For tearing down local deployment
# ---------------------------------
dev/down:
	@docker compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
		down

dev/down-clean:
	@echo "Taking down services and removing volumes..."
	@docker compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
		down --volumes --remove-orphans
	@$(MAKE) prune-esd-images

down:
	@docker compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.submission.yml \
		down

down-clean:
	@echo "Taking down services and removing volumes..."
	@docker compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.submission.yml \
		down --volumes --remove-orphans
	@$(MAKE) prune-esd-images

prune-all:
	@echo "Running this command will prune all images. Do you want to proceed [y/N]?"; \
	read ans; \
	case "$$ans" in \
		[Yy]*) docker image prune -a -f ;; \
		*) echo "Aborting." ;; \
	esac

prune-esd-images:
	@echo "This will remove all unused images associated with the esd project. Continue? [y/N]"; \
	read ans; \
	if [ "$$ans" = "y" ] || [ "$$ans" = "Y" ]; then \
		docker images | grep 'esd' | awk '{print $$3}' | xargs -r docker rmi -f || echo "No esd related images to remove."; \
	else \
		echo "Aborting."; \
	fi

# ---------------------------------
# For deploying modules to AWS
# ---------------------------------
deploy:
	$(MAKE) -C terraform/modules deploy-all

deploy-%:
	$(call run_deploy_or_destroy,deploy,$*)

destroy:
	$(MAKE) -C terraform/modules destroy-all

destroy-%:
	$(call run_deploy_or_destroy,destroy,$*)

plan:
	$(MAKE) -C terraform/modules plan-all

plan-%:
	$(call run_deploy_or_destroy,plan,$*)

# ---------------------------------
# For deploying shared/backend to AWS
# This should only be run once
# Please do not run the below commands because they are initialised in AWS already
# ---------------------------------
deploy-shared:
	$(MAKE) -C terraform/shared deploy-shared

destroy-shared:
	$(MAKE) -C terraform/shared destroy-shared

plan-shared:
	$(MAKE) -C terraform/shared plan-shared
