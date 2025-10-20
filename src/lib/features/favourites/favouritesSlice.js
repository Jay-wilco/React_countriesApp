import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  favourites: [],
  loading: false, // can later be per-country
  error: null,
};

// helper to get current Supabase session
const getCurrentSession = async () => {
  const { supabase } = await import("../../supabase/supabase");
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error("No valid authentication session found");
  }

  return session;
};

// --- Thunks ---

export const fetchFavourites = createAsyncThunk(
  "favourites/fetchFavourites",
  async (_, { rejectWithValue }) => {
    try {
      const session = await getCurrentSession();
      const { supabase } = await import("../../supabase/supabase");
      const { data, error } = await supabase
        .from("favourites")
        .select("*")
        .eq("user_id", session.user.id) // only current user
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addFavourite = createAsyncThunk(
  "favourites/addFavourite",
  async (countryData, { rejectWithValue }) => {
    try {
      const session = await getCurrentSession();
      const { supabase } = await import("../../supabase/supabase");
      const { data, error } = await supabase
        .from("favourites")
        .insert({
          user_id: session.user.id,
          country_name: countryData.name.common,
          country_data: countryData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFavourite = createAsyncThunk(
  "favourites/removeFavourite",
  async (countryName, { rejectWithValue }) => {
    try {
      const session = await getCurrentSession();
      const { supabase } = await import("../../supabase/supabase");
      const { error } = await supabase
        .from("favourites")
        .delete()
        .eq("user_id", session.user.id)
        .eq("country_name", countryName);

      if (error) throw error;
      return countryName;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- Slice ---

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const thunks = [fetchFavourites, addFavourite, removeFavourite];
    thunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          if (thunk === fetchFavourites) state.favourites = action.payload;
          if (thunk === addFavourite) state.favourites.push(action.payload);
          if (thunk === removeFavourite)
            state.favourites = state.favourites.filter(
              (f) => f.country_name !== action.payload
            );
          state.loading = false;
        })
        .addCase(thunk.rejected, (state, action) => {
          console.error(thunk.typePrefix, "failed:", action.payload);
          state.loading = false;
          state.error = action.payload;
        });
    });
  },
});

export default favouritesSlice.reducer;
