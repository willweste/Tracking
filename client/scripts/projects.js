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

// Add event listener to the project form submit event
projectForm.addEventListener("submit", handleProjectFormSubmit);

// Fetch and display projects on page load
fetchAndDisplayProjects();

// Add logout functionality
const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", () => {
    // Clear the stored token and refresh token
    const token = getToken();
    const refreshToken = getRefreshToken();
    localStorage.removeItem("token");
    document.cookie = `refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    console.log("JWT Token deleted:", token); // Log the JWT token
    console.log("Refresh Token deleted:", refreshToken); // Log the refresh token
    // Redirect to the signup page
    window.location.href = "signup.html";
});

// Fetch user data and display the logged-in user
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

                // Add click event listener to each row
                row.addEventListener("click", () => {
                    // Remove the 'selected-project' class from all rows
                    const rows = document.querySelectorAll("#projectList tr");
                    rows.forEach((row) => {
                        row.classList.remove("selected-project");
                    });

                    // Add the 'selected-project' class to the clicked row
                    row.classList.add("selected-project");

                    // Handle row click event, e.g., redirect to project details page
                    // Replace "project-details.html" with the path to your project details page
                    window.location.href = `project-details.html?id=${project.id}`;
                });
            });
        })
        .catch((error) => {
            console.log("Error retrieving projects:", error);
        });
}


// Function to get the refresh token from cookies
function getRefreshToken() {
    const refreshToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refreshToken="))
        ?.split("=")[1];
    console.log("Refresh Token:", refreshToken);
    return refreshToken;
}

