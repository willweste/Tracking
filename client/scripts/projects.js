const projectForm = document.getElementById("projectForm");
const projectNameInput = document.getElementById("projectName");
const projectDescriptionInput = document.getElementById("projectDescription");

// Function to get the token from localStorage
function getToken() {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    return token;
}

// Function to handle the project form submission
function handleProjectFormSubmit(event) {
    event.preventDefault();

    const projectName = projectNameInput.value;
    const projectDescription = projectDescriptionInput.value;

    const token = getToken();

    const projectData = {
        name: projectName,
        description: projectDescription,
    };

    createProject(projectData, token)
}

// Function to create a project
function createProject(projectData, token) {
    fetch("http://localhost:5000/api/projects/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the authentication token in the headers
        },
        body: JSON.stringify(projectData),
        credentials: "include", // Include cookies in the request
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Project created:", data.projectId);
            clearProjectForm();
            fetchAndDisplayProjects();
        })
        .catch((error) => {
            console.log("Error creating project:", error);
        });
}

// Function to clear the project form inputs
function clearProjectForm() {
    projectNameInput.value = "";
    projectDescriptionInput.value = "";
}

// Function to fetch and display projects
function fetchAndDisplayProjects() {
    const token = getToken();

    fetch("http://localhost:5000/api/projects", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`, // Include the authentication token in the headers
        },
        credentials: "include", // Include cookies in the request
    })
        .then((response) => response.json())
        .then((data) => {
            const projectList = document.getElementById("projectList");
            projectList.innerHTML = ""; // Clear existing project list

            data.data.forEach((project) => {
                const row = document.createElement("tr");
                const nameCell = document.createElement("td");
                const descriptionCell = document.createElement("td");

                nameCell.textContent = project.name;
                descriptionCell.textContent = project.description;

                row.appendChild(nameCell);
                row.appendChild(descriptionCell);
                projectList.appendChild(row);
            });
        })
        .catch((error) => {
            console.log("Error retrieving projects:", error);
        });
}

// Add event listener to the project form submit event
projectForm.addEventListener("submit", handleProjectFormSubmit);

// Fetch and display projects on page load
fetchAndDisplayProjects();
