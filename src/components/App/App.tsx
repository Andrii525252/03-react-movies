import SearchBar from '../SearchBar/SearchBar';
import { Toaster, toast } from 'react-hot-toast';
import { useState } from 'react';
import type { Movie } from '../../types/movie';
import { SearchMovie } from '../../services/movieService';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import css from './App.module.css';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasError(false);
    setMovies([]);

    try {
      const data = await SearchMovie(query);

      if (data.length === 0) {
        toast.error('No movies found for your request.');
      }

      setMovies(data);
    } catch (error) {
      setHasError(true);
      toast.error('An error occurred while fetching movies.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  return (
    <div className={css.text}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" />
      {isLoading && <Loader />}
      {hasError && <ErrorMessage />}
      {!isLoading && !hasError && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
