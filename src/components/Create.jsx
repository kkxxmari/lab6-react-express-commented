import { useState } from 'react';
import { movieApi } from '../movieApi.js';

const emptyMovie = { title: '', year: '', poster: '' };

function Create() {
  // Group the three form values in a single state object.
  const [movie, setMovie] = useState(emptyMovie);
  // Store the feedback text and its type together.
  // A null result means there is nothing to announce yet.
  const [result, setResult] = useState(null);
  const [isSending, setIsSending] = useState(false);

  function updateMovie(event) {
    // Each input's name tells this shared handler which property to update.
    const { name, value } = event.target;
    // Change one field without clearing the other two.
    setMovie((current) => ({ ...current, [name]: value }));
    // A changed value makes the last confirmation out of date.
    setResult(null);
  }

  function submitMovie(event) {
    // Leave the browser on Create and send the request from this handler.
    // The POST belongs to a button click, so it should not run in an effect.
    event.preventDefault();
    if (isSending) return;

    // Remove extra spaces from the text fields before making the request.
    // Keep the year as a string, like the years in the starter data.
    const details = {
      title: movie.title.trim(),
      year: movie.year,
      poster: movie.poster.trim()
    };
    setResult(null);
    setIsSending(true);

    movieApi.post('/api/movies', details)
      .then(({ data }) => {
        // Clear the form after a successful response.
        // Use the returned title so feedback matches what was saved.
        setMovie(emptyMovie);
        setResult({ error: false, text: `Added ${data.Title}.` });
      })
      .catch((error) => {
        // A network failure has no response body to read.
        // Show a fallback message and let the user try again.
        setResult({ error: true, text: error.response?.data?.error || 'The movie could not be saved. Is the API running?' });
      })
      .finally(() => setIsSending(false));
  }

  return (
    <section className="movie-form">
      <h2 className="mb-4">This is my Create Component.</h2>
      <form onSubmit={submitMovie}>
        {/* Lock the fields while the POST is pending to prevent repeat clicks. */}
        <fieldset disabled={isSending}>
          {/* React supplies the value, and updateMovie handles typing. */}
          <div className="mb-3">
            <label className="form-label" htmlFor="title">Add Movie Title:</label>
            <input className="form-control" id="title" name="title" type="text"
              value={movie.title} onChange={updateMovie} required maxLength={200}
              pattern=".*\S.*" title="Please provide the movie title." />
          </div>
          {/* Native number validation rejects fractional or out-of-range years. */}
          <div className="mb-3">
            <label className="form-label" htmlFor="year">Add Movie Year:</label>
            <input className="form-control" id="year" name="year" type="number"
              value={movie.year} onChange={updateMovie}
              min="1888" max="9999" step="1" required />
          </div>
          {/* The poster field takes an HTTP or HTTPS image link. */}
          <div className="mb-3">
            <label className="form-label" htmlFor="poster">Add Movie Poster:</label>
            <input className="form-control" id="poster" name="poster" type="url"
              value={movie.poster} onChange={updateMovie} required maxLength={2048}
              pattern="https?://.+" title="Use a full HTTP or HTTPS poster link." />
          </div>
          <button className="btn btn-dark" type="submit">{isSending ? 'Adding...' : 'Add Movie'}</button>
        </fieldset>
      </form>
      {/* Screen readers announce the response without changing focus. */}
      {result && <p role={result.error ? 'alert' : 'status'} className={result.error ? 'mt-3 mb-0 text-danger' : 'mt-3 mb-0'}>{result.text}</p>}
    </section>
  );
}

export default Create;
