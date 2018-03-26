.PHONY: update-function

ENV = dev
FUNCTION = serverless
PORTAL_NAME = qeestudiar

clean: ## Remove the zip from the function lambda generated.
	@echo "clean up package files"
	$(eval LAMBDA_FUNCTION_NAME := $(PORTAL_NAME)-$(ENV)-$(FUNCTION))
	@if [ -f $(LAMBDA_FUNCTION_NAME).zip ]; then rm $(LAMBDA_FUNCTION_NAME).zip; fi

lambda: ## Generate zip file all from app folder
	@make clean
	@echo "Create package archive..."
	$(eval LAMBDA_FUNCTION_NAME := $(PORTAL_NAME)-$(ENV)-$(FUNCTION))
	@cd app && zip -rq $(LAMBDA_FUNCTION_NAME).zip .
	@mv app/$(LAMBDA_FUNCTION_NAME).zip ./

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'