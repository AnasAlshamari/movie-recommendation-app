import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMovie } from '../context/MovieContext';
import { useLanguage } from '../context/LanguageContext';
import { getImageUrl } from '../services/tmdb';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaHeart, FaEye, FaBookmark, FaPen, FaCheck } from 'react-icons/fa';
import './Profile.css';

const DEFAULT_AVATARS = [
    '/avatars/man.png',
    '/avatars/woman.png',
    '/avatars/boy.png',
    '/avatars/girl.png'
];

const AVATAR_LABELS = {
    ar: ['رجل', 'امرأة', 'ولد', 'بنت'],
    en: ['Man', 'Woman', 'Boy', 'Girl']
};

/* ── Horizontal Movie Row ── */
const MovieRow = ({ movies, lang, navigate }) => {
    if (!movies || movies.length === 0) {
        return (
            <div className="profile-empty-state">
                {lang === 'ar' ? 'لا توجد أفلام بعد' : 'No movies yet'}
            </div>
        );
    }

    return (
        <div className="profile-movie-row">
            {movies.map((movie) => {
                const title = movie.title || movie.name || 'Unknown';
                const year = (movie.release_date || movie.first_air_date || '').substring(0, 4);
                return (
                    <motion.div
                        key={movie.id}
                        className="profile-movie-card"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <div style={{ overflow: 'hidden' }}>
                            <img
                                src={getImageUrl(movie.poster_path)}
                                alt={title}
                                className="profile-movie-poster"
                                loading="lazy"
                            />
                        </div>
                        <div className="profile-movie-info">
                            <p className="profile-movie-title">{title}</p>
                            {year && <p className="profile-movie-year">{year}</p>}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

/* ── Main Profile ── */
const Profile = () => {
    const { user, updateUserName } = useAuth();
    const { favorites, watchlist, watched } = useMovie();
    const { lang } = useLanguage();
    const navigate = useNavigate();

    const [avatar, setAvatar] = useState(localStorage.getItem('tawsyah_avatar') || DEFAULT_AVATARS[0]);
    const [showAvatarSelect, setShowAvatarSelect] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');

    useEffect(() => { localStorage.setItem('tawsyah_avatar', avatar); }, [avatar]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setAvatar(reader.result); setShowAvatarSelect(false); };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveName = () => {
        if (newName.trim()) updateUserName(newName.trim());
        setEditingName(false);
    };

    /* Section Config */
    const sections = [
        {
            key: 'favorites',
            title: lang === 'ar' ? 'المفضلة' : 'Favorites',
            icon: <FaHeart />,
            color: 'var(--accent-color)',
            bgColor: 'rgba(225, 29, 72, 0.12)',
            movies: favorites
        },
        {
            key: 'watched',
            title: lang === 'ar' ? 'تمت المشاهدة' : 'Watched',
            icon: <FaEye />,
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.12)',
            movies: watched
        },
        {
            key: 'watchlater',
            title: lang === 'ar' ? 'شاهد لاحقاً' : 'Watch Later',
            icon: <FaBookmark />,
            color: '#8b5cf6',
            bgColor: 'rgba(139, 92, 246, 0.12)',
            movies: watchlist
        }
    ];

    return (
        <div className="container" style={{ padding: '2rem 1.5rem 4rem', minHeight: '85vh' }}>

            {/* ═══ Hero Banner ═══ */}
            <motion.div
                className="profile-hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="profile-hero-mesh" />

                <div className="profile-identity">
                    {/* Avatar */}
                    <div className="profile-avatar-wrap">
                        <motion.img
                            src={avatar}
                            alt="Profile"
                            className="profile-avatar"
                            whileHover={{ scale: 1.06 }}
                        />
                        <button
                            className="profile-avatar-btn"
                            onClick={() => setShowAvatarSelect(!showAvatarSelect)}
                            title={lang === 'ar' ? 'تغيير الصورة' : 'Change avatar'}
                        >
                            <FaCamera size={14} />
                        </button>
                    </div>

                    {/* Name */}
                    <div className="profile-name-row">
                        {editingName ? (
                            <>
                                <input
                                    className="profile-name-input"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                                />
                                <button className="profile-save-btn" onClick={handleSaveName}>
                                    <FaCheck size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="profile-username">{user?.name || 'User'}</h2>
                                <button
                                    className="profile-edit-btn"
                                    onClick={() => { setNewName(user?.name || ''); setEditingName(true); }}
                                    title={lang === 'ar' ? 'تعديل الاسم' : 'Edit name'}
                                >
                                    <FaPen size={13} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Email */}
                    <p className="profile-email">{user?.email}</p>



                    {/* Avatar Selector */}
                    <AnimatePresence>
                        {showAvatarSelect && (
                            <motion.div
                                className="profile-avatar-select"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <p>{lang === 'ar' ? 'اختر صورة شخصية' : 'Choose your avatar'}</p>
                                <div className="profile-avatar-grid">
                                    {DEFAULT_AVATARS.map((src, idx) => (
                                        <div key={idx} style={{ textAlign: 'center' }}>
                                            <img
                                                src={src}
                                                alt={AVATAR_LABELS[lang]?.[idx] || ''}
                                                className={`profile-avatar-option ${avatar === src ? 'active' : ''}`}
                                                onClick={() => { setAvatar(src); setShowAvatarSelect(false); }}
                                            />
                                            <p className="profile-avatar-label">{AVATAR_LABELS[lang]?.[idx]}</p>
                                        </div>
                                    ))}
                                </div>
                                <label className="profile-upload-label">
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                                    {lang === 'ar' ? '📁 رفع صورة خاصة' : '📁 Upload your own'}
                                </label>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* ═══ Movie List Sections ═══ */}
            {sections.map((section, i) => (
                <motion.div
                    key={section.key}
                    className="profile-section"
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 * (i + 1) }}
                >
                    <div className="profile-section-header">
                        <div
                            className="profile-section-icon"
                            style={{ background: section.bgColor, color: section.color }}
                        >
                            {section.icon}
                        </div>
                        <h3 className="profile-section-title">{section.title}</h3>
                        <span className="profile-section-count">
                            {section.movies.length} {lang === 'ar' ? 'فيلم' : (section.movies.length === 1 ? 'movie' : 'movies')}
                        </span>
                    </div>
                    <MovieRow movies={section.movies} lang={lang} navigate={navigate} />
                </motion.div>
            ))}
        </div>
    );
};

export default Profile;
