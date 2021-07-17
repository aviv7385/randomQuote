/// <reference path="jquery-3.5.1.js" />

// get HTML elements 
const quoteTextSpan = document.getElementById("quote");
const quoteAuthorSpan = document.getElementById("author");
const quoteContainer = document.getElementById("quote-container");
const favoritesContainer = document.getElementById("favorites-container");
const loader = document.getElementById("loader");
const favoriteIcon = document.getElementById("favorite");
const main = document.getElementById("main-container");

let apiQuotes = [];
let quote = {};
let favoriteQuotes = [];

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
    favoritesContainer.hidden = true;

    favoriteIcon.style.color = "grey";
    // get a random number between 0 and the length of the apiQuotes array
    const randomNumber = Math.floor(Math.random() * apiQuotes.length);
    // a randomly chosen quote"
    quote = apiQuotes[randomNumber];

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

// add to favorites
function addQuoteToFavorites() {

    saveToLocalStorage(quote);
}

function saveToLocalStorage(favorite) {
    //loading favorite quotes from local storage
    let favoriteQuotesJsonString = localStorage.getItem("favoriteQuotes");
    if (favoriteQuotesJsonString != null) {
        favoriteQuotes = JSON.parse(favoriteQuotesJsonString);
    }

    // check if quote was already chosen as a favorite
    const validateQuote = favoriteQuotes.find(q => q.text === favorite.text);

    // if it wasn't - add to the favorites array and change the color of the favorite icon to red
    if (!validateQuote) {
        // Add the new favorite quote to the array:
        favoriteQuotes.push(favorite);
        favoriteIcon.style.color = "red";
    }
    // if it's already a favorite - remove the quote from the favorite list and change the icon color back to grey
    else {
        removeQuoteFromFavorites(favorite);
        favoriteIcon.style.color = "grey";
    }
    // Save the new array back to local storage: 
    favoriteQuotesJsonString = JSON.stringify(favoriteQuotes);
    localStorage.setItem("favoriteQuotes", favoriteQuotesJsonString);
}

function removeQuoteFromFavorites(favorite) {
    const indexToBeDeleted = favoriteQuotes.findIndex(q => q.text === favorite.text);
    favoriteQuotes.splice(indexToBeDeleted, 1);
}

function showFavoriteQuotes() {
    // get the favorite quotes from the local storage and save them to an array
    favoriteQuotes = JSON.parse(localStorage.getItem("favoriteQuotes"));
    for (let i = 0; i < favoriteQuotes.length; i++) {
        const quotePar = document.createElement("p");
        quotePar.className = "fav-q-par";
        quotePar.id = i;
        favoritesContainer.appendChild(quotePar);
        // check if author field is null and replace it with "unknown"
        if (!favoriteQuotes[i].author) {
            favoriteQuotes[i].author = "Unknown";
        }
        $(`#${i}`).html(`<i class="fas fa-heart heart" title="remove from favorites" id="heart${i}"></i>  ${favoriteQuotes[i].text} (${favoriteQuotes[i].author})`);

        // when clicking on the heart icon (before the favorite quote) - remove it from the favorites array and update the local storage
        $(`#heart${i}`).on("click", function () {
            favoriteQuotes.splice(i, 1);
            $(`#${i}`).empty();
            // Save the new array back to local storage: 
            favoriteQuotesJsonString = JSON.stringify(favoriteQuotes);
            localStorage.setItem("favoriteQuotes", favoriteQuotesJsonString);
        });
    }
}

$(function () {
    // when clicking on the "favorites" button - show the user's favorites
    $('#show-favorites').on('click', function () {
        quoteContainer.hidden = true;
        favoritesContainer.hidden = false;
        $('#favorites-container').empty();
        $('#favorites-container').html('<h2>your favorite quotes</h2>');
        showFavoriteQuotes();
    });

    // when clicking on the "home" button - show the home page (call the getQuotes function to show again the random quote generator)
    $('#homeBtn').on('click', function () {
        favoritesContainer.hidden = true;
        quoteContainer.hidden = false;
        getQuotes();
    });
})

// on load
getQuotes();

