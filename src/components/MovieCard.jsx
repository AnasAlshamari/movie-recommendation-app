import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovie } from '../context/MovieContext';
import { useLanguage } from '../context/LanguageContext';
import { getImageUrl } from '../services/tmdb';
import { FaHeart, FaRegHeart, FaListUl, FaCheck, FaEye, FaRegEye } from 'react-icons/fa';

const MovieCard = ({ movie, hideActions = false }) => {
    const { toggleWatchlist, toggleFavorite, toggleWatched, isInWatchlist, isInFavorites, isWatched } = useMovie();
    const { lang, t } = useLanguage();
    const navigate = useNavigate();

    const title = movie.title || movie.name || 'Unknown Title';
    const isFav = isInFavorites(movie.id);
    const isWatch = isInWatchlist(movie.id);
    const watched = isWatched(movie.id);
    const releaseYear = (movie.release_date || movie.first_air_date || 'N/A').substring(0, 4);

    const handleCardClick = (e) => {
        // Don't navigate if user clicked a button
        if (e.target.closest('button')) return;
        navigate(`/movie/${movie.id}`);
    };

    return (
        <div className="movie-card" onClick={handleCardClick} style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            position: 'relative',
            transition: 'var(--transition)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            cursor: 'pointer'
        }}>
            <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
                <img
                    src={getImageUrl(movie.poster_path)}
                    alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="poster-img"
                />
                <div style={{
                    position: 'absolute', top: '0.5rem', right: '0.5rem',
                    background: 'rgba(0,0,0,0.7)', padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-sm)', fontWeight: '700',
                    color: '#fbbf24', fontSize: '0.85rem', backdropFilter: 'blur(4px)'
                }}>
                    ★ {movie.vote_average?.toFixed(1) || 'NR'}
                </div>
                {watched && (
                    <div style={{
                        position: 'absolute', top: '0.5rem', left: '0.5rem',
                        background: 'rgba(16,185,129,0.9)', padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)', fontWeight: '600',
                        color: '#fff', fontSize: '0.7rem', backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', gap: '0.3rem'
                    }}>
                        <FaEye size={10} /> {lang === 'ar' ? 'تم' : 'Watched'}
                    </div>
                )}
            </div>

            <div style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.2rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                    {releaseYear}
                </p>

                {!hideActions && (
                    <div style={{ display: 'flex', gap: '0.3rem', marginTop: 'auto' }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleWatchlist(movie); }}
                            style={{
                                flex: 1, padding: '0.45rem 0.3rem',
                                borderRadius: 'var(--radius-sm)',
                                background: isWatch ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                                color: isWatch ? '#fff' : 'var(--text-main)',
                                border: '1px solid var(--glass-border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '0.25rem', fontSize: '0.75rem', transition: 'var(--transition)'
                            }}
                        >
                            {isWatch ? <FaCheck size={10} /> : <FaListUl size={10} />}
                            {isWatch ? t('added_watchlist') : t('add_watchlist')}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleWatched(movie); }}
                            style={{
                                width: '34px', height: '34px',
                                borderRadius: 'var(--radius-sm)',
                                background: watched ? 'rgba(16,185,129,0.9)' : 'rgba(255,255,255,0.05)',
                                color: '#fff', border: '1px solid var(--glass-border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.9rem', transition: 'var(--transition)', flexShrink: 0
                            }}
                            title={lang === 'ar' ? 'تم المشاهدة' : 'Mark Watched'}
                        >
                            {watched ? <FaEye size={13} /> : <FaRegEye size={13} />}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(movie); }}
                            style={{
                                width: '34px', height: '34px',
                                borderRadius: 'var(--radius-sm)',
                                background: isFav ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                                color: '#fff', border: '1px solid var(--glass-border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.9rem', transition: 'var(--transition)', flexShrink: 0
                            }}
                        >
                            {isFav ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        .movie-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
          border-color: var(--primary-color);
        }
        .movie-card:hover .poster-img {
          transform: scale(1.05);
        }
      `}</style>
        </div>
    );
};

export default MovieCard;
