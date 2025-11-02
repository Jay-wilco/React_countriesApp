"use client";
import { useAuth } from "@/app/context/AuthContext";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavourite,
  removeFavourite,
} from "../lib/features/favourites/favouritesSlice";

const FavouriteButton = ({ country }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const isFavourite = useSelector((state) =>
    state.favourites.favourites.some(
      (f) => f.country_name === country?.name?.common
    )
  );
  const loading = useSelector((state) => state.favourites.loading);

  const toggleFavourite = () => {
    if (isFavourite) {
      dispatch(removeFavourite(country.name.common));
    } else {
      dispatch(addFavourite(country));
    }
  };

  if (!user) return null;

  return (
    <Tooltip
      title={isFavourite ? "Remove from favourites" : "Add to favourites"}
    >
      <span>
        <IconButton
          onClick={toggleFavourite}
          disabled={loading}
          color={isFavourite ? "error" : "primary"}
        >
          {isFavourite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default FavouriteButton;
