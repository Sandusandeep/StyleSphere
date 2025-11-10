import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import "../styles/Checkout.css";

const Checkout = () => {
  const { state } = useLocation();
  const product = state?.product;
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!product) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "80px" }}>
        No product selected.
      </h2>
    );
  }

  return (
    <div className="checkout-page">
      {/* HEADER */}
      <header className="header-menu">
        <h1 className="logo">StyleSphere</h1>
        <nav className="nav-links">
          <span onClick={() => navigate("/home")} className="nav-item">
            🏠 Home
          </span>
          <span onClick={() => navigate("/cart")} className="nav-item">
            🛍️ Cart
          </span>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-card">
          <div className="checkout-left">
            <img src={product.images?.[0]} alt={product.name} />
          </div>

          <div className="checkout-right">
            <h2>{product.productTitle}</h2>
            <p className="checkout-price">
              ₹{product.price}{" "}
              <span className="original-price">₹{product.originalPrice}</span>
            </p>
            <p>
              <strong>Size:</strong>{" "}
              {product.size || product.availableSizes?.[0]}
            </p>
            <p>
              <strong>Fabric:</strong> {product.fabricType || "Cotton Blend"}
            </p>
            <p>
              <strong>Description:</strong> {product.description}
            </p>
            <p>
              <strong>Reviews:</strong> ⭐⭐⭐⭐☆ (based on{" "}
              {product.comments?.length || 20} reviews)
            </p>

            <div className="checkout-buttons">
              <button
                className="add-btn"
                onClick={() =>
                  addToCart(
                    product,
                    product.size || product.availableSizes?.[0],
                    1
                  )
                }
              >
                Add to Bag
              </button>
              <button
                className="pay-btn"
                onClick={() => navigate("/payment", { state: { product } })}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
