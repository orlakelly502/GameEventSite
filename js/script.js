function toggleAccount() {
  document.getElementById("accMenu").classList.toggle("open");
}

// stagger the js release
function saveDetails() {
  // Get values
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  // Get error spans
  let usernameErr = document.getElementById("usernameErr");
  let passwordErr = document.getElementById("passwordErr");

  // Assume valid to start
  let valid = true;

  // Validate username
  if (username == "") {
    usernameErr.style.display = "block";
    valid = false;
  } else {
    usernameErr.style.display = "none";
  }

  // Validate password
  if (password.length < 6) {
    passwordErr.style.display = "block";
    valid = false;
  } else {
    passwordErr.style.display = "none";
  }

  // If both valid — save to localStorage
  if (valid) {
    localStorage.setItem("playerName", username);
    // Update the button to show their name
    document.getElementById("accButton").innerHTML = username;
    // Close the dropdown
    document.getElementById("accMenu").classList.remove("open");
  }

  // Always return false to prevent page reload
  return false;
}
