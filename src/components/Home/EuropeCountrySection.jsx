// EuropeCountrySection.jsx
import React, { useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';
import { motion } from 'framer-motion';
import HomeCard from '../UI/HomeCard';

function EuropeCountrySection() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEuropeCountries = async () => {
      console.log('Fetching Europe countries...');
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://restcountries.com/v3.1/region/Europe');
        if (!response.ok) {
          throw new Error('Failed to fetch European countries');
        }
        const data = await response.json();
        console.log('Fetched Europe countries:', data);
        setCountries(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEuropeCountries();
  }, []);

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
            Explore the vibrant cultures, capitals, and landscapes of Europe's top countries
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