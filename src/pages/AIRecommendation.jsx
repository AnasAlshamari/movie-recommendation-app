import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getAIRecommendations } from '../services/aiRecommendation';
import { fetchSearch, getImageUrl } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { FaSearch, FaMagic } from 'react-icons/fa';

const AIRecommendation = () => {
    const { lang, t } = useLanguage();
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingRecs, setLoadingRecs] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim().length > 2) {
                performSearch();
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, lang]);

    const performSearch = async () => {
        setLoadingSearch(true);
        try {
            const results = await fetchSearch(query, lang);
            setSearchResults(results.slice(0, 5)); // Top 5 relevant
        } catch (e) {
            console.error(e);
        }
        setLoadingSearch(false);
    };

    const handleSelectMovie = async (movie) => {
        setSelectedMovie(movie);
        setQuery('');
        setSearchResults([]);
        setLoadingRecs(true);
        try {
            const recs = await getAIRecommendations(movie.id, lang);
            setRecommendations(recs);
        } catch (e) {
            console.error(e);
        }
        setLoadingRecs(false);
    };

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                    <FaMagic /> {t('ai_recommendation')}
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>
                    {lang === 'ar'
                        ? 'ابحث عن فيلم تحبه وسنقوم باقتراح أفلام مشابهة باستخدام تقنيات الذكاء الاصطناعي بناءً على القصة والتصنيف والمزيد.'
                        : 'Search for a movie you love and we will suggest similar ones using our recommendation engine based on plots, genres, and more.'}
                </p>

                <div style={{ position: 'relative', marginTop: '2rem' }}>
                    <div style={{ display: 'flex', position: 'relative' }}>
                        <span style={{
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            [lang === 'ar' ? 'right' : 'left']: '1rem',
                            color: 'var(--text-muted)'
                        }}>
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            placeholder={t('search')}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 3rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)',
                                color: '#fff',
                                fontSize: '1.1rem',
                                outline: 'none',
                                boxShadow: 'var(--shadow-glow)'
                            }}
                        />
                    </div>

                    {/* Autocomplete Dropdown */}
                    {(searchResults.length > 0 || loadingSearch) && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'var(--bg-card)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            marginTop: '0.5rem',
                            overflow: 'hidden',
                            zIndex: 10,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                        }}>
                            {loadingSearch ? (
                                <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>{t('loading')}</div>
                            ) : (
                                searchResults.map(movie => (
                                    <div
                                        key={movie.id}
                                        onClick={() => handleSelectMovie(movie)}
                                        style={{
                                            padding: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid var(--glass-border)',
                                            transition: 'var(--transition)'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = 'var(--glass-bg)'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <img
                                            src={getImageUrl(movie.poster_path, 'w92')}
                                            alt={movie.title}
                                            style={{ width: '40px', height: '60px', borderRadius: '4px', objectFit: 'cover' }}
                                        />
                                        <div style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                            <h4 style={{ margin: 0 }}>{movie.title || movie.name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {(movie.release_date || movie.first_air_date || '').substring(0, 4)} • ★ {movie.vote_average?.toFixed(1)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Movie & Recommendations */}
            {selectedMovie && (
                <div className="animate-fade-in" style={{ marginTop: '4rem' }}>
                    <h3 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                        {t('similar_movies')} <span style={{ color: 'var(--primary-color)' }}>"{selectedMovie.title || selectedMovie.name}"</span>
                    </h3>

                    {loadingRecs ? (
                        <Loader />
                    ) : (
                        recommendations.length > 0 ? (
                            <div className="grid-movies">
                                {recommendations.map(movie => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                                {t('no_movies')}
                            </p>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default AIRecommendation;
