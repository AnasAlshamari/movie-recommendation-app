import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchPersonDetails, fetchPersonMovies, getImageUrl } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaFilm } from 'react-icons/fa';

const PersonMovies = () => {
    const { id } = useParams();
    const { lang } = useLanguage();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [details, credits] = await Promise.all([
                    fetchPersonDetails(id),
                    fetchPersonMovies(id, lang)
                ]);
                setPerson(details);

                const directedMovies = credits.crew.filter(c => c.job === 'Director');
                const actedMovies = credits.cast;
                const known = details.known_for_department;
                let allMovies = known === 'Directing' ? directedMovies : (actedMovies.length > 0 ? actedMovies : directedMovies);

                // Sort by popularity — no limit, show ALL movies
                allMovies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                const unique = [];
                const seen = new Set();
                for (const m of allMovies) {
                    if (!seen.has(m.id) && m.poster_path) {
                        seen.add(m.id);
                        unique.push(m);
                    }
                }
                setMovies(unique);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        load();
    }, [id, lang]);

    if (loading) return <Loader />;

    const backIcon = lang === 'ar' ? <FaArrowRight /> : <FaArrowLeft />;
    const roleLabel = person?.known_for_department === 'Directing'
        ? (lang === 'ar' ? 'مخرج' : 'Director')
        : (lang === 'ar' ? 'ممثل' : 'Actor');

    return (
        <div>
            <div style={{ position: 'relative', padding: '4rem 0 2rem', background: 'linear-gradient(180deg, rgba(14,165,233,0.06) 0%, var(--bg-dark) 100%)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate(-1)} style={{
                        position: 'absolute', top: '1.5rem', [lang === 'ar' ? 'right' : 'left']: '1.5rem',
                        background: 'rgba(0,0,0,0.5)', color: '#fff', width: '44px', height: '44px',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)', zIndex: 10
                    }}>{backIcon}</button>
                    <motion.img initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        src={getImageUrl(person?.profile_path, 'w300')} alt={person?.name}
                        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--glass-border)', boxShadow: 'var(--shadow-glow)', flexShrink: 0 }} />
                    <div>
                        <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '0.3rem' }}>{person?.name}</motion.h1>
                        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{roleLabel}</motion.p>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            <FaFilm /> {movies.length} {lang === 'ar' ? 'فيلم' : 'movies'}
                        </motion.div>
                    </div>
                </div>
            </div>
            <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>{lang === 'ar' ? 'الأفلام' : 'Filmography'}</h2>
                {movies.length > 0 ? (
                    <div className="grid-movies">
                        {movies.map((movie, i) => (
                            <motion.div key={movie.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.5), duration: 0.3 }}>
                                <MovieCard movie={movie} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>{lang === 'ar' ? 'لا توجد أفلام.' : 'No movies found.'}</p>
                )}
            </div>
        </div>
    );
};

export default PersonMovies;
