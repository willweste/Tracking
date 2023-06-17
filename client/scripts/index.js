const bugForm = document.getElementById("bugForm");
const submitButton = bugForm.querySelector('button[type="submit"]');
const tableBody = document.querySelector("#bugTable tbody");
const logoutButton = document.getElementById("logoutButton");

// Function to get the token from localStorage
function getToken() {
    return localStorage.getItem("token");
}

// Add a check for authentication on page load
window.addEventListener("load", () => {
    const token = getToken();

    if (token) {
        // User is authenticated, show the logout button
        logoutButton.style.display = "block";
    } else {
        // User is not authenticated, hide the logout button and redirect to the login page
        logoutButton.style.display = "none";
        window.location.href = "login.html";
    }
});

// Add logout functionality
logoutButton.addEventListener("click", () => {
    // Clear the stored token
    const token = getToken();
    localStorage.removeItem("token");
    console.log("JWT Token deleted:", token); // Log the JWT token

    // Redirect to the signup page
    window.location.href = "signup.html";
});

bugForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Disable the submit button to prevent multiple submissions
    submitButton.disabled = true;

    const titleInput = document.getElementById("titleInput");
    const descriptionInput = document.getElementById("descriptionInput");
    const token = getToken();

    // Retrieve the user ID from the token payload
    const decodedToken = decodeToken(token);
    const user_id = decodedToken.user_id;

    // Create JavaScript object using input values
    const bug = {
        title: titleInput.value,
        description: descriptionInput.value,
        user_id: user_id,
    };

    fetch("http://localhost:5000/api/bugs/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the authentication token in the headers
        },
        body: JSON.stringify(bug),
    })
        .then((response) => response.json())
        .then((data) => {
            // Assuming the response contains the newly created bug ID
            console.log("Bug created with ID:", data.bugId);

            // Display the new bug in the table
            displayBug(data.bugId, bug.title, bug.description);
            console.log("JWT Token:", token); // Log the JWT token
            console.log("User ID:", user_id); // Log the user ID (assuming you have a function to extract the user ID from the token)
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

function displayBug(id, title, description) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
    <td>${title}</td>
    <td>${description}</td>
  `;
    tableBody.appendChild(newRow);
}

// Function to decode the JWT token and extract the payload
function decodeToken(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );
    return JSON.parse(jsonPayload);
}
