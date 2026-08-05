// INITIAL DEFAULT TASK DATABASE
const defaultTasks = [
  {
    id: 1,
    title: "Implement OAuth2 Social Auth",
    desc: "Configure Google & GitHub OAuth login workflows with JWT tokens.",
    category: "Backend",
    priority: "High",
    assignee: "Daniel G.",
    status: "progress"
  },
  {
    id: 2,
    title: "Design Dark Mode UI Kit",
    desc: "Create reusable glassmorphism card components in CSS.",
    category: "Design",
    priority: "Medium",
    assignee: "Sarah K.",
    status: "todo"
  },
  {
    id: 3,
    title: "Setup MongoDB Schema",
    desc: "Define user, project, and task relational data models.",
    category: "Backend",
    priority: "High",
    assignee: "Daniel G.",
    status: "review"
  },
  {
    id: 4,
    title: "Unit Test API Endpoints",
    desc: "Achieve 85%+ test coverage across task controller routes.",
    category: "QA",
    priority: "Low",
    assignee: "Alex M.",
    status: "done"
  }
];

// STATE MANAGEMENT
let tasks = JSON.parse(localStorage.getItem("smartTasks")) || defaultTasks;

// RENDER BOARD & UPDATE METRICS
function renderBoard(filterList = tasks) {
  const colTodo = document.getElementById("colTodo");
  const colProgress = document.getElementById("colProgress");
  const colReview = document.getElementById("colReview");
  const colDone = document.getElementById("colDone");

  colTodo.innerHTML = "";
  colProgress.innerHTML = "";
  colReview.innerHTML = "";
  colDone.innerHTML = "";

  let counts = { todo: 0, progress: 0, review: 0, done: 0 };

  filterList.forEach(task => {
    counts[task.status]++;
    const card = createTaskCard(task);

    if (task.status === "todo") colTodo.appendChild(card);
    else if (task.status === "progress") colProgress.appendChild(card);
    else if (task.status === "review") colReview.appendChild(card);
    else if (task.status === "done") colDone.appendChild(card);
  });

  // Update Badges
  document.getElementById("countTodo").innerText = counts.todo;
  document.getElementById("countProgress").innerText = counts.progress;
  document.getElementById("countReview").innerText = counts.review;
  document.getElementById("countDone").innerText = counts.done;

  updateDashboardMetrics(counts);
}

// CREATE TASK CARD HTML
function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.innerHTML = `
    <div class="task-card-header">
      <span class="tag-cat">${task.category}</span>
      <span class="tag-prio prio-${task.priority}">${task.priority}</span>
    </div>
    <h4>${task.title}</h4>
    <p>${task.desc}</p>
    <div class="task-footer">
      <span class="assignee"><i class="far fa-user"></i> ${task.assignee}</span>
      <div class="task-actions">
        <button title="Advance Status" onclick="moveTaskNext(${task.id})"><i class="fas fa-arrow-right"></i></button>
        <button class="btn-delete" title="Delete Task" onclick="deleteTask(${task.id})"><i class="far fa-trash-alt"></i></button>
      </div>
    </div>
  `;
  return card;
}

// ADVANCE WORKFLOW STATUS
function moveTaskNext(id) {
  const statusFlow = ["todo", "progress", "review", "done"];
  tasks = tasks.map(t => {
    if (t.id === id) {
      const currentIndex = statusFlow.indexOf(t.status);
      const nextIndex = (currentIndex + 1) % statusFlow.length;
      t.status = statusFlow[nextIndex];
    }
    return t;
  });
  saveAndRender();
}

// DELETE TASK
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
}

// UPDATE ANALYTICS & PROGRESS FILL
function updateDashboardMetrics(counts) {
  const total = tasks.length;
  const completed = counts.done;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  document.getElementById("statTotal").innerText = total;
  document.getElementById("statProgress").innerText = counts.progress;
  document.getElementById("statCompleted").innerText = completed;
  document.getElementById("statCompletionRate").innerText = `${rate}%`;

  document.getElementById("progressText").innerText = `${rate}% Complete`;
  document.getElementById("progressFill").style.width = `${rate}%`;
}

// SEARCH & FILTER
function filterTasks() {
  const searchVal = document.getElementById("searchInput").value.toLowerCase();
  const prioVal = document.getElementById("priorityFilter").value;
  const catVal = document.getElementById("categoryFilter").value;

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchVal) ||
                        t.desc.toLowerCase().includes(searchVal) ||
                        t.assignee.toLowerCase().includes(searchVal);
    const matchPrio = prioVal === "all" || t.priority === prioVal;
    const matchCat = catVal === "all" || t.category === catVal;

    return matchSearch && matchPrio && matchCat;
  });

  renderBoard(filtered);
}

// MODAL HANDLERS
function openTaskModal() {
  document.getElementById("taskModal").style.display = "flex";
}

function closeTaskModal() {
  document.getElementById("taskModal").style.display = "none";
}

function handleTaskSubmit(e) {
  e.preventDefault();
  const newTask = {
    id: Date.now(),
    title: document.getElementById("taskTitle").value,
    desc: document.getElementById("taskDesc").value,
    category: document.getElementById("taskCategory").value,
    priority: document.getElementById("taskPriority").value,
    assignee: document.getElementById("taskAssignee").value,
    status: document.getElementById("taskStatus").value
  };

  tasks.push(newTask);
  saveAndRender();
  closeTaskModal();
  document.getElementById("taskForm").reset();
}

// PERSISTENCE
function saveAndRender() {
  localStorage.setItem("smartTasks", JSON.stringify(tasks));
  renderBoard();
}

// INITIALIZE
renderBoard();
