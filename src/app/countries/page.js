"use client";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "@/lib/features/countries/countriesSlice";
import { useEffect } from "react";

const Countries = () => {
  const countries = useSelector((state) => state.countries.countries);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  console.log("Countries:", countries);

  const getCurrencies = (country) => {
    if (!country.currencies) return "N/A";
    return Object.values(country.currencies)
      .map((currency) => currency.name)
      .join(", ");
  };

  return (
    <div>
      <h1>Countries</h1>
      <p>Total Countries: {countries.length}</p>
      <ul>
        {countries.map((country, index) => (
          <li key={index}>
            <h2>{country.name.common}</h2>
            <p>Population: {country.population.toLocaleString()}</p>
            <p>Currencies: {getCurrencies(country)}</p>
            {country.flags && country.flags.png && (
              <img
                src={country.flags.png}
                alt={`Flag of ${country.name.common}`}
                width="100"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Countries;
