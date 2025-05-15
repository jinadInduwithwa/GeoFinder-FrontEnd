import React from "react";
import { Link } from "react-router-dom";
import { useCountryContext } from "../../context/CountryContext";
import { FaHeart } from "react-icons/fa";

const Card = ({ country }) => {
  const { language, favorites, addFavoriteCountry, removeFavoriteCountry } = useCountryContext();
  const isFavorited = favorites.includes(country.cca3);

  const formatPopulation = (pop) => {
    const num = Number(pop);
    if (isNaN(num)) return "N/A";
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleFavoriteToggle = () => {
    if (isFavorited) {
      removeFavoriteCountry(country.cca3);
    } else {
      addFavoriteCountry(country.cca3);
    }
  };

  const displayName =
    language === "en"
      ? country.name.common
      : country.translations?.[language]?.common || country.name.common;

  const languageList = Object.values(country.languages || {})
    .slice(0, 3)
    .join(", ") + (Object.keys(country.languages || {}).length > 3 ? "..." : "");

  return (
    <div className="w-full max-w-sm bg-gray-50 border border-gray-200  shadow-lg transition-all duration-300 hover:shadow-xl mx-auto relative group">
      <Link to={`/country/${country.cca3}`}>
        <div className="relative  w-full h-40 overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            src={country.flags.png}
            alt={`${country.name.common} flag`}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 duration-300">
            <span className="text-white text-lg font-bold text-center px-4 drop-shadow-md">
              {displayName}
            </span>
          </div>
        </div>
      </Link>
      <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-sm text-sm font-semibold text-gray-700">
        🌏 {country.area ? `${formatPopulation(country.area)} km²` : "N/A"}
      </div>
      <div className="p-5">
        <Link to={`/country/${country.cca3}`}>
          <h5 className="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            {displayName}
          </h5>
        </Link>
        <p className="mb-1 font-normal text-gray-700 text-sm sm:text-base">
          <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
        </p>
        <p className="mb-1 font-normal text-gray-700 text-sm sm:text-base">
          <strong>Region:</strong> {country.region || "N/A"}
        </p>
        <p className="mb-1 font-normal text-gray-700 text-sm sm:text-base">
          <strong>Languages:</strong> {languageList || "N/A"}
        </p>
        <p className="mb-3 font-normal text-gray-700 text-sm sm:text-base">
          <strong>Population:</strong> {country.population ? formatPopulation(country.population) : "N/A"}
        </p>
        <div className="flex flex-row gap-4 sm:gap-10 items-center">
          <Link
            to={`/country/${country.cca3}`}
            className="inline-flex items-center px-2 py-1 text-sm font-medium text-center rounded-lg hover:bg-green-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 dark:hover:bg-green-500 dark:focus:ring-green-800 transition-all duration-300"
          >
            <span className="text-green-500 hover:text-white font-semibold">Explore</span>
          </Link>
          <FaHeart
            className={`text-xl sm:text-xl ${isFavorited ? 'text-red-500' : 'text-green-500'} hover:${isFavorited ? 'text-red-700' : 'text-green-700'} transition-colors duration-200 cursor-pointer`}
            onClick={handleFavoriteToggle}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;