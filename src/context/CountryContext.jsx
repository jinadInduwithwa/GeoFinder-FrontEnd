import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthenticationContext } from './AuthContext';

// Create Context
const CountryContext = createContext();

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

// Simple in-memory cache
const cache = new Map();

export const CountryProvider = ({ children }) => {
  const { user } = useAuthenticationContext();
  const [countries, setCountries] = useState([]);
  const [allCountries, setAllCountries] = useState([]); // Store all countries for filtering
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [language, setLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSubregion, setSelectedSubregion] = useState('');
  const [populationRange, setPopulationRange] = useState('');
  const [currency, setCurrency] = useState('');
  const [timeZone, setTimeZone] = useState('');

  // Generate cache key
  const getCacheKey = (endpoint, params) => {
    return `${endpoint}-${JSON.stringify(params)}`;
  };

  // Fetch with cache
  const fetchWithCache = async (endpoint, params = {}) => {
    const cacheKey = getCacheKey(endpoint, params);
    const cached = cache.get(cacheKey);

    if (cached && cached.expires > Date.now()) {
      console.log('Using cached data:', cacheKey);
      return cached.data;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `https://restcountries.com/v3.1${endpoint}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${endpoint} (Status: ${response.status})`);
      }

      const data = await response.json();
      cache.set(cacheKey, {
        data,
        expires: Date.now() + 1000 * 60 * 5, // Cache for 5 minutes
      });

      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Fetch favorites from localStorage
  const fetchFavorites = () => {
    if (!user || !user.email) {
      setFavorites([]);
    } else {
      const storedFavorites = localStorage.getItem(`favorites_${user.email}`);
      setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
    }
  };

  // Add favorite country
  const addFavoriteCountry = (cca3) => {
    if (!user || !user.email) {
      toast.error('Please sign in to add favorites');
      return;
    }
    setFavorites((prev) => {
      const newFavorites = [...prev, cca3];
      localStorage.setItem(`favorites_${user.email}`, JSON.stringify(newFavorites));
      toast.success('Added to favorites');
      return newFavorites;
    });
  };

  // Remove favorite country
  const removeFavoriteCountry = (cca3) => {
    if (!user || !user.email) {
      toast.error('Please sign in to remove favorites');
      return;
    }
    setFavorites((prev) => {
      const newFavorites = prev.filter((code) => code !== cca3);
      localStorage.setItem(`favorites_${user.email}`, JSON.stringify(newFavorites));
      toast.success('Removed from favorites');
      return newFavorites;
    });
  };

  // Apply filters to countries
  const applyFilters = (data, query, region, subregion, lang, popRange, curr, tz) => {
    let filtered = [...data];

    // Search filter
    if (query) {
      filtered = filtered.filter((country) =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Region filter
    if (region) {
      filtered = filtered.filter((country) => country.region === region);
    }

    // Subregion filter
    if (subregion) {
      filtered = filtered.filter((country) => country.subregion === subregion);
    }

    // Language filter
    if (lang && lang !== 'en') {
      const langCodeMap = { fr: 'fra', es: 'spa', de: 'deu' };
      const apiLangCode = langCodeMap[lang] || lang;
      filtered = filtered.filter((country) =>
        country.languages && Object.keys(country.languages).includes(apiLangCode)
      );
    }

    // Population filter
    if (popRange) {
      filtered = filtered.filter((country) => {
        const pop = country.population;
        if (popRange === 'small') return pop < 1_000_000;
        if (popRange === 'medium') return pop >= 1_000_000 && pop <= 10_000_000;
        if (popRange === 'large') return pop > 10_000_000;
        return true;
      });
    }

    // Currency filter
    if (curr) {
      filtered = filtered.filter((country) =>
        country.currencies && Object.keys(country.currencies).includes(curr)
      );
    }

    // Time zone filter
    if (tz) {
      filtered = filtered.filter((country) =>
        country.timezones && country.timezones.includes(tz)
      );
    }

    // Sort and paginate
    const sortedData = filtered.sort((a, b) => a.name.common.localeCompare(b.name.common));
    const totalItems = sortedData.length;
    setTotalPages(Math.ceil(totalItems / pageSize));
    const start = (currentPage - 1) * pageSize;
    const paginatedData = sortedData.slice(start, start + pageSize);
    setCountries(paginatedData);
    console.log('Filtered Countries:', paginatedData);
  };

  // Fetch all countries
  const fetchCountries = async (page = 1, lang = 'en') => {
    try {
      const data = await fetchWithCache('/all');
      setAllCountries(data); // Store all countries
      applyFilters(data, searchQuery, selectedRegion, selectedSubregion, lang, populationRange, currency, timeZone);
      setCurrentPage(page);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Search countries by name (debounced)
  const searchCountryByName = useCallback(
    debounce(async (name, lang = 'en') => {
      if (!name) {
        fetchCountries(1, lang);
        return;
      }
      try {
        const data = await fetchWithCache(`/name/${encodeURIComponent(name)}`);
        setCountries(Array.isArray(data) ? data : [data]);
        setTotalPages(1);
        setCurrentPage(1);
      } catch (err) {
        toast.error(err.message);
      }
    }, 500),
    []
  );

  // Fetch countries by region
  const fetchCountriesByRegion = async (region, page = 1, lang = 'en') => {
    if (!region) {
      fetchCountries(page, lang);
      return;
    }
    try {
      const data = await fetchWithCache(`/region/${encodeURIComponent(region)}`);
      setAllCountries(data); // Store for filtering
      applyFilters(data, searchQuery, '', selectedSubregion, lang, populationRange, currency, timeZone);
      setCurrentPage(page);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Fetch country by alpha code
  const fetchCountryByCode = async (code, lang = 'en') => {
    try {
      const data = await fetchWithCache(`/alpha/${encodeURIComponent(code)}`);
      const country = Array.isArray(data) ? data[0] : data;
      return { data: country };
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  // Clear cache
  const clearCache = () => {
    cache.clear();
    localStorage.removeItem('countries');
    if (searchQuery) {
      searchCountryByName(searchQuery, language);
    } else if (selectedRegion) {
      fetchCountriesByRegion(selectedRegion, currentPage, language);
    } else {
      fetchCountries(currentPage, language);
    }
    toast.success('Cache cleared');
  };

  // Get filter options
  const getSubregions = () => {
    const subregions = new Set(allCountries.map((c) => c.subregion).filter(Boolean));
    return ['All Subregions', ...Array.from(subregions).sort()];
  };

  const getCurrencies = () => {
    const currencies = new Set();
    allCountries.forEach((c) => {
      if (c.currencies) {
        Object.keys(c.currencies).forEach((code) => currencies.add(code));
      }
    });
    return ['All Currencies', ...Array.from(currencies).sort()];
  };

  const getTimeZones = () => {
    const timeZones = new Set();
    allCountries.forEach((c) => {
      if (c.timezones) {
        c.timezones.forEach((tz) => timeZones.add(tz));
      }
    });
    return ['All Time Zones', ...Array.from(timeZones).sort()];
  };

  // Fetch favorites when user changes
  useEffect(() => {
    fetchFavorites();
  }, [user]);

  // Fetch countries based on filters
  useEffect(() => {
    if (searchQuery) {
      searchCountryByName(searchQuery, language);
    } else if (selectedRegion) {
      fetchCountriesByRegion(selectedRegion, currentPage, language);
    } else {
      fetchCountries(currentPage, language);
    }
    return () => searchCountryByName.cancel && searchCountryByName.cancel();
  }, [currentPage, language, searchQuery, selectedRegion, selectedSubregion, populationRange, currency, timeZone]);

  const value = {
    countries,
    favorites,
    loading,
    error,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    selectedSubregion,
    setSelectedSubregion,
    populationRange,
    setPopulationRange,
    currency,
    setCurrency,
    timeZone,
    setTimeZone,
    fetchCountries,
    searchCountryByName,
    fetchCountriesByRegion,
    fetchCountryByCode,
    clearCache,
    fetchFavorites,
    addFavoriteCountry,
    removeFavoriteCountry,
    getSubregions,
    getCurrencies,
    getTimeZones,
  };

  return (
    <CountryContext.Provider value={value}>
      {children}
      <ToastContainer />
    </CountryContext.Provider>
  );
};

export const useCountryContext = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountryContext must be used within a CountryProvider');
  }
  return context;
};