import React from 'react';
import { useMovie } from '../context/MovieContext';
import { useLanguage } from '../context/LanguageContext';
import MovieCard from '../components/MovieCard';

const Favorites = () => {
    const { favorites } = useMovie();
    const { t } = useLanguage();

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
            <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ color: 'var(--accent-color)' }}>❤️</span> {t('favorites')}
            </h2>

            {favorites.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>{t('no_movies')}</p>
                </div>
            ) : (
                <div className="grid-movies">
                    {favorites.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
