// src/contexts/FavouritesContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);
  const [favouriteCount, setFavouriteCount] = useState(0);
  const userId = localStorage.getItem("userId");

  // ✅ Load existing favourites from DB on first render
  useEffect(() => {
    const fetchFavourites = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/favourites/${userId}`
        );
        setFavourites(res.data || []);
        setFavouriteCount(res.data.length || 0);
      } catch (err) {
        console.error("Error loading favourites:", err);
      }
    };
    fetchFavourites();
  }, [userId]);

  // ✅ Add to favourites (local + count update)
  const addToFavourites = (product) => {
    setFavourites((prev) => [...prev, product]);
    setFavouriteCount((prev) => prev + 1);
  };

  // ✅ Remove from favourites (local + count update)
  const removeFromFavourites = async (productId) => {
    try {
      // Remove from backend too
      await axios.delete(
        `http://localhost:5000/api/favourites/${userId}/${productId}`
      );

      // Update local context
      setFavourites((prev) =>
        prev.filter((item) => {
          // Case 1: item.productId._id exists
          if (item.productId?._id) return item.productId._id !== productId;
          // Case 2: plain product object
          return item._id !== productId;
        })
      );

      setFavouriteCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Error removing favourite:", err);
    }
  };

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        favouriteCount,
        addToFavourites,
        removeFromFavourites,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => useContext(FavouritesContext);
