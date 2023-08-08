import React, { createContext, useState } from "react";

export const AuthContext = createContext();
export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [path, setPath] = useState('/');
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <AuthContext.Provider value={{ path, setPath, isAuthenticated, setIsAuthenticated, user, setUser }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
};
