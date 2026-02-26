import { fetchRecommendations, fetchSimilar, fetchMovieDetails } from './tmdb';

export const getAIRecommendations = async (movieId, lang = 'ar') => {
    try {
        const [recs, similar, baseMovie] = await Promise.all([
            fetchRecommendations(movieId, lang).catch(() => []),
            fetchSimilar(movieId, lang).catch(() => []),
            fetchMovieDetails(movieId, lang).catch(() => null)
        ]);

        // Merge and deduplicate based on id
        const combined = [...recs, ...similar];
        const unique = [];
        const map = new Map();

        for (const item of combined) {
            if (!map.has(item.id) && item.poster_path) {
                map.set(item.id, true);
                unique.push(item);
            }
        }

        if (baseMovie) {
            const baseGenres = baseMovie.genres ? baseMovie.genres.map(g => g.id) : [];
            const baseTitle = (baseMovie.title || '').toLowerCase();
            // Match words with 4+ characters (supports English and Arabic)
            const baseWords = (baseMovie.overview || '').toLowerCase().match(/[\w\u0600-\u06FF]{4,}/g) || [];
            const baseKeywords = new Set(baseWords);

            unique.forEach(item => {
                let score = 0;

                // 1. Popularity relevance (Base score, cap at 50 points)
                score += Math.min((item.popularity || 0) * 0.5, 50);

                // 2. Genre similarity (15 points per matching genre)
                if (item.genre_ids) {
                    const matchCount = item.genre_ids.filter(id => baseGenres.includes(id)).length;
                    score += matchCount * 15;
                }

                // 3. Exact title similarity (30 points boost)
                const itemTitle = (item.title || item.name || '').toLowerCase();
                if (itemTitle && baseTitle && (itemTitle.includes(baseTitle) || baseTitle.includes(itemTitle))) {
                    score += 30;
                }

                // 4. Strong keyword matching in plot/description (5 points per word, max 40 points)
                const itemWords = (item.overview || '').toLowerCase().match(/[\w\u0600-\u06FF]{4,}/g) || [];
                let keywordMatches = 0;
                itemWords.forEach(w => {
                    if (baseKeywords.has(w)) keywordMatches++;
                });
                score += Math.min(keywordMatches * 5, 40);

                item._aiScore = score;
            });

            // Sort by the new intelligent score
            unique.sort((a, b) => b._aiScore - a._aiScore);
        } else {
            // Sort by popularity fallback
            unique.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        }

        return unique.slice(0, 20); // Top 20 most accurate results
    } catch (error) {
        console.error("Error in AI recommendation logic:", error);
        return [];
    }
};
