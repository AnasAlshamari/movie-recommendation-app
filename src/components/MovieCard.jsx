import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovie } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getImageUrl } from '../services/tmdb';
import { FaHeart, FaRegHeart, FaListUl, FaCheck, FaEye, FaRegEye, FaTimes, FaSignInAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MovieCard = ({ movie, hideActions = false }) => {
    const { toggleWatchlist, toggleFavorite, toggleWatched, isInWatchlist, isInFavorites, isWatched } = useMovie();
    const { user } = useAuth();
    const { lang, t } = useLanguage();
    const navigate = useNavigate();
    const [showGuestModal, setShowGuestModal] = useState(false);

    const title = movie.title || movie.name || 'Unknown Title';
    const isFav = isInFavorites(movie.id);
    const isWatch = isInWatchlist(movie.id);
    const watched = isWatched(movie.id);
    const releaseYear = (movie.release_date || movie.first_air_date || 'N/A').substring(0, 4);

    const handleCardClick = (e) => {
        if (e.target.closest('button')) return;
        navigate(`/movie/${movie.id}`);
    };

    const handleAction = (actionFn, e) => {
        e.stopPropagation();
        if (!user) {
            setShowGuestModal(true);
            return;
        }
        actionFn(movie);
    };

    return (
        <>
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
                        <div className="movie-card-actions" style={{ display: 'flex', gap: '0.3rem', marginTop: 'auto' }}>
                            <button
                                className="action-btn-main"
                                onClick={(e) => handleAction(toggleWatchlist, e)}
                                style={{
                                    flex: 1, padding: '0.45rem 0.3rem',
                                    borderRadius: 'var(--radius-sm)',
                                    background: isWatch ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                                    color: isWatch ? '#fff' : 'var(--text-main)',
                                    border: '1px solid var(--glass-border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: '0.25rem', fontSize: '0.75rem', transition: 'var(--transition)',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                }}
                            >
                                {isWatch ? <FaCheck style={{ flexShrink: 0 }} size={10} /> : <FaListUl style={{ flexShrink: 0 }} size={10} />}
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{isWatch ? t('added_watchlist') : t('add_watchlist')}</span>
                            </button>
                            <button
                                className="action-btn-icon"
                                onClick={(e) => handleAction(toggleWatched, e)}
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
                                className="action-btn-icon"
                                onClick={(e) => handleAction(toggleFavorite, e)}
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

            {/* Guest Modal */}
            <AnimatePresence>
                {showGuestModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowGuestModal(false)}
                            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000 }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            style={{
                                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                background: 'rgba(15,23,42,0.97)', backdropFilter: 'blur(20px)',
                                border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                                padding: '2.5rem', maxWidth: '420px', width: '90%', zIndex: 1001, textAlign: 'center'
                            }}
                        >
                            <button onClick={() => setShowGuestModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)', padding: '0.3rem' }}>
                                <FaTimes size={18} />
                            </button>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                            <p style={{ color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                                {t('guest_save_prompt')}
                            </p>
                            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button onClick={() => { setShowGuestModal(false); navigate('/auth'); }}
                                    style={{
                                        background: 'var(--primary-color)', color: '#fff', padding: '0.8rem 1.5rem',
                                        borderRadius: 'var(--radius-sm)', fontWeight: '600', fontSize: '0.95rem',
                                        display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'var(--transition)'
                                    }}>
                                    <FaSignInAlt /> {t('login')} / {t('register')}
                                </button>
                                <button onClick={() => setShowGuestModal(false)}
                                    style={{
                                        background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)', padding: '0.8rem 1.5rem',
                                        borderRadius: 'var(--radius-sm)', fontWeight: '600', fontSize: '0.95rem',
                                        border: '1px solid var(--glass-border)', transition: 'var(--transition)'
                                    }}>
                                    {t('close')}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default MovieCard;
