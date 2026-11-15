const internshipTracks = {
    "data-analytics": {
        name: "Data Analytics",
        description: "Turn messy data into useful insights, from spreadsheet basics to an end-to-end capstone.",
        tasks: [
            {
                title: "Data Cleaning Basics",
                day: 1,
                description: "Clean a messy dataset using Google Sheets or Excel. Identify and fix duplicate rows, blank cells, inconsistent formatting, and incorrect data types.",
                difficulty: "Beginner"
            },
            {
                title: "Formulas & Pivot Tables",
                day: 4,
                description: "Use spreadsheet formulas and Pivot Tables to answer questions and extract useful insights from a dataset.",
                difficulty: "Beginner"
            },
            {
                title: "Data Visualization",
                day: 8,
                description: "Create charts and a simple dashboard that communicate useful insights from a dataset.",
                difficulty: "Beginner → Intermediate"
            },
            {
                title: "Introduction to SQL",
                day: 11,
                description: "Practice basic SQL queries and use them to answer real-world questions about data.",
                difficulty: "Beginner → Intermediate"
            },
            {
                title: "SQL Joins & Aggregations",
                day: 15,
                description: "Use JOIN, GROUP BY and aggregate functions such as COUNT, SUM and AVG to analyze information across multiple tables.",
                difficulty: "Intermediate"
            },
            {
                title: "Lookup Functions & Data Wrangling",
                day: 19,
                description: "Use VLOOKUP or XLOOKUP to combine related datasets and handle data mismatches.",
                difficulty: "Intermediate"
            },
            {
                title: "Mini Analysis Project",
                day: 22,
                description: "Complete a small end-to-end analysis involving data cleaning, formulas, Pivot Tables, charts and recommendations.",
                difficulty: "Intermediate"
            },
            {
                title: "Capstone Project",
                day: 26,
                description: "Complete a larger project combining spreadsheet analysis and SQL using at least two related tables.",
                difficulty: "Intermediate"
            }
        ]
    },
    "web-development": {
        name: "Web Development",
        description: "Create for the web, from your first homepage to a complete internship platform.",
        tasks: [
            {
                title: "Build the TechBridge Homepage",
                day: 1,
                description: "Create the first version of the TECHBRIDGE website using HTML and CSS.",
                difficulty: "Beginner"
            },
            {
                title: "Build the TechBridge Programs Experience",
                day: 4,
                description: "Create a Programs experience presenting TechBridge's available learning programs.",
                difficulty: "Beginner"
            },
            {
                title: "Build the Internship Tasks Experience",
                day: 8,
                description: "Create an interface that presents the TechBridge internship tasks and helps users understand the internship journey.",
                difficulty: "Beginner → Intermediate"
            },
            {
                title: "Build an Interactive Internship Roadmap",
                day: 11,
                description: "Use JavaScript to allow visitors to switch between the Data Analytics and Web Development internship tracks.",
                difficulty: "Beginner → Intermediate"
            },
            {
                title: "Build the Intern Registration Experience",
                day: 15,
                description: "Create a professional registration and onboarding interface for TechBridge interns.",
                difficulty: "Intermediate"
            },
            {
                title: "Build the Task Submission System",
                day: 19,
                description: "Create an interface through which interns can prepare and submit their task work.",
                difficulty: "Intermediate"
            },
            {
                title: "Build the Intern Dashboard",
                day: 22,
                description: "Create a dashboard where an intern can view their profile, progress, tasks and submissions.",
                difficulty: "Intermediate"
            },
            {
                title: "Build the Complete TechBridge Internship Platform",
                day: 26,
                description: "Combine the different components created during the internship into a complete TechBridge platform.",
                difficulty: "Intermediate"
            }
        ]
    }
};

let selectedTrack = "web-development";

const trackButtons = document.querySelectorAll(".track-button");
const taskList = document.querySelector("#task-list");
const selectedTrackName = document.querySelector("#selected-track-name");
const selectedTrackDescription = document.querySelector("#selected-track-description");

function createTaskItem(task, index) {
    const item = document.createElement("li");
    item.className = "task-item";

    const marker = document.createElement("div");
    marker.className = "task-marker";

    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");

    const day = document.createElement("strong");
    day.textContent = `DAY ${task.day}`;

    marker.append(number, day);

    const content = document.createElement("article");
    content.className = "task-content";

    const contentTop = document.createElement("div");
    contentTop.className = "task-content-top";

    const introduction = document.createElement("span");
    introduction.className = "task-introduction";
    introduction.textContent = `Introduced Day ${task.day}`;

    const difficulty = document.createElement("span");
    difficulty.className = "task-level";
    if (task.difficulty === "Beginner") {
        difficulty.classList.add("level-beginner");
    } else if (task.difficulty === "Beginner → Intermediate") {
        difficulty.classList.add("level-bridge");
    } else {
        difficulty.classList.add("level-intermediate");
    }
    difficulty.textContent = task.difficulty;

    contentTop.append(introduction, difficulty);

    const title = document.createElement("h3");
    title.textContent = task.title;

    const description = document.createElement("p");
    description.textContent = task.description;

    content.append(contentTop, title, description);
    item.append(marker, content);

    return item;
}

function displayTrack(trackKey) {
    let track;

    if (trackKey === "data-analytics") {
        track = internshipTracks["data-analytics"];
    } else if (trackKey === "web-development") {
        track = internshipTracks["web-development"];
    } else {
        throw new Error(`Unknown internship track: ${trackKey}`);
    }

    selectedTrack = trackKey;
    selectedTrackName.textContent = track.name;
    selectedTrackDescription.textContent = track.description;
    taskList.setAttribute("aria-label", `${track.name} internship tasks`);
    taskList.replaceChildren(...track.tasks.map(createTaskItem));

    trackButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.track === selectedTrack));
    });
}

trackButtons.forEach((button) => {
    button.addEventListener("click", () => displayTrack(button.dataset.track));
});

displayTrack(selectedTrack);
