# Terraform Backend

This directory contains the Terraform backend configuration for the project.

## Usage
In the shared directory of the project, run the following command:

```bash
terraform init
```

In the root directory of the project, run the following command:

```bash
make deploy-shared
```
to initialize the terraform backend and create the shared resources.

The command should be run only once, when the project is created.
It should never be destroyed.

The terraform backend is used by terraform to store the state of the infrastructure.
The state is shared by all developers who are IAM users under the same Root User.