import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('tawsyah_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const mockUser = { id: 1, email, name: email.split('@')[0] };
        setUser(mockUser);
        localStorage.setItem('tawsyah_user', JSON.stringify(mockUser));
        return true;
    };

    const signup = (name, email, password) => {
        const mockUser = { id: Date.now(), email, name };
        setUser(mockUser);
        localStorage.setItem('tawsyah_user', JSON.stringify(mockUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tawsyah_user');
    };

    const updateUserName = (newName) => {
        if (!user || !newName.trim()) return;
        const updatedUser = { ...user, name: newName.trim() };
        setUser(updatedUser);
        localStorage.setItem('tawsyah_user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserName }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
