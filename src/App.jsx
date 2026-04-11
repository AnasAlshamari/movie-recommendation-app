import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

// Components
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Watchlist from './pages/Watchlist';
import Favorites from './pages/Favorites';
import AIRecommendation from './pages/AIRecommendation';
import Profile from './pages/Profile';
import MovieDetails from './pages/MovieDetails';
import PersonMovies from './pages/PersonMovies';
import CategoryMovies from './pages/CategoryMovies';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="popLayout">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/watchlist" element={<PrivateRoute><PageTransition><Watchlist /></PageTransition></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><PageTransition><Favorites /></PageTransition></PrivateRoute>} />
        {/* AI Recommendations accessible to guests */}
        <Route path="/recommendations" element={<PageTransition><AIRecommendation /></PageTransition>} />
        <Route path="/profile" element={<PrivateRoute><PageTransition><Profile /></PageTransition></PrivateRoute>} />
        <Route path="/movie/:id" element={<PageTransition><MovieDetails /></PageTransition>} />
        <Route path="/person/:id" element={<PageTransition><PersonMovies /></PageTransition>} />
        <Route path="/category/:id" element={<PageTransition><CategoryMovies /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <AnimatedRoutes />
        </main>
        <footer className="site-footer">
          <a
            href="https://linktr.ee/AnasAlshammari"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            © 2026 Anas Alshammari
          </a>
        </footer>
      </div>
    </Router>
  );
}

export default App;
