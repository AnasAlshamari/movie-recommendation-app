import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useMovie } from '../context/MovieContext';
import { fetchMovieDetails, fetchMovieCredits, getImageUrl } from '../services/tmdb';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import { FaStar, FaClock, FaCalendar, FaHeart, FaRegHeart, FaListUl, FaCheck, FaEye, FaRegEye, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const MovieDetails = () => {
    const { id } = useParams();
    const { lang, t } = useLanguage();
    const { toggleWatchlist, toggleFavorite, toggleWatched, isInWatchlist, isInFavorites, isWatched } = useMovie();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [details, creds] = await Promise.all([
                    fetchMovieDetails(id, lang),
                    fetchMovieCredits(id)
                ]);
                setMovie(details);
                setCredits(creds);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        load();
    }, [id, lang]);

    if (loading) return <Loader />;
    if (!movie) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>{t('error')}</div>;

    const backIcon = lang === 'ar' ? <FaArrowRight /> : <FaArrowLeft />;

    return (
        <div>
            {/* Backdrop Hero */}
            <div style={{ position: 'relative', minHeight: '55vh', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})`, backgroundSize: 'cover', backgroundPosition: 'center top', zIndex: -2 }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(5,11,20,0.3) 0%, rgba(5,11,20,1) 100%)', zIndex: -1 }} />

                <button onClick={() => navigate(-1)} style={{
                    position: 'absolute', top: '1.5rem', [lang === 'ar' ? 'right' : 'left']: '1.5rem',
                    background: 'rgba(0,0,0,0.5)', color: '#fff', width: '44px', height: '44px',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)', zIndex: 10
                }}>
                    {backIcon}
                </button>

                <div className="container" style={{ padding: '2rem 1.5rem', position: 'relative', zIndex: 1, display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <motion.img
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        src={getImageUrl(movie.poster_path, 'w500')} alt={movie.title}
                        style={{ width: 'clamp(140px, 28vw, 240px)', borderRadius: 'var(--radius-md)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', border: '2px solid var(--glass-border)', flexShrink: 0 }}
                    />
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} style={{ flex: 1, minWidth: '250px' }}>
                        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', marginBottom: '0.5rem' }}>{movie.title}</h1>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24' }}><FaStar /> {movie.vote_average?.toFixed(1)}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FaCalendar /> {movie.release_date?.substring(0, 4)}</span>
                            {movie.runtime > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FaClock /> {movie.runtime} {lang === 'ar' ? 'دقيقة' : 'min'}</span>}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            {movie.genres?.map(g => (
                                <span key={g.id} style={{ padding: '0.25rem 0.7rem', borderRadius: 'var(--radius-full)', background: 'rgba(14,165,233,0.12)', color: 'var(--primary-color)', fontSize: '0.85rem', border: '1px solid rgba(14,165,233,0.2)' }}>{g.name}</span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button onClick={() => toggleWatchlist(movie)} className="detail-action-btn" style={{ background: isInWatchlist(movie.id) ? 'var(--primary-color)' : 'rgba(255,255,255,0.08)' }}>
                                {isInWatchlist(movie.id) ? <FaCheck /> : <FaListUl />} {isInWatchlist(movie.id) ? t('added_watchlist') : t('add_watchlist')}
                            </button>
                            <button onClick={() => toggleWatched(movie)} className="detail-action-btn" style={{ background: isWatched(movie.id) ? 'rgba(16,185,129,0.9)' : 'rgba(255,255,255,0.08)' }}>
                                {isWatched(movie.id) ? <FaEye /> : <FaRegEye />} {lang === 'ar' ? 'تم المشاهدة' : 'Watched'}
                            </button>
                            <button onClick={() => toggleFavorite(movie)} className="detail-action-btn" style={{ background: isInFavorites(movie.id) ? 'var(--accent-color)' : 'rgba(255,255,255,0.08)' }}>
                                {isInFavorites(movie.id) ? <FaHeart /> : <FaRegHeart />} {t('add_favorite')}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Details Body */}
            <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
                {movie.overview && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: '3rem' }}>
                        <h2 style={{ marginBottom: '0.8rem', fontSize: '1.4rem' }}>{lang === 'ar' ? 'القصة' : 'Story'}</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.9, fontSize: '1.05rem', maxWidth: '800px' }}>{movie.overview}</p>
                    </motion.div>
                )}

                {/* Director — CLICKABLE */}
                {credits?.director && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginBottom: '3rem' }}>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>{lang === 'ar' ? 'المخرج' : 'Director'}</h2>
                        <Link to={`/person/${credits.director.id}`} className="credit-link">
                            <img src={getImageUrl(credits.director.profile_path, 'w185')} alt={credits.director.name}
                                style={{ width: '65px', height: '65px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--glass-border)', transition: 'var(--transition)' }} />
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{credits.director.name}</h3>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{lang === 'ar' ? 'اضغط لعرض أفلامه' : 'Click to see their movies'}</p>
                            </div>
                        </Link>
                    </motion.div>
                )}

                {/* Cast — CLICKABLE */}
                {credits?.actors?.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>{lang === 'ar' ? 'طاقم التمثيل' : 'Main Cast'}</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1.5rem' }}>
                            {credits.actors.map(actor => (
                                <Link to={`/person/${actor.id}`} key={actor.id} className="credit-card">
                                    <img src={getImageUrl(actor.profile_path, 'w185')} alt={actor.name}
                                        style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.6rem', border: '2px solid var(--glass-border)', display: 'block', transition: 'var(--transition)' }} />
                                    <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', textAlign: 'center' }}>{actor.name}</p>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>{actor.character}</p>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            <style>{`
        .detail-action-btn {
          padding: 0.65rem 1rem; border-radius: var(--radius-sm);
          color: #fff; display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.88rem; border: 1px solid var(--glass-border);
          transition: var(--transition);
        }
        .detail-action-btn:hover { transform: translateY(-2px); }
        .credit-link {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem; border-radius: var(--radius-sm);
          background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border);
          transition: var(--transition); max-width: 350px;
        }
        .credit-link:hover {
          background: rgba(14,165,233,0.08); border-color: var(--primary-color);
        }
        .credit-link:hover img { border-color: var(--primary-color); }
        .credit-card {
          padding: 1rem 0.5rem; border-radius: var(--radius-sm);
          transition: var(--transition);
        }
        .credit-card:hover { transform: translateY(-4px); }
        .credit-card:hover img { border-color: var(--primary-color); box-shadow: 0 0 15px rgba(14,165,233,0.3); }
      `}</style>
        </div>
    );
};

export default MovieDetails;
