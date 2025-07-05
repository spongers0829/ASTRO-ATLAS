async function fetchNews() {
  const newsContainer = document.getElementById("newsContainer");
  newsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=10&offset=10");
    const data = await response.json();
    const articles = data.results;

    const cards = articles.map(article => `
      <div class="news-card" onclick="window.open('${article.url}', '_blank')">
        <img src="${article.image_url}" alt="News image" />
        <div class="news-content">
          <h3>${article.title}</h3>
          <p>${article.summary.slice(0, 130)}...</p>
        </div>
      </div>
    `).join("");

    newsContainer.innerHTML = cards;

  } catch (err) {
    console.error("Failed to fetch news", err);
    newsContainer.innerHTML = "<p>Failed to load news. Please try again later.</p>";
  }
}

// Hamburger and popup menu
const hamburger = document.getElementById("hamburger");
const popupMenu = document.getElementById("popupMenu");

hamburger.addEventListener("click", () => {
  popupMenu.classList.toggle("show");
});

window.addEventListener("click", function (e) {
  if (!popupMenu.contains(e.target) && !hamburger.contains(e.target)) {
    popupMenu.classList.remove("show");
  }
});

fetchNews();
