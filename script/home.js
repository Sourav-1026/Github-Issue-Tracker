let allIssues = [];
let searchResults = [];
let lastQuery = "";

const cardInfo = document.getElementById("card-info");

async function loadIssues() {
  const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
  const data = await res.json();

  allIssues = data.data;
  displayIssues(allIssues);
}

function displayIssues(issues) {
  cardInfo.innerHTML = "";

  document.getElementById("total-issues").innerText = issues.length;

  issues.forEach((issue) => {
    const priorityColor = issue.status === "open" ? "border-t-green-500" : "border-t-purple-500";

    const priorityBadge = issue.priority === "high" ? "bg-red-100 text-red-500" : issue.priority === "medium" ? "bg-yellow-100 text-yellow-600" : "bg-gray-200 text-gray-600";

    const statusIcon = issue.status === "open" ? `<i class="fa-regular fa-circle-check text-green-500"></i>` : `<i class="fa-solid fa-circle-check text-purple-500"></i>`;

    const labels = issue.labels
      .map((label) => {
        if (label === "bug") return `<span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-500">BUG</span>`;
        if (label === "help wanted") return `<span class="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-500">HELP WANTED</span>`;
        if (label === "enhancement") return `<span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">ENHANCEMENT</span>`;
        if (label === "documentation") return `<span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">DOCUMENTATION</span>`;
        if (label === "good first issue") return `<span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">GOOD FIRST USE</span>`;
      })
      .join("");

    const div = document.createElement("div");

    div.className = `bg-white border-t-4 ${priorityColor} shadow-md rounded-lg p-4 flex flex-col justify-between`;
    div.dataset.id = issue.id;

    div.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            ${statusIcon}
            <span class="text-xs px-3 py-1 rounded-full ${priorityBadge} font-semibold">
                ${issue.priority}
            </span>
        </div>

        <div>
            <h3 class="font-semibold text-gray-800 mb-2">
                ${issue.title}
            </h3>

            <p class="text-sm text-gray-500 mb-3 line-clamp-2">
                ${issue.description}
            </p>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
            ${labels}
        </div>

        <div class="text-xs text-gray-400 border-t pt-3 flex justify-between">
            <div>
                <p>#${issue.id} by ${issue.author}</p>
                <p>Assignee: ${issue.assignee}</p>
            </div>
            <div>
                <p>Created: ${new Date(issue.createdAt).toLocaleDateString()}</p>
                <p>Updated: ${new Date(issue.updatedAt).toLocaleDateString()}</p>
            </div>
        </div>
    `;
    cardInfo.appendChild(div);
  });
}

loadIssues();

let currentStatus = "all-filter-btn";
let currentSearchIndex = 0;

const allCard = document.getElementById("all-card-container");
const searchInput = document.getElementById("search-input");
const nextIssueBtn = document.getElementById("next-issue-btn");

const query = searchInput.value.trim().toLowerCase();

async function searchIssues(query) {
  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`);
  const data = await res.json();

  searchResults = data.data;
  currentSearchIndex = 0;
}

nextIssueBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();

  if (!query) {
    alert("Type something first");
    return;
  }

  if (query !== lastQuery) {
    await searchIssues(query);
    lastQuery = query;
  }

  if (searchResults.length === 0) {
    await searchIssues(query);
  }

  const issue = searchResults[currentSearchIndex];

  displayIssues([issue]);

  currentSearchIndex++;

  if (currentSearchIndex >= searchResults.length) {
    currentSearchIndex = 0;
  }
});

// let totalIssueCount = document.getElementById("total-issues");
// totalIssueCount.innerText = allCard.length;

const allBtn = document.getElementById("all-filter-btn");
const openBtn = document.getElementById("open-filter-btn");
const closeBtn = document.getElementById("close-filter-btn");

function toggleStyle(id) {
  allBtn.classList.remove("bg-[#4A00FF]", "text-white");
  openBtn.classList.remove("bg-[#4A00FF]", "text-white");
  closeBtn.classList.remove("bg-[#4A00FF]", "text-white");

  allBtn.classList.add("text-[#64748B]");
  openBtn.classList.add("text-[#64748B]");
  closeBtn.classList.add("text-[#64748B]");

  const selected = document.getElementById(id);
  selected.classList.remove("text-[#64748B]");
  selected.classList.add("bg-[#4A00FF]", "text-white");

  currentStatus = id;

  let filteredIssues = [];

  if (id === "open-filter-btn") {
    filteredIssues = allIssues.filter((issue) => issue.status === "open");
  } else if (id === "close-filter-btn") {
    filteredIssues = allIssues.filter((issue) => issue.status === "closed");
  } else {
    filteredIssues = allIssues;
  }

  displayIssues(filteredIssues);
}

const boxContainer = document.getElementById("box-container");

cardInfo.addEventListener("click", async (event) => {
  const card = event.target.closest("[data-id]");

  if (!card) return;

  const issueId = card.dataset.id;

  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`);

  const data = await res.json();
  const issue = data.data;

  // const priorityColor = issue.status === "open" ? "border-t-green-500" : "border-t-purple-500";

  const priorityBadge = issue.priority === "high" ? "bg-red-100 text-red-500" : issue.priority === "medium" ? "bg-yellow-100 text-yellow-600" : "bg-gray-200 text-gray-600";

  // const statusIcon = issue.status === "open" ? `<i class="fa-regular fa-circle-check text-green-500"></i>` : `<i class="fa-solid fa-circle-check text-purple-500"></i>`;

  const labels = issue.labels
    .map((label) => {
      if (label === "bug") return `<span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-500">BUG</span>`;
      if (label === "help wanted") return `<span class="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-500">HELP WANTED</span>`;
      if (label === "enhancement") return `<span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">ENHANCEMENT</span>`;
      if (label === "documentation") return `<span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">DOCUMENTATION</span>`;
      if (label === "good first issue") return `<span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">GOOD FIRST ISSUE</span>`;
    })
    .join("");

  boxContainer.innerHTML = `
      <div class="pt-2">

        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          ${issue.title}
        </h2>

        <div class="flex items-center gap-3 text-sm text-gray-500 mb-4">
          <span class="px-3 py-1 rounded-full font-semibold 
            ${issue.status === "open" ? "bg-green-500 text-white" : "bg-purple-500 text-white"}">
              ${issue.status === "open" ? "Opened" : "Closed"}
          </span>
          <span>Opened by ${issue.author}</span>
          <span>•</span>
          <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          ${labels}
        </div>

        <p class="text-gray-600 mb-6 leading-relaxed">
          ${issue.description}
        </p>

        <div class="bg-gray-100 rounded-xl p-5 flex justify-between items-center mb-6">

          <div>
            <p class="text-sm text-gray-500 mb-1">Assignee:</p>
            <p class="font-semibold text-gray-800">${issue.assignee}</p>
          </div>

          <div class="text-right">
            <p class="text-sm text-gray-500 mb-1">Priority:</p>
            <span class="px-4 py-1 rounded-full text-sm font-semibold ${priorityBadge}">
              ${issue.priority.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
`;

  my_modal_1.showModal();
});
