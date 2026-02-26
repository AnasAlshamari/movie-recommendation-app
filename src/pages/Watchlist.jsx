import React from 'react';
import { useMovie } from '../context/MovieContext';
import { useLanguage } from '../context/LanguageContext';
import MovieCard from '../components/MovieCard';

const Watchlist = () => {
    const { watchlist } = useMovie();
    const { t } = useLanguage();

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
            <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ color: 'var(--primary-color)' }}>📺</span> {t('watchlist')}
            </h2>

            {watchlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>{t('no_movies')}</p>
                </div>
            ) : (
                <div className="grid-movies">
                    {watchlist.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Watchlist;
