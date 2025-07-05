// ====== Carousel Background Logic ======
const carouselImages = document.querySelectorAll(".carousel-img");
let currentSlide = 0;

function showSlide(index) {
  carouselImages.forEach((img, i) => {
    img.classList.remove("active");
    if (i === index) img.classList.add("active");
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % carouselImages.length;
  showSlide(currentSlide);
}

setInterval(nextSlide, 4000); // Change image every 4 seconds
showSlide(currentSlide);

// ====== Navbar Hamburger ======
const hamburger = document.getElementById('hamburger');
const popupMenu = document.getElementById('popupMenu');

hamburger.addEventListener('click', () => {
  popupMenu.style.display = popupMenu.style.display === 'flex' ? 'none' : 'flex';
});

document.querySelectorAll('.popup-menu a').forEach(link => {
  link.addEventListener('click', () => {
    popupMenu.style.display = 'none';
  });
});

// ====== AOS Animation Init ======
AOS.init({
  duration: 1000,
  easing: 'ease-in-out',
  once: true,
});

// ====== Open Jotform Chat Widget ======
function openJotBot() {
  if (window.JFChatWidget) {
    JFChatWidget.open();
  } else {
    console.warn("Jotform chat not loaded yet.");
  }
}

// ====== Lazy Reveal for Image of the Day (Optional Section) ======
const imageDaySection = document.querySelector(".image-day-section");
if (imageDaySection) {
  imageDaySection.style.opacity = 0;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        imageDaySection.style.transition = "opacity 1.2s ease-out";
        imageDaySection.style.opacity = 1;
        observer.unobserve(imageDaySection);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(imageDaySection);
}

// ====== Broken Image Fallback ======
window.addEventListener('error', function (e) {
  if (e.target.tagName === 'IMG') {
    e.target.style.display = 'none';
  }
}, true);

// ====== AstroBot Chat Logic ======
function handleOption(questionText) {
  appendMessage("You", questionText);
  respondToUser(questionText.toLowerCase());
}

function handleUserInput() {
  const inputField = document.getElementById("user-input");
  const userText = inputField.value.trim();
  if (!userText) return;

  appendMessage("You", userText);
  respondToUser(userText.toLowerCase());
  inputField.value = "";
}

function appendMessage(sender, text) {
  const msgBox = document.getElementById("chat-messages");
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  msgBox.appendChild(msg);
  msgBox.scrollTop = msgBox.scrollHeight;
}

function respondToUser(input) {
  let response = "Hmm, I don’t have that answer yet. Try another question.";

  if (input.includes("astroatlas")) {
    response = "AstroAtlas is a cosmic discovery portal where you can explore astronomy events, news, and missions.";
  } else if (input.includes("contribute")) {
    response = "You can contribute by sharing the site, donating, or joining our community programs.";
  } else if (input.includes("created")) {
    response = "AstroAtlas was built by a passionate team of space enthusiasts during a hackathon!";
  } else if (input.includes("mission")) {
    response = "Our mission is to spark curiosity about the cosmos through science, stories, and interactive features.";
  } else if (input.includes("contact")) {
    response = "You can reach out via the contact form or social media links in the footer.";
  }

  setTimeout(() => {
    appendMessage("AstroBot", response);
  }, 500);
}

// ====== Calendar Event Fetching ======
async function fetchSpaceEvents() {
  const container = document.getElementById("events-container");
  const inputDate = document.getElementById("event-date").value;
  container.innerHTML = "Loading events...";

  if (!inputDate) {
    container.innerHTML = "<p style='color: orange;'>Please select a date.</p>";
    return;
  }

  const [year, month, day] = inputDate.split("-");
  const apiUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Accept": "application/json"
      }
    });

    const data = await response.json();

    const events = [...(data.events || []), ...(data.births || []), ...(data.deaths || [])].filter(event =>
      /(space|nasa|astronom|galaxy|planet|apollo|cosmo|satellite|universe|rocket)/i.test(event.text)
    );

    if (events.length === 0) {
      container.innerHTML = "<p style='color: orange;'>No space-related events found on this date. Try another date!</p>";
      return;
    }

    container.innerHTML = "";

    events.slice(0, 10).forEach(event => {
      const page = event.pages?.[0];
      const img = page?.thumbnail?.source || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Space_Shuttle_Columbia_launching.jpg/640px-Space_Shuttle_Columbia_launching.jpg";
      const title = event.text;
      const year = event.year;

      const card = document.createElement("div");
      card.className = "event-card";

      card.innerHTML = `
        <img src="${img}" alt="Event Image">
        <h3>${year}</h3>
        <p>${title}</p>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    container.innerHTML = "<p style='color: red;'>Failed to load events. Try again later.</p>";
  }
}
