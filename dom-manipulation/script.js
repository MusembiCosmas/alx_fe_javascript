// ======================
// Task 0: Dynamic Quote Generator
// ======================

// Initial quotes array with text and category
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not watch the clock. Do what it does. Keep going.", category: "Productivity" }
];

// Load quotes from localStorage if available
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
}

// Function to display a random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>${quote.text}</p><small>Category: ${quote.category}</small>`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuote").value.trim();
  const newQuoteCategory = document.getElementById("newCategory").value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories();
    displayRandomQuote();
    document.getElementById("newQuote").value = "";
    document.getElementById("newCategory").value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Event listener for the Show New Quote button
document.getElementById("showQuoteBtn").addEventListener("click", displayRandomQuote);

// ======================
// Task 1: Web Storage + JSON Import/Export
// ======================

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (e) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ======================
// Task 2: Category Filtering System
// ======================

// Populate category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["All Categories", ...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = categories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join("");

  // Restore last selected category from localStorage
  const lastCategory = localStorage.getItem("lastSelectedCategory");
  if (lastCategory) {
    categoryFilter.value = lastCategory;
    filterQuotes();
  }
}

// Filter quotes based on category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);

  let filteredQuotes = quotes;
  if (selectedCategory !== "All Categories") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filteredQuotes
    .map(q => `<p>${q.text}</p><small>Category: ${q.category}</small>`)
    .join("");
}

// ======================
// Task 3: Server Sync Simulation
// ======================

const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    const res = await fetch(SERVER_URL);
    const data = await res.json();

    // Simulated server quotes
    const serverQuotes = data.slice(0, 5).map((item, index) => ({
      text: item.title,
      category: `ServerCat${index + 1}`
    }));

    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error('Error fetching from server:', error);
  }
}

// Push local quotes to server (simulation)
async function pushQuotesToServer() {
  try {
    for (const q of quotes) {
      await fetch(SERVER_URL, {
        method: 'POST',
        body: JSON.stringify(q),
        headers: { 'Content-Type': 'application/json' }
      });
    }
    console.log('Local quotes pushed to server (simulation)');
  } catch (error) {
    console.error('Error pushing to server:', error);
  }
}

// Conflict resolution: server wins
function resolveConflicts(serverQuotes) {
  let conflictFound = false;

  serverQuotes.forEach(serverQ => {
    const exists = quotes.some(
      localQ =>
        localQ.text.toLowerCase() === serverQ.text.toLowerCase() &&
        localQ.category.toLowerCase() === serverQ.category.toLowerCase()
    );
    if (!exists) {
      quotes.push(serverQ);
      conflictFound = true;
    }
  });

  if (conflictFound) {
    saveQuotes();
    populateCategories();
    displayRandomQuote();
    alert('Quotes updated from server (server data took precedence).');
  }
}

// Sync every 60 seconds
setInterval(fetchQuotesFromServer, 60000);

// Initial sync on load
fetchQuotesFromServer();

// ======================
// Initialize App
// ======================

document.addEventListener("DOMContentLoaded", () => {
  populateCategories();

  // Show last viewed quote if available
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML = `<p>${quote.text}</p><small>Category: ${quote.category}</small>`;
  } else {
    displayRandomQuote();
  }
});
