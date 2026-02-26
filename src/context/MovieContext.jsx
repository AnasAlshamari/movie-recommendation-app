import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

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
    // Lazy initialization from localStorage — prevents the overwrite-on-mount bug
    const [watchlist, setWatchlist] = useState(() => loadFromStorage('tawsyah_watchlist'));
    const [favorites, setFavorites] = useState(() => loadFromStorage('tawsyah_favorites'));
    const [watched, setWatched] = useState(() => loadFromStorage('tawsyah_watched'));

    // Track whether initial mount is done to avoid writing defaults back
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        localStorage.setItem('tawsyah_watchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    useEffect(() => {
        if (isInitialMount.current) return;
        localStorage.setItem('tawsyah_favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        if (isInitialMount.current) return;
        localStorage.setItem('tawsyah_watched', JSON.stringify(watched));
    }, [watched]);

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
