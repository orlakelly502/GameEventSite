// generic onload - ensures name change displays for returning users
window.onload = function () {
  greeting();
};

function toggleAccount() {
  document.getElementById("accMenu").classList.toggle("open");
}

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
    let btn = document.getElementById("accButton");
    localStorage.setItem("playerName", username);
    // Update the button to show their name
    btn.innerHTML = username;
    // Close the dropdown
    document.getElementById("accMenu").classList.remove("open");

    btn.innerHTML = "Sign Out";

    // call greeting function to update the page greeting
    greeting();
  }

  // Always return false to prevent page reload
  return false;
}

function greeting() {
  var username = localStorage.getItem("playerName");
  if (username != null) {
    var heroName = document.getElementById("heroName");
    heroName.innerHTML = username;

    // Add glow colour only when name exists
    heroName.style.color = "#38bdf8";
    heroName.style.textShadow = "0 0 10px rgba(56, 189, 248, 0.6)";

    // Fade in animation
    heroName.classList.remove("fade-in");
    setTimeout(function () {
      heroName.classList.add("fade-in");
    }, 10);
  }
}
// testing function

function clearLocalStorage() {
  localStorage.clear();
}

//clearLocalStorage();
