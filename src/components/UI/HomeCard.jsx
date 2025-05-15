import React from 'react';
import { Link } from 'react-router-dom';
import { useCountryContext } from '../../context/CountryContext';
import { FaHeart } from 'react-icons/fa';

const HomeCard = ({ country }) => {
  const { language } = useCountryContext();

  const displayName =
    language === 'en'
      ? country.name?.common || 'Unknown'
      : country.translations?.[language]?.common || country.name?.common || 'Unknown';

  return (
    <div className="flex-shrink-0 w-60 sm:w-72 mx-2 sm:mx-4 bg-gray-50 border border-gray-200  shadow-lg transition-all duration-300 hover:shadow-xl relative group">
      <Link to={`/country/${country.cca3}`}>
        <div className="relative  w-full h-40 sm:h-48 overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            src={country.flags?.png || 'https://via.placeholder.com/150'}
            alt={`${country.name?.common || 'Country'} flag`}
          />
          {/* Hover overlay with country name */}
          <div className="absolute inset-0 bg-black/60 bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-base sm:text-lg font-bold text-center px-4 drop-shadow-md line-clamp-2">
              {displayName}
            </span>
          </div>
        </div>
      </Link>
      <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-sm text-xs sm:text-sm font-semibold text-gray-700">
        🌏 {country.area ? `${country.area.toLocaleString()} km²` : 'N/A'}
      </div>
      <div className="p-4 sm:p-5">
        <Link to={`/country/${country.cca3}`}>
          <h5 className="mb-2 text-lg sm:text-xl font-bold tracking-tight text-gray-900 line-clamp-1">
            {displayName}
          </h5>
        </Link>
        <p className="mb-1 font-normal text-gray-700 text-xs sm:text-sm">
          <strong>Capital:</strong> {country.capital?.[0] || 'N/A'}
        </p>
        <p className="mb-1 font-normal text-gray-700 text-xs sm:text-sm">
          <strong>Region:</strong> {country.region || 'N/A'}
        </p>
        <p className="mb-3 font-normal text-gray-700 text-xs sm:text-sm">
          <strong>Population:</strong> {country.population ? country.population.toLocaleString() : 'N/A'}
        </p>
        
      </div>
    </div>
  );
};

export default HomeCard;