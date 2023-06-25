const bugForm = document.getElementById("bugForm");
const submitButton = bugForm.querySelector('button[type="submit"]');
const tableBody = document.querySelector("#bugTable tbody");
const logoutButton = document.getElementById("logoutButton");
const usernameElement = document.getElementById("username");
const signupButton = document.getElementById("signupButton");
const loginButton = document.getElementById("loginButton");

// Function to get the token from localStorage
function getToken() {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    return token;
}

// Add a check for authentication on page load
window.addEventListener("load", () => {
    const token = getToken();

    if (token) {
        // User is authenticated, show the logout button and username
        logoutButton.style.display = "block";
        usernameElement.style.display = "inline-block";
        signupButton.style.display = "none";
        loginButton.style.display = "none";

        // Fetch user data
        fetchUserData();
    } else {
        // User is not authenticated, hide the logout button and username
        logoutButton.style.display = "none";
        usernameElement.style.display = "none";
        signupButton.style.display = "block";
        loginButton.style.display = "block";
        window.location.href = "signup.html";
    }
});

function fetchUserData() {
    const accessToken = getToken();

    fetch("http://localhost:5000/api/users/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authentication token in the headers
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
                    });
                });
            } else {
                throw new Error("Error retrieving user data");
            }
        })
        .then((data) => {
            const { username } = data;
            console.log("Logged-in username:", username);

            // Update the username element in the HTML
            usernameElement.textContent = `Username: ${username}`;
        })
        .catch((error) => {
            console.log("Error retrieving user data:", error);
        });
}

function refreshAccessToken() {
    return fetch("http://localhost:5001/refresh", {
        method: "POST",
        credentials: "include", // Include cookies in the request
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error refreshing access token");
            }
        })
        .then((data) => {
            const { accessToken } = data;
            console.log("Access token refreshed:", accessToken);

            // Store the access token in the local storage
            localStorage.setItem("token", accessToken);

            return accessToken;
        })
        .catch((error) => {
            console.log("Error refreshing access token:", error);
            // Handle the error, e.g., redirect the user to the login page
            window.location.href = "login.html";
        });
}

// Add logout functionality
logoutButton.addEventListener("click", () => {
    // Clear the stored token
    const token = getToken();
    localStorage.removeItem("token");
    console.log("JWT Token deleted:", token); // Log the JWT token
    // Redirect to the signup page
    window.location.href = "signup.html";
});

// Create bug functionality
bugForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Disable the submit button to prevent multiple submissions
    submitButton.disabled = true;

    const titleInput = document.getElementById("titleInput");
    const descriptionInput = document.getElementById("descriptionInput");
    const token = getToken();

    // Create JavaScript object using input values
    const bug = {
        title: titleInput.value,
        description: descriptionInput.value,
    };

    fetch("http://localhost:5000/api/bugs/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the authentication token in the headers
        },
        body: JSON.stringify(bug),
        credentials: "include", // Include cookies in the request
    })
        .then((response) => response.json())
        .then((data) => {
            // Assuming the response contains the newly created bug ID
            console.log("Bug created with ID:", data.bugId);
            console.log("JWT Token:", token); // Log the JWT token

            // Display the new bug in the table
            displayBug(data.bugId, bug.title, bug.description);
        })
        .catch((error) => {
            console.log("Error creating bug:", error);
        })
        .finally(() => {
            // Re-enable the submit button
            submitButton.disabled = false;
        });

    // Clear form inputs
    titleInput.value = "";
    descriptionInput.value = "";
});

// Fetch bugs data from the backend API
const token = getToken();

fetch("http://localhost:5000/api/bugs", {
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`, // Include the authentication token in the headers
    },
    credentials: "include", // Include cookies in the request
})
    .then((response) => response.json())
    .then((data) => {
        // Loop through the bugs data and generate table rows
        data.forEach((bug) => {
            displayBug(bug.id, bug.title, bug.description);
        });
    })
    .catch((error) => {
        console.log("Error retrieving bugs:", error);
    });

function displayBug(id, title, description) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
    <td>${title}</td>
    <td>${description}</td>
    <td>${id}</td>
    <td><button class="delete-button" data-bug-id="${id}">Delete</button></td>
  `;
    newRow.setAttribute("data-bug-id", id); // Assign a unique identifier
    tableBody.appendChild(newRow);
}

tableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
        const bugId = event.target.dataset.bugId;
        deleteBug(bugId);
    }
});

function deleteBug(bugId) {
    const token = getToken();

    fetch(`http://localhost:5000/api/bugs/${bugId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the authentication token in the headers
        },
        credentials: "include", // Include cookies in the request
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Bug deleted with ID:", data.bugId);
            removeBugFromTable(data.bugId);
        })
        .catch((error) => {
            console.log("Error deleting bug:", error);
        });
}

function removeBugFromTable(bugId) {
    const rowToRemove = tableBody.querySelector(`[data-bug-id="${bugId}"]`);
    if (rowToRemove) {
        rowToRemove.remove();
    }
}
