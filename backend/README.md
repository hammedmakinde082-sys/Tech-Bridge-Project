# TechBridge Task API

## Run locally

From this directory, install dependencies once and start the server:

```sh
npm install
npm start
```

Open the dashboard at <http://localhost:3000/dashboard.html>. The Express server serves the website from the project root and exposes its API on the same origin.

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/tasks` | Return all internship tasks as a JSON array. |
| GET | `/api/tasks/:id` | Return one task as a JSON object, or `404` if it does not exist. |
| PUT | `/api/tasks/:id` | Update a task's status. Send JSON such as `{"status":"completed"}`. Accepted statuses are `completed`, `in-progress`, and `not-started`. |

Task data is stored in `data/tasks.json`, so status updates remain available after the server restarts.
