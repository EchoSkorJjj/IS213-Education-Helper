PROJECT_NAME := ESD
ENVIRONMENT ?= dev
NPM_SUBDIRS := client
PYTHON_VERSION := 3.11.2
VENV_NAME := venv
VENV_DEACTIVATE := deactivate
ifeq ($(OS),Windows_NT)
	PYTHON := python
	VENV_ACTIVATE := venv\Scripts\activate.bat
	RM := del /s /q
else
	PYTHON := python3
	VENV_ACTIVATE := . venv/bin/activate
	RM := rm -rf
endif
init: check-terraform check-aws-cli venv requirements npm-install

venv:
	@echo "Creating python virtual environment in '$(VENV_NAME)' folder..."
	$(PYTHON) -m venv $(VENV_NAME)

requirements:
	@echo "Installing Python requirements..."
	@$(VENV_ACTIVATE) && pip install -r requirements.txt
	
deactivate-venv:
	@echo "Deactivating virtual environment..."
	$(RM) $(VENV_NAME)
	@find . -name "*.pyc" -delete
	@exit 0