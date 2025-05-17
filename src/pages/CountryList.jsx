
// src/pages/CountryList.jsx
import React from 'react';
import { useCountryContext } from '../context/CountryContext';
import Card from '../components/UI/Card';
import { HiSearch } from 'react-icons/hi';

const CountryList = () => {
  const {
    countries,
    loading,
    error,
    currentPage,
    setCurrentPage,
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
    clearCache,
    getSubregions,
    getCurrencies,
    getTimeZones,
  } = useCountryContext();

  console.log('CountryList State:', {
    countries: countries?.length,
    loading,
    error,
    errorType: typeof error,
    errorValue: error,
    searchQuery,
    selectedRegion,
    selectedSubregion,
    populationRange,
    currency,
    timeZone,
  }); // Debug log

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setSelectedRegion('');
    setSelectedSubregion('');
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedSubregion('');
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleSubregionChange = (e) => {
    setSelectedSubregion(e.target.value === 'All Subregions' ? '' : e.target.value);
    setCurrentPage(1);
  };

  const handlePopulationChange = (e) => {
    setPopulationRange(e.target.value);
    setCurrentPage(1);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value === 'All Currencies' ? '' : e.target.value);
    setCurrentPage(1);
  };

  const handleTimeZoneChange = (e) => {
    setTimeZone(e.target.value === 'All Time Zones' ? '' : e.target.value);
    setCurrentPage(1);
  };

  const handleClearCache = () => {
    clearCache();
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {typeof error === 'string' ? error : 'An unexpected error occurred'}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Countries</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center flex-wrap">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by country name..."
            className="p-2 border border-gray-300 rounded-full w-full pl-10"
            data-testid="search-input"
          />
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <select
          value={selectedRegion}
          onChange={handleRegionChange}
          className="p-2 border border-gray-300 rounded-full w-full sm:w-1/5"
          data-testid="region-select"
        >
          <option value="">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
        <select
          value={selectedSubregion || 'All Subregions'}
          onChange={handleSubregionChange}
          className="p-2 border border-gray-300 rounded-full w-full sm:w-1/5"
          data-testid="subregion-select"
        >
          {getSubregions().map((subregion) => (
            <option key={subregion} value={subregion}>
              {subregion}
            </option>
          ))}
        </select>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-2 border border-gray-300 rounded-full w-full sm:w-1/5"
          data-testid="language-select"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
        </select>
        <select
          value={populationRange}
          onChange={handlePopulationChange}
          className="p-2 border border-gray-300 rounded-full w-full sm:w-1/5"
          data-testid="population-select"
        >
          <option value="">All Populations</option>
          <option value="small">Small ( 1M)</option>
          <option value="medium">Medium (1M - 10M)</option>
          <option value="large">Large ( 10M)</option>
        </select>
        <select
          value={currency || 'All Currencies'}
          onChange={handleCurrencyChange}
          className="p-2 border border-gray-300 rounded-full w-full sm:w-1/5"
          data-testid="currency-select"
        >
          {getCurrencies().map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>
        <select
          value={timeZone || 'All Time Zones'}
          onChange={handleTimeZoneChange}
          className="p-2 border border-gray-300 rounded-full w-full sm:w-1/5"
          data-testid="timezone-select"
        >
          {getTimeZones().map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
        <button
          onClick={handleClearCache}
          className="hover:text-red-600 text-gray-200 py-2 px-4 rounded-full border"
          data-testid="clear-cache-btn"
        >
          Clear Cache
        </button>
      </div>
      {countries.length === 0 ? (
        <div className="text-center mt-10">No countries match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {countries.map((country) => (
            <Card key={country.cca3} country={country} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
            data-testid="prev-page-btn"
          >
            Previous
          </button>
          <span className="py-2 px-4" data-testid="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50"
            data-testid="next-page-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CountryList;
