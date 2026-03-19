# Task API (Express + Mongoose)

## Setup

1. Install deps:
   ```bash
   npm install
   ```
2. Create `.env`:
   - `MONGO_URI=...`
   - `PORT=8080`
   - `JWT_SECRET=...`

## Auth

Send JWT in headers:

- `Authorization: Bearer <token>`

## Endpoints

### Users / Auth

- `POST /api/users/register`
  - body: `{ "name": "A", "email": "a@b.com", "password": "secret" }`
- `POST /api/users/login`
  - body: `{ "email": "a@b.com", "password": "secret" }`
  - returns: `{ "token": "..." }`
- `GET /api/users/me`

### Projects (auth required)

- `POST /api/projects`
  - body: `{ "name": "My Project", "description": "..." }`
- `GET /api/projects`
- `GET /api/projects/:projectId`
- `PATCH /api/projects/:projectId`
- `DELETE /api/projects/:projectId`

### Tasks (auth required; must own project)

- `POST /api/projects/:projectId/tasks`
  - body: `{ "title": "Do thing", "description": "...", "status": "todo" }`
- `GET /api/projects/:projectId/tasks`
  - query: `?status=todo|in_progress|done`
- `GET /api/tasks/:taskId`
- `PATCH /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`
