# Terraform Modules

This directory contains the Terraform modules for the project.

## Usage
In the modules directory of the project, run the following command:

```bash
terraform init
```

You must change the terraform workspace to the name of the environment you are deploying to.
Run the following command:

```bash
terraform workspace help
terraform workspace list
```

If the workspace does not exist, run the following command:

```bash
terraform workspace new <workspace-name>
```

To switch environments, run the following command:

```bash
terraform workspace select <workspace-name>
```

In the root directory of the project, run the following command:
    
```bash
make deploy
```

to deploy the infrastructure.

The modules uses the terraform state stored in the backend created by the shared module.
This allows developers to share the state of the infrastructure.