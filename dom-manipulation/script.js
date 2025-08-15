// Quotes array with text and category
let quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
    { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

// Function to display a random quote
function displayRandomQuote() {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    let randomQuote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerText = `"${randomQuote.text}" - ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote() {
    let textInput = document.getElementById("quoteText").value.trim();
    let categoryInput = document.getElementById("quoteCategory").value.trim();

    if (textInput && categoryInput) {
        quotes.push({ text: textInput, category: categoryInput });
        document.getElementById("quoteText").value = "";
        document.getElementById("quoteCategory").value = "";
        displayRandomQuote();
    }
}

// Event listeners
document.getElementById("newQuoteBtn").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Display first random quote on page load
displayRandomQuote();
