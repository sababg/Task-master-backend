# TaskMaster Backend (REST API)

TaskMaster is a secure RESTful API for managing users, projects, and tasks. It is built with Node.js, Express, MongoDB, and Mongoose, and uses JWT authentication with ownership-based authorization.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (`jsonwebtoken`)
- Password hashing (`bcrypt`)
- Environment config (`dotenv`)

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Environment variables

Create a `.env` file in the project root:

```bash
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

**Important:** Ensure `.env` is in `.gitignore` and is not committed.

### 3) Run the server

```bash
npm run dev
```

Or:

```bash
npm start
```

## Folder Structure (Suggested)

```
config/          # Database connection
models/          # Mongoose schemas (User, Project, Task)
routes/api/      # Express route modules (users, projects, tasks)
middleware/      # Auth middleware, error handlers, etc.
utils/           # JWT helpers and other utilities
server.js        # Main entry point
```

## Authentication

This API uses **JWT Bearer tokens**.

### How to send a token

Include the token in every protected request:

- Header: `Authorization: Bearer <token>`

Protected routes will return `401 Unauthorized` if the token is missing or invalid.

## Data Models (High Level)

### User

- `username` (required)
- `email` (required, unique)
- `password` (required, hashed with bcrypt via pre-save hook)

### Project

- `name` (required)
- `description` (optional)
- `user` (required, ObjectId ref to `User`) — used for ownership authorization

### Task

- `title` (required)
- `description` (optional)
- `status` (e.g., `To Do`, `In Progress`, `Done`)
- `project` (required, ObjectId ref to `Project`)

## Authorization Rules (Security Requirements)

Ownership-based authorization is enforced throughout:

- A user can only access **their own projects**
- Tasks are **children of projects**
- A user can only create/read/update/delete tasks **inside projects they own**
- Attempts to access another user’s data should return `403 Forbidden` (or similar)

## API Endpoints

Base URL examples below assume the API is mounted at `/api`.

---

# Users

## Register

**POST** `/api/users/register`

Creates a new user. Password hashing is handled by the User model.

**Body (example):**

```json
{
  "username": "alex",
  "email": "alex@example.com",
  "password": "Password123!"
}
```

**Success Response (example):**

- `201 Created`

---

## Login

**POST** `/api/users/login`

Authenticates a user and returns a signed JWT.

**Body (example):**

```json
{
  "email": "alex@example.com",
  "password": "Password123!"
}
```

**Success Response (example):**

- `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

# Projects (Protected)

All project routes require a valid JWT.

## Create a project

**POST** `/api/projects`

**Body (example):**

```json
{
  "name": "Spring Launch",
  "description": "All tasks for the spring product launch."
}
```

**Notes:**

- The project owner (`user`) is automatically set from `req.user` (decoded JWT).

---

## Get all projects (owned by current user)

**GET** `/api/projects`

Returns only projects where `project.user === req.user._id`.

---

## Get a project by id (must be owned)

**GET** `/api/projects/:id`

- `404 Not Found` if project does not exist
- `403 Forbidden` if project exists but belongs to another user

---

## Update a project (must be owned)

**PUT** `/api/projects/:id`

**Body (example):**

```json
{
  "name": "Spring Launch (Updated)",
  "description": "Updated description."
}
```

---

## Delete a project (must be owned)

**DELETE** `/api/projects/:id`

---

# Tasks (Protected)

Tasks are tied to projects and require ownership checks on the parent project.

## Create a task under a project (must own project)

**POST** `/api/projects/:projectId/tasks`

**Body (example):**

```json
{
  "title": "Draft launch plan",
  "description": "Outline milestones and owners",
  "status": "To Do"
}
```

**Rules:**

- Validates `projectId`
- Verifies the project exists
- Verifies the logged-in user owns the project before creating the task

---

## Get all tasks for a project (must own project)

**GET** `/api/projects/:projectId/tasks`

Returns all tasks associated with the project.

---

## Update a task (must own parent project)

**PUT** `/api/tasks/:taskId`

**Body (example):**

```json
{
  "title": "Draft launch plan v2",
  "status": "In Progress"
}
```

**Rules (required):**

1. Find task by `taskId`
2. Load parent project from `task.project`
3. Verify logged-in user owns that project
4. Apply update

---

## Delete a task (must own parent project)

**DELETE** `/api/tasks/:taskId`

Follows the same authorization rules as update.

---

## Testing Checklist (Postman/Insomnia)

1. Register a user
2. Login and copy the JWT
3. Try accessing protected routes **without** a token → should fail (`401`)
4. Create a project with User A
5. Create tasks under that project with User A
6. Login as User B and try to:
   - Read User A’s project
   - Create/read/update/delete tasks in User A’s project  
     → should fail (`403`)

#

👤 Author
Saba Beigi
🌎 Charlotte, NC
💼 GitHub @sababg
📧 beigisaba@gmail.com

Feel free to reach out with questions, feedback, or ideas!
