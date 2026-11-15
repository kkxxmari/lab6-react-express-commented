import { useState } from 'react';
import { movieApi } from '../movieApi.js';

// I reuse these empty values when the form first opens and after a successful save.
const emptyMovie = { title: '', year: '', poster: '' };

function Create() {
  // I keep the title, year and poster together in one state object.
  const [movie, setMovie] = useState(emptyMovie);
  // I keep the feedback message and whether it is an error together.
  // I use null when I have no message to show yet.
  const [result, setResult] = useState(null);
  // I track the pending request to disable the form and change the button text.
  const [isSending, setIsSending] = useState(false);

  function updateMovie(event) {
    // I use the input name to work out which field I need to update.
    const { name, value } = event.target;
    // I copy the other values first so typing in one field does not erase them.
    setMovie((current) => ({ ...current, [name]: value }));
    // I clear the old message when someone starts editing the form again.
    setResult(null);
  }

  function submitMovie(event) {
    // I stop the usual form reload so I can send the data with Axios.
    // I send the POST from this submit handler rather than from useEffect.
    event.preventDefault();
    // I ignore another submission while the previous one is still pending.
    if (isSending) return;

    // I remove spaces at the start and end of the title and poster link.
    // I leave the year as a string to match the starter movie data.
    const details = {
      title: movie.title.trim(),
      year: movie.year,
      poster: movie.poster.trim()
    };
    setResult(null);
    // I mark the request as pending before sending it.
    setIsSending(true);

    // I send the three fields to the same API used by the Read page.
    movieApi.post('/api/movies', details)
      .then(({ data }) => {
        // I empty the inputs once the server has accepted the movie.
        // I use the title from the response in my confirmation message.
        setMovie(emptyMovie);
        setResult({ error: false, text: `Added ${data.Title}.` });
      })
      .catch((error) => {
        // I might not get a response at all if the server is switched off.
        // I show my own message if the server did not send an error message.
        setResult({ error: true, text: error.response?.data?.error || 'The movie could not be saved. Is the API running?' });
      })
      // I enable the form again after either success or failure.
      .finally(() => setIsSending(false));
  }

  return (
    <section className="movie-form">
      <h2 className="mb-4">This is my Create Component.</h2>
      <form onSubmit={submitMovie}>
        {/* I disable the form while I wait so the same movie is not sent twice. */}
        <fieldset disabled={isSending}>
          {/* I get this value from state and update it when the user types. */}
          <div className="mb-3">
            <label className="form-label" htmlFor="title">Add Movie Title:</label>
            <input className="form-control" id="title" name="title" type="text"
              value={movie.title} onChange={updateMovie} required maxLength={200}
              pattern=".*\S.*" title="Please provide the movie title." />
          </div>
          {/* I use the number input to check the year before sending the form. */}
          <div className="mb-3">
            <label className="form-label" htmlFor="year">Add Movie Year:</label>
            <input className="form-control" id="year" name="year" type="number"
              value={movie.year} onChange={updateMovie}
              min="1888" max="9999" step="1" required />
          </div>
          {/* I ask for a full web link here because the card needs an image address. */}
          <div className="mb-3">
            <label className="form-label" htmlFor="poster">Add Movie Poster:</label>
            <input className="form-control" id="poster" name="poster" type="url"
              value={movie.poster} onChange={updateMovie} required maxLength={2048}
              pattern="https?://.+" title="Use a full HTTP or HTTPS poster link." />
          </div>
          {/* I change the label while the server is handling the request. */}
          <button className="btn btn-dark" type="submit">{isSending ? 'Adding...' : 'Add Movie'}</button>
        </fieldset>
      </form>
      {/* I give the message a role so a screen reader can announce it too. */}
      {result && <p role={result.error ? 'alert' : 'status'} className={result.error ? 'mt-3 mb-0 text-danger' : 'mt-3 mb-0'}>{result.text}</p>}
    </section>
  );
}

export default Create;
