// User registration form submission
const signupForm = document.getElementById("signupForm");

const submitButton = signupForm.querySelector('button[type="submit"]');

signupForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent form submission

  // Disable the submit button to prevent multiple submissions
  submitButton.disabled = true;

  // Get form data
  const formData = new FormData(signupForm);
  const user = Object.fromEntries(formData);

  // Make a POST request to the server
  try {
    const response = await fetch("http://localhost:5000/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("User created with ID:", data.userId);
    } else {
      throw new Error("Error creating User: " + response.status);
    }
  } catch (error) {
    console.log(error);
  } finally {
    submitButton.disabled = false;

    // Clear form inputs
    signupForm.reset();
  }
});
