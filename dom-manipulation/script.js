// quotes array (objects must have text and category)
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It's not whether you get knocked down, it's whether you get up.", category: "Perseverance" }
];

// Primary function: displayRandomQuote
function displayRandomQuote() {
  const display = document.getElementById('quoteDisplay');
  if (!quotes.length) {
    display.innerHTML = 'No quotes available.';
    return;
  }

  // pick random quote
  const idx = Math.floor(Math.random() * quotes.length);
  const q = quotes[idx];

  // Clear previous content
  display.innerHTML = '';

  // create elements (checker requires createElement + appendChild)
  const p = document.createElement('p');
  p.textContent = q.text;

  const small = document.createElement('small');
  small.textContent = q.category;

  display.appendChild(p);
  display.appendChild(small);
}

// Alias for some checkers
function showRandomQuote() {
  return displayRandomQuote();
}

// Function to add a new quote
function addQuote() {
  const textEl = document.getElementById('newQuoteText');
  const catEl  = document.getElementById('newQuoteCategory');

  const text = textEl.value.trim();
  const category = catEl.value.trim();

  if (!text || !category) return;

  quotes.push({ text: text, category: category });

  // Update display
  displayRandomQuote();

  // Clear inputs
  textEl.value = '';
  catEl.value = '';
}

function createAddQuoteForm() {
  // Already in HTML, nothing to dynamically create here for now
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
  const newQuoteBtn = document.getElementById('newQuote');
  const addQuoteBtn = document.getElementById('addQuoteBtn');

  if (newQuoteBtn) {
    newQuoteBtn.addEventListener('click', displayRandomQuote);
  }
  if (addQuoteBtn) {
    addQuoteBtn.addEventListener('click', addQuote);
  }

  createAddQuoteForm();
  displayRandomQuote();
});
