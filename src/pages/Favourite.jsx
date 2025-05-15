import { useEffect, useState } from 'react';
import { useCountryContext } from '../context/CountryContext';
import { toast } from 'react-hot-toast';

function Favorites() {
  const { favorites, fetchCountryByCode, removeFavoriteCountry, loading, error } = useCountryContext();
  const [favoriteCountries, setFavoriteCountries] = useState([]);

  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      try {
        const countryPromises = favorites.map((cca3) => fetchCountryByCode(cca3, 'en'));
        const countryResponses = await Promise.all(countryPromises);
        setFavoriteCountries(countryResponses.map((res) => res.data));
      } catch (err) {
        toast.error('Failed to fetch favorite countries');
      }
    };
    if (favorites.length > 0) {
      fetchFavoriteDetails();
    } else {
      setFavoriteCountries([]);
    }
  }, [favorites, fetchCountryByCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-white">
        <div className="text-2xl font-semibold text-gray-800 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-white">
        <div className="text-2xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  if (!favoriteCountries.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-white">
        <div className="text-2xl font-semibold text-gray-600">No favorites yet</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white py-8 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="container mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-600 mb-8 animate-fade-in-down">
          Favorite Countries
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {favoriteCountries.map((country) => (
            <div
              key={country.cca3}
              className="bg-gray-100 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
            >
              <img
                src={country.flags?.png}
                alt={`${country.name?.common} flag`}
                className="w-full h-32 sm:h-40 object-cover rounded-t-xl"
              />
              <div className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  {country.name?.common}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  <strong>Capital:</strong> {country.capital?.[0] || 'N/A'}
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
      </div>
    </div>
  );
}

export default Favorites;