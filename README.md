# FlowPilot - AI Productivity Platform

FlowPilot is a modern ClickUp-inspired productivity web app built for simplicity and speed.

## Included capabilities

- Work hierarchy: Workspace → Spaces → Folders → Lists → Tasks
- Task management with priorities, due dates, tags, subtasks/checklists, comments, and quick reassignment
- Multi-view shell: List, Kanban, Calendar, Timeline, Table
- Dashboard widgets for today, upcoming deadlines, activity, and focus-time stats
- AI helpers:
  - Task summarization
  - Automatic task generation from text prompts (e.g. "Plan a product launch")
  - Smart deadline suggestions by priority
  - Workload balancing signals
  - Natural language task search
- Dark/light mode, keyboard shortcut hints, responsive layout
- Integration-ready stubs: Slack, Google Drive, GitHub, Zoom, Email
- Role model references: Admin, Manager, Member

## Tech stack

- Next.js + React + TypeScript
- Tailwind CSS
- In-memory demo data (easy to connect to PostgreSQL/MongoDB + Express/Nest backend)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Notes for production

- Add secure auth (NextAuth/Auth.js or custom JWT with HTTP-only cookies)
- Persist data in PostgreSQL
- Add WebSocket updates for comments/activity/time tracking
- Add background AI pipeline with provider abstraction
