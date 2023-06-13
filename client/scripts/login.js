// User login form submission
const loginForm = document.getElementById("loginForm");
const submitButton = loginForm.querySelector('button[type="submit"]');

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent form submission

  // Disable the submit button to prevent multiple submissions
  submitButton.disabled = true;

  // Get form data
  const formData = new FormData(loginForm);
  const user = Object.fromEntries(formData);

  // Make a POST request to the server
  try {
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      // User login successful
      console.log("User logged in successfully");

      // Redirect to a new page or perform other actions
      // Example: Redirect to the dashboard page
      window.location.href = "index.html";
    } else {
      // User login failed
      throw new Error("Error logging in: " + response.status);
    }
  } catch (error) {
    console.log(error);
  } finally {
    submitButton.disabled = false;

    // Clear form inputs
    loginForm.reset();
  }
});
