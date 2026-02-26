const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
console.log("TMDB API Key loaded:", API_KEY ? "YES (Hidden for security)" : "NO - IT IS UNDEFINED");
const BASE_URL = 'https://api.themoviedb.org/3';

const langCode = (lang) => lang === 'ar' ? 'ar-AE' : 'en-US';

export const fetchTrending = async (lang = 'ar') => {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=${langCode(lang)}`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.results || [];
};

export const fetchSearch = async (query, lang = 'ar') => {
    if (!query) return [];
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=${langCode(lang)}&query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.results || [];
};

export const fetchRecommendations = async (movieId, lang = 'ar') => {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}&language=${langCode(lang)}`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.results || [];
};

export const fetchSimilar = async (movieId, lang = 'ar') => {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=${langCode(lang)}`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.results || [];
};

export const fetchMovieDetails = async (movieId, lang = 'ar') => {
    const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${langCode(lang)}`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
};

export const fetchMovieCredits = async (movieId) => {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    const director = data.crew?.find(c => c.job === 'Director');
    const actors = data.cast?.slice(0, 6) || [];
    return { director, actors };
};

// ------ New: Person filmography ------
export const fetchPersonDetails = async (personId) => {
    const res = await fetch(`${BASE_URL}/person/${personId}?api_key=${API_KEY}&language=en-US`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
};

export const fetchPersonMovies = async (personId, lang = 'ar') => {
    const res = await fetch(`${BASE_URL}/person/${personId}/movie_credits?api_key=${API_KEY}&language=${langCode(lang)}`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    // For actors: cast. For directors: crew filtered by 'Director'
    return { cast: data.cast || [], crew: data.crew || [] };
};

// ------ New: Genre list ------
export const fetchGenres = async (lang = 'ar') => {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${langCode(lang)}`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.genres || [];
};

// ------ New: Discover with filters ------
export const fetchDiscover = async ({ lang = 'ar', genre, yearFrom, yearTo, minRating, sortBy = 'popularity.desc', page = 1 } = {}) => {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${langCode(lang)}&sort_by=${sortBy}&page=${page}`;
    if (genre) url += `&with_genres=${genre}`;
    if (yearFrom) url += `&primary_release_date.gte=${yearFrom}-01-01`;
    if (yearTo) url += `&primary_release_date.lte=${yearTo}-12-31`;
    if (minRating) url += `&vote_average.gte=${minRating}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.results || [];
};

export const getImageUrl = (path, size = 'w500') => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : 'https://via.placeholder.com/500x750?text=No+Cover';
};
