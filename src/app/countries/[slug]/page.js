"use client";
import { useAuth } from "@/app/context/AuthContext";
import FavouriteButton from "@/components/FavouriteButton";
import {
  clearSelectedCountry,
  setSelectedCountry,
  fetchCountries,
} from "@/lib/features/countries/countriesSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CountryPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { selectedCountry, loading, error, countries } = useSelector(
    (state) => state.countries
  );

  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const fetchWeatherData = async (capital) => {
    if (!capital) return;
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERAPI;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          capital
        )}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error("Weather data not available");
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setWeatherError(err.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    if (countries.length === 0) dispatch(fetchCountries());
  }, [countries.length, dispatch]);

  useEffect(() => {
    if (selectedCountry?.capital?.[0])
      fetchWeatherData(selectedCountry.capital[0]);
  }, [selectedCountry]);

  useEffect(() => {
    if (slug && countries.length > 0) {
      const countryName = decodeURIComponent(slug.replace(/-/g, " "));
      const foundCountry = countries.find(
        (c) =>
          c.name.common.toLowerCase() === countryName.toLowerCase() ||
          c.name.official.toLowerCase() === countryName.toLowerCase()
      );
      if (foundCountry) dispatch(setSelectedCountry(foundCountry));
      else dispatch(clearSelectedCountry());
    }
    return () => dispatch(clearSelectedCountry());
  }, [slug, countries, dispatch]);

  const handleBack = () => router.push("/countries");

  if (loading || countries.length === 0)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6">Loading countries data...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        gap={2}
      >
        <Typography variant="h6" color="error">
          Error loading country: {error}
        </Typography>
        <Button
          variant="contained"
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
        >
          Back to Countries
        </Button>
      </Box>
    );

  if (!selectedCountry)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        gap={2}
      >
        <Typography variant="h6">Country not found</Typography>
        <Button
          variant="contained"
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
        >
          Back to Countries
        </Button>
      </Box>
    );

  const getCurrencies = (country) => {
    if (!country.currencies) return "N/A";
    return Object.values(country.currencies)
      .map((c) => `${c.name} (${c.symbol})`)
      .join(", ");
  };

  const getLanguages = (country) => {
    if (!country.languages) return "N/A";
    return Object.values(country.languages).join(", ");
  };

  const formatPopulation = (pop) => new Intl.NumberFormat().format(pop);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Button
        variant="outlined"
        onClick={handleBack}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Countries
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column: Flag + Name + Favourite + Details */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={3}
                >
                  {/* Flag */}
                  <Image
                    width={300}
                    height={200}
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                    src={
                      selectedCountry.flags?.svg || selectedCountry.flags?.png
                    }
                    alt={`Flag of ${selectedCountry.name?.common}`}
                    priority
                  />

                  {/* Name + Favourite */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h3" component="h1">
                      {selectedCountry.name?.common}
                    </Typography>
                    {user && <FavouriteButton country={selectedCountry} />}
                  </Box>

                  {/* Country Details */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    width="100%"
                  >
                    <Typography variant="body1">
                      <strong>Population:</strong>{" "}
                      {formatPopulation(selectedCountry.population)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Capital:</strong>{" "}
                      {selectedCountry.capital?.join(", ") || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Currencies:</strong>{" "}
                      {getCurrencies(selectedCountry)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Languages:</strong>
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {getLanguages(selectedCountry)
                        .split(", ")
                        .map((lang, index) => (
                          <Chip key={index} label={lang} size="small" />
                        ))}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Weather + Map */}
          <Grid
            item
            xs={12}
            md={6}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            {/* Weather */}
            {weatherData && (
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Weather in {selectedCountry.capital[0]}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={2}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Image
                        width={80}
                        height={80}
                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                        alt={weatherData.weather[0].description}
                      />
                      <Box>
                        <Typography variant="h3">
                          {Math.round(weatherData.main.temp)}°C
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          {weatherData.weather[0].main}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography>
                        <strong>Humidity:</strong> {weatherData.main.humidity}%
                      </Typography>
                      <Typography>
                        <strong>Wind Speed:</strong> {weatherData.wind.speed}{" "}
                        m/s
                      </Typography>
                      <Typography>
                        <strong>Feels like:</strong>{" "}
                        {Math.round(weatherData.main.feels_like)}°C
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Map */}
            {selectedCountry.latlng && (
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Location Map
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      width: "100%",
                      height: 300,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps?q=${selectedCountry.latlng[0]},${selectedCountry.latlng[1]}&hl=en&z=5&output=embed`}
                      allowFullScreen
                    />
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CountryPage;
