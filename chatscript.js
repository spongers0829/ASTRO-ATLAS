document.addEventListener("DOMContentLoaded", () => {
  const chatbot = document.getElementById("chatbot");
  const closeChat = document.getElementById("closeChat");
  const supportLinks = document.querySelectorAll('a[href="#support"]');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');

  const predefinedAnswers = {
    "What is AstroAtlas?": "AstroAtlas is a cosmic discovery portal where you can explore astronomy events, news, and missions.",
    "How can I contribute?": "You can contribute by sharing the site, donating, or joining our community programs.",
    "Who created this site?": "AstroAtlas was created by a team of passionate astronomers and developers for educational outreach.",
    "What is your mission?": "Our mission is to make astronomy accessible, engaging, and inspiring for everyone.",
    "How can I contact support?": "You can contact support through our chatbot, email, or by visiting the Support section on the site."
  };

  function appendMessage(sender, msg) {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${sender}:</strong> ${msg}`;
    chatbotMessages.appendChild(p);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function handleUserMessage(msg) {
    appendMessage("You", msg);
    const response = predefinedAnswers[msg.trim()];
    if (response) {
      appendMessage("AstroBot", response);
    } else {
      appendMessage("AstroBot", "Let me get back to you on that.");
      // You can add fetch() here to query a backend API.
    }
  }

  supportLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      chatbot.style.display = "flex";
    });
  });

  closeChat.addEventListener("click", () => {
    chatbot.style.display = "none";
  });

  document.querySelectorAll('.chatbot-quick button').forEach(btn => {
    btn.addEventListener("click", () => {
      handleUserMessage(btn.textContent);
    });
  });

  sendBtn.addEventListener("click", () => {
    const msg = input.value.trim();
    if (msg !== "") {
      handleUserMessage(msg);
      input.value = "";
    }
  });
});
