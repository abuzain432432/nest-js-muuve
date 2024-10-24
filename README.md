# Guidelines About Project

## Table of Contents

- [Folder Structure](#folder-structure)
- [Testing Guidelines](#testing-guidelines)
- [File Naming Conventions](#file-naming-conventions)
- [Coding Standards](#coding-standards)

## Folder Structure

This project follows a modular folder structure for better organization and maintainability. Below is the structure for the `auth` module:

### Key Directories:

- **`__mock__/`**: Contains mocked services for unit testing, isolating tests from actual implementations.
- **`__fixtures__/`**: Includes fixture data for setting up test scenarios.
- **`dto/`**: Contains Data Transfer Objects to manage the structure of data models.
- **`enums/`**: Organizes enums used throughout the module.
- **`auth.controller.ts`, `auth.service.ts`, `auth.module.ts`**: Core files for the module, facilitating easy access and understanding of functionalities.

## Testing Guidelines

### Unit Tests

- **Scope**: Test the smallest units of code, such as services and controllers.
- **Mocking**: Mock dependencies (e.g., services) to isolate the functionality of the unit under test.

### Integration Tests

- **Scope**: Test each module and its endpoints, including both success and error cases.
- **Mocking**: Mock actual database interactions to isolate the logic of the application.

### End-to-End (E2E) Tests

- **Scope**: Test the complete application by interacting with actual endpoints.
- **Environment**: Use a dedicated test environment with a running server instance.

## File Naming Conventions

- Use **camelCase** for JavaScript and TypeScript variables, functions etc.
- Name files according to their functionality (e.g., `auth.controller.ts`, `user-response.dto.ts`).
- Use clear and descriptive names for mocks and fixtures (e.g., `auth.service.mock.ts`, `user-response.fixture.ts`).

## Coding Standards

- Follow **TypeScript** best practices.
- Write **clean, readable, and maintainable code**.
- Use **consistent indentation** (2 spaces).
- Document code where necessary with comments and JSDoc style annotations.
