import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchTrending, fetchDiscover, getImageUrl } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import SmartSearch from '../components/SmartSearch';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaFire, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Horizontal scroll row with RTL-aware arrows
const HorizontalRow = ({ children, lang }) => {
    const ref = useRef(null);
    const isRtl = lang === 'ar';

    const scroll = (direction) => {
        if (!ref.current) return;
        // In RTL, the scroll axis is inverted — positive scrollLeft goes left visually
        const amount = 300;
        if (isRtl) {
            ref.current.scrollBy({ left: direction === 'next' ? -amount : amount, behavior: 'smooth' });
        } else {
            ref.current.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' });
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* "Previous" arrow — left side in LTR, right side in RTL */}
            <button onClick={() => scroll('prev')} className="scroll-arrow"
                style={{ [isRtl ? 'right' : 'left']: '-8px', top: '50%', transform: 'translateY(-50%)', position: 'absolute', zIndex: 10 }}>
                {isRtl ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
            <div ref={ref} className="hide-scrollbar"
                style={{ display: 'flex', gap: '1rem', overflowX: 'auto', scrollSnapType: 'x mandatory', padding: '0.5rem 0', scrollbarWidth: 'none', msOverflowStyle: 'none', direction: isRtl ? 'rtl' : 'ltr' }}>
                {children}
            </div>
            {/* "Next" arrow — right side in LTR, left side in RTL */}
            <button onClick={() => scroll('next')} className="scroll-arrow"
                style={{ [isRtl ? 'left' : 'right']: '-8px', top: '50%', transform: 'translateY(-50%)', position: 'absolute', zIndex: 10 }}>
                {isRtl ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
        </div>
    );
};

// Genre sections — NO emojis
const GENRE_SECTIONS = [
    { id: 28, en: 'Action', ar: 'أكشن' },
    { id: 35, en: 'Comedy', ar: 'كوميديا' },
    { id: 18, en: 'Drama', ar: 'دراما' },
    { id: 27, en: 'Horror', ar: 'رعب' },
    { id: 878, en: 'Sci-Fi', ar: 'خيال علمي' },
    { id: 10749, en: 'Romance', ar: 'رومانسي' },
];

const Home = () => {
    const { lang, t } = useLanguage();
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [genreMovies, setGenreMovies] = useState({});
    const [loading, setLoading] = useState(true);
    const [heroIndex, setHeroIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const trending = await fetchTrending(lang);
                setTrendingMovies(trending);

                const genreResults = {};
                await Promise.all(
                    GENRE_SECTIONS.map(async (g) => {
                        // Sort by vote_count.desc → most reviewed = most well-known/popular
                        const movies = await fetchDiscover({ lang, genre: g.id, sortBy: 'vote_count.desc' });
                        genreResults[g.id] = movies.slice(0, 20);
                    })
                );
                setGenreMovies(genreResults);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        load();
    }, [lang]);

    // Auto-cycle hero
    useEffect(() => {
        if (trendingMovies.length < 2) return;
        const interval = setInterval(() => {
            setHeroIndex(prev => (prev + 1) % Math.min(trendingMovies.length, 8));
        }, 6000);
        return () => clearInterval(interval);
    }, [trendingMovies]);

    if (loading) return <Loader />;
    if (!trendingMovies.length) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>{t('error')}</div>;

    const heroMovie = trendingMovies[heroIndex];

    return (
        <div>
            {/* Auto-Sliding Hero */}
            <div style={{ position: 'relative', height: '65vh', minHeight: '420px', display: 'flex', alignItems: 'center', padding: '0 5%', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                    <motion.div key={heroMovie.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${getImageUrl(heroMovie.backdrop_path, 'original')})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2 }} />
                </AnimatePresence>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(5,11,20,1) 0%, rgba(5,11,20,0.4) 50%, rgba(5,11,20,1) 100%)', zIndex: -1 }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(5,11,20,0) 0%, rgba(5,11,20,1) 100%)', zIndex: -1 }} />

                <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: 0 }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={heroMovie.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', marginBottom: '0.8rem', color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                                {heroMovie.title || heroMovie.name}
                            </h1>
                            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '600px' }}>
                                {heroMovie.overview || t('hero_subtitle')}
                            </p>
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <Button variant="primary" onClick={() => navigate(`/movie/${heroMovie.id}`)} style={{ padding: '0.8rem 1.8rem', color: '#fff' }}>
                                    <FaPlay style={{ color: '#fff' }} /> <span style={{ color: '#fff' }}>{lang === 'ar' ? 'تفاصيل الفيلم' : 'View Details'}</span>
                                </Button>
                                <span style={{ color: '#fbbf24', fontWeight: '700' }}>★ {heroMovie.vote_average?.toFixed(1)}</span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Hero Dots */}
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                    {trendingMovies.slice(0, 8).map((_, i) => (
                        <button key={i} onClick={() => setHeroIndex(i)}
                            style={{ width: i === heroIndex ? '28px' : '10px', height: '10px', borderRadius: '10px', background: i === heroIndex ? 'var(--primary-color)' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s ease', border: 'none' }} />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="container" style={{ padding: '3rem 1.5rem' }}>
                <SmartSearch />

                {/* Trending */}
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaFire style={{ color: '#f97316' }} /> {t('trending')}
                    </h2>
                    <HorizontalRow lang={lang}>
                        {trendingMovies.map(movie => (
                            <div key={movie.id} style={{ minWidth: '200px', maxWidth: '200px', scrollSnapAlign: 'start', flexShrink: 0 }}>
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </HorizontalRow>
                </div>

                {/* Genre Category Sections */}
                {GENRE_SECTIONS.map(genre => {
                    const movies = genreMovies[genre.id];
                    if (!movies || movies.length === 0) return null;
                    return (
                        <div key={genre.id} style={{ marginBottom: '3rem' }}>
                            <h2 style={{ marginBottom: '1rem', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}>
                                {lang === 'ar' ? genre.ar : genre.en}
                            </h2>
                            <HorizontalRow lang={lang}>
                                {movies.map(movie => (
                                    <div key={movie.id} style={{ minWidth: '200px', maxWidth: '200px', scrollSnapAlign: 'start', flexShrink: 0 }}>
                                        <MovieCard movie={movie} />
                                    </div>
                                ))}
                            </HorizontalRow>
                        </div>
                    );
                })}
            </div>

            <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .scroll-arrow {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(5,11,20,0.85); color: #fff; border: 1px solid var(--glass-border);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(8px); transition: var(--transition);
          opacity: 0.7; cursor: pointer;
        }
        .scroll-arrow:hover { opacity: 1; background: var(--primary-color); }
      `}</style>
        </div>
    );
};

export default Home;
