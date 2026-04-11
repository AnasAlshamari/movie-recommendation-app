import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Simple local user registry so data survives logout/login cycles
const USERS_KEY = 'tawsyah_users';

const loadUsers = () => {
    try {
        const stored = localStorage.getItem(USERS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch { return []; }
};

const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

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
        const users = loadUsers();
        const existing = users.find(u => u.email === email);
        if (existing) {
            // Return the persisted user (keeps their name & ID)
            setUser(existing);
            localStorage.setItem('tawsyah_user', JSON.stringify(existing));
        } else {
            // First-time login — create user entry
            const newUser = { id: Date.now(), email, name: email.split('@')[0] };
            users.push(newUser);
            saveUsers(users);
            setUser(newUser);
            localStorage.setItem('tawsyah_user', JSON.stringify(newUser));
        }
        return true;
    };

    const signup = (name, email, password) => {
        const users = loadUsers();
        const existing = users.find(u => u.email === email);
        if (existing) {
            // Already registered — just log them in
            setUser(existing);
            localStorage.setItem('tawsyah_user', JSON.stringify(existing));
        } else {
            const newUser = { id: Date.now(), email, name };
            users.push(newUser);
            saveUsers(users);
            setUser(newUser);
            localStorage.setItem('tawsyah_user', JSON.stringify(newUser));
        }
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
        // Also update in the registry
        const users = loadUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            users[idx] = updatedUser;
            saveUsers(users);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserName }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
