// Sample quote data
let quotes = [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");
const categorySelect = document.getElementById("categorySelect");

// Function to display a random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `<blockquote>"${quote.text}"</blockquote><p><em>Category: ${quote.category}</em></p>`;
}

// Function to dynamically create the add quote form
function createAddQuoteForm() {
  const heading = document.createElement("h2");
  heading.textContent = "Add a New Quote";

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.id = "newQuoteText";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  // Append to form container
  formContainer.appendChild(heading);
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addBtn);
}

// Function to add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);

  // Check if category is new
  const existingOptions = Array.from(categorySelect.options).map(opt => opt.value.toLowerCase());
  if (!existingOptions.includes(category.toLowerCase())) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  }

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added!");
}

// Setup
newQuoteBtn.addEventListener("click", showRandomQuote);
createAddQuoteForm(); // Generate the form on page load

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

function saveLastQuote(quote) {
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

function loadLastQuote() {
  const last = sessionStorage.getItem('lastQuote');
  if (last) {
    const quote = JSON.parse(last);
    quoteDisplay.innerHTML = `<blockquote>"${quote.text}"</blockquote><p><em>Category: ${quote.category}</em></p>`;
  }
}

saveLastQuote(quote);

// Export Quotes as JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2); // pretty print
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Import Quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
        updateCategoryDropdown();
      } else {
        alert("Invalid JSON format. Expected an array.");
      }
    } catch (error) {
      alert("Failed to import: " + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function updateCategoryDropdown() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  // Clear and repopulate
  categorySelect.innerHTML = "";
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

// Init everything on load
loadQuotes();
loadLastQuote();
updateCategoryDropdown();
createAddQuoteForm();
newQuoteBtn.addEventListener("click", showRandomQuote);

