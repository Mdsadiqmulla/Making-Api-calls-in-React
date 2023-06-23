import React, { useState, useEffect } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [retryInterval, setRetryInterval] = useState(null);

  useEffect(() => {
    if (retryCount > 0) {
      setError(`Something went wrong.... Retrying (${retryCount})`);
    }
  }, [retryCount]);

  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);
    setRetryCount(0);
    setRetryInterval(setInterval(fetchData, 5000)); // Retry every 5 seconds

    try {
      const response = await fetch('https://swapi.dev/api/films/');
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_data,
      }));

      setMovies(transformedMovies);
      clearInterval(retryInterval);
      setIsLoading(false);
    } catch (error) {
      clearInterval(retryInterval);
      setIsLoading(false);
      setError('Failed to fetch movies');
    }
  }

  function fetchData() {
    setRetryCount((prevCount) => prevCount + 1);
  }

  function cancelRetry() {
    clearInterval(retryInterval);
    setIsLoading(false);
    setError(null);
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} disabled={isLoading}>
          Fetch Movies
        </button>
        {isLoading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {retryCount > 0 && (
          <button onClick={cancelRetry} disabled={isLoading}>
            Cancel
          </button>
        )}
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;
