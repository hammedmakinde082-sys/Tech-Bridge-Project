let tasks = [];

const technologies = {
    nextjs: {
        category: "Framework · React",
        name: "Next.js",
        description: "Next.js is a React framework for building full-stack web applications. It is commonly used for fast, search-friendly websites and products that need both a rich interface and server-rendered pages.",
        link: "https://nextjs.org/docs",
        linkText: "Explore the Next.js docs"
    },
    vue: {
        category: "Progressive JavaScript framework",
        name: "Vue.js",
        description: "Vue.js is a JavaScript framework for building user interfaces. Developers use it to create interactive pages and single-page applications, from small enhancements to complete web experiences.",
        link: "https://vuejs.org/guide/",
        linkText: "Explore the Vue.js guide"
    },
    angular: {
        category: "Web application framework · Google",
        name: "Angular",
        description: "Angular is a TypeScript-based framework for building web applications. Its structured tools are commonly used for large, feature-rich applications maintained by teams.",
        link: "https://angular.dev/overview",
        linkText: "Explore Angular"
    },
    backend: {
        category: "The server side of an application",
        name: "Backend development",
        description: "Backend development handles the data, business rules, and requests that power an application behind the scenes and connect its services to the frontend. Node.js runs JavaScript on the server, Express.js helps build APIs with Node.js, and Django is a Python framework for database-backed web applications. Flask, Laravel, and .NET are other options.",
        link: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side",
        linkText: "Explore backend development"
    }
};

const taskGrid = document.querySelector("#dashboard-task-grid");
const taskCount = document.querySelector("#task-count");
const filterButtons = document.querySelectorAll(".dashboard-filter");
const progressBar = document.querySelector(".progress-track");
const progressFill = document.querySelector(".progress-fill");
const progressSummary = document.querySelector("#progress-summary");
const completedCount = document.querySelector("#completed-count");
const remainingCount = document.querySelector("#remaining-count");
const progressPercent = document.querySelector("#progress-percent");
const internshipStatus = document.querySelector("#internship-status");
const taskDialog = document.querySelector("#task-dialog");
const taskDialogContent = document.querySelector("#task-dialog-content");
const dialogClose = document.querySelector(".dashboard-dialog .dialog-close");
const techTabs = document.querySelectorAll(".tech-tab");
const techPanel = document.querySelector("#tech-panel");
const backendStatus = document.querySelector("#backend-status");
const apiMessage = document.querySelector("#dashboard-api-message");
let activeFilter = "all";

async function requestJson(url, options) {
    let response;
    try {
        response = await fetch(url, options);
    } catch (error) {
        setBackendStatus(false);
        throw error;
    }
    setBackendStatus(true);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "The request could not be completed.");
    }
    return data;
}

function setBackendStatus(connected) {
    backendStatus.textContent = `Backend Status: ${connected ? "Connected" : "Offline"}`;
    backendStatus.dataset.state = connected ? "connected" : "offline";
}

function setApiMessage(message, isError) {
    apiMessage.textContent = message;
    apiMessage.dataset.state = isError ? "error" : "";
}

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (text) {
        element.textContent = text;
    }
    return element;
}

function createTaskCard(task, index) {
    const card = createElement("article", `dashboard-task-card task-${task.status}`);
    const top = createElement("div", "dashboard-task-top");
    const number = createElement("span", "dashboard-task-number", `TASK ${task.id || index + 1}`);
    const status = createElement("span", `dashboard-task-status status-${task.status}`, task.status.replace("-", " "));
    status.textContent = task.status === "in-progress" ? "In Progress" : task.status === "not-started" ? "Not Started" : "Completed";
    top.append(number, status);

    const title = createElement("h3", "", task.title);
    const description = createElement("p", "dashboard-task-description", task.description);
    const actions = createElement("div", "dashboard-task-actions");
    const viewButton = createElement("button", "dashboard-view-task", "View Task");
    viewButton.type = "button";
    viewButton.addEventListener("click", () => loadTaskDetails(task.id, index));
    actions.append(viewButton);

    if (task.status !== "completed") {
        const completeButton = createElement("button", "dashboard-complete-task", "Mark as Completed");
        completeButton.type = "button";
        completeButton.addEventListener("click", () => updateTaskStatus(task, completeButton));
        actions.append(completeButton);
    }

    card.append(top, title, description, actions);
    return card;
}

function renderTasks() {
    const visibleTasks = tasks.filter((task) => activeFilter === "all" || task.status === activeFilter);
    if (tasks.length === 0) {
        taskGrid.replaceChildren(createElement("p", "dashboard-task-message", "No tasks are available right now."));
    } else {
        taskGrid.replaceChildren(...visibleTasks.map((task) => createTaskCard(task, tasks.indexOf(task))));
    }
    taskCount.textContent = `${visibleTasks.length} ${visibleTasks.length === 1 ? "task" : "tasks"} shown`;

    const counts = {
        all: tasks.length,
        completed: tasks.filter((task) => task.status === "completed").length,
        "in-progress": tasks.filter((task) => task.status === "in-progress").length,
        "not-started": tasks.filter((task) => task.status === "not-started").length
    };
    document.querySelectorAll("[data-filter-count]").forEach((count) => {
        count.textContent = `(${counts[count.dataset.filterCount]})`;
    });

    const completed = counts.completed;
    const remaining = tasks.length - completed;
    const percentage = tasks.length ? (completed / tasks.length) * 100 : 0;
    const percentageText = Number.isInteger(percentage) ? String(percentage) : percentage.toFixed(1);
    completedCount.textContent = String(completed);
    remainingCount.textContent = String(remaining);
    progressPercent.textContent = `${percentageText}%`;
    progressSummary.textContent = `${completed} / ${tasks.length} tasks completed`;
    internshipStatus.lastChild.textContent = completed === tasks.length ? " Completed" : " In Progress";
    progressFill.style.width = `${percentage}%`;
    progressBar.setAttribute("aria-valuemax", String(tasks.length));
    progressBar.setAttribute("aria-valuenow", String(completed));
    progressBar.setAttribute("aria-valuetext", `${completed} of ${tasks.length} tasks completed`);
}

function showTaskDetails(task, index) {
    const heading = createElement("h2", "dashboard-dialog-title", task.title);
    heading.id = "task-dialog-title";
    const number = createElement("p", "dashboard-dialog-number", `TASK ${task.id || index + 1}`);
    const description = createElement("p", "dashboard-dialog-description", task.description);
    const status = createElement("p", `dashboard-dialog-status status-${task.status}`, `Status: ${task.status === "in-progress" ? "In Progress" : task.status === "not-started" ? "Not Started" : "Completed"}`);
    taskDialogContent.replaceChildren(number, heading, description, status);
    taskDialog.showModal();
}

async function loadTaskDetails(taskId, index) {
    taskDialogContent.replaceChildren(createElement("p", "dashboard-dialog-description", "Loading task details..."));
    taskDialog.showModal();
    try {
        const task = await requestJson(`/api/tasks/${encodeURIComponent(taskId)}`);
        showTaskDetails(task, index);
    } catch (error) {
        taskDialogContent.replaceChildren(
            createElement("h2", "dashboard-dialog-title", "Unable to load task"),
            createElement("p", "dashboard-dialog-description", error.message)
        );
    }
}

async function updateTaskStatus(task, button) {
    button.disabled = true;
    setApiMessage("", false);
    try {
        const wasCurrentTask = task.status === "in-progress";
        const updatedTask = await requestJson(`/api/tasks/${encodeURIComponent(task.id)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "completed" })
        });
        tasks = tasks.map((currentTask) => currentTask.id === updatedTask.id ? updatedTask : currentTask);
        const nextTask = wasCurrentTask ? tasks.find((currentTask) => currentTask.status === "not-started") : null;
        if (nextTask) {
            try {
                const advancedTask = await requestJson(`/api/tasks/${encodeURIComponent(nextTask.id)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "in-progress" })
                });
                tasks = tasks.map((currentTask) => currentTask.id === advancedTask.id ? advancedTask : currentTask);
            } catch (error) {
                renderTasks();
                setApiMessage(`Task completed, but the next task could not be started. ${error.message}`, true);
                return;
            }
        }
        renderTasks();
    } catch (error) {
        button.disabled = false;
        setApiMessage(`Unable to update task. ${error.message}`, true);
    }
}

function showLoadError(error) {
    setBackendStatus(false);
    taskCount.textContent = "";
    taskGrid.replaceChildren(
        createElement("p", "dashboard-task-message", "Unable to load tasks. Please check your connection or try again.")
    );
    const retryButton = createElement("button", "dashboard-retry-button", "Try again");
    retryButton.type = "button";
    retryButton.addEventListener("click", loadTasks);
    taskGrid.append(retryButton);
    setApiMessage(error.message, true);
}

async function loadTasks() {
    taskGrid.replaceChildren(createElement("p", "dashboard-task-message", "Loading tasks..."));
    setApiMessage("", false);
    try {
        tasks = await requestJson("/api/tasks");
        renderTasks();
    } catch (error) {
        showLoadError(error);
    }
}

function showTechnology(key) {
    const technology = technologies[key];
    if (!technology) {
        throw new Error(`Unknown technology: ${key}`);
    }

    const category = createElement("p", "section-kicker", technology.category);
    const heading = createElement("h3", "", technology.name);
    const description = createElement("p", "", technology.description);
    const link = createElement("a", "text-link", technology.linkText);
    link.href = technology.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.append(document.createTextNode(" ↗"));
    techPanel.replaceChildren(category, heading, description, link);
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        if (!["all", "completed", "in-progress", "not-started"].includes(filter)) {
            throw new Error(`Unknown task filter: ${filter}`);
        }
        activeFilter = filter;
        filterButtons.forEach((filterButton) => {
            filterButton.setAttribute("aria-pressed", String(filterButton === button));
        });
        loadTasks();
    });
});

techTabs.forEach((button) => {
    button.addEventListener("click", () => {
        const technology = button.dataset.technology;
        if (!technology || !Object.prototype.hasOwnProperty.call(technologies, technology)) {
            throw new Error(`Unknown technology: ${technology}`);
        }
        techTabs.forEach((tab) => {
            tab.setAttribute("aria-pressed", String(tab === button));
        });
        showTechnology(technology);
    });
});

dialogClose.addEventListener("click", () => taskDialog.close());
taskDialog.addEventListener("click", (event) => {
    if (event.target === taskDialog) {
        taskDialog.close();
    }
});

renderTasks();
