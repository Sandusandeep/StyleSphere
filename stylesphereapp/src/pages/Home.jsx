import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import axios from "axios";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import ProductPopup from "../components/ProductPopup";
import LogoutPopup from "../components/LogoutPopup";
import { useFavourites } from "../contexts/FavouritesContext"; // ✅ Context import

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  //const [favouriteCount, setFavouriteCount] = useState(0);
  const { favourites, favouriteCount, addToFavourites, removeFromFavourites } =
    useFavourites();

  const { addToCart, items } = useCart();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // 🔹 Fetch banner + product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, productRes] = await Promise.all([
          axios.get(
            "https://stylesphere-backend-clean.onrender.com/api/banners"
          ),
          axios.get(
            "https://stylesphere-backend-clean.onrender.com/api/products"
          ),
        ]);
        setBanners(bannerRes.data);
        const shuffled = productRes.data.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 8));
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchData();
  }, []);

  // // 🔹 Load favourite count from DB
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

  // 🔹 Auto-slide banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners]);

  // ❤️ Add product to favourites (DB)
  const handleAddToFavourites = async (product) => {
    if (!userId) {
      alert("Please log in first to add favourites.");
      return;
    }
    try {
      await axios.post(
        `https://stylesphere-backend-clean.onrender.com/api/favourites`,
        {
          userId,
          productId: product._id || product.id,
        }
      );
      addToFavourites(product); // ✅ update context
      alert(`${product.productTitle} added to Favourites ❤️`);
    } catch (err) {
      console.error("Error adding favourite:", err);
      alert("Error saving to favourites.");
    }
  };

  const handleBuyNow = (product) => {
    navigate("/checkout", { state: { product } });
  };

  return (
    <div className="home-container">
      {/* ✅ Header Menu */}
      <header className="header-menu">
        <h1 className="logo" onClick={() => navigate("/home")}>
          StyleSphere
        </h1>
        <nav className="nav-links">
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
          <div className="dropdown">
            <span onClick={() => navigate("/products?type=Kids")}>Kids</span>
            <div className="dropdown-content">
              <p onClick={() => navigate("/products?type=Kids&name=Dresses")}>
                Dresses
              </p>
            </div>
          </div>
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

          <span className="fav-link" onClick={() => navigate("/favourites")}>
            ❤️ Favourites ({favouriteCount})
          </span>
          <span className="cart-link" onClick={() => navigate("/cart")}>
            🛍️ Cart (
            {items.reduce((total, item) => total + (item.quantity || 0), 0)})
          </span>
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

      {/* ✅ Banner Section */}
      <section className="banner-section">
        {banners.length > 0 && (
          <img
            src={banners[currentBanner].img}
            alt="banner"
            className="banner-image"
          />
        )}
      </section>

      {/* ✅ Product Section */}
      <section className="products-section">
        <h2 className="section-title">🔥 Hot Deals & Discounts</h2>
        <div className="products-grid">
          {products.map((p, index) => (
            <div
              key={p._id || p.id}
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
                alt={p.name}
                className="product-img"
              />
              <h3>{p.productTitle}</h3>
              <p className="price">
                ₹{p.price}{" "}
                <span className="original-price">₹{p.originalPrice}</span>
              </p>

              <div className="btn-group">
                <button
                  className="fav-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToFavourites(p);
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
      </section>

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

export default Home;
