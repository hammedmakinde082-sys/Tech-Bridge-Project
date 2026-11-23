const tasks = [
    {
        title: "Build the TechBridge Homepage",
        description: "Create the first version of the TechBridge website using HTML and CSS.",
        status: "completed"
    },
    {
        title: "Build the TechBridge Programs Experience",
        description: "Create a Programs experience presenting TechBridge's available learning programs.",
        status: "completed"
    },
    {
        title: "Build the Internship Tasks Experience",
        description: "Create an interface that presents the TechBridge internship tasks and helps users understand the internship journey.",
        status: "completed"
    },
    {
        title: "Build an Interactive Internship Roadmap",
        description: "Use JavaScript to allow visitors to switch between the Data Analytics and Web Development internship tracks.",
        status: "completed"
    },
    {
        title: "Build the Intern Registration Experience",
        description: "Create a professional registration and onboarding interface for TechBridge interns.",
        status: "completed"
    },
    {
        title: "Build the Task Submission System",
        description: "Create an interface through which interns can prepare and submit their task work.",
        status: "completed"
    },
    {
        title: "Build the Intern Dashboard",
        description: "Create a dashboard where an intern can view their profile, progress, tasks, and submissions.",
        status: "in-progress"
    },
    {
        title: "Build the Complete TechBridge Internship Platform",
        description: "Combine the different components created during the internship into a complete TechBridge platform.",
        status: "not-started"
    }
];

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
let activeFilter = "all";

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
    const number = createElement("span", "dashboard-task-number", `TASK ${index + 1}`);
    const status = createElement("span", `dashboard-task-status status-${task.status}`, task.status.replace("-", " "));
    status.textContent = task.status === "in-progress" ? "In Progress" : task.status === "not-started" ? "Not Started" : "Completed";
    top.append(number, status);

    const title = createElement("h3", "", task.title);
    const description = createElement("p", "dashboard-task-description", task.description);
    const actions = createElement("div", "dashboard-task-actions");
    const viewButton = createElement("button", "dashboard-view-task", "View Task");
    viewButton.type = "button";
    viewButton.addEventListener("click", () => showTaskDetails(task, index));
    actions.append(viewButton);

    if (task.status !== "completed") {
        const completeButton = createElement("button", "dashboard-complete-task", "Mark as Completed");
        completeButton.type = "button";
        completeButton.addEventListener("click", () => {
            const wasCurrentTask = task.status === "in-progress";
            task.status = "completed";
            if (wasCurrentTask) {
                const nextTask = tasks.find((nextTask) => nextTask.status === "not-started");
                if (nextTask) {
                    nextTask.status = "in-progress";
                }
            }
            renderTasks();
        });
        actions.append(completeButton);
    }

    card.append(top, title, description, actions);
    return card;
}

function renderTasks() {
    const visibleTasks = tasks.filter((task) => activeFilter === "all" || task.status === activeFilter);
    taskGrid.replaceChildren(...visibleTasks.map((task) => createTaskCard(task, tasks.indexOf(task))));
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
    const percentage = (completed / tasks.length) * 100;
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
    const number = createElement("p", "dashboard-dialog-number", `TASK ${index + 1}`);
    const description = createElement("p", "dashboard-dialog-description", task.description);
    const status = createElement("p", `dashboard-dialog-status status-${task.status}`, `Status: ${task.status === "in-progress" ? "In Progress" : task.status === "not-started" ? "Not Started" : "Completed"}`);
    taskDialogContent.replaceChildren(number, heading, description, status);
    taskDialog.showModal();
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
        renderTasks();
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
