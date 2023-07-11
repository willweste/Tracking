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
fetchUserData();

function fetchUserData() {
    const token = getToken();

    fetch("http://localhost:5000/api/users/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`, // Include the authentication token in the headers
        },
        credentials: "include", // Include cookies in the request
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                console.log("Access token expired"); // Log when the access token has expired
                // Access token expired, attempt token refreshing
                return refreshAccessToken().then((newAccessToken) => {
                    console.log("New access token generated:", newAccessToken); // Log the new access token
                    // Retry the fetch request with the new access token
                    return fetch("http://localhost:5000/api/users/me", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${newAccessToken}`,
                        },
                        credentials: "include", // Include cookies in the request
                    });
                });
            } else {
                throw new Error("Error retrieving user data");
            }
        })
        .then((data) => {
            const { username } = data;
            console.log("Logged-in username:", username);
            const usernameElement = document.getElementById("username");
            usernameElement.textContent = `Username: ${username}`;
        })
        .catch((error) => {
            console.log("Error retrieving user data:", error);
            // Handle the error, e.g., redirect the user to the login page
            window.location.href = "login.html";
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

