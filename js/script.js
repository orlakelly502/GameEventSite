document.addEventListener("DOMContentLoaded", function () {
  let isSignedIn = localStorage.getItem("signedIn") === "true";
  updateVisuals(isSignedIn);
});

let eventQueue = [];
let currentEventIndex = 0;

$.getJSON("data/events.json", function (data) {
  eventQueue = data;
  updateEventDetails();
  // Run immediately so there's no blank flash on page load, then update every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
});

function loadNextEvent() {
  currentEventIndex++;

  // If we run out of events display a generic message
  if (currentEventIndex >= eventQueue.length) {
    $("#eventsPreview .events-preview-text").fadeOut(500, function () {
      $(this)
        .html("<h2>More Events Coming Soon!</h2><p>Check back later.</p>")
        .fadeIn();
    });
    return;
  }
}

function updateEventDetails() {
  const nextEvent = eventQueue[currentEventIndex];

  // Fade out text area
  $("#eventsPreview .events-preview-text").animate(
    { opacity: 0, marginLeft: "-20px" },
    500,
    function () {
      // Swap the content
      $(this).find(".events-preview-label").text(nextEvent.label);
      $(this).find("h2").text(nextEvent.name);
      $(this)
        .find(".events-meta")
        .html(
          `# ${nextEvent.date.split(" ").slice(0, 3).join(" ")} &nbsp;·&nbsp; # ${nextEvent.location}`,
        );
      $(this).find("p").last().text(nextEvent.description);

      // Fade back in
      $(this).animate({ opacity: 1, marginLeft: "0px" }, 500);
    },
  );
}

function updateCountdown() {
  const nextEvent = eventQueue[currentEventIndex]; // Get current target
  const targetDate = new Date(nextEvent.date);
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    loadNextEvent();
    return; // Stop this tick so the new date can take over on the next tick
  }

  // Calculate each unit from the total milliseconds remaining
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  document.querySelectorAll(".countdown-number")[0].textContent = pad(days);
  document.querySelectorAll(".countdown-number")[1].textContent = pad(hours);
  document.querySelectorAll(".countdown-number")[2].textContent = pad(minutes);
  document.querySelectorAll(".countdown-number")[3].textContent = pad(seconds);
}

// handles changes to both button text and greeting message depending on sign in status
function updateVisuals(isSignedIn) {
  let btn = document.getElementById("accButton");
  let heroName = document.getElementById("heroName");

  if (isSignedIn) {
    let username = localStorage.getItem("playerName");
    btn.innerHTML = "Sign Out";

    heroName.innerHTML = username;
    heroName.style.color = "#38bdf8";
    heroName.style.textShadow = "0 0 10px rgba(56, 189, 248, 0.6)";

    heroName.classList.remove("fade-in");
    setTimeout(function () {
      heroName.classList.add("fade-in");
    }, 10);
  } else {
    btn.innerHTML = "Sign In";

    heroName.innerHTML = "Newcomer";
    heroName.style.color = "";
    heroName.style.textShadow = "";
  }
}

function toggleAccount() {
  let isSignedIn = localStorage.getItem("signedIn") === "true";

  if (isSignedIn) {
    localStorage.removeItem("playerName");
    localStorage.removeItem("signedIn");
    updateVisuals(false);
  } else {
    $("#accMenu").stop().slideToggle(300);
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
    localStorage.setItem("playerName", username);
    localStorage.setItem("signedIn", "true");
    document.getElementById("accMenu").classList.remove("open");
    $("#accMenu").slideUp(300);
    updateVisuals(true);
  }

  // Always return false to prevent page reload
  return false;
}

// countup effect for the stat bubbles
const communityStats = [
  { target: 2500, suffix: "k" },
  { target: 150, suffix: "+" },
  { target: 12, suffix: "k" },
];

function startCounting() {
  //Target all the stat spans
  const $statSpans = $(".aboutStat");

  // Loop through the spans
  $statSpans.each(function (i) {
    const $this = $(this);
    const data = communityStats[i]; // Get the data matching for current span

    $({ countNum: 0 }).animate(
      { countNum: data.target },
      {
        duration: 5000,
        easing: "swing",
        step: function () {
          $this.text(Math.floor(this.countNum).toLocaleString());
        },
        complete: function () {
          // Final formatting
          if (data.target === 2500) {
            $this.text("2.5k");
          } else {
            $this.text(data.target.toLocaleString() + data.suffix);
          }

          // Added glow when finished for a wee final flourish
          $this
            .closest(".stat-bubble")
            .css("box-shadow", "0 0 30px var(--accent)");
        },
      },
    );
  });
}

const statsSection = document.querySelector("#aboutStats");

// making sure it only runs when in view - or else no one sees the cool countup!
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      startCounting();
      observer.unobserve(statsSection); // Stop watching once it runs
    }
  },
  { threshold: 0.6 },
); // Runs when 60% of the section is visible

observer.observe(statsSection);

// Jquery  - adding a on hover glow to the session cards

$(".session-card").hover(
  function () {
    $(this).css("box-shadow", "0 0 20px rgba(56, 189, 248, 0.8)");
  },
  function () {
    $(this).css("box-shadow", "none");
  },
);

// -------------------Online Play page scripts------------------

// script for game filter search
function searchGame() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("searchMenu");
  filter = input.value.toUpperCase();
  ul = document.getElementById("menuList");
  li = ul.getElementsByTagName("li");

  // loop for going through all list items and hiding those who dont match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

//script for filtering the list of online play sessions
filterSelection("all");
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "all") c = "";
  //add the show class to the filtered cards and remove the show class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    filterRemoveClass(x[i], "filterShow");
    if (x[i].className.indexOf(c) > -1) filterAddClass(x[i], "filterShow");
  }
}

//show filtered elements
function filterAddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

//hide cards that are not selected
function filterRemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

//add active class to current filter button (highlight it)
var btnContainer = document.getElementById("btnContainer");
var btns = btnContainer.getElementsByClassName("btnFilter");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

// -------------------Events page scripts------------------

// RSVP Form validation script - using Bootstrap's validation styles and custom pattern for email input
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("rsvpForm");

  form.addEventListener(
    "submit",
    function (event) {
      // Check if the form passes all HTML5 validation rules (including our pattern)
      if (!form.checkValidity()) {
        event.preventDefault(); // Stop the form from submitting
        event.stopPropagation(); // Stop the event from bubbling up
      } else {
        // If it IS valid, you would normally let it submit or handle your AJAX call here
        // event.preventDefault(); // Uncomment this if you are using fetch/AJAX to send the data
        // alert("RSVP Confirmed!");
      }

      // Add Bootstrap's 'was-validated' class to the form.
      // This triggers the red/green borders and shows the invalid-feedback divs.
      form.classList.add("was-validated");
    },
    false,
  );
});
