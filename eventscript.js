// === Carousel Functionality ===
let currentIndex = 0;
const carouselImages = document.querySelectorAll(".carousel-img");

function showNextImage() {
  carouselImages.forEach((img, idx) => {
    img.classList.remove("active");
  });
  currentIndex = (currentIndex + 1) % carouselImages.length;
  carouselImages[currentIndex].classList.add("active");
}

setInterval(showNextImage, 4000); // change every 4 seconds

// === AOS Animation Initialization ===
AOS.init();

// === NASA APOD Calendar Events ===
const apiKey = "QKwRcRX6MbYf6QiHacW2bWk6nbLzwfrDJ6C4B2bJ"; // Replace with your NASA API key for production
const calendarInput = document.getElementById("event-calendar");
const resultsDiv = document.getElementById("calendar-results");

calendarInput.addEventListener("change", async (e) => {
  const selectedDate = e.target.value;
  if (!selectedDate) return;

  let date = selectedDate;
  let found = false;
  let tries = 0;
  let maxTries = 30;

  while (!found && tries < maxTries) {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`);
    const data = await response.json();

    if (data && data.media_type === "image") {
      displayEvent(data);
      found = true;
    } else {
      // Subtract a day and try again
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 1);
      date = newDate.toISOString().split("T")[0];
      tries++;
    }
  }

  if (!found) {
    resultsDiv.innerHTML = `<p style="color: red;">No events found for selected date or nearby dates.</p>`;
  }
});

function displayEvent(data) {
  resultsDiv.innerHTML = `
    <div class="calendar-card">
      <h3>${data.title}</h3>
      <p><strong>Date:</strong> ${data.date}</p>
      <p>${data.explanation}</p>
      ${data.url ? `<img src="${data.url}" alt="${data.title}" />` : ""}
    </div>
  `;
}
