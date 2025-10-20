import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ RECOMMENDED - One API call with all data
const api =
  "https://restcountries.com/v3.1/all?fields=name,flags,population,currencies,capital,languages,region,subregion,area,latlng";

const initialState = {
  countries: [],
  selectedCountry: null,
  loading: false,
  error: null,
};

export const fetchCountries = createAsyncThunk(
  "countries/fetchAll",
  async () => {
    const response = await axios.get(api);

    return response.data;
  }
);

export const selectCountryByName = (state, countryName) => {
  return state.countries.find(
    (country) =>
      country.name.common.toLowerCase() === countryName.toLowerCase() ||
      country.name.official.toLowerCase() === countryName.toLowerCase()
  );
};

export const countriesSlice = createSlice({
  name: "countries",
  initialState,
  reducers: {
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
      state.error = null;
    },
    clearSelectedCountry: (state) => {
      state.selectedCountry = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCountries.fulfilled, (state, action) => {
      state.countries = action.payload;
    });
  },
});
export const { setSelectedCountry, clearSelectedCountry } =
  countriesSlice.actions;

export default countriesSlice.reducer;
