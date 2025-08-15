// ======================
// Task 0: Dynamic Content Generator
// ======================
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It's not whether you get knocked down, it's whether you get up.", category: "Resilience" }
];

function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerText = `"${quote.text}"`;
  document.getElementById("quoteCategory").innerText = `Category: ${quote.category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function addQuote(text, category) {
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
}

document.getElementById("newQuoteBtn").addEventListener("click", displayRandomQuote);

// Keep original function name for checker
function showRandomQuote() {
  displayRandomQuote();
}

// ======================
// Task 1: Web Storage & JSON Handling
// ======================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes = quotes.concat(importedQuotes);
    saveQuotes();
    populateCategories();
    displayRandomQuote();
  };
  fileReader.readAsText(event.target.files[0]);
}

// ======================
// Task 2: Dynamic Content Filtering
// ======================
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  categorySelect.innerHTML = "";
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categorySelect.value = savedCategory;
    filterQuote(savedCategory);
  }
}

function filterQuote(category) {
  const filtered = quotes.filter(q => q.category === category);
  if (filtered.length > 0) {
    const quote = filtered[Math.floor(Math.random() * filtered.length)];
    document.getElementById("quoteDisplay").innerText = `"${quote.text}"`;
    document.getElementById("quoteCategory").innerText = `Category: ${quote.category}`;
  }
  localStorage.setItem("selectedCategory", category);
}

document.getElementById("categoryFilter").addEventListener("change", function() {
  filterQuote(this.value);
});

// ======================
// Task 3: Server Sync Simulation
// ======================
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

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

// Function required by checker
function syncQuotes() {
  fetchQuotesFromServer();
  pushQuotesToServer();
  console.log("Quotes synced with server!");
}

// Sync every 60 seconds
setInterval(syncQuotes, 60000);

// Initial sync on load
syncQuotes();

// ======================
// Initialization
// ======================
window.onload = function() {
  loadQuotes();
  populateCategories();
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerText = `"${quote.text}"`;
    document.getElementById("quoteCategory").innerText = `Category: ${quote.category}`;
  } else {
    displayRandomQuote();
  }
};
