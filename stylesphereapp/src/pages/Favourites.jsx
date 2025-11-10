// src/pages/Favourites.jsx
import React from "react";
import "../styles/Favourites.css";
import { useNavigate } from "react-router-dom";
import { useFavourites } from "../contexts/FavouritesContext";

const Favourites = () => {
  const { favourites, removeFromFavourites } = useFavourites();
  const navigate = useNavigate();

  return (
    <div className="favourites-page">
      <header className="header-menu">
        <h1 className="logo" onClick={() => navigate("/home")}>
          StyleSphere
        </h1>
        <nav className="nav-links">
          <span onClick={() => navigate("/products?type=Men")}>Men</span>
          <span onClick={() => navigate("/products?type=Women")}>Women</span>
          <span onClick={() => navigate("/products?type=Kids")}>Kids</span>
          <button className="cart-link" onClick={() => navigate("/cart")}>
            🛍️ Cart
          </button>
        </nav>
      </header>

      <h2 className="fav-title">
        ❤️ Your Favourite Products ({favourites.length})
      </h2>

      {favourites.length === 0 ? (
        <div className="empty-fav">
          <img
            src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
            alt="No favourites"
          />
          <p>No favourites yet! Explore and add your favourites ❤️</p>
        </div>
      ) : (
        <div className="fav-grid">
          {favourites.map((f) => {
            const product = f.productId || f; // handle both shapes

            return (
              <div key={product._id || product.id} className="fav-card">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.productTitle || "Product"}
                    className="fav-img"
                  />
                ) : (
                  <div className="no-img">No Image</div>
                )}
                <h3>{product.productTitle || "Unnamed Product"}</h3>
                <p className="fav-price">
                  ₹{product.price || "-"}{" "}
                  <span className="original-price">
                    ₹{product.originalPrice || "-"}
                  </span>
                </p>
                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFromFavourites(product._id || product.id)
                  }
                >
                  ❌ Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favourites;
