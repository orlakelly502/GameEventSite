// generic onload - ensures name change displays for returning users
window.onload = function () {
  greeting();
};

function toggleAccount() {
  // check buttons current state
  let buttonStatus = document.getElementById("accButton").innerHTML.trim();
  if (buttonStatus == "Sign In") {
    document.getElementById("accMenu").classList.toggle("open");
  } else {
    localStorage.removeItem("playerName");

    let heroName = document.getElementById("heroName");
    heroName.innerHTML = "Newcomer";
    heroName.style.color = "";
    heroName.style.textShadow = "";

    document.getElementById("accButton").innerHTML = "Sign In";
  }
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

// Clock
const targetDate = new Date("March 30, 2026 18:00:00");

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  // Calculate each unit from the total milliseconds remaining
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Pad single digits with a leading zero e.g. 9 becomes 09
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  document.getElementById("eventCountdown").innerHTML = `
        <span class="countdown-unit"><span class="countdown-number">${pad(days)}</span><span class="countdown-label">Days</span></span>
        <span class="countdown-unit"><span class="countdown-number">${pad(hours)}</span><span class="countdown-label">Hours</span></span>
        <span class="countdown-unit"><span class="countdown-number">${pad(minutes)}</span><span class="countdown-label">Minutes</span></span>
        <span class="countdown-unit"><span class="countdown-number">${pad(seconds)}</span><span class="countdown-label">Seconds</span></span>
    `;
}

// Run immediately so there's no blank flash on page load, then update every second
updateCountdown();
setInterval(updateCountdown, 1000);
