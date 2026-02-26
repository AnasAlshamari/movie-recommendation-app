import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

import { FaGlobe, FaSignOutAlt, FaSignInAlt, FaHeart, FaListUl, FaMagic, FaHome, FaBars, FaTimes } from 'react-icons/fa';

const DEFAULT_AVATAR = '/avatars/man.png';

const Navbar = () => {
    const { lang, toggleLanguage, t } = useLanguage();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const avatar = localStorage.getItem('tawsyah_avatar') || DEFAULT_AVATAR;

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', label: t('home'), icon: <FaHome size={17} />, show: true },
        { path: '/recommendations', label: t('ai_recommendation'), icon: <FaMagic size={17} />, show: !!user },
        { path: '/watchlist', label: t('watchlist'), icon: <FaListUl size={17} />, show: !!user },
        { path: '/favorites', label: t('favorites'), icon: <FaHeart size={17} />, show: !!user },
    ];

    return (
        <>
            <nav className="top-nav">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/logo.png?v=3" alt={t('app_name')} style={{ height: '70px', width: 'auto', transform: 'scale(2.2)', transformOrigin: 'center' }} />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="desktop-nav">
                        {navItems.filter(i => i.show).map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${isActive(item.path) ? 'nav-active' : ''}`}
                            >
                                {item.icon} <span className="nav-label">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <button onClick={toggleLanguage} className="nav-action-btn">
                            <FaGlobe size={14} /> {lang === 'ar' ? 'EN' : 'AR'}
                        </button>

                        {user ? (
                            <>
                                {/* Avatar — navigates to Profile */}
                                <Link to="/profile" className="avatar-link" title={t('profile')}>
                                    <img src={avatar} alt="avatar" className="nav-avatar" />
                                </Link>
                                <button onClick={handleLogout} className="nav-logout-btn">
                                    <FaSignOutAlt size={14} /> <span className="nav-label">{t('logout')}</span>
                                </button>
                            </>
                        ) : (
                            <Link to="/auth" className="nav-login-btn">
                                <FaSignInAlt size={14} /> {t('login')}
                            </Link>
                        )}

                        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                            {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Overlay */}
            {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}

            {/* Mobile Sidebar */}
            <aside className={`mobile-sidebar ${mobileOpen ? 'open' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <Link to="/" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/logo.png?v=3" alt={t('app_name')} style={{ height: '50px', width: 'auto', transform: 'scale(2.0)', transformOrigin: 'left center' }} />
                    </Link>
                    <button onClick={() => setMobileOpen(false)} style={{ color: 'var(--text-muted)', padding: '0.5rem' }}>
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* User avatar in sidebar */}
                {user && (
                    <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                        <img src={avatar} alt="avatar" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid var(--primary-color)', objectFit: 'cover' }} />
                        <div>
                            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem' }}>{user.name}</p>
                        </div>
                    </Link>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {navItems.filter(i => i.show).map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            className={`sidebar-item ${isActive(item.path) ? 'sidebar-active' : ''}`}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
                    <button onClick={() => { toggleLanguage(); setMobileOpen(false); }} className="sidebar-item">
                        <span className="sidebar-icon"><FaGlobe size={17} /></span>
                        {lang === 'ar' ? 'English' : 'العربية'}
                    </button>
                    {user ? (
                        <button onClick={handleLogout} className="sidebar-item" style={{ color: 'var(--accent-color)' }}>
                            <span className="sidebar-icon"><FaSignOutAlt size={17} /></span>
                            {t('logout')}
                        </button>
                    ) : (
                        <Link to="/auth" onClick={() => setMobileOpen(false)} className="sidebar-item" style={{ color: 'var(--primary-color)' }}>
                            <span className="sidebar-icon"><FaSignInAlt size={17} /></span>
                            {t('login')}
                        </Link>
                    )}
                </div>
            </aside>

            <style>{`
                .top-nav {
                    position: sticky; top: 0; z-index: 100;
                    background: rgba(5,11,20,0.88);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid var(--glass-border);
                    padding: 0.7rem 0;
                }
                .desktop-nav {
                    display: flex; align-items: center; gap: 0.3rem;
                }
                .nav-item {
                    display: flex; align-items: center; gap: 0.45rem;
                    padding: 0.55rem 0.9rem; border-radius: var(--radius-sm);
                    color: var(--text-muted); font-size: 0.9rem;
                    transition: var(--transition);
                }
                .nav-item:hover { color: var(--primary-color); background: rgba(14,165,233,0.06); }
                .nav-active { color: var(--primary-color) !important; background: rgba(14,165,233,0.1); font-weight: 600; }

                .nav-action-btn {
                    display: flex; align-items: center; gap: 0.35rem;
                    color: var(--text-main); padding: 0.45rem 0.7rem;
                    border-radius: var(--radius-sm); background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border); font-size: 0.85rem;
                    transition: var(--transition);
                }
                .nav-action-btn:hover { background: rgba(255,255,255,0.1); }

                .nav-logout-btn {
                    display: flex; align-items: center; gap: 0.35rem;
                    color: var(--accent-color); padding: 0.45rem 0.7rem;
                    border-radius: var(--radius-sm);
                    background: rgba(225,29,72,0.06); border: 1px solid rgba(225,29,72,0.15);
                    font-size: 0.85rem; transition: var(--transition);
                }
                .nav-logout-btn:hover { background: rgba(225,29,72,0.15); }

                .nav-login-btn {
                    background: var(--primary-color); color: #fff;
                    padding: 0.5rem 1rem; border-radius: var(--radius-sm);
                    font-weight: 600; display: flex; align-items: center;
                    gap: 0.4rem; font-size: 0.85rem;
                }

                .avatar-link { display: flex; }
                .nav-avatar {
                    width: 36px; height: 36px; border-radius: 50%;
                    border: 2px solid var(--glass-border); object-fit: cover;
                    transition: all 0.3s ease; cursor: pointer;
                    background: var(--bg-dark);
                }
                .nav-avatar:hover {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 12px rgba(14,165,233,0.4);
                    transform: scale(1.08);
                }

                .mobile-toggle { display: none; color: var(--text-main); padding: 0.4rem; }
                .mobile-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.6); z-index: 200;
                }
                .mobile-sidebar {
                    position: fixed; top: 0; width: 280px; height: 100vh;
                    background: rgba(5,11,20,0.97); backdrop-filter: blur(24px);
                    z-index: 300; display: flex; flex-direction: column;
                    padding: 1.5rem; overflow-y: auto;
                    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
                }
                body[dir="rtl"] .mobile-sidebar { right: -300px; border-left: 1px solid var(--glass-border); }
                body[dir="rtl"] .mobile-sidebar.open { right: 0; }
                body[dir="ltr"] .mobile-sidebar { left: -300px; border-right: 1px solid var(--glass-border); }
                body[dir="ltr"] .mobile-sidebar.open { left: 0; }

                .sidebar-item {
                    display: flex; align-items: center; gap: 0.7rem;
                    padding: 0.8rem 1rem; border-radius: var(--radius-sm);
                    color: var(--text-muted); font-size: 0.95rem;
                    transition: var(--transition); text-align: start;
                    border-inline-start: 3px solid transparent;
                }
                .sidebar-item:hover { color: #fff; background: rgba(255,255,255,0.04); }
                .sidebar-active {
                    color: #fff !important; background: rgba(14,165,233,0.12);
                    border-inline-start-color: var(--primary-color);
                    font-weight: 600;
                }
                .sidebar-icon { width: 22px; display: flex; justify-content: center; flex-shrink: 0; }

                @media (max-width: 900px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: flex !important; }
                    .nav-label { display: none; }
                }
            `}</style>
        </>
    );
};

export default Navbar;
