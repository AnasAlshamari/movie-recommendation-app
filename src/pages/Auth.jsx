import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { MdMovie } from 'react-icons/md';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const { login, signup } = useAuth();
    const { t, lang } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email.includes('@')) {
            setError(lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            setError(lang === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' : 'Password must be at least 6 characters.');
            return;
        }

        if (isLogin) {
            if (login(email, password)) navigate('/');
        } else {
            if (!name.trim()) {
                setError(lang === 'ar' ? 'الاسم مطلوب.' : 'Name is required.');
                return;
            }
            if (signup(name, email, password)) navigate('/');
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setEmail('');
        setPassword('');
        setName('');
    };

    return (
        <div className="container" style={{
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem'
        }}>
            <motion.div
                className="glass-panel"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    padding: 'clamp(2rem, 5vw, 3rem)',
                    width: '100%',
                    maxWidth: '440px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.8rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative glow */}
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'var(--primary-color)', filter: 'blur(120px)', opacity: 0.12, zIndex: 0 }} />

                {/* Header */}
                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <MdMovie size={40} style={{ color: 'var(--primary-color)' }} />
                    </div>
                    <h2 className="text-gradient" style={{ marginBottom: '0.5rem', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                        {isLogin ? t('login') : t('signup')}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('welcome')}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'relative', zIndex: 1 }}>

                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                key="name-input"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="input-group"
                            >
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder=" "
                                />
                                <label><FaUser style={{ marginInlineEnd: '0.4rem' }} /> {t('name')}</label>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="input-group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=" "
                        />
                        <label><FaEnvelope style={{ marginInlineEnd: '0.4rem' }} /> {t('email')}</label>
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=" "
                        />
                        <label><FaLock style={{ marginInlineEnd: '0.4rem' }} /> {t('password')}</label>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ color: 'var(--accent-color)', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}
                        >
                            ⚠️ {error}
                        </motion.div>
                    )}

                    <Button type="submit" variant="primary" style={{ marginTop: '0.5rem', padding: '1.1rem', fontSize: '1.05rem', borderRadius: 'var(--radius-md)', width: '100%' }}>
                        {isLogin ? t('login') : t('signup')}
                    </Button>
                </form>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>
                    {isLogin
                        ? (lang === 'ar' ? 'ليس لديك حساب؟ ' : "Don't have an account? ")
                        : (lang === 'ar' ? 'لديك حساب بالفعل؟ ' : "Already have an account? ")}
                    <button
                        type="button"
                        onClick={toggleMode}
                        style={{ color: 'var(--primary-hover)', fontWeight: 'bold', borderBottom: '1px dashed var(--primary-hover)', paddingBottom: '2px' }}
                    >
                        {isLogin ? t('signup') : t('login')}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default Auth;
