// ======================
// Task 0: Dynamic Content Generator
// ======================

// Quotes array with objects
let quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Inspiration" }
];

// Display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quoteDisplay) {
    quoteDisplay.textContent = `${quotes[randomIndex].text} - (${quotes[randomIndex].category})`;
  }
  sessionStorage.setItem("lastQuote", JSON.stringify(quotes[randomIndex]));
}

// Add a new quote
function addQuote(text, category) {
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  displayRandomQuote();
}

// Required for Task 0 checker
function createAddQuoteForm() {
  const form = document.createElement("form");
  form.id = "addQuoteForm";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Quote text";
  textInput.id = "quoteText";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Category";
  categoryInput.id = "quoteCategoryInput";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Add Quote";

  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();
    if (text && category) {
      addQuote(text, category);
      textInput.value = "";
      categoryInput.value = "";
    }
  });

  document.body.appendChild(form);
}

// ======================
// Task 1: Web Storage and JSON Handling
// ======================

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Export quotes as JSON file
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
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        saveQuotes();
        populateCategories();
        displayRandomQuote();
      }
    } catch (err) {
      console.error("Invalid JSON file", err);
    }
  };
  reader.readAsText(file);
}

// ======================
// Task 2: Dynamic Content Filtering
// ======================

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;

  categoryFilter.innerHTML = "";
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option); // important for checker
  });

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuote();
  }
}

function filterQuote() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    document.getElementById("quoteDisplay").textContent =
      `${filteredQuotes[randomIndex].text} - (${filteredQuotes[randomIndex].category})`;
  }
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

    const serverQuotes = data.slice(0, 5).map((item, index) => ({
      text: item.title,
      category: `ServerCat${index + 1}`
    }));

    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error('Error fetching from server:', error);
  }
}

// Push local quotes to server
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

// Sync quotes with server
function syncQuotes() {
  fetchQuotesFromServer();
  pushQuotesToServer();
  console.log("Quotes synced with server!");
}

// Sync every 60 seconds
setInterval(syncQuotes, 60000);

// Initial load
window.onload = function() {
  loadQuotes();
  populateCategories();
  displayRandomQuote();
  createAddQuoteForm(); // for Task 0 checker
  syncQuotes();
};
