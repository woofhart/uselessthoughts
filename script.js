let quotes = [];
let currentDeck = [];
let todayQuote = "";
const quoteElement = document.getElementById("quote");
const newQuoteBtn = document.getElementById("new-quote");
const shareBtn = document.getElementById("share");
const copyBtn = document.getElementById("copy");
const darkModeBtn = document.getElementById("dark-mode");
const darkIcon = darkModeBtn.querySelector("i");

async function loadQuotes() {
  const res = await fetch("quotes.json");
  quotes = await res.json();
  initializeDeck();
  loadTodayQuote();
  restoreDarkMode();
}

function initializeDeck() {
  const savedDeck = JSON.parse(localStorage.getItem("deck"));
  if (savedDeck && savedDeck.length > 0) {
    currentDeck = savedDeck;
  } else {
    currentDeck = shuffle([...quotes]);
    localStorage.setItem("deck", JSON.stringify(currentDeck));
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadTodayQuote() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("date");
  const savedQuote = localStorage.getItem("todayQuote");

  if (savedDate === today && savedQuote) {
    todayQuote = savedQuote;
  } else {
    if (currentDeck.length === 0) {
      currentDeck = shuffle([...quotes]);
    }
    todayQuote = currentDeck.pop();
    localStorage.setItem("todayQuote", todayQuote);
    localStorage.setItem("date", today);
    localStorage.setItem("deck", JSON.stringify(currentDeck));
  }

  displayQuote(todayQuote);
}

function displayQuote(q) {
  quoteElement.classList.remove("show"); // fade out
  setTimeout(() => {
    quoteElement.textContent = q;
    quoteElement.classList.add("show"); // fade in
  }, 200);
}

// New Quote
newQuoteBtn.addEventListener("click", () => {
  if (currentDeck.length === 0) {
    currentDeck = shuffle([...quotes]);
  }
  const next = currentDeck.pop();
  displayQuote(next);
  localStorage.setItem("deck", JSON.stringify(currentDeck));
});

// Copy
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(quoteElement.textContent);
  alert("Quote copied to clipboard!");
});

// Share
shareBtn.addEventListener("click", async () => {
  if (navigator.share) {
    await navigator.share({
      title: "USELESS THOUGHT FOR THE DAY",
      text: quoteElement.textContent,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(quoteElement.textContent);
    alert("Quote copied to clipboard!");
  }
});

// Dark mode toggle with sun/moon
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
  updateDarkIcon(isDark);
});

function restoreDarkMode() {
  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) document.body.classList.add("dark");
  updateDarkIcon(isDark);
}

function updateDarkIcon(isDark) {
  if (isDark) {
    darkIcon.classList.remove("fa-moon");
    darkIcon.classList.add("fa-sun");
  } else {
    darkIcon.classList.remove("fa-sun");
    darkIcon.classList.add("fa-moon");
  }
}

loadQuotes();
