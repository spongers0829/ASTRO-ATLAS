async function fetchSpaceEvents() {
  const month = document.getElementById('monthSelect').value;
  const day = document.getElementById('daySelect').value;
  const eventResults = document.getElementById('eventResults');

  if (!month || !day) {
    alert("Please select both month and day.");
    return;
  }

  eventResults.innerHTML = "<p>Loading...</p>";

  const apiUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    const allEvents = [...data.events, ...data.births, ...data.deaths];

    const spaceEvents = allEvents.filter(event =>
      /(space|NASA|launch|satellite|astronaut|cosmos|probe|mission|orbiter|rocket|planet|moon|ISRO|ESA)/i.test(event.text)
    );

    const cards = await Promise.all(spaceEvents.map(async event => {
      const imageUrl = await fetchWikiImage(event.pages?.[0]?.normalizedtitle || event.text.split("–")[0]);
      return `
        <div class="event-card">
          ${imageUrl ? `<img src="${imageUrl}" alt="Event image" />` : ''}
          <h3>${event.year}</h3>
          <p>${event.text}</p>
        </div>
      `;
    }));

    eventResults.innerHTML = cards.length ? cards.join('') : "<p>No space-related events found for this date.</p>";

  } catch (error) {
    console.error("Failed to fetch events:", error);
    eventResults.innerHTML = "<p>Error loading events. Try again later.</p>";
  }
}

async function fetchWikiImage(title) {
  if (!title) return null;

  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    prop: "pageimages",
    piprop: "thumbnail",
    pithumbsize: "400",
    titles: title
  });

  try {
    const res = await fetch(url);
    const data = await res.json();
    const page = Object.values(data.query.pages)[0];
    return page.thumbnail?.source || null;
  } catch (e) {
    return null;
  }
}

// Toggle popup menu on hamburger click
document.getElementById("hamburger").addEventListener("click", () => {
  const popupMenu = document.getElementById("popupMenu");
  popupMenu.style.display = popupMenu.style.display === "flex" ? "none" : "flex";
});

// Optional: Close menu if clicked outside
window.addEventListener("click", function (e) {
  const menu = document.getElementById("popupMenu");
  const hamburger = document.getElementById("hamburger");
  if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
    menu.style.display = "none";
  }
});

// Hamburger toggle
const hamburger = document.getElementById("hamburger");
const popupMenu = document.getElementById("popupMenu");

hamburger.addEventListener("click", () => {
  popupMenu.classList.toggle("show");
});

// Close popup menu when clicking outside
window.addEventListener("click", function (e) {
  if (!popupMenu.contains(e.target) && !hamburger.contains(e.target)) {
    popupMenu.classList.remove("show");
  }
});
