// get HTML elements 
const quoteTextSpan = document.getElementById("quote");
const quoteAuthorSpan = document.getElementById("author");
const quoteContainer = document.getElementById("quote-container");
const loader = document.getElementById("loader");

let apiQuotes = [];

// show loader
function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// hide loader
function removeLoadingSpinner() {
    quoteContainer.hidden = false;
    loader.hidden = true;
}

// show new quote
function newQuote() {
    showLoadingSpinner(); // show loader
    // get a random number between 0 and the length of the apiQuotes array
    const randomNumber = Math.floor(Math.random() * apiQuotes.length);
    // a randomly chosen quote"
    const quote = apiQuotes[randomNumber];

    // get specific fields from the random quote 
    const quoteText = quote.text;
    const quoteAuthor = quote.author;

    // insert quote data to the HTML elements
    // check if author field is null and replace it with "unknown"
    if (!quoteAuthor) {
        quoteAuthorSpan.innerText = "- Unknown";
    }
    else {
        quoteAuthorSpan.innerText = "- " + quoteAuthor;
    }

    // check the quote's length to determine the styling
    if (quoteText.length > 50) {
        quoteTextSpan.classList.add("long-quote"); // if the text is too long - add a new class to the quote-text div
    }
    else {
        quoteTextSpan.classList.remove("long-quote");
    }

    quoteTextSpan.innerText = quoteText;
    removeLoadingSpinner(); // hide the loader
}


// get quotes from API
async function getQuotes() {
    showLoadingSpinner(); // show loader
    const apiUrl = "https://type.fit/api/quotes";
    try {
        const response = await fetch(apiUrl);
        apiQuotes = await response.json();
        newQuote();
    }
    catch (err) {
        console.log(err);
        
    }
}

// tweet quote
function tweetQuote() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteTextSpan.textContent} ${quoteAuthorSpan.textContent}`;
    window.open(twitterUrl, "_blank"); // open window in a new tab    
}

// on load
getQuotes();

