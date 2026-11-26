const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");

const app = express();
const port = Number(process.env.PORT) || 3000;
const tasksFile = path.join(__dirname, "data", "tasks.json");
const websiteDirectory = path.resolve(__dirname, "..");
const validStatuses = new Set(["completed", "in-progress", "not-started"]);

app.use(express.json({ limit: "10kb" }));

async function readTasks() {
    const contents = await fs.readFile(tasksFile, "utf8");
    return JSON.parse(contents);
}

app.get("/api/tasks", async (request, response, next) => {
    try {
        response.json(await readTasks());
    } catch (error) {
        next(error);
    }
});

app.get("/api/tasks/:id", async (request, response, next) => {
    try {
        const id = Number(request.params.id);
        const tasks = await readTasks();
        const task = tasks.find((item) => item.id === id);
        if (!task) {
            return response.status(404).json({ error: "Task not found." });
        }
        response.json(task);
    } catch (error) {
        next(error);
    }
});

app.put("/api/tasks/:id", async (request, response, next) => {
    try {
        const id = Number(request.params.id);
        const { status } = request.body || {};
        if (!validStatuses.has(status)) {
            return response.status(400).json({
                error: "Status must be completed, in-progress, or not-started."
            });
        }

        const tasks = await readTasks();
        const task = tasks.find((item) => item.id === id);
        if (!task) {
            return response.status(404).json({ error: "Task not found." });
        }

        task.status = status;
        await fs.writeFile(tasksFile, `${JSON.stringify(tasks, null, 2)}\n`, "utf8");
        response.json(task);
    } catch (error) {
        next(error);
    }
});

app.use("/api", (request, response) => {
    response.status(404).json({ error: "API endpoint not found." });
});

app.use(express.static(websiteDirectory));

app.use((error, request, response, next) => {
    if (error instanceof SyntaxError && "body" in error) {
        return response.status(400).json({ error: "Request body must be valid JSON." });
    }
    console.error(error);
    response.status(500).json({ error: "The server could not complete the request." });
});

app.listen(port, () => {
    console.log(`TechBridge server running at http://localhost:${port}`);
});
