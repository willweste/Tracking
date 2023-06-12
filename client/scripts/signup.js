// Password match validation
var password = document.getElementById("password");
var confirmPassword = document.getElementById("confirm-password");

function validatePassword() {
  if (password.value !== confirmPassword.value) {
    confirmPassword.setCustomValidity("Passwords do not match");
  } else {
    confirmPassword.setCustomValidity("");
  }
}

password.onchange = validatePassword;
confirmPassword.onkeyup = validatePassword;
