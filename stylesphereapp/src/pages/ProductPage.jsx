import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/ProductPage.css";
import { useCart } from "../contexts/CartContext";
import { useFavourites } from "../contexts/FavouritesContext"; // ✅ Context import
import ProductPopup from "../components/ProductPopup";
import LogoutPopup from "../components/LogoutPopup";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const itemsPerPage = 28;
  const navigate = useNavigate();
  const location = useLocation();

  const { addToCart, items } = useCart();
  const { favourites, addToFavourites, favouriteCount } = useFavourites(); // ✅ Hook used inside component

  const params = new URLSearchParams(location.search);
  const categoryType = params.get("type");
  const categoryName = params.get("name");

  // ✅ Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error loading products:", err);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Filter products by category
  useEffect(() => {
    if (products.length > 0) {
      let result = products;
      if (categoryType) {
        result = result.filter(
          (p) => p.type.toLowerCase() === categoryType.toLowerCase()
        );
      }
      if (categoryName) {
        result = result.filter(
          (p) =>
            p.name.toLowerCase().replace("-", "") ===
            categoryName.toLowerCase().replace("-", "")
        );
      }
      setFiltered(result);
      setCurrentPage(1);
    }
  }, [products, categoryType, categoryName]);

  // ✅ Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayed = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // ✅ Handle Buy Now
  const handleBuyNow = (product) => {
    navigate("/checkout", { state: { product } });
  };

  return (
    <div className="productpage-container">
      {/* HEADER MENU */}
      <header className="header-menu">
        <h1 className="logo" onClick={() => navigate("/home")}>
          StyleSphere
        </h1>
        <nav className="nav-links">
          {/* MEN */}
          <div className="dropdown">
            <span onClick={() => navigate("/products?type=Men")}>Men</span>
            <div className="dropdown-content">
              <p onClick={() => navigate("/products?type=Men&name=T-Shirt")}>
                T-Shirts
              </p>
              <p onClick={() => navigate("/products?type=Men&name=Shirt")}>
                Shirts
              </p>
              <p onClick={() => navigate("/products?type=Men&name=Shoes")}>
                Shoes
              </p>
            </div>
          </div>

          {/* WOMEN */}
          <div className="dropdown">
            <span onClick={() => navigate("/products?type=Women")}>Women</span>
            <div className="dropdown-content">
              <p onClick={() => navigate("/products?type=Women&name=Saree")}>
                Saree
              </p>
              <p onClick={() => navigate("/products?type=Women&name=Salwar")}>
                Salwar
              </p>
              <p onClick={() => navigate("/products?type=Women&name=Footwear")}>
                Footwear
              </p>
            </div>
          </div>

          {/* KIDS */}
          <div className="dropdown">
            <span onClick={() => navigate("/products?type=Kids")}>Kids</span>
            <div className="dropdown-content">
              <p onClick={() => navigate("/products?type=Kids&name=Dresses")}>
                Dresses
              </p>
            </div>
          </div>

          {/* ACCESSORIES */}
          <div className="dropdown">
            <span onClick={() => navigate("/products?type=Accessories")}>
              Accessories
            </span>
            <div className="dropdown-content">
              <p
                onClick={() => navigate("/products?type=Accessories&name=Bags")}
              >
                Bags
              </p>
              <p
                onClick={() =>
                  navigate("/products?type=Accessories&name=Glasses")
                }
              >
                Glasses
              </p>
            </div>
          </div>

          {/* ❤️ FAVOURITES */}
          <span
            className="fav-link"
            onClick={() => navigate("/favourites")}
            style={{ cursor: "pointer" }}
          >
            ❤️ Favourites ({favouriteCount})
          </span>

          {/* 🛍️ CART */}
          <span
            className="cart-link"
            onClick={() => navigate("/cart")}
            style={{ cursor: "pointer" }}
          >
            🛍️ Cart (
            {items.reduce((total, item) => total + (item.quantity || 0), 0)} )
          </span>

          {/* 🚪 LOGOUT */}
          <span
            className="logout-link"
            onClick={() => setShowLogoutPopup(true)}
            style={{ cursor: "pointer" }}
          >
            🚪 Logout
          </span>
        </nav>
      </header>

      {showLogoutPopup && (
        <LogoutPopup onClose={() => setShowLogoutPopup(false)} />
      )}

      {/* CATEGORY TITLE */}
      <h2 className="category-title">
        {categoryType} {categoryName ? `› ${categoryName}` : ""} Collection
      </h2>

      {/* PRODUCT GRID */}
      <div className="product-grid">
        {displayed.map((p, index) => (
          <div
            key={p.id}
            className="product-card"
            onClick={() => setSelectedProduct(p)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={
                hoveredIndex === index
                  ? p.images[currentImageIndex[index] || 0]
                  : p.images[0]
              }
              alt={p.productTitle}
              className="product-img"
            />
            <h3>{p.productTitle}</h3>
            <p className="price">
              ₹{p.price}{" "}
              <span className="original-price">₹{p.originalPrice}</span>
            </p>

            {/* ✅ ACTION BUTTONS */}
            <div className="btn-group">
              <button
                className="fav-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addToFavourites(p); // ✅ context handles localStorage + state
                }}
              >
                ❤️ Add to Favs
              </button>

              <button
                className="add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p, p.availableSizes?.[0] || "M", 1);
                }}
              >
                🛒 Add to Bag
              </button>

              <button
                className="buy-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuyNow(p);
                }}
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* PRODUCT POPUP */}
      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onBuyNow={handleBuyNow}
        />
      )}
    </div>
  );
};

export default ProductPage;
