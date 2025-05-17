import { useEffect, useState, useCallback } from 'react';
import { useCountryContext } from '../context/CountryContext';
import { toast } from 'react-hot-toast';
import { HiSearch } from 'react-icons/hi';

// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

function Favorites() {
  const {
    favorites,
    fetchCountryByCode,
    removeFavoriteCountry,
    loading,
    error,
    getCurrencies,
  } = useCountryContext();
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [populationRange, setPopulationRange] = useState('');
  const [currency, setCurrency] = useState('');

  // Fetch favorite countries
  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      try {
        const countryPromises = favorites.map((cca3) => fetchCountryByCode(cca3, 'en'));
        const countryResponses = await Promise.all(countryPromises);
        const countries = countryResponses.map((res) => res.data);
        setFavoriteCountries(countries);
        setFilteredCountries(countries);
      } catch (err) {
        toast.error('Failed to fetch favorite countries');
      }
    };
    if (favorites.length > 0) {
      fetchFavoriteDetails();
    } else {
      setFavoriteCountries([]);
      setFilteredCountries([]);
    }
  }, [favorites, fetchCountryByCode]);

  // Apply filters and search
  const applyFilters = useCallback(() => {
    let filtered = [...favoriteCountries];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((country) =>
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Region filter
    if (selectedRegion) {
      filtered = filtered.filter((country) => country.region === selectedRegion);
    }

    // Population filter
    if (populationRange) {
      filtered = filtered.filter((country) => {
        const pop = country.population;
        if (populationRange === 'small') return pop < 1_000_000;
        if (populationRange === 'medium') return pop >= 1_000_000 && pop <= 10_000_000;
        if (populationRange === 'large') return pop > 10_000_000;
        return true;
      });
    }

    // Currency filter
    if (currency && currency !== 'All Currencies') {
      filtered = filtered.filter((country) =>
        country.currencies && Object.keys(country.currencies).includes(currency)
      );
    }

    setFilteredCountries(filtered);
  }, [favoriteCountries, searchQuery, selectedRegion, populationRange, currency]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Debounced search handler
  const handleSearchChange = debounce((value) => {
    setSearchQuery(value);
  }, 300);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  const handlePopulationChange = (e) => {
    setPopulationRange(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-2xl font-semibold text-red-500 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  // Empty favorites state
  if (!favoriteCountries.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
          No favorites yet
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="container mx-auto">
        <h1 className="text-md sm:text-md  text-left font-bold text-gray-600 dark:text-gray-200 my-4 animate-fade-in-down">
          My Favorites
        </h1>

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center flex-wrap">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search favorite countries..."
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-full w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-full w-full sm:w-1/5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Regions</option>
            <option value="Africa">Africa</option>
            <option value="Americas">Americas</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
          </select>
          <select
            value={populationRange}
            onChange={handlePopulationChange}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-full w-full sm:w-1/5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Populations</option>
            <option value="small">Small (&lt; 1M)</option>
            <option value="medium">Medium (1M - 10M)</option>
            <option value="large">Large (&gt; 10M)</option>
          </select>
          <select
            value={currency}
            onChange={handleCurrencyChange}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-full w-full sm:w-1/5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {getCurrencies().map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>

        {/* Country Cards */}
        {filteredCountries.length === 0 ? (
          <div className="text-center text-gray-600  dark:text-gray-400 text-xl">
            No favorite countries match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCountries.map((country) => (
              <div
                key={country.cca3}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
              >
                <img
                  src={country.flags?.png}
                  alt={`${country.name?.common} flag`}
                  className="w-full h-32 sm:h-40 object-cover rounded-t-xl"
                />
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {country.name?.common}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    <strong>Capital:</strong> {country.capital?.[0] || 'N/A'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    <strong>Region:</strong> {country.region || 'N/A'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    <strong>Population:</strong>{' '}
                    {country.population ? (
                      country.population >= 1_000_000
                        ? `${(country.population / 1_000_000).toFixed(1)}M`
                        : country.population >= 1_000
                        ? `${(country.population / 1_000).toFixed(1)}K`
                        : country.population
                    ) : (
                      'N/A'
                    )}
                  </p>
                  <button
                    onClick={() => removeFavoriteCountry(country.cca3)}
                    className="mt-4 w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Remove from Favorites
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;