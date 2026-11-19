const challenges = [
    {
        title: "Sales Snapshot",
        track: "data-analytics",
        trackName: "Data Analytics",
        difficulty: "Beginner",
        description: "Explore a small shop's monthly sales data and find which products and months are performing best.",
        outcome: "A clear one-page summary with a few charts and three useful business observations.",
        objective: "Turn a basic sales spreadsheet into a short, evidence-based story about business performance.",
        skills: "Sorting, spreadsheet formulas, pivot tables, chart selection, and communicating insights.",
        tools: "Google Sheets or Microsoft Excel",
        deliverable: "A cleaned spreadsheet, a simple visual summary, and three written recommendations.",
        time: "2–3 hours"
    },
    {
        title: "Customer Voice",
        track: "data-analytics",
        trackName: "Data Analytics",
        difficulty: "Intermediate",
        description: "Group customer feedback into themes and compare how different service areas are rated.",
        outcome: "A short findings report that highlights recurring feedback and one priority for improvement.",
        objective: "Use a small set of customer comments and ratings to identify patterns that a team can act on.",
        skills: "Data cleaning, categorization, summary statistics, basic visualization, and clear writing.",
        tools: "Google Sheets or Microsoft Excel",
        deliverable: "A categorized feedback table, a chart of key themes, and a concise recommendation.",
        time: "3–4 hours"
    },
    {
        title: "Monthly Budget Explorer",
        track: "data-analytics",
        trackName: "Data Analytics",
        difficulty: "Advanced",
        description: "Compare planned and actual expenses to uncover overspending patterns and suggest practical changes.",
        outcome: "A small interactive dashboard that makes expense trends and budget variances easy to understand.",
        objective: "Analyze a multi-category expense dataset, highlight significant variances, and explain what may be driving them.",
        skills: "Data validation, formulas, pivot tables, dashboard layout, and presenting evidence-based recommendations.",
        tools: "Google Sheets or Microsoft Excel",
        deliverable: "A dashboard with category comparisons, monthly trends, and a brief written summary.",
        time: "5–6 hours"
    },
    {
        title: "A Landing Page That Welcomes",
        track: "web-development",
        trackName: "Web Development",
        difficulty: "Beginner",
        description: "Build a friendly, responsive landing page for a community workshop or local service.",
        outcome: "A polished single-page site with a clear message, useful sections, and a strong call to action.",
        objective: "Create a readable page layout that introduces an organization and guides visitors to one next step.",
        skills: "HTML structure, CSS typography, spacing, color, and responsive layout basics.",
        tools: "HTML, CSS, and a web browser",
        deliverable: "A responsive page with a hero, details section, and prominent contact or sign-up link.",
        time: "3–4 hours"
    },
    {
        title: "Portfolio Project Gallery",
        track: "web-development",
        trackName: "Web Development",
        difficulty: "Intermediate",
        description: "Design a project gallery where a learner can introduce themselves and show their work.",
        outcome: "A mobile-friendly portfolio page that helps visitors scan projects and find contact information.",
        objective: "Present a learner's background and projects in a cohesive layout that works on small and large screens.",
        skills: "Semantic HTML, CSS Grid or Flexbox, responsive design, and accessible link styling.",
        tools: "HTML, CSS, and a web browser",
        deliverable: "A portfolio page with an introduction, at least three project cards, and contact links.",
        time: "4–5 hours"
    },
    {
        title: "Interactive Task Tracker",
        track: "web-development",
        trackName: "Web Development",
        difficulty: "Advanced",
        description: "Create a small task tracker that lets a visitor add tasks, mark them complete, and remove them.",
        outcome: "A useful browser-based interface with clear feedback and no page refresh for common actions.",
        objective: "Combine a simple interface with JavaScript state and event handling to manage a list of tasks.",
        skills: "DOM updates, event listeners, input validation, accessible controls, and responsive UI design.",
        tools: "HTML, CSS, JavaScript, and a web browser",
        deliverable: "A working task tracker with add, complete, and delete interactions.",
        time: "5–7 hours"
    }
];

const challengeGrid = document.querySelector("#challenge-grid");
const challengeCount = document.querySelector("#challenge-count");
const emptyMessage = document.querySelector("#challenge-empty");
const filterButtons = document.querySelectorAll(".filter-button");
const challengeDialog = document.querySelector("#challenge-dialog");
const dialogContent = document.querySelector("#dialog-content");
const dialogClose = document.querySelector(".dialog-close");
const activeFilters = {
    track: "all",
    difficulty: "all"
};

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

function createChallengeCard(challenge) {
    const card = createElement("article", `challenge-card ${challenge.track}-card`);
    const top = createElement("div", "challenge-card-top");
    const track = createElement("span", "challenge-track", challenge.trackName);
    const difficulty = createElement("span", `challenge-level level-${challenge.difficulty.toLowerCase()}`, challenge.difficulty);
    top.append(track, difficulty);

    const title = createElement("h3", "", challenge.title);
    const description = createElement("p", "challenge-description", challenge.description);
    const outcome = createElement("p", "challenge-outcome");
    outcome.append(createElement("strong", "", "You’ll create"), document.createTextNode(` ${challenge.outcome}`));

    const button = createElement("button", "challenge-view-button", "View challenge");
    button.type = "button";
    button.setAttribute("aria-label", `View details for ${challenge.title}`);
    button.addEventListener("click", () => showChallengeDetails(challenge));

    card.append(top, title, description, outcome, button);
    return card;
}

function renderChallenges() {
    const visibleChallenges = challenges.filter((challenge) => {
        const matchesTrack = activeFilters.track === "all" || challenge.track === activeFilters.track;
        const matchesDifficulty = activeFilters.difficulty === "all" || challenge.difficulty === activeFilters.difficulty;
        return matchesTrack && matchesDifficulty;
    });

    challengeGrid.replaceChildren(...visibleChallenges.map(createChallengeCard));
    challengeCount.textContent = `${visibleChallenges.length} ${visibleChallenges.length === 1 ? "challenge" : "challenges"} to explore`;
    emptyMessage.hidden = visibleChallenges.length > 0;
}

function showChallengeDetails(challenge) {
    const heading = createElement("h2", "dialog-title", challenge.title);
    heading.id = "dialog-title";
    const badges = createElement("p", "dialog-badges");
    badges.append(
        createElement("span", "challenge-track", challenge.trackName),
        createElement("span", `challenge-level level-${challenge.difficulty.toLowerCase()}`, challenge.difficulty)
    );

    const sections = [
        ["Objective", challenge.objective],
        ["Skills to practice", challenge.skills],
        ["Suggested tools", challenge.tools],
        ["What to produce", challenge.deliverable],
        ["Estimated time", challenge.time]
    ];
    const detailList = createElement("dl", "dialog-details");
    sections.forEach(([label, value]) => {
        detailList.append(createElement("dt", "", label), createElement("dd", "", value));
    });

    dialogContent.replaceChildren(heading, badges, detailList);
    challengeDialog.showModal();
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const { filter, value } = button.dataset;
        if (filter !== "track" && filter !== "difficulty") {
            throw new Error(`Unknown challenge filter: ${filter}`);
        }
        activeFilters[filter] = value;
        filterButtons.forEach((filterButton) => {
            if (filterButton.dataset.filter === filter) {
                filterButton.setAttribute("aria-pressed", String(filterButton === button));
            }
        });
        renderChallenges();
    });
});

dialogClose.addEventListener("click", () => challengeDialog.close());
challengeDialog.addEventListener("click", (event) => {
    if (event.target === challengeDialog) {
        challengeDialog.close();
    }
});

renderChallenges();
