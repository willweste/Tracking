const bugForm = document.getElementById("bugForm");
const submitButton = bugForm.querySelector('button[type="submit"]');

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

  fetch("http://localhost:5000/api/bugs/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bug),
  })
    .then((response) => response.json())
    .then((data) => {
      // Assuming the response contains the newly created bug ID
      console.log("Bug created with ID:", data.bugId);

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
fetch("http://localhost:5000/api/bugs")
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
