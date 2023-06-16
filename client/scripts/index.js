const bugForm = document.getElementById("bugForm");
const submitButton = bugForm.querySelector('button[type="submit"]');

// Add a check for authentication on page load
window.addEventListener("load", () => {
  const token = localStorage.getItem("token");

  if (token) {
    // User is authenticated, show the logout button
    document.getElementById("logoutButton").style.display = "block";
  } else {
    // User is not authenticated, hide the logout button and redirect to the login page
    document.getElementById("logoutButton").style.display = "none";
    window.location.href = "login.html";
  }
});


// Add logout functionality
const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", () => {
    // Clear the stored token
    const token = localStorage.getItem("token");
    localStorage.removeItem("token");
    console.log("JWT Token deleted:", token); // Log the JWT token

    // Redirect to the signup page
    window.location.href = "signup.html";
});


// ... rest of the code ...

bugForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Disable the submit button to prevent multiple submissions
  submitButton.disabled = true;

  const titleInput = document.getElementById("titleInput");
  const descriptionInput = document.getElementById("descriptionInput");

  // Create JavaScript object using input values
  const bug = {
    title: titleInput.value,
    description: descriptionInput.value,
  };

  const token = localStorage.getItem("token");

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
          console.log("User ID:", getUserIdFromToken(token)); // Log the user ID (assuming you have a function to extract the user ID from the token)
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
fetch("http://localhost:5000/api/bugs")
    .then((response) => response.json())
    .then((data) => {
        console.log("JWT Token:", req.headers.authorization); // Log the JWT token
        console.log("User ID:", req.user.id); // Log the user ID

        // Loop through the bugs data and generate table rows
      data.forEach((bug) => {
        displayBug(bug.id, bug.title, bug.description);
      });
    })
    .catch((error) => {
      console.log("Error retrieving bugs:", error);
    });

const tableBody = document.querySelector("#bugTable tbody");

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
  fetch(`http://localhost:5000/api/bugs/${bugId}`, {
    method: "DELETE",
  })
      .then((response) => response.json())
      .then((data) => {
        console.log("Bug deleted with ID:", data.bugId);

        // Remove the corresponding row from the table
        const rowToDelete = document.querySelector(
            `#bugTable tr[data-bug-id="${data.bugId}"]`
        );
        if (rowToDelete) {
          rowToDelete.remove();
        }
      })
      .catch((error) => {
        console.log("Error deleting bug:", error);
      });
}

const getUserIdFromToken = (token) => {
    // Decode the token to get the payload
    const decodedToken = jwt.decode(token);

    // Extract the user ID from the payload
    const userId = decodedToken.userId;

    return userId;
};
