import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique user IDs

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage for user data on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Function to log in and save user to localStorage
  const login = (userData) => {
    const userWithId = {
      ...userData,
      id: userData.id || uuidv4(), // Assign a unique ID if not already present
    };
    setUser(userWithId);
    localStorage.setItem('user', JSON.stringify(userWithId));
  };

  // Function to log out and clear localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthenticationContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthenticationContext must be used within an AuthProvider');
  }
  return context;
};