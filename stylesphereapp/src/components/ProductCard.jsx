// // src/components/ProductCard.jsx
// import React from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// /**
//  * ProductCard is presentational: shows image, name, price
//  * Clicking image/title navigates to /products/:id
//  */
// const ProductCard = ({ product }) => {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.03 }}
//       style={{
//         background: "#fff",
//         borderRadius: 8,
//         padding: 12,
//         boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
//       }}
//     >
//       <Link
//         to={`/products/${product.id}`}
//         style={{ textDecoration: "none", color: "inherit" }}
//       >
//         <div style={{ height: 200, overflow: "hidden", borderRadius: 8 }}>
//           <img
//             src={product.img}
//             alt={product.name}
//             style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           />
//         </div>
//         <div style={{ marginTop: 8 }}>
//           <div style={{ fontWeight: 700 }}>{product.name}</div>
//           <div style={{ marginTop: 6 }}>₹ {product.price}</div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// };

// export default ProductCard;
import { useCart } from "../contexts/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div
      key={p.id}
      className="product-card"
      onClick={() => setSelectedProduct(p)}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <img src={product.images[0]} alt={product.name} />
      <h3>{product.name}</h3>
      <p>
        ₹{product.price}{" "}
        <span className="line-through">₹{product.originalPrice}</span>
      </p>
      <button
        onClick={() => addToCart(product, "M", 1)}
        className="add-cart-btn"
      >
        Add to Cart
      </button>
    </div>
  );
};
export default ProductCard;
