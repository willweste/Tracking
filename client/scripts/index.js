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

// Function to get the refresh token from cookiess
function getRefreshToken() {
    const refreshToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refreshToken="))
        ?.split("=")[1];
    console.log("Refresh Token:", refreshToken);
    return refreshToken;
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
        fetchAndDisplayBugs();
    } else {
        // User is not authenticated, hide the logout button and username
        logoutButton.style.display = "none";
        usernameElement.style.display = "none";
        signupButton.style.display = "block";
        loginButton.style.display = "block";
        window.location.href = "signup.html";
    }
});

let loggedInUsername = '';
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
            const reportedByInput = document.getElementById("reportedByInput");
            reportedByInput.value = username;
            loggedInUsername = username;
            // Update the username element in the HTML
            usernameElement.textContent = `Username: ${username}`;
        })
        .catch((error) => {
            console.log("Error retrieving user data:", error);
            // Handle the error, e.g., redirect the user to the login page
            window.location.href = "login.html";
        });
}


function refreshAccessToken() {
    const refreshToken = getRefreshToken();

    return fetch("http://localhost:5000/api/users/refresh-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
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

// Create bug functionality
bugForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Disable the submit button to prevent multiple submissions
    submitButton.disabled = true;

    const titleInput = document.getElementById("titleInput");
    const descriptionInput = document.getElementById("descriptionInput");
    const statusInput = document.getElementById("statusInput");
    const severityInput = document.getElementById("severityInput");
    const assignedToInput = document.getElementById("assignedToInput");
    const reportedByInput = document.getElementById("reportedByInput");
    const token = getToken();

    // Create JavaScript object using input values
    const bug = {
        title: titleInput.value,
        description: descriptionInput.value,
        status: statusInput.value,
        severity: severityInput.value,
        assignedTo: assignedToInput.value,
        reportedBy: reportedByInput.value,
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

            fetchAndDisplayBugs();

            // Display the new bug in the table
            displayBug(data.bugId, bug.title, bug.description, bug.status, bug.severity, bug.assignedTo, bug.reportedBy);
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
    statusInput.value = "Open";
    severityInput.value = "Low";
    assignedToInput.value = "";
    reportedByInput.value = loggedInUsername;
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
        if (Array.isArray(data)) {
            // Loop through the bugs data and generate table rows
            data.forEach((bug) => {
                displayBug(bug.id, bug.title, bug.description, bug.Status, bug.Severity, bug.AssignedTo, bug.ReportedBy, bug.CreatedAt, bug.UpdatedAt);
            });
        } else {
            console.log("Invalid bugs data:", data);
        }
    })
    .catch((error) => {
        console.log("Error retrieving bugs:", error);
    });



function displayBug(id, title, description, status, severity, assignedTo, reportedBy, createdAt, updatedAt) {
    // Create Date objects from the timestamps
    const createdAtDate = new Date(createdAt);
    const updatedAtDate = new Date(updatedAt);

    // Convert the Date objects to the EST time zone
    const createdAtEST = createdAtDate.toLocaleString("en-US", { timeZone: "America/New_York" });
    const updatedAtEST = updatedAtDate.toLocaleString("en-US", { timeZone: "America/New_York" });

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
    <td>${title}</td>
    <td>${description}</td>
    <td>${status}</td>
    <td>${severity}</td>
    <td>${assignedTo}</td>
    <td>${reportedBy}</td>
    <td>${createdAtEST}</td>
    <td>${updatedAtEST}</td>
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
            fetchAndDisplayBugs();
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
// Add a global variable to keep track of the current page and total pages
let currentPage = 1;
let totalPages = 1;

function fetchAndDisplayBugs(page = currentPage) {
    const token = getToken();
    const url = `http://localhost:5000/api/bugs?page=${page}`;

    fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`, // Include the authentication token in the headers
        },
        credentials: "include", // Include cookies in the request
    })
        .then((response) => response.json())
        .then((data) => {
            // Update the current page number
            currentPage = page;

            // Extract the bug data from the response
            const bugs = data.data;

            // Loop through the bugs data and generate table rows
            // But before that, clear the existing table data
            tableBody.innerHTML = "";
            bugs.forEach((bug) => {
                displayBug(
                    bug.id,
                    bug.title,
                    bug.description,
                    bug.Status,
                    bug.Severity,
                    bug.AssignedTo,
                    bug.ReportedBy,
                    bug.CreatedAt,
                    bug.UpdatedAt
                );
            });

            // Update the total pages
            const totalCount = data.totalCount;
            const pageSize = data.pageSize;
            totalPages = Math.ceil(totalCount / pageSize);

            // Generate the pagination links based on the total number of pages
            generatePaginationLinks(totalPages);
        })
        .catch((error) => {
            console.log("Error retrieving bugs:", error);
        });
}

function generatePaginationLinks(totalPages) {
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = ""; // Clear existing pagination links

    const previousLink = createPageLink("Previous", currentPage - 1);
    paginationContainer.appendChild(previousLink);

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);

    for (let page = startPage; page <= endPage; page++) {
        const pageLink = createPageLink(page, page);
        paginationContainer.appendChild(pageLink);
    }

    const nextLink = createPageLink("Next", currentPage + 1);
    paginationContainer.appendChild(nextLink);
}

function createPageLink(label, page) {
    const pageLink = document.createElement("li");
    pageLink.classList.add("page-item");
    const linkClass = page === currentPage ? "page-link active" : "page-link";
    pageLink.innerHTML = `<a class="${linkClass}" href="#">${label}</a>`;
    pageLink.addEventListener("click", () => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            fetchAndDisplayBugs(page);
        }
    });
    return pageLink;
}



