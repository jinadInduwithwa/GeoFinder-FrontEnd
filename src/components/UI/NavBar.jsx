import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MobileNavBar from "./MobileNavBar";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); // Use logout from AuthContext
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [isHomePage]);

  const handleLogout = () => {
    logout(); // Use localStorage-based logout
    toast.success("Logged out successfully!");
    navigate("/signin");
  };

  return (
    <>
      <nav className="hidden md:block fixed w-full top-0 z-50 transition-all duration-300">
        <div
          className={`${
            isScrolled || !isHomePage
              ? "bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link
                to="/"
                className={`text-2xl font-bold ${
                  isScrolled || !isHomePage
                    ? "text-green-600 dark:text-green-400"
                    : "text-white"
                }`}
              >
                GeoFinder
              </Link>

              <div className="flex items-center space-x-8">
                <Link
                  to="/countries-list"
                  className={`hover:text-green-600 dark:hover:text-green-400 transition-colors ${
                    isScrolled || !isHomePage
                      ? "text-gray-700 dark:text-gray-300"
                      : "text-white"
                  }`}
                >
                  Explore
                </Link>
                {user && (
                  <Link
                    to="/favourite"
                    className={`hover:text-green-600 dark:hover:text-green-400 transition-colors ${
                      isScrolled || !isHomePage
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-white"
                    }`}
                  >
                    Favourite
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white dark:bg-red-500 dark:text-gray-100 px-3 py-1 rounded-sm hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/signin"
                    className="bg-green-600 text-white dark:bg-green-500 dark:text-gray-100 px-3 py-1 rounded-sm hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? (
                    <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <SunIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <MobileNavBar />
    </>
  );
}

export default NavBar;