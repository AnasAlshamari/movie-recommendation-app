import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

const MovieContext = createContext();

// Helper to safely read JSON from localStorage
const loadFromStorage = (key, fallback = []) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
};

export const MovieProvider = ({ children }) => {
    const { user } = useAuth();

    // Per-user storage keys
    const getKey = useCallback((base) => {
        return user ? `${base}_${user.id}` : base;
    }, [user]);

    const [watchlist, setWatchlist] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [watched, setWatched] = useState([]);

    // Reload lists whenever user changes (login/logout)
    useEffect(() => {
        if (user) {
            setWatchlist(loadFromStorage(`tawsyah_watchlist_${user.id}`));
            setFavorites(loadFromStorage(`tawsyah_favorites_${user.id}`));
            setWatched(loadFromStorage(`tawsyah_watched_${user.id}`));
        } else {
            setWatchlist([]);
            setFavorites([]);
            setWatched([]);
        }
    }, [user]);

    // Persist on changes — only when user is logged in
    useEffect(() => {
        if (user) localStorage.setItem(`tawsyah_watchlist_${user.id}`, JSON.stringify(watchlist));
    }, [watchlist, user]);

    useEffect(() => {
        if (user) localStorage.setItem(`tawsyah_favorites_${user.id}`, JSON.stringify(favorites));
    }, [favorites, user]);

    useEffect(() => {
        if (user) localStorage.setItem(`tawsyah_watched_${user.id}`, JSON.stringify(watched));
    }, [watched, user]);

    const toggleWatchlist = (movie) => {
        setWatchlist((prev) => {
            const exists = prev.find((m) => m.id === movie.id);
            return exists ? prev.filter((m) => m.id !== movie.id) : [...prev, movie];
        });
    };

    const toggleFavorite = (movie) => {
        setFavorites((prev) => {
            const exists = prev.find((m) => m.id === movie.id);
            return exists ? prev.filter((m) => m.id !== movie.id) : [...prev, movie];
        });
    };

    const toggleWatched = (movie) => {
        setWatched((prev) => {
            const exists = prev.find((m) => m.id === movie.id);
            return exists ? prev.filter((m) => m.id !== movie.id) : [...prev, movie];
        });
    };

    const isInWatchlist = (movieId) => watchlist.some((m) => m.id === movieId);
    const isInFavorites = (movieId) => favorites.some((m) => m.id === movieId);
    const isWatched = (movieId) => watched.some((m) => m.id === movieId);

    return (
        <MovieContext.Provider
            value={{
                watchlist,
                favorites,
                watched,
                toggleWatchlist,
                toggleFavorite,
                toggleWatched,
                isInWatchlist,
                isInFavorites,
                isWatched
            }}
        >
            {children}
        </MovieContext.Provider>
    );
};

export const useMovie = () => useContext(MovieContext);
