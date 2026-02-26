import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMovie } from '../context/MovieContext';
import { fetchSearch, fetchGenres, fetchDiscover } from '../services/tmdb';
import MovieCard from './MovieCard';
import Loader from './Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaSlidersH, FaTimes, FaStar, FaCalendar, FaFilm, FaEye } from 'react-icons/fa';

const SmartSearch = () => {
    const { lang } = useLanguage();
    const { isWatched } = useMovie();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [yearFrom, setYearFrom] = useState('');
    const [yearTo, setYearTo] = useState('');
    const [minRating, setMinRating] = useState('');
    const [watchStatus, setWatchStatus] = useState('all');
    const [activeMode, setActiveMode] = useState('search');

    useEffect(() => { fetchGenres(lang).then(setGenres).catch(console.error); }, [lang]);

    // Debounced text search
    useEffect(() => {
        if (query.trim().length < 2) { if (activeMode === 'search') setResults([]); return; }
        setActiveMode('search');
        const timeout = setTimeout(async () => {
            setSearching(true);
            try {
                const data = await fetchSearch(query, lang);
                // Sort by popularity first, then by rating
                data.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                setResults(applyLocalFilters(data));
            } catch (e) { console.error(e); }
            setSearching(false);
        }, 400);
        return () => clearTimeout(timeout);
    }, [query, lang]);

    const runDiscover = useCallback(async () => {
        if (query.trim().length >= 2) return;
        setActiveMode('discover');
        setSearching(true);
        try {
            // Sort by popularity.desc to get well-known movies first
            const data = await fetchDiscover({ lang, genre: selectedGenre, yearFrom, yearTo, minRating, sortBy: 'popularity.desc' });
            setResults(applyLocalFilters(data));
        } catch (e) { console.error(e); }
        setSearching(false);
    }, [lang, selectedGenre, yearFrom, yearTo, minRating, query, watchStatus]);

    const applyLocalFilters = (movies) => {
        let filtered = movies;
        if (watchStatus === 'watched') filtered = filtered.filter(m => isWatched(m.id));
        if (watchStatus === 'unwatched') filtered = filtered.filter(m => !isWatched(m.id));
        return filtered;
    };

    const handleApplyFilters = () => { runDiscover(); };
    const clearFilters = () => { setSelectedGenre(''); setYearFrom(''); setYearTo(''); setMinRating(''); setWatchStatus('all'); setResults([]); setActiveMode('search'); };
    const hasActiveFilters = selectedGenre || yearFrom || yearTo || minRating || watchStatus !== 'all';

    const selectStyle = { padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '0.9rem', outline: 'none', flex: 1, minWidth: '120px', transition: 'var(--transition)' };

    return (
        <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem', maxWidth: '700px', margin: '0 auto 1rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [lang === 'ar' ? 'right' : 'left']: '1rem', color: 'var(--text-muted)', pointerEvents: 'none' }}><FaSearch /></span>
                    <input type="text" placeholder={lang === 'ar' ? 'ابحث عن فيلم...' : 'Search for a movie...'} value={query} onChange={(e) => setQuery(e.target.value)}
                        style={{ width: '100%', padding: lang === 'ar' ? '0.9rem 2.8rem 0.9rem 1rem' : '0.9rem 1rem 0.9rem 2.8rem', borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'var(--transition)' }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'} onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'} />
                </div>
                <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.9rem 1.2rem', borderRadius: 'var(--radius-lg)', background: hasActiveFilters ? 'var(--primary-color)' : 'var(--glass-bg)', color: '#fff', border: '1px solid var(--glass-border)', fontSize: '0.9rem', transition: 'var(--transition)', flexShrink: 0 }}>
                    <FaSlidersH /> {lang === 'ar' ? 'فلاتر' : 'Filters'}
                </button>
            </div>

            <AnimatePresence>
                {showFilters && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', maxWidth: '700px', margin: '0 auto' }}>
                        <div style={{ padding: '1.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ flex: 1, minWidth: '130px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}><FaFilm size={11} /> {lang === 'ar' ? 'التصنيف' : 'Genre'}</label>
                                    <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} style={selectStyle}>
                                        <option value="">{lang === 'ar' ? 'الكل' : 'All'}</option>
                                        {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                    </select>
                                </div>
                                <div style={{ flex: 1, minWidth: '90px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}><FaCalendar size={11} /> {lang === 'ar' ? 'من سنة' : 'From'}</label>
                                    <input type="number" min="1900" max="2026" placeholder="2010" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} style={selectStyle} />
                                </div>
                                <div style={{ flex: 1, minWidth: '90px' }}>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem', display: 'block' }}>{lang === 'ar' ? 'إلى سنة' : 'To'}</label>
                                    <input type="number" min="1900" max="2026" placeholder="2025" value={yearTo} onChange={(e) => setYearTo(e.target.value)} style={selectStyle} />
                                </div>
                                <div style={{ flex: 1, minWidth: '100px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}><FaStar size={11} /> {lang === 'ar' ? 'التقييم' : 'Rating'}</label>
                                    <select value={minRating} onChange={(e) => setMinRating(e.target.value)} style={selectStyle}>
                                        <option value="">{lang === 'ar' ? 'الكل' : 'Any'}</option>
                                        <option value="5">5+</option><option value="6">6+</option><option value="7">7+</option><option value="8">8+</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1, minWidth: '120px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}><FaEye size={11} /> {lang === 'ar' ? 'المشاهدة' : 'Status'}</label>
                                    <select value={watchStatus} onChange={(e) => setWatchStatus(e.target.value)} style={selectStyle}>
                                        <option value="all">{lang === 'ar' ? 'الكل' : 'All'}</option>
                                        <option value="watched">{lang === 'ar' ? 'تم مشاهدتها' : 'Watched'}</option>
                                        <option value="unwatched">{lang === 'ar' ? 'لم تتم' : 'Unwatched'}</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                                <button onClick={handleApplyFilters} style={{ flex: 1, padding: '0.7rem', borderRadius: 'var(--radius-sm)', background: 'var(--primary-color)', color: '#fff', fontWeight: '600', fontSize: '0.9rem' }}>
                                    {lang === 'ar' ? '🔍 بحث' : '🔍 Apply'}
                                </button>
                                {hasActiveFilters && (
                                    <button onClick={clearFilters} style={{ padding: '0.7rem 1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <FaTimes size={12} /> {lang === 'ar' ? 'مسح' : 'Clear'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {searching && <Loader />}
            {!searching && results.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>{results.length} {lang === 'ar' ? 'نتيجة' : 'results'}</p>
                    <div className="grid-movies">{results.map(m => <MovieCard key={m.id} movie={m} />)}</div>
                </motion.div>
            )}
            {!searching && results.length === 0 && (query.trim().length >= 2 || activeMode === 'discover') && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'لم يتم العثور على أفلام.' : 'No movies found.'}</div>
            )}
        </div>
    );
};

export default SmartSearch;
