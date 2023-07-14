// Get the project ID from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("projectId");

// DOM elements
const backButton = document.getElementById("backButton");
const projectInfoContainer = document.getElementById("projectInfo");
const taskList = document.getElementById("taskList");

// Event listener for the back button
backButton.addEventListener("click", () => {
    // Redirect to the projects page
    window.location.href = "projects.html";
});

// Fetch project details and tasks on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchProjectDetails(projectId);
    fetchTasks(projectId);
});

// Function to fetch project details
function fetchProjectDetails(projectId) {
    const token = getToken();

    fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
    })
        .then((response) => response.json())
        .then((data) => {
            // Display project details
            displayProjectDetails(data);
        })
        .catch((error) => {
            console.log("Error retrieving project details:", error);
        });
}

// Function to display project details
function displayProjectDetails(project) {
    const { name, description, startDate, endDate, status, createdBy } = project;

    const projectInfo = document.createElement("div");
    projectInfo.innerHTML = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Start Date:</strong> ${startDate}</p>
        <p><strong>End Date:</strong> ${endDate}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Created By:</strong> ${createdBy}</p>
    `;

    projectInfoContainer.appendChild(projectInfo);
}

// Function to fetch tasks for the project
function fetchTasks(projectId) {
    const token = getToken();

    fetch(`http://localhost:5000/api/projects/${projectId}/tasks`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
    })
        .then((response) => response.json())
        .then((data) => {
            // Display tasks
            displayTasks(data.tasks);
        })
        .catch((error) => {
            console.log("Error retrieving tasks:", error);
        });
}

// Function to display tasks
function displayTasks(tasks) {
    taskList.innerHTML = ""; // Clear existing tasks

    tasks.forEach((task) => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const assignedToCell = document.createElement("td");
        const statusCell = document.createElement("td");

        nameCell.textContent = task.name;
        assignedToCell.textContent = task.assignedTo;
        statusCell.textContent = task.status;

        row.appendChild(nameCell);
        row.appendChild(assignedToCell);
        row.appendChild(statusCell);

        taskList.appendChild(row);
    });
}

// Function to get the token from localStorage
function getToken() {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    return token;
}
