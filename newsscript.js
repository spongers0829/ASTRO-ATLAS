const NASA_KEY = 'U990DX5F5fnmYdruCV1jyPXoNFHiy1DJPOmeuw0t'; // ✅ Replace with actual key
const SPACE_NEWS_URL = "https://api.spaceflightnewsapi.net/v4/articles/?limit=10&offset=10";
const FALLBACK_IMAGE = "https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

const APOD_RANGE_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&start_date=${getPastDate(5)}&end_date=${getToday()}`;
const APOD_TODAY_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`;

async function loadAPODCarousel() {
  try {
    const res = await fetch(APOD_RANGE_URL);
    const data = await res.json();
    const track = document.getElementById("carousel-track");
    data.forEach(apod => {
      const img = document.createElement("img");
      img.src = apod.url;
      img.title = `${apod.date}: ${apod.title}`;
      img.alt = apod.title;
      img.onerror = () => img.src = FALLBACK_IMAGE;
      track.appendChild(img);
    });
  } catch (err) {
    console.error("Failed to load APOD carousel:", err);
  }
}

async function loadTodayAPOD() {
  try {
    const res = await fetch(APOD_TODAY_URL);
    const data = await res.json();
    const container = document.getElementById("today-apod");
    container.innerHTML = `
      <h2>✨ Today’s APOD: ${data.title}</h2>
      <img src="${data.url}" alt="${data.title}" onerror="this.src='${FALLBACK_IMAGE}'" />
      <p>${data.explanation}</p>
    `;
  } catch (err) {
    console.error("Failed to load today's APOD:", err);
  }
}

async function loadSpaceNews() {
  const container = document.getElementById("news-container");
  container.innerHTML = "<p>Loading space news...</p>";

  try {
    const res = await fetch(SPACE_NEWS_URL);
    const data = await res.json();
    const articles = data.results || [];
    container.innerHTML = "";

    articles.slice(0, 12).forEach((article) => {
      const imgSrc = article.image_url || FALLBACK_IMAGE;

      const card = document.createElement("div");
      card.className = "news-card";
      card.onclick = () => window.open(article.url, "_blank");

      const img = document.createElement("img");
      img.src = FALLBACK_IMAGE;
      img.alt = article.title;
      img.loading = "lazy";

      if (article.image_url) {
        const preload = new Image();
        preload.src = article.image_url;
        preload.onload = () => {
          img.src = article.image_url;
        };
      }

      const content = document.createElement("div");
      content.className = "news-content";
      content.innerHTML = `
        <h3 class="news-title">${article.title}</h3>
        <p class="news-summary">${article.summary.substring(0, 120)}...</p>
      `;

      card.appendChild(img);
      card.appendChild(content);
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading space news:", error);
    container.innerHTML = "<p style='color:tomato;'>Failed to load space news.</p>";
  }
}

loadAPODCarousel();
loadTodayAPOD();
loadSpaceNews();
