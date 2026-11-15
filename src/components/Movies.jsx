// I import the card component so I can reuse it for every movie.
import MovieItem from './MovieItem.jsx';

function Movies({ movies }) {
  // I take the movies array from the props passed in by Read.
  return (
    <div className="movie-list">
      {/* I use movie-list to arrange the cards with the grid in App.css. */}
      {/* I make one MovieItem for each movie in the array. */}
      {/* I use imdbID as the key so React can keep track of each card. */}
      {/* I pass the full movie object down instead of splitting up its fields. */}
      {movies.map((movie) => (
        <MovieItem key={movie.imdbID} movie={movie} />
      ))}
    </div>
  );
}

export default Movies;
