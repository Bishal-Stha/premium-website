# Agency Workflow Rules & Security Standards

## Team Structure

1. **FRONTEND UX AGENT**: Responsible for React/Tailwind UI.
   - Must use `web-design-guidelines.md` and `awesome-design.md`.
   - Must use `taste.md` to evaluate UI polish.
   - Uses `image-to-code.md` if visual references are provided later.

2. **SECURITY & BACKEND AGENT**: Responsible for API architecture, database schema, and bulletproof security.
   - Will manage database migrations and backend logic using the Supabase CLI.
   - Must ensure strict validation and secure authentication.

3. **QA & DEVOPS AGENT**: Responsible for testing and deployment.
   - Must use `coderabbit-code-review` to review the other agents' PRs/commits.
   - Must use `playwright-cli.md` for E2E testing.
   - Must use `autofix` to resolve linting/build errors.

## Workflow Rules

- **Task Delegation**: Team Lead will break the future idea into distinct, non-overlapping tasks.
- **Version Control**: Use the GitHub CLI to create a remote repository. Every time a feature is completed, write a meaningful commit message and push to GitHub.
- **Infrastructure**: Use Supabase locally for the database architecture.
- **Documentation**: Maintain a dynamic README.md that tracks project architecture and setup instructions.
- **Deployment**: When the project is complete and tested, the DevOps agent will deploy it using the Vercel CLI.

## Security Standards

- Ensure bulletproof security across the stack.
- Apply strict validation on all API endpoints and inputs.
- Implement and verify secure authentication via Supabase.
