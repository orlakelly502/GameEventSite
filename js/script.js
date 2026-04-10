document.addEventListener("DOMContentLoaded", function () {
  // checking both storage types  on load so sign-in status is peristant across all pages
  let isSignedIn =
    localStorage.getItem("signedIn") === "true" ||
    sessionStorage.getItem("signedIn") === "true";
  // update heroName (if on homepage) & button text (sign in or sign out)
  updateVisuals(isSignedIn);
  checkReveal();
  $(window).on("scroll", checkReveal);
});

// Checks each element with .reveal class position relative to viewport
function checkReveal() {
  $(".reveal").each(function () {
    var elementTop = this.getBoundingClientRect().top;
    var windowHeight = window.innerHeight;
    // Add visible class when element is within 100px of the bottom of the screen
    if (elementTop < windowHeight - 100) {
      $(this).addClass("visible");
    }
  });
}

// Stores event data fetched from JSON
let eventQueue = [];

// Track which event is currently displayed in the event preview section (homepage)
let currentEventIndex = 0;

// if prevents this running on pages without events section - stops null reference errors
if (document.getElementById("eventsPreview")) {
  $.getJSON("data/events.json", function (data) {
    eventQueue = data;
    // calling these functions here to ensure data exists before they try to use it
    updateEventDetails();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    // show a message rather than unexplained blank section
  }).fail(function () {
    $("#eventsPreview .events-preview-text").html(
      "<h2>Events unavailable</h2><p>Please check back later.</p>",
    );
  });
}

// Advance to the next even in queue when countdown expires
function loadNextEvent() {
  currentEventIndex++;

  // If we run out of events display a message rather than breaking
  if (currentEventIndex >= eventQueue.length) {
    $("#eventsPreview .events-preview-text").fadeOut(500, function () {
      $(this)
        .html("<h2>More Events Coming Soon!</h2><p>Check back later.</p>")
        .fadeIn();
    });
    return;
  }
}

// animates the event details swap for events preview (homepage)
function updateEventDetails() {
  const nextEvent = eventQueue[currentEventIndex];

  // Fade out text area
  $("#eventsPreview .events-preview-text").animate(
    { opacity: 0, marginLeft: "-20px" },
    500,
    function () {
      // Swap the content while invisible
      $(this).find(".events-preview-label").text(nextEvent.label);
      $(this).find("h2").text(nextEvent.name);
      $(this)
        .find(".events-meta")
        .html(
          `# ${nextEvent.date.split(" ").slice(0, 3).join(" ")} &nbsp;·&nbsp; # ${nextEvent.location}`,
        );
      $(this).find("p").last().text(nextEvent.description);

      // Fade back in once content swapped
      $(this).animate({ opacity: 1, marginLeft: "0px" }, 500);
    },
  );
}

// Runs every second via setinterval
function updateCountdown() {
  const nextEvent = eventQueue[currentEventIndex];
  const targetDate = new Date(nextEvent.date);
  const now = new Date();
  // calculate remaining time for current event
  const diff = targetDate - now;

  if (diff <= 0) {
    loadNextEvent();
    return; // Return early so next tick will pick up the new event date
  }

  // Calculate each unit from the total milliseconds remaining
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Pad single digits for consistent display 09 not 9
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  document.querySelectorAll(".countdown-number")[0].textContent = pad(days);
  document.querySelectorAll(".countdown-number")[1].textContent = pad(hours);
  document.querySelectorAll(".countdown-number")[2].textContent = pad(minutes);
  document.querySelectorAll(".countdown-number")[3].textContent = pad(seconds);
}

// -- Account Menu -- \\

// handles changes to both button text and greeting message depending on sign in status passed in
function updateVisuals(isSignedIn) {
  let btn = document.getElementById("accButton");
  let heroName = document.getElementById("heroName");

  // make heroName invisable if name isn't null - prevents js running outside of homepage
  if (heroName) {
    heroName.style.opacity = "0";
  }

  // 500ms delay before swapping content for a cleaner swap animation
  setTimeout(function () {
    if (isSignedIn) {
      // checking both storage types to match what was used at login
      let username =
        localStorage.getItem("playerName") ||
        sessionStorage.getItem("playerName");
      btn.innerHTML = "Sign Out";

      if (heroName) {
        heroName.innerHTML = username;
        heroName.style.color = "#38bdf8";
        heroName.style.textShadow = "0 0 10px rgba(56, 189, 248, 0.6)";
        heroName.style.opacity = "1";
      }
    } else {
      btn.innerHTML = "Sign In";

      if (heroName) {
        heroName.innerHTML = "Newcomer";
        heroName.style.color = "";
        heroName.style.textShadow = "";
        heroName.style.opacity = "1";
      }
    }
  }, 500);
}

// Sign-in toggle / sign-out handler
function toggleAccount() {
  let isSignedIn =
    localStorage.getItem("signedIn") === "true" ||
    sessionStorage.getItem("signedIn") === "true";

  // variables for handling aria toggling
  let menu = $("#accMenu");
  let button = document.getElementById("accButton");

  // if signed in clear both storage types, covers either login preference
  if (isSignedIn) {
    localStorage.removeItem("playerName");
    localStorage.removeItem("signedIn");
    sessionStorage.removeItem("playerName");
    sessionStorage.removeItem("signedIn");
    updateVisuals(false);
  } else {
    // if not signed in, open the menu & clear old errors
    $("#accMenu").stop().slideToggle(300);

    // toggle the aria state for screen reader users
    let isOpen = menu.is(":visible");
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");

    clearErrors();
  }
}

// click outside account dropdown to close it
$(document).on("click", function (event) {
  if (!$(event.target).closest("#accMenu, #accButton").length) {
    $("#accMenu").slideUp(300);

    // updating Aria label for screen readers
    document.getElementById("accButton").setAttribute("aria-expanded", "false");

    clearErrors();
    clearLoginInputs();
  }
});

// press esc key to close account drop down
$(document).on("keydown", function (event) {
  if (event.key === "Escape") {
    $("#accMenu").slideUp(300);

    //updating Aria label for screen readers
    document.getElementById("accButton").setAttribute("aria-expanded", "false");
    clearErrors();
    clearLoginInputs();
  }
});

// Validates inputs & stores details on sucessful login
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
  if (username === "") {
    usernameErr.classList.remove("hidden-error");
    valid = false;
  } else {
    usernameErr.classList.add("hidden-error");
  }

  // Validate password
  if (password.length < 6) {
    passwordErr.classList.remove("hidden-error");
    valid = false;
  } else {
    passwordErr.classList.add("hidden-error");
  }

  //If invalid keep focus on element
  if (!valid) {
    if (username === "") {
      document.getElementById("username").focus();
    } else {
      document.getElementById("password").focus();
    }
    return false;
  }

  // If valid & stayLoggedIn checked save to local storage
  if (valid) {
    if (document.getElementById("stayLoggedIn").checked) {
      localStorage.setItem("playerName", username);
      localStorage.setItem("signedIn", "true");
    } else {
      // else use session storage so details clear when tab closes
      sessionStorage.setItem("playerName", username);
      sessionStorage.setItem("signedIn", "true");
    }
    // close menu
    document.getElementById("accMenu").classList.remove("open");
    $("#accMenu").slideUp(300);
    updateVisuals(true);
    clearLoginInputs();
  }

  // Always return false to prevent page reload
  return false;
}

// clear error messages from account dropdown form
function clearErrors() {
  document.getElementById("usernameErr").classList.add("hidden-error");
  document.getElementById("passwordErr").classList.add("hidden-error");
}

// clear user inputs from account dropdown form
function clearLoginInputs() {
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

// -- Community Stats Counter -- \\

// target values each stat bubble
const communityStats = [
  { target: 2500, suffix: "k" },
  { target: 150, suffix: "+" },
  { target: 12, suffix: "k" },
];

// animates the count up for values in stat spans
function animateStatSpan(i) {
  let $currentSpan = $(this);

  // getting matching data for current span
  const data = communityStats[i];

  $({ countNum: 0 }).animate(
    { countNum: data.target }, // animating count up from 0 to target
    {
      duration: 5000,
      easing: "swing",
      step: function () {
        // Math.floor removes the decimals which come from swings floating point arithmetic
        $currentSpan.text(Math.floor(this.countNum));
      },
      complete: function () {
        if (data.target === 2500) {
          $currentSpan.text("2.5k");
        } else {
          $currentSpan.text(data.target + data.suffix);
        }
        $currentSpan
          .closest(".stat-bubble")
          .css("box-shadow", "0 0 25px var(--accent)");
      },
    },
  );
}

function startCounting() {
  const $statSpans = $(".aboutStat");
  // passing each statSpan into the animateStatSpan call
  $statSpans.each(animateStatSpan);
}

const statsSection = document.querySelector("#aboutStats");

// IntersectionObserver ensures startCounting only called when section enters viewport
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      startCounting();
      observer.unobserve(statsSection); // Ensures animation only runs once instead of repeating
    }
  },
  { threshold: 0.6 },
); // Runs when 60% of the section is visible

if (document.querySelector("#aboutStats")) {
  observer.observe(statsSection);
}

// -- Session Cards -- \\

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

// GAME FILTER
//script for filtering the list of online play sessions by game selected
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

// script for platform filter button
// when the platform filter button is clicked it toggles between hiding and showing the dropdown content

function dropdownFunction() {
  document.getElementById("platformDropdown").classList.toggle("show");
}

//script for searching different platforms available by typing in the search bar
function platformListFilter() {
  const input = document.getElementById("platformSearch");
  const filter = input.value.toUpperCase();
  const div = document.getElementById("platformDropdown");
  const a = div.getElementsByTagName("a");
  for (let i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

//add active class to current filter button (highlight it)
var btnContainer = document.getElementById("btnContainer");

if (btnContainer) {
  var btns = btnContainer.getElementsByClassName("btnFilter");

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      var current = btnContainer.getElementsByClassName("active");

      if (current.length > 0) {
        current[0].className = current[0].className.replace(" active", "");
      }

      this.className += " active";
    });
  }
}

// snackbar show function
function onlineSnackBar() {
  var x = document.getElementById("snackBar");
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}

// -------------------Events page scripts------------------

document.addEventListener("DOMContentLoaded", function () {
  const rsvpModal = document.getElementById("rsvpModal");
  const hiddenEventIdInput = document.getElementById("rsvpEventId");

  const form = document.getElementById("rsvpForm");
  const successMessage = document.getElementById("rsvpSuccessMessage");

  const nameInput = document.getElementById("rsvpName");
  const emailInput = document.getElementById("rsvpEmail");

  const nameErr = document.getElementById("rsvpNameErr");
  const emailErr = document.getElementById("rsvpEmailErr");

  const confirmBtn = form.querySelector("button");

  // 🔹 When modal opens
  rsvpModal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;

    if (!button) {
      console.error("❌ Modal opened without a button trigger");
      return;
    }

    const eventId = button.getAttribute("data-event-id");

    if (!eventId) {
      console.error("❌ No data-event-id found on button");
      return;
    }

    console.log("Opening modal for event:", eventId);

    // ✅ Set hidden input
    hiddenEventIdInput.value = eventId;

    // ✅ Reset modal state every time
    form.classList.remove("d-none");
    successMessage.classList.add("d-none");

    nameInput.value = "";
    emailInput.value = "";

    nameErr.classList.add("hidden-error");
    emailErr.classList.add("hidden-error");
  });

  // 🔹 Handle RSVP submit
  confirmBtn.addEventListener("click", function () {
    let name = nameInput.value.trim();
    let email = emailInput.value.trim();
    let eventId = hiddenEventIdInput.value;

    console.log("Submitting RSVP for:", eventId);

    // 🚨 Safety check
    if (!eventId) {
      alert("Error: No event selected.");
      return;
    }

    let valid = true;

    // VALIDATE NAME
    if (name === "") {
      nameErr.classList.remove("hidden-error");
      valid = false;
    } else {
      nameErr.classList.add("hidden-error");
    }

    // VALIDATE EMAIL
    if (email === "" || !email.includes("@")) {
      emailErr.classList.remove("hidden-error");
      valid = false;
    } else {
      emailErr.classList.add("hidden-error");
    }

    if (!valid) return;

    let storageKey = "rsvp_" + eventId;

    let existing = localStorage.getItem(storageKey);

    if (existing) {
      let existingData = JSON.parse(existing);

      // 🔍 Compare emails (case-insensitive)
      if (existingData.email.toLowerCase() === email.toLowerCase()) {
        alert("You have already RSVP’d to this event with this email.");
        return;
      }
    }

    // ✅ Save RSVP
    localStorage.setItem(
      storageKey,
      JSON.stringify({ name: name, email: email, event: eventId }),
    );

    console.log("Saved:", storageKey);

    // ✅ Show success state
    document.getElementById("rsvpMessageName").textContent = name;

    form.classList.add("d-none");
    successMessage.classList.remove("d-none");
  });
});

// SIGN UP FORM VALIDATION, STORAGE & SUCCESS MESSAGE SCRIPT

function saveSignUpDetails() {
  // GET VALUES
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let nameErr = document.getElementById("nameErr");
  let emailErr = document.getElementById("emailErr");
  let valid = true;

  // VALIDATE
  if (name === "") {
    nameErr.classList.remove("hidden-error");
    valid = false;
  } else {
    nameErr.classList.add("hidden-error");
  }

  if (email === "" || !email.includes("@")) {
    emailErr.classList.remove("hidden-error");
    valid = false;
  } else {
    emailErr.classList.add("hidden-error");
  }

  // FOCUS ON FIX IF INVALID
  if (!valid) {
    if (name === "") {
      document.getElementById("name").focus();
    } else {
      document.getElementById("email").focus();
    }
    return false;
  }

  // VALID & SUBMIT
  if (valid) {
    try {
      localStorage.setItem(
        "communityUser",
        JSON.stringify({ name: name, email: email }),
      );

      // THIS MUST MATCH THE ID IN THE SPAN IN THE MODAL
      document.getElementById("signUpMessageName").textContent = name;

      $("#signUpSuccessModal").modal("show");

      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
    } catch (error) {
      // IF ANYTHING GOES WRONG (WHICH IT SHOULDN'T) LOG THE ERROR TO THE CONSOLE
      console.error("Error saving sign-up details:", error);
    }
  }

  return false;
}

// -------------------About Us page scripts------------------
// Load reviews
window.onload = function () {
  showReviews();
};
// Saves reviews
function saveReview(e) {
  e.preventDefault();

  const name = document.getElementById("reviewName").value.trim();
  const game = document.getElementById("reviewGame").value.trim();
  const rating = document.getElementById("reviewRating").value.trim();
  const text = document.getElementById("reviewText").value.trim();

  // Rating validation
  const ratingNum = +rating;
  const oneDecimal = /^([0-4](\.\d)?|5(\.0)?)$/;

  if (!name || !game || !rating || !text) {
    alert("Please fill in all fields.");
    return;
  }

  if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
    alert("Rating must be between 0 and 5.");
    return;
  }

  if (!oneDecimal.test(rating)) {
    alert("Rating can only have one decimal place.");
    return;
  }

  // Builds a String to store
  const reviewString = `${name}||${game}||${rating}||${text}`;

  // Create a unique key
  const key = "review_" + Date.now();

  // Saves review to local storage
  localStorage.setItem(key, reviewString);

  // Resets form
  document.getElementById("reviewForm").reset();
  showReviews();
}

function showReviews() {
  const display = document.getElementById("reviewsDisplay");
  display.innerHTML = `<h2 class="review-section-title">Other Reviews</h2>
`;

  // Loops through localStorage keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.startsWith("review_")) {
      const value = localStorage.getItem(key);

      // Split string back to parts
      const parts = value.split("||");
      const name = parts[0];
      const game = parts[1];
      const rating = parts[2];
      const text = parts[3];

      display.innerHTML += `
        <div class="glow-card review-card">
          <h3 style="color: var(--accent);">${game}</h3>
          <p class="review-user">By ${name} — Rating: ${rating}/5</p>
          <p>${text}</p>
        </div>
        
        <button class="delete-icon" onclick="deleteReview('${key}')"> <img src="images/deleteicon.png"> 
        </button>
    </div>
        `;
    }
  }
}

function deleteReview(key) {
  localStorage.removeItem(key);
  showReviews();
}

// ------------------- FAQ page scripts -------------------

let activeFaqCategory = "all";

// Open and close FAQ answers
$(document).on("click", ".faq-question", function () {
  const $clickedQuestion = $(this);
  const $answer = $clickedQuestion.next(".faq-answer");

  $(".faq-question").not($clickedQuestion).attr("aria-expanded", "false");
  $(".faq-answer").not($answer).stop(true, true).slideUp(250);

  if ($answer.is(":visible")) {
    $clickedQuestion.attr("aria-expanded", "false");
    $clickedQuestion.removeClass("open");
    $answer.stop(true, true).slideUp(250);
  } else {
    $clickedQuestion.attr("aria-expanded", "true");
    $clickedQuestion.addClass("open");
    $answer.stop(true, true).slideDown(250);
  }
});

// Category filter buttons
$(document).on("click", ".faq-filter-btn", function () {
  $(".faq-filter-btn").removeClass("active");
  $(this).addClass("active");

  activeFaqCategory = $(this).data("category");
  filterFaqItems();
});

// Live search
$("#faqSearch").on("input", function () {
  filterFaqItems();
});

function filterFaqItems() {
  const searchTerm = ($("#faqSearch").val() || "").toLowerCase().trim();
  let visibleCount = 0;

  $(".faq-item").each(function () {
    const category = $(this).data("category");
    const itemText = $(this).text().toLowerCase();

    const matchesCategory =
      activeFaqCategory === "all" || category === activeFaqCategory;

    const matchesSearch = itemText.includes(searchTerm);

    if (matchesCategory && matchesSearch) {
      $(this).stop(true, true).fadeIn(200);
      visibleCount++;
    } else {
      $(this).stop(true, true).fadeOut(200);
    }
  });

  if (visibleCount === 0) {
    $("#faqNoResults").removeClass("d-none");
  } else {
    $("#faqNoResults").addClass("d-none");
  }
}

// FAQ form validation + add question to page
$("#faqForm").on("submit", function (e) {
  e.preventDefault();

  const name = $("#faqName").val().trim();
  const category = $("#faqCategory").val();
  const question = $("#faqQuestionInput").val().trim();

  let valid = true;

  $(".faq-error").hide();

  if (name === "") {
    $("#faqNameErr").show();
    valid = false;
  }

  if (category === "") {
    $("#faqCategoryErr").show();
    valid = false;
  }

  if (question === "") {
    $("#faqQuestionErr").show();
    valid = false;
  }

  if (!valid) {
    if (name === "") {
      $("#faqName").trigger("focus");
    } else if (category === "") {
      $("#faqCategory").trigger("focus");
    } else {
      $("#faqQuestionInput").trigger("focus");
    }
    return;
  }

  const newQuestionHtml = `
    <div class="community-question">
      <h4>${escapeHtml(question)}</h4>
      <p><strong>From:</strong> ${escapeHtml(name)}</p>
      <p><strong>Category:</strong> ${escapeHtml(category)}</p>
    </div>
  `;

  if ($("#communityQuestions p").length) {
    $("#communityQuestions").html("");
  }

  $("#communityQuestions").prepend(newQuestionHtml).hide().fadeIn(250);

  // get existing stored questions
  let storedQuestions = JSON.parse(localStorage.getItem("faqQuestions")) || [];

  // create new question object
  const newQuestion = {
    name: name,
    category: category,
    question: question,
  };

  // add to array
  storedQuestions.push(newQuestion);

  // save back to localStorage
  localStorage.setItem("faqQuestions", JSON.stringify(storedQuestions));

  $("#faqFormMessage")
    .text("Thanks! Your question has been added below.")
    .hide()
    .fadeIn(200);

  $("#faqForm")[0].reset();
});

// Small safety helper so user text is added safely
function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

$(document).ready(function () {
  loadStoredQuestions();
});

function loadStoredQuestions() {
  let storedQuestions = JSON.parse(localStorage.getItem("faqQuestions")) || [];

  if (storedQuestions.length === 0) return;

  $("#communityQuestions").html("");

  storedQuestions.forEach((q) => {
    const questionHtml = `
      <div class="community-question">
        <h4>${escapeHtml(q.question)}</h4>
        <p><strong>From:</strong> ${escapeHtml(q.name)}</p>
        <p><strong>Category:</strong> ${escapeHtml(q.category)}</p>
      </div>
    `;

    $("#communityQuestions").append(questionHtml);
  });
}
