const express = require('express');
const cors = require('cors');
const parser = require('body-parser');
const { randomUUID } = require('node:crypto');
const startingMovies = require('./movies.json');

const app = express();
const port = Number(process.env.PORT ?? 4000);
const allowedPages = ['http://localhost:5173', 'http://127.0.0.1:5173'];

// Keep a separate, editable list instead of changing the imported seed array.
// Restarting Node starts the lab over with the original three movies.
const movieList = startingMovies.slice();

// Vite runs on port 5173, so the browser treats it as a different origin.
// Register CORS first so even validation errors have the right headers.
app.use(cors({ origin: allowedPages }));

// Decide how to parse req.body by looking at the request's content type.
// Axios sends JSON, but an ordinary URL-encoded form also works here.
app.use(parser.json({ limit: '16kb' }));
app.use(parser.urlencoded({ extended: true, limit: '16kb' }));

app.get('/api/movies', function sendMovies(req, res) {
  // React reads the movie list from response.data.movies.
  // Sending JSON also sets the response content type for us.
  res.json({ movies: movieList });
});

function readMovieFields(body) {
  // Only accept the kinds of values the Create form sends.
  // Optional chaining also handles requests with no parsed body.
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const poster = typeof body?.poster === 'string' ? body.poster.trim() : '';
  const yearValue = body?.year;
  const year = typeof yearValue === 'string' || typeof yearValue === 'number'
    ? String(yearValue).trim() : '';

  if (!title || title.length > 200) return { error: 'Title must have 1 to 200 characters.' };
  if (!/^\d{4}$/.test(year) || Number(year) < 1888) return { error: 'Use a four-digit year of 1888 or later.' };

  // Accept a web address for the poster rather than a file path.
  // The API stores the address; it does not download the image.
  if (poster.length > 2048 || !/^https?:\/\//i.test(poster) || !URL.canParse(poster)) {
    return { error: 'Use a valid HTTP or HTTPS link for the poster.' };
  }

  // Use the field names already expected by MovieItem.
  // Give the new movie its own key even if a title is used twice.
  return { movie: { Title: title, Year: year, Poster: poster, Type: 'movie', imdbID: randomUUID() } };
}

app.post('/api/movies', function addMovie(req, res) {
  const result = readMovieFields(req.body);
  if (result.error) return res.status(400).json({ error: result.error });

  // The next visit to Read can now fetch the newly added film.
  // Status 201 tells Create that the server accepted it.
  movieList.push(result.movie);
  return res.status(201).json(result.movie);
});

app.use(function notFound(req, res) {
  res.status(404).json({ error: 'No matching API route.' });
});

// Keep all parser and server errors in the same JSON format.
// Unexpected errors are logged on the server instead of sent to React.
app.use(function reportError(error, req, res, next) {
  if (res.headersSent) return next(error);
  const messages = { 400: 'The request body could not be read.', 413: 'The request body is too large.', 415: 'Unsupported request encoding.' };
  if (messages[error.status]) return res.status(error.status).json({ error: messages[error.status] });
  console.error(error);
  return res.status(500).json({ error: 'The server could not complete the request.' });
});

// Start listening only when this file is the Node entry point.
// Importing it elsewhere gives access to the app without taking port 4000.
if (require.main === module) {
  const listener = app.listen(port, 'localhost', function started() {
    console.log(`API: http://localhost:${port}`);
  });
  listener.on('error', function failed(error) {
    console.error('Could not start the API:', error.message);
    process.exitCode = 1;
  });
}

module.exports = app;
