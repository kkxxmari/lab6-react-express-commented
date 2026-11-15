// I use CommonJS here because this backend file has the .cjs extension.
const express = require('express');
const cors = require('cors');
const parser = require('body-parser');
const { randomUUID } = require('node:crypto');
const startingMovies = require('./movies.json');

const app = express();
// I use PORT when it is supplied and otherwise keep the lab on port 4000.
const port = Number(process.env.PORT ?? 4000);
// I list both local frontend addresses so either spelling works in the browser.
const allowedPages = ['http://localhost:5173', 'http://127.0.0.1:5173'];

// I copy the starter array so I can add movies to a separate list.
// I only keep changes in memory, so restarting Node resets the list.
const movieList = startingMovies.slice();

// I allow the Vite addresses because the frontend uses a different port.
// I put CORS first so error responses also get the needed headers.
app.use(cors({ origin: allowedPages }));

// I add middleware to read incoming request bodies.
// I accept JSON from Axios and URL-encoded form data too.
app.use(parser.json({ limit: '16kb' }));
app.use(parser.urlencoded({ extended: true, limit: '16kb' }));

// I handle the list request without changing any stored movies.
app.get('/api/movies', function sendMovies(req, res) {
  // I send the list inside movies because that is what Read expects.
  // I use res.json so Express also sets the JSON content type.
  res.json({ movies: movieList });
});

function readMovieFields(body) {
  // I check the field types instead of assuming every request came from my form.
  // I use optional chaining in case there is no request body.
  // I trim text values and use an empty string for unsupported input types.
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const poster = typeof body?.poster === 'string' ? body.poster.trim() : '';
  // I accept a year sent as either a number or a string.
  const yearValue = body?.year;
  const year = typeof yearValue === 'string' || typeof yearValue === 'number'
    ? String(yearValue).trim() : '';

  // I reject blank or overly long titles before adding anything to the list.
  if (!title || title.length > 200) return { error: 'Title must have 1 to 200 characters.' };
  // I require four digits and do not allow a year earlier than 1888.
  if (!/^\d{4}$/.test(year) || Number(year) < 1888) return { error: 'Use a four-digit year of 1888 or later.' };

  // I check that the poster is a valid HTTP or HTTPS address.
  // I store the link here; the browser loads the actual image later.
  if (poster.length > 2048 || !/^https?:\/\//i.test(poster) || !URL.canParse(poster)) {
    return { error: 'Use a valid HTTP or HTTPS link for the poster.' };
  }

  // I use capitalized field names to match the starter movies and MovieItem.
  // I make a fresh ID so two movies with the same title still have different keys.
  return { movie: { Title: title, Year: year, Poster: poster, Type: 'movie', imdbID: randomUUID() } };
}

// I handle form submissions separately from the GET list request.
app.post('/api/movies', function addMovie(req, res) {
  const result = readMovieFields(req.body);
  // I return a 400 response if validation found a problem.
  if (result.error) return res.status(400).json({ error: result.error });

  // I add the movie to the list that the GET route returns.
  // I return 201 to say that a new movie was created.
  movieList.push(result.movie);
  return res.status(201).json(result.movie);
});

// I place this after the API routes so unmatched requests get a JSON 404.
app.use(function notFound(req, res) {
  res.status(404).json({ error: 'No matching API route.' });
});

// I keep error responses in JSON so the frontend can read them consistently.
// I log unexpected error details on the server and send a simple message back.
app.use(function reportError(error, req, res, next) {
  // I pass the error onward if Express has already started the response.
  if (res.headersSent) return next(error);
  // I map the parser status codes to short messages the form can display.
  const messages = { 400: 'The request body could not be read.', 413: 'The request body is too large.', 415: 'Unsupported request encoding.' };
  if (messages[error.status]) return res.status(error.status).json({ error: messages[error.status] });
  console.error(error);
  return res.status(500).json({ error: 'The server could not complete the request.' });
});

// I start listening when I run this file directly with Node.
// I can also import the app for checks without opening the usual server port.
if (require.main === module) {
  // I bind to localhost because the existing lab is intended to run locally.
  const listener = app.listen(port, 'localhost', function started() {
    console.log(`API: http://localhost:${port}`);
  });
  // I report startup errors, such as another program already using the port.
  listener.on('error', function failed(error) {
    console.error('Could not start the API:', error.message);
    process.exitCode = 1;
  });
}

// I export the same app so checks can start it on a temporary port.
module.exports = app;
