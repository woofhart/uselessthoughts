const quoteElement = document.getElementById("quote");
const newQuoteButton = document.getElementById("new-quote");
const copyButton = document.getElementById("copy");
const shareButton = document.getElementById("share");
const whyButton = document.getElementById("why");
const darkModeButton = document.getElementById("dark-mode");

let showingExplanation = false;
let currentQuote = "";

const explanationText = "The so-called 'useless thoughts' are not truly useless. They are fragments of wisdom we already know, but bury under the noise of everyday life. They are simple truths—obvious, forgotten, or ignored—that remind us of our humanity. Their very uselessness is their power: they don't demand action, only reflection.";

// Load quotes from JSON
async function loadQuotes() {
  try {
    const response = await fetch("quotes.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const quotes = await response.json();
    return quotes;
  } catch (error) {
    console.error("Error loading quotes:", error);
    // If there's an error, show a message and use a default quote
    quoteElement.textContent = "Error loading quotes. Please refresh the page.";
    return ["The moon doesn’t apologize for being half-lit. Neither should you."];
  }
}

// Display a random quote
async function displayRandomQuote() {
  const quotes = await loadQuotes();
  currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteElement.textContent = `"${currentQuote}"`;
  showingExplanation = false;
  whyButton.innerHTML = '<i class="fas fa-question-circle"></i> Why useless thoughts?';
}

// Toggle between quote and explanation
function toggleExplanation() {
  if (showingExplanation) {
    // Show the current quote
    quoteElement.textContent = `"${currentQuote}"`;
    whyButton.innerHTML = '<i class="fas fa-question-circle"></i> Why useless thoughts?';
    showingExplanation = false;
  } else {
    // Show the explanation
    quoteElement.textContent = explanationText;
    whyButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to thoughts';
    showingExplanation = true;
  }
}

// Copy quote to clipboard
function copyQuote() {
  const textToCopy = showingExplanation ? explanationText : `"${currentQuote}"`;
  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      // Provide visual feedback that text was copied
      const originalText = copyButton.innerHTML;
      copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        copyButton.innerHTML = originalText;
      }, 2000);
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
      alert('Failed to copy text. Please try again.');
    });
}

// Share quote
function shareQuote() {
  const shareData = {
    title: "Useless Thought for the Day",
    text: showingExplanation ? explanationText : `"${currentQuote}"`
  };
  
  try {
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Shared successfully'))
        .catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      copyQuote();
    }
  } catch (err) {
    console.log('Error sharing:', err);
    copyQuote();
  }
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const icon = darkModeButton.querySelector('i');
  if (document.body.classList.contains('dark')) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
  
  // Save preference to localStorage
  const isDarkMode = document.body.classList.contains('dark');
  localStorage.setItem('darkMode', isDarkMode);
}

// Event listeners
newQuoteButton.addEventListener('click', displayRandomQuote);
whyButton.addEventListener('click', toggleExplanation);
copyButton.addEventListener('click', copyQuote);
shareButton.addEventListener('click', shareQuote);
darkModeButton.addEventListener('click', toggleDarkMode);

// Initialize
function init() {
  // Load dark mode preference
  const darkModePreference = localStorage.getItem('darkMode');
  if (darkModePreference === 'true') {
    document.body.classList.add('dark');
    const icon = darkModeButton.querySelector('i');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
  
  // Load initial quote
  displayRandomQuote();
}

// Run initialization when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();

}
