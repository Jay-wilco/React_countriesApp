"use client";
import { useAuth } from "../../context/AuthContext";
import FavouriteButton from "../../components/FavouriteButton";
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
import { useTheme } from "@mui/material/styles";

const CountryPage = () => {
  const theme = useTheme(); // detect light/dark theme
  const { slug } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { selectedCountry, loading, error, countries } = useSelector(
    (state) => state.countries
  );

  const [weatherData, setWeatherData] = useState(null);

  const fetchWeatherData = async (capital) => {
    if (!capital) return;
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
      console.error(err);
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

  const bgImage =
    theme.palette.mode === "dark"
      ? "/images/pexels-pixabay-moon2.jpg"
      : "/images/pexels-pixabay-sun.jpg";

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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        justifyContent: "center",
        pt: "80px",
      }}
    >
      {/* Overlay for light transparency */}
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,0.5)"
              : "rgba(255,255,255,0.3)",
          backdropFilter: "blur(4px)",
          p: 3,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Back to Countries
        </Button>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(18,18,18,0.5)"
                : "rgba(255,255,255,0.5)",
            backdropFilter: "blur(8px)",
            borderRadius: 3,
          }}
        >
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: "100%",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(18,18,18,0.4)"
                      : "rgba(255,255,255,0.4)",
                  backdropFilter: "blur(6px)",
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={3}
                  >
                    <Image
                      width={300}
                      height={200}
                      style={{
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ddd",
                      }}
                      src={
                        selectedCountry.flags?.svg || selectedCountry.flags?.png
                      }
                      alt={`Flag of ${selectedCountry.name?.common}`}
                      priority
                    />

                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                          color:
                            theme.palette.mode === "dark" ? "#fff" : "#222",
                        }}
                      >
                        {selectedCountry.name?.common}
                      </Typography>
                      {user && <FavouriteButton country={selectedCountry} />}
                    </Box>

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
                          .map((lang, idx) => (
                            <Chip key={idx} label={lang} size="small" />
                          ))}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column */}
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
                <Card
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(18,18,18,0.4)"
                        : "rgba(255,255,255,0.4)",
                    backdropFilter: "blur(6px)",
                    borderRadius: 3,
                  }}
                >
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
                          <Typography
                            variant="h3"
                            sx={{
                              color:
                                theme.palette.mode === "dark" ? "#fff" : "#222",
                            }}
                          >
                            {Math.round(weatherData.main.temp)}°C
                          </Typography>
                          <Typography variant="h6" color="text.secondary">
                            {weatherData.weather[0].main}
                          </Typography>
                        </Box>
                      </Box>

                      <Box display="flex" flexDirection="column" gap={1}>
                        <Typography
                          sx={{
                            color:
                              theme.palette.mode === "dark" ? "#fff" : "#222",
                          }}
                        >
                          <strong>Humidity:</strong> {weatherData.main.humidity}
                          %
                        </Typography>
                        <Typography
                          sx={{
                            color:
                              theme.palette.mode === "dark" ? "#fff" : "#222",
                          }}
                        >
                          <strong>Wind Speed:</strong> {weatherData.wind.speed}{" "}
                          m/s
                        </Typography>
                        <Typography
                          sx={{
                            color:
                              theme.palette.mode === "dark" ? "#fff" : "#222",
                          }}
                        >
                          <strong>Feels like:</strong>{" "}
                          {Math.round(weatherData.main.feels_like)}°C
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Map */}
              {selectedCountry.capital?.[0] && (
                <Card
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(18,18,18,0.4)"
                        : "rgba(255,255,255,0.4)",
                    backdropFilter: "blur(6px)",
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        color: theme.palette.mode === "dark" ? "#fff" : "#222",
                      }}
                    >
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
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(
                          selectedCountry.capital[0]
                        )}&t=&z=5&ie=UTF8&iwloc=&output=embed`}
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
    </Box>
  );
};

export default CountryPage;
