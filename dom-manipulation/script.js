// Task 2: Add category filtering to Dynamic Quote Generator

let quotes = [];

// Load quotes from localStorage (or defaults)
function loadQuotes() {
  try {
    const raw = localStorage.getItem('quotes');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        quotes = parsed;
        return;
      }
    }
  } catch (e) {}
  quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
    { text: "It's not whether you get knocked down, it's whether you get up.", category: "Perseverance" }
  ];
}

function saveQuotes() {
  try {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  } catch (e) {}
}

function displayRandomQuote() {
  const display = document.getElementById('quoteDisplay');
  if (!display) return;
  while (display.firstChild) display.removeChild(display.firstChild);

  const selectedCategory = document.getElementById('categoryFilter')?.value || 'all';
  let filteredQuotes = quotes;
  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (!filteredQuotes.length) {
    display.textContent = 'No quotes available for this category.';
    return;
  }

  const idx = Math.floor(Math.random() * filteredQuotes.length);
  const q = filteredQuotes[idx];
  try { sessionStorage.setItem('lastQuote', JSON.stringify(q)); } catch (e) {}

  const p = document.createElement('p');
  p.textContent = q.text;
  const small = document.createElement('small');
  small.textContent = q.category;

  display.appendChild(p);
  display.appendChild(small);
}

function showRandomQuote() {
  return displayRandomQuote();
}

function addQuote() {
  const textEl = document.getElementById('newQuoteText');
  const catEl  = document.getElementById('newQuoteCategory');
  if (!textEl || !catEl) return;

  const text = textEl.value.trim();
  const category = catEl.value.trim();
  if (!text || !category) return;

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  displayRandomQuote();

  textEl.value = '';
  catEl.value = '';
}

// Populate categories in dropdown
function populateCategories() {
  const filter = document.getElementById('categoryFilter');
  if (!filter) return;

  const selectedBefore = filter.value;
  // Remove all except "all"
  filter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))].sort();
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });

  // Restore saved category selection if exists
  const savedCategory = localStorage.getItem('selectedCategory') || selectedBefore;
  if (savedCategory && [...filter.options].some(o => o.value === savedCategory)) {
    filter.value = savedCategory;
  }
}

function filterQuotes() {
  const selected = document.getElementById('categoryFilter')?.value || 'all';
  try { localStorage.setItem('selectedCategory', selected); } catch (e) {}
  displayRandomQuote();
}

function exportToJsonFile() {
  try {
    const json = JSON.stringify(quotes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {}
}

function importFromJsonFile(event) {
  const file = event?.target?.files?.[0] || null;
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter(item => item && typeof item.text === 'string' && typeof item.category === 'string');
        if (valid.length) {
          quotes.push(...valid);
          saveQuotes();
          populateCategories();
          displayRandomQuote();
        }
      }
    } catch (err) {}
  };
  reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  populateCategories();

  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory && document.getElementById('categoryFilter')) {
    document.getElementById('categoryFilter').value = savedCategory;
  }

  const newQuoteBtn = document.getElementById('newQuote');
  const addQuoteBtn = document.getElementById('addQuoteBtn');
  const exportBtn   = document.getElementById('exportBtn');
  const importFile  = document.getElementById('importFile');

  if (newQuoteBtn) newQuoteBtn.addEventListener('click', displayRandomQuote);
  if (addQuoteBtn) addQuoteBtn.addEventListener('click', addQuote);
  if (exportBtn)   exportBtn.addEventListener('click', exportToJsonFile);
  if (importFile)  importFile.addEventListener('change', importFromJsonFile);

  displayRandomQuote();
});
