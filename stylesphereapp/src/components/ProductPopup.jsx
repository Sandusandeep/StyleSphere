import React, { useState, useEffect } from "react";
import "../styles/ProductPopup.css";

const ProductPopup = ({ product, onClose, onAddToCart, onBuyNow }) => {
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0]);
  const [selectedSize, setSelectedSize] = useState(
    product?.availableSizes?.[0]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden"; // disable background scroll
    return () => {
      document.body.style.overflow = "auto"; // enable scroll on close
    };
  }, []);

  if (!product) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-content"
        onClick={(e) => e.stopPropagation()} // prevent close on inner click
      >
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="popup-details">
          {/* LEFT SECTION */}
          <div className="popup-left">
            <div className="main-image">
              <img src={selectedImage} alt="selected" />
            </div>

            <div className="thumbnail-list">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  className={`thumbnail ${
                    selectedImage === img ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="popup-right">
            <h2>{product.productTitle}</h2>
            <p className="popup-price">
              ₹{product.price}{" "}
              <span className="original-price">₹{product.originalPrice}</span>
            </p>

            <p className="popup-desc">{product.description}</p>

            <h4>Available Sizes:</h4>
            <div className="size-list">
              {product.availableSizes?.map((size) => (
                <span
                  key={size}
                  className={`size-box ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </span>
              ))}
            </div>

            <div className="popup-buttons">
              <button
                className="add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product, selectedSize, 1);
                  onClose();
                }}
              >
                Add to Cart
              </button>
              <button
                className="buy-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onBuyNow({ ...product, size: selectedSize });
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPopup;
