# Premium Website

Welcome to the Premium Website project! This repository contains the source code, architecture, and documentation for our upcoming application.

## 👥 Meet the Team

Our development process is handled by a specialized 3-agent team, orchestrated by the Team Lead:

### 1. Frontend UX Agent
- **Focus:** React and Tailwind CSS UI.
- **Responsibilities:** Delivering high-quality, polished user interfaces based on web design guidelines and structural evaluations (`taste.md`). Converts visual references to code when available.

### 2. Security & Backend Agent
- **Focus:** API architecture, database schema, and security.
- **Responsibilities:** Managing database migrations and backend logic using the Supabase CLI. Ensures bulletproof security, strict validation, and secure authentication across all data layers.

### 3. QA & DevOps Agent
- **Focus:** Testing and deployment.
- **Responsibilities:** Reviewing code (`coderabbit-code-review`), establishing stable E2E testing loops (`playwright-cli.md`), autofixing linting/build errors, and maintaining seamless deployments via the Vercel CLI.

## 🏗️ Architecture

- **Frontend:** React + Tailwind CSS
- **Backend & Database:** Supabase (PostgreSQL, Authentication, Row Level Security)
- **Deployment:** Vercel

## 🚀 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd premium-website
   ```

2. **Database Setup:**
   - Make sure you have Docker installed and running.
   - Start the local Supabase environment:
     ```bash
     supabase start
     ```

3. **Install Dependencies (Frontend/Backend):**
   *(To be determined upon initialization of the framework)*

4. **Testing:**
   - E2E tests are configured via Playwright.

(Documentation is regularly updated by the DevOps agent as project architecture evolves.)
