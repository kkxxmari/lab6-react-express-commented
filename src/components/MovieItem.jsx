import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';

// I receive one movie object from Movies for this card.
function MovieItem({ movie }) {
  // I remember whether the image failed for this particular card.
  const [imageError, setImageError] = useState(false);
  // I also check for N/A because it is not a usable image link.
  const showPoster = movie.Poster && movie.Poster !== 'N/A' && !imageError;

  // I log the movie when the card mounts or receives a different movie object.
  useEffect(() => {
    console.log('Movie details:', movie);
  }, [movie]);

  return (
    // I use Bootstrap Card to keep all the movie cards styled the same way.
    <Card className="h-100">
      {/* I read Title with a capital T because that is how the API names it. */}
      <Card.Header as="h3" className="h5">{movie.Title}</Card.Header>
      <Card.Body>
        {/* I still show the title and year if the poster is missing. */}
        {showPoster ? (
          // I switch to the fallback text when the browser cannot load the image.
          <img className="movie-poster" src={movie.Poster} alt={movie.Title}
            width="300" height="450" loading="lazy" onError={() => setImageError(true)} />
        ) : (
          <p className="missing-poster">No poster available</p>
        )}
      </Card.Body>
      {/* I put the release year at the bottom of the card. */}
      <Card.Footer>{movie.Year}</Card.Footer>
    </Card>
  );
}

export default MovieItem;
