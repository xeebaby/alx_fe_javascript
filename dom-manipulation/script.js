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

function populateCategories() {
  const uniqueCategories = ["all", ...new Set(quotes.map(q => q.category))];

  // Update both dropdowns
  [categorySelect, categoryFilter].forEach(dropdown => {
    dropdown.innerHTML = ""; // Clear existing options
    uniqueCategories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      dropdown.appendChild(option);
    });
  });

  // Restore last selected filter from storage
  const savedFilter = localStorage.getItem("lastFilter");
  if (savedFilter && uniqueCategories.includes(savedFilter)) {
    categoryFilter.value = savedFilter;
    filterQuotes(); // Auto-filter when page loads
  }
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("lastFilter", selectedCategory);

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  displayQuotes(filteredQuotes);
}

function displayQuotes(list) {
  quoteDisplay.innerHTML = "";

  if (list.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  list.forEach(quote => {
    const quoteElement = document.createElement("div");
    quoteElement.innerHTML = `<blockquote>"${quote.text}"</blockquote><p><em>Category: ${quote.category}</em></p>`;
    quoteDisplay.appendChild(quoteElement);
  });
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text, category };

  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  alert("Quote added!");

  // Send to server
  postQuoteToServer(newQuote);

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

}

// Main app start
loadQuotes();
loadLastQuote();
createAddQuoteForm();
populateCategories();
newQuoteBtn.addEventListener("click", showRandomQuote);

async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();

    // Convert server posts into quote format
    const serverQuotes = data.slice(0, 10).map(post => ({
      text: post.title,
      category: "Server" // simulate server origin
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Error fetching server quotes:", error);
    return [];
  }
}

async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();

  // Get local quotes
  let localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  // Detect conflicts (simple: if text already exists, skip it)
  let newQuotes = serverQuotes.filter(sq =>
    !localQuotes.some(lq => lq.text === sq.text)
  );

  if (newQuotes.length > 0) {
    quotes.push(...newQuotes);
    saveQuotes();
    populateCategories();
    showNotification(`${newQuotes.length} new quote(s) synced from server.`);
    filterQuotes();
  }
}

setInterval(syncWithServer, 30000); // every 30 seconds

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  setTimeout(() => notification.textContent = "", 5000);
}

let conflictQuotes = [];

if (localQuotes.some(lq => lq.text === sq.text && lq.category !== sq.category)) {
  conflictQuotes.push(sq);
}

loadQuotes();
loadLastQuote();
createAddQuoteForm();
populateCategories();
newQuoteBtn.addEventListener("click", showRandomQuote);
syncWithServer(); // do initial sync on load
setInterval(syncWithServer, 30000); // background sync

method: "POST",
headers: {
  "Content-Type": "application/json"
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    const data = await response.json();
    console.log("Quote sent to server:", data);
  } catch (error) {
    console.error("Failed to post quote to server:", error);
  }
}

async function syncQuotes() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverData = await response.json();

    // Simulate server quotes from API data
    const serverQuotes = serverData.slice(0, 10).map(post => ({
      text: post.title,
      category: "Server"
    }));

    // Load current local quotes
    let localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

    // Find quotes that are in server but not in local
    const newQuotes = serverQuotes.filter(sq => 
      !localQuotes.some(lq => lq.text === sq.text)
    );

    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      showNotification("Quotes synced with server!"); // ✅ Added message
    } else {
      showNotification("Quotes synced with server!"); // ✅ Still show confirmation even if no new ones
    }

  } catch (error) {
    console.error("Error during sync:", error);
    showNotification("❌ Failed to sync with server.");
  }
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  setTimeout(() => {
    notification.textContent = "";
  }, 5000);
}


// App Initialization
loadQuotes();
loadLastQuote();
createAddQuoteForm();
populateCategories();
newQuoteBtn.addEventListener("click", showRandomQuote);

// 🔄 Sync on load + every 30 seconds
syncQuotes();
setInterval(syncQuotes, 30000); // Auto-sync every 30 sec



