// src/contexts/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // ✅ Helper: always fetch current user's email
  const getUserEmail = () => localStorage.getItem("userEmail");

  // ✅ Fetch cart from DB using email
  const fetchCart = async () => {
    const email = getUserEmail();
    if (!email) return;

    try {
      const res = await axios.get(`https://stylesphere-q6vb.onrender.com/api/cart/${email}`);
      if (res.data && res.data.items) {
        setItems(res.data.items);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      const localCart = localStorage.getItem("cartItems");
      if (localCart) setItems(JSON.parse(localCart));
    }
  };

  // ✅ Run on mount & whenever user logs in/out or navigates to Cart page
  useEffect(() => {
    const fetchCart = async () => {
      const email = getUserEmail();
      if (!email) return;

      try {
        const res = await axios.get(`https://stylesphere-q6vb.onrender.com/api/cart/${email}`);
        if (res.data && res.data.items) {
          setItems(res.data.items);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        const localCart = localStorage.getItem("cartItems");
        if (localCart) setItems(JSON.parse(localCart));
      }
    };

    fetchCart();

    const handleStorageChange = () => fetchCart();

    // 🧩 Detect when user navigates to /cart and reload
    const handleRouteChange = () => {
      if (window.location.pathname === "/cart") {
        fetchCart();
      }
    };
    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ✅ Recalculate total whenever items change
  useEffect(() => {
    const newTotal = items.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
    setTotal(newTotal);
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  // ✅ Add product to cart
  const addToCart = async (product, size = "M", quantity = 1) => {
    const email = getUserEmail();
    if (!email) {
      alert("Please log in to add to cart");
      return;
    }

    const existing = items.find((i) => i.id === product.id && i.size === size);
    let updated;

    if (existing) {
      updated = items.map((i) =>
        i.id === product.id && i.size === size
          ? { ...i, quantity: i.quantity + quantity }
          : i
      );
    } else {
      updated = [...items, { ...product, size, quantity }];
    }

    try {
      await axios.post("https://stylesphere-q6vb.onrender.com/api/cart", {
        email,
        items: updated,
        total: updated.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      });
      setItems(updated);
    } catch (err) {
      console.error("Error saving cart:", err);
      setItems(updated);
    }
  };

  // ✅ Update quantity
  const updateQuantity = async (id, size, newQty) => {
    const email = getUserEmail();
    if (!email) return;

    if (newQty <= 0) {
      const updated = items.filter((i) => !(i.id === id && i.size === size));
      setItems(updated);
      await axios.delete(
        `https://stylesphere-q6vb.onrender.com/api/cart/${email}/${id}/${size}`
      );
      return;
    }

    const updated = items.map((i) =>
      i.id === id && i.size === size ? { ...i, quantity: newQty } : i
    );
    setItems(updated);

    await axios.post("https://stylesphere-q6vb.onrender.com/api/cart", {
      email,
      items: updated,
    });
  };

  // ✅ Remove from cart
  const removeFromCart = async (id, size) => {
    const email = getUserEmail();
    const updated = items.filter((i) => !(i.id === id && i.size === size));
    setItems(updated);
    await axios.delete(`https://stylesphere-q6vb.onrender.com/api/cart/${email}/${id}/${size}`);
  };

  // ✅ Clear entire cart
  const clearCart = async () => {
    const email = getUserEmail();
    setItems([]);
    localStorage.removeItem("cartItems");
    await axios.delete(`https://stylesphere-q6vb.onrender.com/api/cart/clear/${email}`);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
