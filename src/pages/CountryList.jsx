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
      <div className="space-y-6 mb-6">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Long Search Bar - about 2/3 width */}
          <div className="flex-1 bg-white rounded-xl  p-4 flex items-center relative">
            <HiSearch className="absolute  left-8 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by country name..."
              className="pl-10 pr-2 py-2 border border-gray-200 rounded-lg w-full focus:outline-none"
            />
          </div>

          {/* One Select Box - about 1/3 width */}
          <div className="sm:w-1/3 bg-white rounded-xl ">
            <label className="block text-sm text-gray-600 mb-1">Region</label>
            <select
              value={selectedRegion}
              onChange={handleRegionChange}
              className="w-full p-2 border border-gray-200 rounded-lg"
            >
              <option value="">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Subregion */}
          <div className="bg-white rounded-xl">
            <label className="block text-sm text-gray-600 mb-1">Subregion</label>
            <select
              value={selectedSubregion || 'All Subregions'}
              onChange={handleSubregionChange}
              className="w-full p-2 border border-gray-200 rounded-lg"
            >
              {getSubregions().map((subregion) => (
                <option key={subregion} value={subregion}>
                  {subregion}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div className="bg-white rounded-xl ">
            <label className="block text-sm text-gray-600 mb-1">Language</label>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full p-2 border border-gray-200 rounded-lg"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
            </select>
          </div>

          {/* Population */}
          <div className="bg-white rounded-xl ">
            <label className="block text-sm text-gray-600 mb-1">Population</label>
            <select
              value={populationRange}
              onChange={handlePopulationChange}
              className="w-full p-2 border border-gray-200 rounded-lg"
            >
              <option value="">All Populations</option>
              <option value="small">Small (&lt; 1M)</option>
              <option value="medium">Medium (1M - 10M)</option>
              <option value="large">Large (&gt; 10M)</option>
            </select>
          </div>

          {/* Currency */}
          <div className="bg-white rounded-xl ">
            <label className="block text-sm text-gray-600 mb-1">Currency</label>
            <select
              value={currency || 'All Currencies'}
              onChange={handleCurrencyChange}
              className="w-full p-2 border border-gray-200 rounded-lg"
            >
              {getCurrencies().map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>

          {/* Time Zone */}
          <div className="bg-white rounded-xl ">
            <label className="block text-sm text-gray-600 mb-1">Time Zone</label>
            <select
              value={timeZone || 'All Time Zones'}
              onChange={handleTimeZoneChange}
              className="w-full p-2 border border-gray-200 rounded-lg"
            >
              {getTimeZones().map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Cache Button */}
          <div className="flex items-end">
            <button
              onClick={handleClearCache}
              className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-lg border hidden border-red-200 hover:bg-red-100 transition"
            >
              Clear Cache
            </button>
          </div>
        </div>
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
          >
            Previous
          </button>
          <span className="py-2 px-4">Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CountryList;