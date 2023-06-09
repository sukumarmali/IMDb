// Set the base URL for API endpoints and define the API key
const apiBaseUrl = "https://api.themoviedb.org/3";
const apiKey = "d209329cce0ab919c1772a0552d0ea65";
const imageBaseUrl = "https://image.tmdb.org/t/p/w300";

// Get references to HTML elements
const moviesGrid = document.getElementById("movies-grid");
const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
const categoryTitle = document.getElementById("category-title");

// Fetch and display currently playing movies
async function fetchMoviesNowPlaying() {
    // Fetch data from the API
    const response = await fetch(`${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`);
    const jsonResponse = await response.json();

    // Process the response to get necessary movie details
    const movies = await Promise.all(
        jsonResponse.results.map(async (result) => ({
            id: result.id,
            title: result.title,
            poster_path: result.poster_path,
            vote_average: result.vote_average,
            IMDbId: await getIMDbId(result.id), // Get IMDb ID for each movie
        }))
    );

    // Display the movies on the webpage
    displayMovies(movies);
}

// Search movies based on a query
async function searchMovies(query) {
    // Fetch data from the API based on the search query
    const response = await fetch(`${apiBaseUrl}/search/movie?api_key=${apiKey}&query=${query}`);
    const jsonResponse = await response.json();

    // Process the response to get necessary movie details
    const movies = await Promise.all(
        jsonResponse.results.map(async (result) => ({
            id: result.id,
            title: result.title,
            poster_path: result.poster_path,
            vote_average: result.vote_average,
            IMDbId: await getIMDbId(result.id), // Get IMDb ID for each movie
        }))
    );

    // Display the movies on the webpage
    displayMovies(movies);
}

// Display movies on the webpage
function displayMovies(movies) {
    moviesGrid.innerHTML = movies
        .map(
            (movie) =>
                `<div class="movie-card">
                    <a href="https://www.imdb.com/title/${movie.IMDbId}/">
                        <img src="${imageBaseUrl}${movie.poster_path}"/>
                        <p>⭐ ${movie.vote_average}</p>
                        <h1>${movie.title}<h1/>
                    </a>
                 </div>`
        )
        .join("");
}

// Handle the form submission for movie search
function handleSearchFormSubmit(event) {
    event.preventDefault();
    categoryTitle.innerHTML = "Search Results";
    const searchQuery = searchInput.value;
    searchMovies(searchQuery);
}

// Fetch IMDb ID for a movie
async function getIMDbId(movieId) {
    // Fetch external IDs for a movie from the API
    const response = await fetch(`${apiBaseUrl}/movie/${movieId}/external_ids?api_key=${apiKey}`);
    const jsonResponse = await response.json();
    const IMDbId = jsonResponse.imdb_id;
    return IMDbId;
}

// Add event listener for search form submission
searchForm.addEventListener("submit", handleSearchFormSubmit);

// Fetch and display currently playing movies when the page loads
fetchMoviesNowPlaying();
