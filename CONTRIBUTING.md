# Contributing to nestjs-trpc-v2

Thank you for your interest in contributing to nestjs-trpc-v2! This guide will help you get started.

## Getting Started

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/nestjs-trpc-v2.git
cd nestjs-trpc-v2
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/mguay22/nestjs-trpc-v2.git
```

### Prerequisites

- Node.js >= 18
- pnpm >= 10.0.0

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## Development Workflow

### Available Commands

All commands use Turborepo for optimal caching and parallel execution:

```bash
# Build all packages
pnpm build

# Run development mode (watch)
pnpm dev

# Run linting
pnpm lint

# Fix lint issues
pnpm lint:fix

# Format code with Prettier
pnpm format

# Check formatting
pnpm format:check

# Type checking
pnpm check-types

# Run tests
pnpm test
```

### Making Changes

1. Create a new branch from `main`:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes
3. Ensure all checks pass:

```bash
pnpm lint
pnpm format:check
pnpm build
pnpm test
```

## Commit Style

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are validated using commitlint.

### Format

```
<type>(<scope>): <subject>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system or dependency changes
- `ci`: CI/CD configuration changes
- `chore`: Other changes that don't modify src or test files

### Examples

```bash
feat(router): add support for subscription procedures
fix(generator): resolve type inference issue with nested schemas
docs(readme): update installation instructions
chore(deps): update @trpc/server to v11
```

## Pull Request Process

1. Ensure your branch is up to date with `main`:

```bash
git fetch upstream
git rebase upstream/main
```

2. Push your branch to your fork:

```bash
git push origin feature/your-feature-name
```

3. Open a Pull Request against the `main` branch

4. Fill out the PR template with:
   - A clear description of the changes
   - Any related issues
   - Testing instructions if applicable

5. Wait for CI checks to pass and address any review feedback

## Code Style

- TypeScript is used throughout the project
- Prettier handles code formatting
- ESLint handles linting
- Pre-commit hooks automatically run lint-staged

## Questions?

If you have questions, feel free to:

- Open an [Issue](https://github.com/mguay22/nestjs-trpc-v2/issues)

Thank you for contributing!
