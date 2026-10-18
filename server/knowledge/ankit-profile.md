# Ankit Gupta — knowledge file for the portfolio assistant

## Summary
- Name: Ankit Gupta
- Role: Full stack developer, ~3 years of production experience
- Based in: Vapi, Gujarat, India
- Current company: Setu Net Pvt Ltd
- What I do there: I own the full product lifecycle largely independently — requirements, design, development, deployment and server management.
- Looking for: full-time full stack / .NET + Angular roles at product companies
- Available from: October 2026
- Open to: Pune, Hyderabad, Remote

## Experience

### Full Stack Developer, Setu Net Pvt Ltd, Vapi, Gujarat (May 2023 – Present)
- I design and build our internal platforms end to end — shaping requirements together with the team and stakeholders, developing the features, deploying them to IIS (Windows) and Ubuntu (Linux) servers, and supporting them in production.
- Configuration-driven workflow platform: admins define approval chains, escalations, form routing, role-based access and email notifications from the UI, with zero code changes or redeployments per workflow.
- Visual Form Builder: a step-by-step builder that creates tables, views, workflow routes, menu entries and role access in a single transaction.
- Dual-database support: one codebase running on both PostgreSQL and SQL Server. I'm currently leading the production schema migration to PostgreSQL.
- Reusable Angular component library: dynamic forms, modals and dashboards, now the standard across the company's internal products.
- Stack used there: .NET Core, Angular, PostgreSQL, SQL Server, Stored Procedures, IIS, Ubuntu, Docker.
- Impact: new module setup went from weeks to about 2 hours for a non-technical admin; a role-privilege query went from 8.4s to 80ms (about 100x faster); one codebase serves both PostgreSQL and SQL Server; new workflows ship from configuration with zero redeploys.

## Tech stack
- Daily: Angular, .NET Core, PostgreSQL, TypeScript
- Growing in: Redis, RabbitMQ, Docker, CI/CD
- Familiar with: SQL Server, Azure DevOps, Linux, Nginx
- AI tools: I use Claude and Copilot for reviews, explanations and boilerplate. Every production decision and all business logic is written and understood by me.

## Projects

### JobPing (flagship, in development, expected October 2026)
- What: a developer job alert platform. Workers fetch jobs from 3 sources every 2 hours, calculate match scores against each user's skill profile, and send email alerts through a RabbitMQ pipeline.
- Stack: .NET Core 8, Angular 18, PostgreSQL, RabbitMQ, Redis, Docker
- Duplicate alerts: an alert_history table with a unique (user_id, job_id) constraint, checked before every RabbitMQ publish.
- Why RabbitMQ: polling wakes up every N minutes regardless of new data; RabbitMQ wakes the worker only when a message arrives.
- Why Redis: one component solving four problems — cache, distributed lock, rate limiter, JWT blacklist.
- Why delta updates for preferences: delete-all-and-reinsert breaks audit trails and causes race conditions; track the delta and apply the diff.

### Workflow Automation Platform (work project, Setu Net Pvt Ltd)
- Configuration-driven platform that automated most internal operations. Approval chains, escalation rules, form routing and notifications are defined by admins in the UI, not in code.
- Stack: .NET Core, Angular, PostgreSQL, SQL Server.
- The interesting problem: how do you let non-developers ship new workflows safely? Every rule lives in configuration tables the engine reads at runtime, so a new workflow is data, not a deployment.

### Visual Form Builder (work project, Setu Net Pvt Ltd)
- Step-by-step builder (list → mail → escalation → review → form) that turns an admin's choices into a working module.
- Stack: .NET Core, Angular, SQL, Transactions.
- The interesting problem: what if setup fails halfway? Tables, views, workflow routes, sidebar menu entries and role grants are all created in a single database transaction. Either the whole module exists or nothing does.

### This portfolio's AI assistant
- Angular chat widget → .NET 8 API proxy → open-source LLM (OpenAI-compatible API), with Redis rate limiting and streamed answers. The API key never reaches the browser.

## Contact
- Email: ankitjguptaforwork@gmail.com
- GitHub: https://github.com/Ankit-gupta-work
- LinkedIn: https://www.linkedin.com/in/ankit-gupta-489113253

## Things the assistant must NOT answer
- Salary, current CTC or expected CTC → "Ankit prefers to discuss compensation directly — email him."
- Personal life, family, age, health, religion, politics.
- Anything not written in this file → "I don't know that — you can ask Ankit at ankitjguptaforwork@gmail.com."
