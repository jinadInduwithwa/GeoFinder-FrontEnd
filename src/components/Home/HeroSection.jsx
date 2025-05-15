import { motion, AnimatePresence } from "framer-motion";
import Button from "../UI/Button";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import heroVideo from "../../assets/home/heroVideo.mp4"; 

function HeroSection() {
  const [showContent, setShowContent] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch 15 countries for the slider
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags");
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }
        const data = await response.json();
        const selectedCountries = data.slice(0, 15);
        setCountries(selectedCountries);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Delay to ensure content animates after loader and auto-slide with very slow transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    if (countries.length > 0) {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % countries.length);
      }, 10000); // 10 seconds interval for very slow slide

      return () => {
        clearTimeout(timer);
        clearInterval(slideInterval);
      };
    }

    return () => clearTimeout(timer);
  }, [countries.length]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      ></div>

      {/* Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="relative max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between w-full z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left Side: Text Content */}
            <motion.div
              className="w-full sm:w-1/2 text-left mb-8 sm:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.h1
                className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Welcome to <span className="text-green-500">GeoFinder</span>
                <br />
                Explore the World,
                <br />
                One Country at a Time
              </motion.h1>
              <motion.p
                className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-xs sm:max-w-md md:max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Discover detailed information about countries, regions, and cultures from across the globe.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <Button to="/countries-list" icon={FaArrowRight}>
                  Start Exploring
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Side: Flag Slider */}
            <motion.div
              className="w-full sm:w-1/2 h-40 sm:h-60 md:h-96 relative overflow-hidden rounded-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {loading && (
                <div className="text-center text-white absolute inset-0 flex items-center justify-center">
                  Loading flags...
                </div>
              )}
              {error && (
                <div className="text-center text-red-400 absolute inset-0 flex items-center justify-center">
                  Error: {error}
                </div>
              )}
              {!loading && !error && countries.length > 0 && (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={countries[currentSlide].flags.png}
                    alt={countries[currentSlide].name.common}
                    className="w-full h-full object-contain rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  />
                </AnimatePresence>
              )}
              {/* Navigation dots */}
              {!loading && !error && countries.length > 0 && (
                <div className="hidden justify-center mt-2 sm:mt-4 space-x-2 absolute bottom-2 sm:bottom-4 left-0 right-0">
                  {countries.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full ${
                        index === currentSlide ? "bg-blue-500" : "bg-gray-300"
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HeroSection;