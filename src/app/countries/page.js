"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchCountries } from "@/lib/features/countries/countriesSlice";
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Image from "next/image";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const Countries = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const countries = useSelector((state) => state.countries.countries);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("nameAsc");
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  if (!countries || countries.length === 0) return <div>Loading...</div>;

  const getCurrencies = (country) => {
    if (!country.currencies) return "N/A";
    return Object.values(country.currencies)
      .map((c) => `${c.name} (${c.symbol})`)
      .join(", ");
  };

  const filteredCountries = countries
    .filter((c) =>
      c.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case "nameAsc":
          return a.name.common.localeCompare(b.name.common);
        case "nameDesc":
          return b.name.common.localeCompare(a.name.common);
        case "popAsc":
          return a.population - b.population;
        case "popDesc":
          return b.population - a.population;
        default:
          return 0;
      }
    });

  const handleCountryClick = (name) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/countries/${encodeURIComponent(slug)}`);
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: `url("/images/earth1.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundAttachment: "fixed",
        paddingTop: "80px",
        paddingX: 2,
        paddingBottom: 4,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.55)", // darkness level here
          zIndex: 0,
        },
      }}
    >
      {/* SEARCH + SORT */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        {/* Search */}
        <TextField
          label="🔍 Search for a country"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={(theme) => ({
            width: 220,
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              backgroundColor:
                theme.palette.mode === "light"
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.1)",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light"
                    ? "rgba(255,255,255,1)"
                    : "rgba(255,255,255,0.15)",
              },
              "&.Mui-focused": {
                boxShadow:
                  theme.palette.mode === "light"
                    ? "0 0 0 3px rgba(25, 118, 210, 0.3)"
                    : "0 0 0 3px rgba(144, 202, 249, 0.3)",
              },
            },
          })}
        />

        {/* Sort */}
        <FormControl
          size="small"
          sx={(theme) => ({
            width: 180,
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              backgroundColor:
                theme.palette.mode === "light"
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.1)",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light"
                    ? "rgba(255,255,255,1)"
                    : "rgba(255,255,255,0.15)",
              },
            },
          })}
        >
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Sort by"
          >
            <MenuItem value="nameAsc">
              <SortByAlphaIcon sx={{ mr: 1 }} /> Name (A → Z)
            </MenuItem>
            <MenuItem value="nameDesc">
              <SortByAlphaIcon sx={{ mr: 1 }} /> Name (Z → A)
            </MenuItem>
            <MenuItem value="popAsc">
              <PeopleAltIcon sx={{ mr: 1 }} /> Population (Low → High)
            </MenuItem>
            <MenuItem value="popDesc">
              <PeopleAltIcon sx={{ mr: 1 }} /> Population (High → Low)
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* COUNTRY CARDS */}
      <Grid container spacing={2} justifyContent="center">
        {filteredCountries.map((country) => (
          <Grid item key={country.name.common}>
            <Card
              sx={{
                width: 220,
                height: 260,
                borderRadius: 3,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.25s, box-shadow 0.25s",
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 3,
                  backgroundColor: "rgba(255,255,255,0.25)",
                },
              }}
            >
              <CardActionArea
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => handleCountryClick(country.name.common)}
              >
                <Box
                  sx={{ height: "50%", width: "100%", position: "relative" }}
                >
                  <Image
                    src={country.flags.svg}
                    alt={country.name.common}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>

                <CardContent
                  sx={{
                    height: "50%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Typography variant="h5">{country.name.common}</Typography>
                  <Typography variant="body2">
                    <strong>Population:</strong>{" "}
                    {country.population.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Currency:</strong> {getCurrencies(country)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Back to Top Button */}
      {showScroll && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          sx={(theme) => ({
            position: "fixed",
            bottom: 32,
            right: 32,
            borderRadius: "50%",
            minWidth: "56px",
            minHeight: "56px",
            zIndex: 1200,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            backgroundColor:
              theme.palette.mode === "light"
                ? "rgba(25,118,210,0.85)"
                : "rgba(144,202,249,0.85)",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? "rgba(25,118,210,1)"
                  : "rgba(144,202,249,1)",
              transform: "translateY(-3px)",
            },
            transition: "all 0.3s ease",
          })}
        >
          <ArrowUpwardIcon />
        </Button>
      )}
    </Box>
  );
};
export default Countries;
