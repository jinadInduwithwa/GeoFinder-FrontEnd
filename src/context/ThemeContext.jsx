import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme && ["light", "dark"].includes(savedTheme) ? savedTheme : "light";
  });

  useEffect(() => {
    try {
      console.log("ThemeProvider: Applying theme:", theme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
      localStorage.setItem("theme", theme);
      console.log("ThemeProvider: HTML classes:", document.documentElement.classList.toString());
    } catch (error) {
      console.error("ThemeProvider: Error applying theme:", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    try {
      console.log("ThemeProvider: Toggling theme from", theme);
      setTheme((prevTheme) => {
        const newTheme = prevTheme === "light" ? "dark" : "light";
        console.log("ThemeProvider: New theme set to", newTheme);
        return newTheme;
      });
    } catch (error) {
      console.error("ThemeProvider: Error toggling theme:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};