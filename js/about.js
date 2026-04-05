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
};

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

