# 🏢 Enterprise Solution Development IS213 Template Files

Quickly create and manage new projects with the Enterprise Solution Development IS213 template files.

- [🏢 Enterprise Solution Development IS213 Template Files](#-enterprise-solution-development-is213-template-files)
  - [🚀 Quick Start](#-quick-start)
  - [📚 TODO](#-todo)
    - [🔧 CICD](#-cicd)
    - [🏛 Architecture](#-architecture)
    - [🌐 Frontend](#-frontend)
    - [🔒 Authentication](#-authentication)
  - [📁 Folder Structure](#-folder-structure)
  - [🔨 Commit Hooks](#-commit-hooks)
  - [🔍 Miscellaneous](#-miscellaneous)
    - [🛠 Makefile](#-makefile)

## 🚀 Quick Start

To get started:

1. Populate all the environment variables.
2. Run the following make commands for local development using Docker. This will also install dependencies for Husky.
    ```bash
    make up
    ```

## 📚 TODO 

### 🔧 CICD

- [ ] Cleanup local deployment using Docker.
- [ ] Create a .env file populator script.
- [ ] Kubernetes cluster configuration.
- [ ] Terraform configuration.

### 🏛 Architecture

- [ ] Create a pipeline for separating read and write databases using Kafka, Debezium (CDC).
- [ ] Improve documentation for maintenance.
- [ ] Conduct Mini VAPT for security testing.

### 🌐 Frontend

- [ ] Migrate from CRA to Vite.
- [ ] Write unit tests.
- [ ] Set up a visual regression testing pipeline.

### 🔒 Authentication

- [ ] Write unit tests.
- [ ] Enhance logging capabilities.

## 📁 Folder Structure

| Folder               | Description                                                                              |
|----------------------|------------------------------------------------------------------------------------------|
| `authentication`     | Code for authentication and authorization.                                               |
| `deployment`         | Docker and Kubernetes configurations. Subfolders for Docker and Kubernetes setups.       |
| `downstream-services`| Different downstream services, all behind the Kong gateway. Each with its Dockerfile.    |
| `frontend`           | Front-end portion of the project.                                                        |
| `kong`               | Kong API Gateway related code, configurations, and custom authentication plugin.         |
| `Makefile`           | Makefile for various project-related tasks.                                              |

## 🔨 Commit Hooks

Utilizing Husky with:

- **lint-staged** for linting files on commit.
- **commitlint** to ensure commit messages adhere to the [convention](https://www.conventionalcommits.org/en/v1.0.0/).

## 🔍 Miscellaneous

### 🛠 Makefile

For instructions on installing `Make` on Windows and Ubuntu, refer to [`/docs/Makefile.md`](/docs/Makefile.md).

