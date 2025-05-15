

import React, { useEffect } from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { useCountryContext } from "../../context/CountryContext";
import HomeCard from "../UI/HomeCard";

function EuropeCountrySection() {
  const {
    countries,
    loading,
    error,
    fetchCountriesByRegion,
    setSelectedRegion,
  } = useCountryContext();

  useEffect(() => {
    console.log("Fetching Americas countries...");
    setSelectedRegion("Asia"); // Set region in context
    fetchCountriesByRegion("Asia", 1, "en"); // Fetch Americas countries
  }, [fetchCountriesByRegion, setSelectedRegion]);

  // Log countries for debugging
  useEffect(() => {
    console.log("Countries:", countries);
  }, [countries]);

  return (
    <section className="py-8 sm:py-16 w-full bg-gradient-to-b from-gray-50 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Discover Europe Countries
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto text-sm sm:text-base">
            Explore the vibrant cultures, capitals, and landscapes of the Europes' top countries
          </p>
        </motion.div>
      </div>

      {loading && (
        <div className="text-center text-gray-600">Loading countries...</div>
      )}
      {error && (
        <div className="text-center text-red-600">Error: {error}</div>
      )}
      {!loading && !error && countries.length === 0 && (
        <div className="text-center text-gray-600">No countries found.</div>
      )}
      {!loading && !error && countries.length > 0 && (
        <div className="mb-8">
          <Marquee
            gradient={false}
            speed={40}
            pauseOnHover={true}
            className="flex gap-6 sm:gap-8"
          >
            {countries.slice(0, 15).map((country, index) => (
              <HomeCard key={country.cca3 || index} country={country} />
            ))}
          </Marquee>
        </div>
      )}
    </section>
  );
}

export default EuropeCountrySection;