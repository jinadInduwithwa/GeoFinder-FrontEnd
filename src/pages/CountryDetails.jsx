import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCountryContext } from "../context/CountryContext";
import { ThemeContext } from "../context/ThemeContext";
import { FaGlobe, FaClock, FaLanguage, FaMoneyBillWave, FaInfoCircle, FaHeart, FaArrowLeft, FaMapMarkerAlt, FaExternalLinkAlt, FaWikipediaW, FaMapMarkedAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useTranslation } from "react-i18next";

// Initialize i18next (unchanged)
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          backToCountries: "Back to Countries",
          loading: "Loading...",
          error: "Error",
          noData: "No Data",
          noDataMessage: "No country data found for the provided code.",
          keyInformation: "Key Information",
          capital: "Capital",
          capitalTooltip: "Main administrative city",
          population: "Population",
          populationTooltip: "Total inhabitants",
          area: "Area",
          areaTooltip: "Land area in square kilometers",
          continent: "Continent",
          continentTooltip: "Geographical continent",
          region: "Region",
          regionTooltip: "Geopolitical region",
          detailedInformation: "Detailed Information",
          countryInformation: "Country Information",
          subregion: "Subregion",
          languages: "Languages",
          currencies: "Currencies",
          timezones: "Timezones",
          borderingCountries: "Bordering Countries",
          callingCode: "Calling Code",
          topLevelDomain: "Top-Level Domain",
          independent: "Independent",
          unMember: "UN Member",
          coordinates: "Coordinates",
          drivingSide: "Driving Side",
          whereLocated: "Where is {{country}} Located?",
          timeComparison: "Current Local Time",
          localTime: "Local Time (Your PC)",
          countryTime: "{{country}} Time",
          mapNotAvailable: "Map not available",
          flag: "Flag",
          coatOfArms: "Coat of Arms",
          wikipedia: "Wikipedia",
          openInGoogleMaps: "View on Google Maps",
          viewOnOpenStreetMap: "View on OpenStreetMap",
          externalResources: "External Resources",
          overview: "Overview",
          gallery: "Gallery",
          map: "Map",
          moreDetails: "More Details",
          about: "About {{country}}",
          authError: "Authentication required. Please log in.",
        },
      },
      si: { translation: { /* Sinhala translations */ } },
      ta: { translation: { /* Tamil translations */ } },
      de: { translation: { /* German translations */ } },
      zh: { translation: { /* Chinese translations */ } },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

const CountryDetails = () => {
  const { cca3 } = useParams();
  const navigate = useNavigate();
  const { language: contextLanguage, fetchCountryByCode, loading, error } = useCountryContext();
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [country, setCountry] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(contextLanguage || "en");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countryTime, setCountryTime] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Sync i18next language (unchanged)
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  // Load favorite state (unchanged)
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favoriteCountries") || "[]");
    setIsFavorite(favorites.includes(cca3));
  }, [cca3]);

  // Toggle favorite (unchanged)
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favoriteCountries") || "[]");
    const updatedFavorites = isFavorite
      ? favorites.filter((code) => code !== cca3)
      : [...favorites, cca3];
    localStorage.setItem("favoriteCountries", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  // Fetch country data (unchanged)
  useEffect(() => {
    const getCountry = async () => {
      try {
        const response = await fetchCountryByCode(cca3, selectedLanguage);
        if (!response || !response.data) throw new Error("No country data received");
        setCountry(response.data);
        setAuthError(null);
      } catch (err) {
        console.error("Error fetching country:", err);
        if (err.response && err.response.status === 401) {
          setAuthError(t("authError"));
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setCountry(null);
        }
      }
    };
    getCountry();
  }, [cca3, selectedLanguage, fetchCountryByCode, navigate, t]);

  // Update clocks (unchanged)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (country && country.timezones && country.timezones.length > 0) {
        const timezone = country.timezones[0];
        const match = timezone.match(/UTC([+-])(\d{2}):(\d{2})/);
        if (match) {
          const sign = match[1] === "+" ? 1 : -1;
          const hours = parseInt(match[2], 10);
          const minutes = parseInt(match[3], 10);
          const offsetMinutes = sign * (hours * 60 + minutes);

          const localOffsetMinutes = 5 * 60 + 30;
          const utcTime = now.getTime() - localOffsetMinutes * 60 * 1000;
          const countryTimeMs = utcTime + offsetMinutes * 60 * 1000;
          setCountryTime(new Date(countryTimeMs));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [country]);

  // Formatters (unchanged)
  const formatPopulation = (pop) => {
    const num = Number(pop);
    if (isNaN(num)) return "N/A";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  };

  const formatArea = (area) => {
    const num = Number(area);
    if (isNaN(num)) return "N/A";
    return `${num.toLocaleString()} km²`;
  };

  const formatTime = (date) => {
    if (!date) return "N/A";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleLanguageChange = (lang) => setSelectedLanguage(lang);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 text-lg animate-pulse">
        {t("loading")}
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
        <div className="bg-red-100 dark:bg-gray-800/80 border-l-4 border-red-600 dark:border-gray-400 p-6 rounded-lg shadow-lg max-w-md">
          <p className="font-bold">{t("error")}</p>
          <p>{authError}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
        <div className="bg-red-100 dark:bg-gray-800/80 border-l-4 border-red-600 dark:border-gray-400 p-6 rounded-lg shadow-lg max-w-md">
          <p className="font-bold">{t("error")}</p>
          <p>{error}</p>
          <Link to="/countries-list" className="mt-4 text-indigo-600 dark:text-blue-500 hover:underline">
            {t("backToCountries")}
          </Link>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
        <div className="bg-yellow-100 dark:bg-gray-800/80 border-l-4 border-yellow-600 dark:border-gray-400 p-6 rounded-lg shadow-lg max-w-md">
          <p className="font-bold">{t("noData")}</p>
          <p>{t("noDataMessage")}</p>
          <Link to="/countries-list" className="mt-4 text-indigo-600 dark:text-blue-500 hover:underline">
            {t("backToCountries")}
          </Link>
        </div>
      </div>
    );
  }

  const displayName = selectedLanguage === "en"
    ? country.name?.common || "N/A"
    : country.translations?.[selectedLanguage]?.common || country.name?.common || "N/A";
  const languageList = Object.values(country.languages || {}).join(", ") || "N/A";
  const currencyList = Object.values(country.currencies || {})
    .map((curr) => `${curr.name} (${curr.symbol})`)
    .join(", ") || "N/A";
  const timezoneList = country.timezones?.join(", ") || "N/A";
  const borderList = country.borders?.map((code) => ({
    code,
    name: country.translations?.[selectedLanguage]?.common || code,
  })) || [];
  const callingCode = country.idd ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}` : "N/A";
  const tldList = country.tld?.join(", ") || "N/A";

  const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(displayName.replace(/\s+/g, "_"))}`;
  const googleMapsUrl = country.latlng
    ? `https://www.google.com/maps/@${country.latlng[0]},${country.latlng[1]},5z`
    : "https://www.google.com/maps";
  const openStreetMapUrl = country.latlng
    ? `https://www.openstreetmap.org/#map=5/${country.latlng[0]}/${country.latlng[1]}`
    : "https://www.openstreetmap.org";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 font-sans">
      {/* Hero Section */}
      <div
        className="relative h-64 sm:h-72 md:h-80 shadow-lg overflow-hidden bg-gray-200 dark:bg-gray-900"
        style={{
          backgroundImage: `url(${country.flags?.png || "https://via.placeholder.com/1200x600"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
        <div className="relative p-4 sm:p-6 md:p-8 flex flex-col items-start h-full justify-center">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full">
            <img
              src={country.flags?.png || "https://via.placeholder.com/100x60"}
              alt={`${displayName} flag`}
              className="w-20 h-12 sm:w-24 sm:h-16 md:w-28 md:h-20 rounded shadow-md"
            />
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{displayName}</h1>
              <p className="text-base sm:text-lg md:text-xl text-white opacity-90 mt-1">{country.name?.official || "N/A"}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs sm:text-sm md:text-base text-white">
                <span className="flex items-center">
                  🌐 <span className="ml-1">{t("capital")}:</span>{" "}
                  <span className="ml-1 font-semibold">{country.capital?.[0] || "N/A"}</span>
                </span>
                <span className="flex items-center">
                  👥 <span className="ml-1">{t("population")}:</span>{" "}
                  <span className="ml-1 font-semibold">{formatPopulation(country.population)}</span>
                </span>
                <span className="flex items-center">
                  🌍 <span className="ml-1">{t("area")}:</span>{" "}
                  <span className="ml-1 font-semibold">{formatArea(country.area)}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              to="/countries-list"
              className="inline-flex items-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300 shadow-md"
            >
              <FaArrowLeft className="mr-2 text-green-500 dark:text-green-500" />
              {t("backToCountries")}
            </Link>
            <a
              href={wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-500 dark:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-600 dark:hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-md"
            >
              <FaWikipediaW className="mr-2 text-green-500 dark:text-green-500" />
              {t("wikipedia")}
            </a>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-500 dark:bg-green-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600 dark:hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-md"
            >
              <FaMapMarkedAlt className="mr-2 text-green-500 dark:text-green-500" />
              {t("openInGoogleMaps")}
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (unchanged) */}
      <div className="sticky max-w-4xl mx-auto top-0 z-40 flex justify-around py-3 bg-gray-50  dark:bg-gray-800 rounded-full mt-4 shadow-lg">
        {["overview", "gallery", "map", "moreDetails"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full ${
              activeTab === tab
                ? "bg-green-600 dark:bg-green-800/80 text-white"
                : "text-gray-900 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
            }`}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {/* Main Content (unchanged) */}
      <div className="max-w-4xl mx-auto mt-6 px-4">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-full">
              <h2 className="flex items-center text-xl font-semibold mb-2">
                <FaGlobe className="mr-2 text-green-600 dark:text-green-400" />
                {t("about", { country: displayName })}
              </h2>
              <div className="flex items-center mb-4">
                <img
                  src={country.flags?.png || "https://via.placeholder.com/100x60"}
                  alt={`${displayName} flag`}
                  className="w-32 h-20 mr-4 rounded shadow"
                />
                <div>
                  <p className="text-lg font-semibold">{displayName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{country.name?.official || "N/A"}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This beautiful country has a rich history and culture, with diverse landscapes and friendly people. Visitors can experience unique traditions, taste delicious local cuisine, and explore breathtaking natural wonders.
              </p>
              <div className="text-gray-900 dark:text-gray-200 space-y-2">
                <p><strong>{t("continent")}:</strong> {country.continent?.[0] || "N/A"}</p>
                <p><strong>{t("region")}:</strong> {country.region || "N/A"}</p>
                <p><strong>{t("subregion")}:</strong> {country.subregion || "N/A"}</p>
                <p><strong>{t("languages")}:</strong> {languageList}</p>
                <p><strong>{t("currencies")}:</strong> {currencyList}</p>
                <p><strong>{t("timezones")}:</strong> {timezoneList}</p>
                <p>
                  <strong>{t("borderingCountries")}:</strong>{" "}
                  {borderList.length > 0 ? (
                    borderList.map(({ code, name }, index) => (
                      <span key={code}>
                        <Link
                          to={`/country/${code}`}
                          className="text-green-600 p-2  dark:text-green-500 hover:underline"
                        >
                          {name}
                        </Link>
                        {index < borderList.length - 1 && ", "}
                      </span>
                    ))
                  ) : (
                    "None"
                  )}
                </p>
                <div className="text-gray-600 dark:text-gray-400 space-y-2">
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    {t("coordinates")}: {country.latlng ? `${country.latlng[0]}, ${country.latlng[1]}` : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-full">
              <h2 className="flex items-center text-xl font-semibold mb-2">
                <FaClock className="mr-2 text-green-600 dark:text-green-400" />
                {t("timeComparison")}
              </h2>
              <div className="text-center">
                <p
                  className="text-4xl font-bold text-red-600 dark:text-red-400"
                  dangerouslySetInnerHTML={{ __html: formatTime(countryTime).replace(":", "<span class='blink-colon'>:</span>") }}
                />
                <p className="text-gray-600 dark:text-gray-400">{new Date().toLocaleDateString()}</p>
                <p className="text-gray-600 dark:text-gray-400">Timezone: {country.timezones?.[0] || "N/A"}</p>
              </div>
              <style>
                {`
                  .blink-colon {
                    animation: blink 1s step-end infinite;
                  }
                  @keyframes blink {
                    50% { opacity: 0; }
                  }
                `}
              </style>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-full">
              <h2 className="flex items-center text-xl font-semibold mb-2">
                <FaExternalLinkAlt className="mr-2 text-green-600 dark:text-green-400" />
                {t("externalResources")}
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-blue-500 dark:bg-gray-800/80 text-white dark:text-gray-200 font-semibold py-2 px-4 rounded-full hover:bg-blue-600 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  {t("openInGoogleMaps")}
                </a>
                <a
                  href={openStreetMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-green-500 dark:bg-green-800/80 text-white dark:text-gray-200 font-semibold py-2 px-4 rounded-full hover:bg-green-600 dark:hover:bg-green-700 transform hover:scale-105 transition-all duration-300"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  {t("viewOnOpenStreetMap")}
                </a>
                <a
                  href={wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-indigo-600 dark:bg-indigo-800/80 text-white dark:text-gray-200 font-semibold py-2 px-4 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  {t("wikipedia")}
                </a>
              </div>
            </div>
          </div>
        )}
        {activeTab === "gallery" && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">{t("gallery")}</h2>
            <p className="text-gray-600 dark:text-gray-400">Gallery content coming soon...</p>
          </div>
        )}
        {activeTab === "map" && country.latlng && (
          <div className="mt-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-full">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-4">{t("map")}</h2>
              <div className="h-96 w-full rounded-lg overflow-hidden">
                <MapContainer
                  center={[country.latlng[0], country.latlng[1]]}
                  zoom={4}
                  style={{ height: "100%", width: "100%" }}
                  className="rounded-lg"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[country.latlng[0], country.latlng[1]]}>
                    <Popup>{displayName}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        )}
        {activeTab === "moreDetails" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg ">
              <h2 className="flex items-center text-xl font-semibold mb-2">
                <FaLanguage className="mr-2 text-green-600 dark:text-green-400" />
                {t("languages")}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{languageList}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="flex items-center text-xl font-semibold mb-2">
                <FaMoneyBillWave className="mr-2 text-green-600 dark:text-green-400" />
                {t("currencies")}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{currencyList}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="flex items-center text-xl font-semibold mb-2">
                <FaClock className="mr-2 text-green-600 dark:text-green-400" />
                {t("timezones")}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{timezoneList}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="flex items-center text-xl font-semibold mb-2">
                <FaInfoCircle className="mr-2 text-green-600 dark:text-green-400" />
                {t("detailedInformation")}
              </h2>
              <div className="text-gray-700 dark:text-gray-300">
                <p><strong>{t("subregion")}:</strong> {country.subregion || "N/A"}</p>
                <p><strong>{t("independent")}:</strong> {country.independent ? "Yes" : "No"}</p>
                <p><strong>{t("unMember")}:</strong> {country.unMember ? "Yes" : "No"}</p>
                <p><strong>{t("callingCode")}:</strong> {callingCode}</p>
                <p><strong>{t("topLevelDomain")}:</strong> {tldList}</p>
                <p><strong>{t("drivingSide")}:</strong> {country.car?.side || "N/A"}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg col-span-1 sm:col-span-2 text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">{t("coatOfArms")}</h2>
              <img
                className="w-48 mx-auto"
                src={country.coatOfArms?.png || "https://via.placeholder.com/200x200"}
                alt={`${displayName} coat of arms`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sticky Favorites Button (unchanged) */}
      <div className="fixed bottom-20 right-8 z-50">
        <button
          onClick={toggleFavorite}
          className={`p-4 rounded-full shadow-lg ${
            isFavorite ? "bg-red-600 dark:bg-red-500" : "bg-green-500 dark:bg-green-600"
          } text-white dark:text-gray-200 hover:bg-red-700 dark:hover:bg-red-600 transform hover:scale-110 transition-all duration-300`}
          aria-label={isFavorite ? t("removeFromFavorites") : t("addToFavorites")}
        >
          <FaHeart className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default CountryDetails;