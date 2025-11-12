import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import "../styles/Cart.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutPopup from "../components/LogoutPopup";
import { useFavourites } from "../contexts/FavouritesContext"; // ✅ Context import

const Cart = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart, setItems } =
    useCart();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const { favourites, favouriteCount, addToFavourites, removeFromFavourites } =
    useFavourites();

  // 🧩 Load cart from DB
  // useEffect(() => {
  //   const fetchCart = async () => {
  //     try {
  //       const res = await axios.get(`https://stylesphere-backend-clean.onrender.com/api/cart/${userId}`);
  //       setItems(res.data?.items || []);
  //     } catch (err) {
  //       console.error("Error fetching cart:", err);
  //     }
  //   };
  //   if (userId) fetchCart();
  // }, [userId, setItems]);
  // ❌ Remove the old useEffect that calls axios.get
  // ✅ Replace with:
  useEffect(() => {
    // When context updates items, re-render happens automatically
    // No need to fetch manually here
  }, [items]);

  // 🧩 Sync cart to DB whenever items change
  useEffect(() => {
    if (!userId || items.length === 0) return;
    const saveCart = async () => {
      try {
        await axios.post(
          `https://stylesphere-backend-clean.onrender.com/api/cart/${userId}`,
          { items }
        );
      } catch (err) {
        console.error("Error saving cart:", err);
      }
    };
    saveCart();
  }, [items, userId]);

  // // 🧩 Fetch favourites count for header
  // useEffect(() => {
  //   const loadFavs = async () => {
  //     try {
  //       const res = await axios.get(
  //         `https://stylesphere-backend-clean.onrender.com/api/favourites/${userId}`
  //       );
  //       setFavouriteCount(res.data?.length || 0);
  //     } catch (err) {
  //       console.error("Error fetching favourites:", err);
  //     }
  //   };
  //   if (userId) loadFavs();
  // }, [userId]);

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems: items, total } });
  };

  return (
    <div className="cart-page">
      {/* ✅ Header */}
      <header className="header-menu">
        <h1 className="logo" onClick={() => navigate("/home")}>
          StyleSphere
        </h1>
        <nav className="nav-links">
          <span className="fav-link" onClick={() => navigate("/favourites")}>
            ❤️ Favourites ({favouriteCount})
          </span>
          <span className="cart-link" onClick={() => navigate("/cart")}>
            🛍️ Cart ({items.reduce((t, i) => t + (i.quantity || 0), 0)})
          </span>
          <span
            className="logout-link"
            onClick={() => setShowLogoutPopup(true)}
          >
            🚪 Logout
          </span>
        </nav>
      </header>

      {showLogoutPopup && (
        <LogoutPopup onClose={() => setShowLogoutPopup(false)} />
      )}

      <h1 className="app-title">🛍️ Your Shopping Bag</h1>

      {items.length === 0 ? (
        <div className="empty-cart">
          <img
            src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
            alt="Empty Cart"
            className="empty-cart-img"
          />
          <h2>Your cart is empty!</h2>
          <p>Explore our collections and add your favorite products.</p>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items scrollable">
            {items.map((item, index) => (
              <div className="cart-item" key={index}>
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="cart-img"
                />
                <div className="cart-item-right">
                  <h3>{item.productTitle || item.name}</h3>
                  <p>Size: {item.size}</p>
                  <div className="cart-price">
                    <span className="current-price">₹{item.price}</span>
                    <span className="original-price">
                      ₹{item.originalPrice}
                    </span>
                  </div>
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id, item.size)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <p>Total Items: {items.length}</p>
            <p>Total Price: ₹{total.toFixed(2)}</p>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
