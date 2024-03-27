PROJECT_NAME = "esd"
LOCAL_DEPLOY_DIR = "deployment/docker"
NPM_SUBDIRS = backend/simple/user-storage client 

npm-install: npm-install-subdirectories
	@echo "Running npm install to set up Husky and other dependencies..."
	@if [ ! -d "node_modules" ]; then \
		npm install; \
	fi
	@echo "All npm dependencies installed."

npm-install-subdirectories:
	@echo "Running npm install in subdirectories..."
	@for dir in ${NPM_SUBDIRS}; do \
		if [ ! -d "$${dir}/node_modules" ]; then \
			echo "Running npm install in $${dir} service..."; \
			cd $${dir} && npm install && cd ..; \
		fi \
	done
	@echo "All subdirectory dependencies installed."

# ---------------------------------------
# For deploying docker containers locally
# ---------------------------------------
up: npm-install
	@docker compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
		up --build -d --remove-orphans

nobuild/up: npm-install
	@docker-compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
		up -d

# ---------------------------------
# For tearing down local deployment
# ---------------------------------
down:
	@docker compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
		down

down-clean:
	@echo "Taking down services and removing volumes..."
	@docker compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
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
