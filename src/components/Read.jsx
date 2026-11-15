import { useEffect, useState } from 'react';
import { movieApi } from '../movieApi.js';
import Movies from './Movies.jsx';

function Read() {
  // I start with an empty array while I wait for the server movies.
  const [movies, setMovies] = useState([]);
  // I show loading until the request has finished.
  const [isLoading, setIsLoading] = useState(true);
  // I keep any request error separate from the movie list.
  const [message, setMessage] = useState('');

  useEffect(() => {
    // I create a controller so I can cancel the request when I leave this page.
    const request = new AbortController();

    async function loadMovies() {
      try {
        // I wait here for the GET request to finish before reading its result.
        const result = await movieApi.get('/api/movies', {
          // I connect this request to the controller used in cleanup.
          signal: request.signal
        });
        // I get the movies property from the JSON sent by Express.
        // I check that it really is an array before trying to display the cards.
        const movieList = result.data?.movies;
        if (!Array.isArray(movieList)) {
          // I use the same error path if the response has the wrong shape.
          throw new Error('Expected an array of movies.');
        }
        // I save the array in state so React can pass it down to Movies.
        if (!request.signal.aborted) setMovies(movieList);
      } catch {
        // I ignore cancellation because leaving the page is not a server error.
        if (!request.signal.aborted) {
          setMessage('Movies are unavailable at the moment. Please try again later.');
        }
      } finally {
        // I finish loading whether the request worked or failed.
        if (!request.signal.aborted) setIsLoading(false);
      }
    }

    // I fetch again when Read opens, including when I return from Create.
    // I get the latest list from the server instead of sharing form state.
    loadMovies();
    // I cancel any request still running when this component unmounts.
    return () => request.abort();
  }, []); // I use an empty dependency list to fetch on mount.

  // I choose what to display based on loading, errors and the movie count.
  let content;
  if (isLoading) {
    content = <p role="status">Loading the movie list...</p>;
  } else if (message) {
    content = <p role="alert" className="text-danger">{message}</p>;
  } else if (movies.length === 0) {
    content = <p>There are no movies to display.</p>;
  } else {
    // I only render the cards once I have a nonempty list.
    content = <Movies movies={movies} />;
  }

  return (
    <section>
      <h2 className="mb-4">This is my Read Component.</h2>
      {/* I keep the heading visible whichever result is displayed below it. */}
      {content}
    </section>
  );
}

export default Read;
