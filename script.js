// Quotes array
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do one thing every day that scares you.", category: "Courage" }
];

// Function to show a random quote
function showRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let randomQuote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerText =
    `"${randomQuote.text}" - ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote() {
  let text = document.getElementById("quoteText").value.trim();
  let category = document.getElementById("quoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text: text, category: category });
    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";
    showRandomQuote();
  }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Show one quote on page load
showRandomQuote();
