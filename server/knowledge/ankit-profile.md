# Ankit Gupta — knowledge file for the portfolio assistant

## Summary
- Name: Ankit Gupta
- Role: Full stack developer, ~3 years of production experience
- Based in: Vapi, Gujarat, India
- Current company: a product services company
- What I do there: I own the full product lifecycle largely independently — requirements, design, development, deployment and server management.
- Looking for: full-time full stack / .NET + Angular roles at product companies
- Available from: October 2026
- Open to: Pune, Hyderabad, Remote

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

### Inventory Management System (work project)
- Full-featured platform for SMBs, used in production. Angular, .NET, SQL.

### HR Leave Management Portal (work project)
- Multi-level approval workflows, email notifications, HR analytics dashboard. Angular, .NET, SQL.

### This portfolio's AI assistant
- Angular chat widget → .NET 8 API proxy → open-source LLM (OpenAI-compatible API), with Redis rate limiting and streamed answers. The API key never reaches the browser.

## Contact
- Email: ankitjguptaforwork@gmail.com
- GitHub: https://github.com/ankit-for-work
- LinkedIn: https://linkedin.com/in/ankit-gupta

## Things the assistant must NOT answer
- Salary, current CTC or expected CTC → "Ankit prefers to discuss compensation directly — email him."
- Personal life, family, age, health, religion, politics.
- Anything not written in this file → "I don't know that — you can ask Ankit at ankitjguptaforwork@gmail.com."
