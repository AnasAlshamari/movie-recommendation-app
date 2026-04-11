import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchDiscover } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Genre label map (matches Home.jsx's GENRE_SECTIONS + extras)
const GENRE_LABELS = {
    28: { en: 'Action', ar: 'أكشن' },
    12: { en: 'Adventure', ar: 'مغامرة' },
    16: { en: 'Animation', ar: 'رسوم متحركة' },
    35: { en: 'Comedy', ar: 'كوميديا' },
    80: { en: 'Crime', ar: 'جريمة' },
    99: { en: 'Documentary', ar: 'وثائقي' },
    18: { en: 'Drama', ar: 'دراما' },
    10751: { en: 'Family', ar: 'عائلي' },
    14: { en: 'Fantasy', ar: 'فانتازيا' },
    36: { en: 'History', ar: 'تاريخي' },
    27: { en: 'Horror', ar: 'رعب' },
    10402: { en: 'Music', ar: 'موسيقى' },
    9648: { en: 'Mystery', ar: 'غموض' },
    10749: { en: 'Romance', ar: 'رومانسي' },
    878: { en: 'Sci-Fi', ar: 'خيال علمي' },
    53: { en: 'Thriller', ar: 'إثارة' },
    10752: { en: 'War', ar: 'حرب' },
    37: { en: 'Western', ar: 'غربي' },
};

const CategoryMovies = () => {
    const { id } = useParams();
    const { lang, t } = useLanguage();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const genreId = parseInt(id);
    const genreLabel = GENRE_LABELS[genreId]
        ? (lang === 'ar' ? GENRE_LABELS[genreId].ar : GENRE_LABELS[genreId].en)
        : (lang === 'ar' ? 'أفلام' : 'Movies');

    // Load initial 3 pages
    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            setMovies([]);
            setPage(1);
            setHasMore(true);
            try {
                const pages = await Promise.all([
                    fetchDiscover({ lang, genre: genreId, sortBy: 'popularity.desc', page: 1 }),
                    fetchDiscover({ lang, genre: genreId, sortBy: 'popularity.desc', page: 2 }),
                    fetchDiscover({ lang, genre: genreId, sortBy: 'popularity.desc', page: 3 }),
                ]);
                const all = pages.flat();
                // Deduplicate
                const seen = new Set();
                const unique = all.filter(m => {
                    if (seen.has(m.id)) return false;
                    seen.add(m.id);
                    return true;
                });
                setMovies(unique);
                setPage(4);
                if (pages[2].length === 0) setHasMore(false);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        loadInitial();
    }, [genreId, lang]);

    const loadMore = async () => {
        setLoadingMore(true);
        try {
            const results = await fetchDiscover({ lang, genre: genreId, sortBy: 'popularity.desc', page });
            if (results.length === 0) {
                setHasMore(false);
            } else {
                setMovies(prev => {
                    const ids = new Set(prev.map(m => m.id));
                    const newOnes = results.filter(m => !ids.has(m.id));
                    return [...prev, ...newOnes];
                });
                setPage(prev => prev + 1);
            }
        } catch (err) { console.error(err); }
        setLoadingMore(false);
    };

    const backIcon = lang === 'ar' ? <FaArrowRight /> : <FaArrowLeft />;

    if (loading) return <Loader />;

    return (
        <div>
            {/* Header */}
            <div style={{ padding: '2rem 0 1rem', background: 'linear-gradient(180deg, rgba(14,165,233,0.06) 0%, var(--bg-dark) 100%)' }}>
                <div className="container">
                    <div style={{ marginBottom: '1rem' }}>
                        <button onClick={() => navigate(-1)} style={{
                            background: 'rgba(0,0,0,0.5)', color: '#fff', width: '44px', height: '44px',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)'
                        }}>{backIcon}</button>
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
                        {genreLabel}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {movies.length} {lang === 'ar' ? 'فيلم' : 'movies'}
                    </p>
                </div>
            </div>

            {/* Movies grid */}
            <div className="container" style={{ padding: '1rem 1.5rem 4rem' }}>
                {movies.length > 0 ? (
                    <>
                        <div className="grid-movies">
                            {movies.map((movie, i) => (
                                <motion.div key={movie.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.015, 0.4), duration: 0.3 }}>
                                    <MovieCard movie={movie} />
                                </motion.div>
                            ))}
                        </div>
                        {hasMore && (
                            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                <Button variant="primary" onClick={loadMore} disabled={loadingMore}
                                    style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}>
                                    {loadingMore ? t('loading') : t('load_more')}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>{t('no_movies')}</p>
                )}
            </div>
        </div>
    );
};

export default CategoryMovies;
