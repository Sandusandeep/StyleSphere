// src/components/Banner.jsx
import React from "react";
import { motion } from "framer-motion";
import bannerImg from "../assets/banner.jpg"; // put file in src/assets

const Banner = () => {
  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: 12 }}>
      <img
        src={bannerImg}
        alt="banner"
        style={{
          width: "100%",
          height: "320px",
          objectFit: "cover",
          filter: "brightness(0.85)",
        }}
      />
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ position: "absolute", left: 48, top: 48, color: "white" }}
      >
        <h1 style={{ fontSize: "2.4rem", margin: 0 }}>Stylesphere</h1>
        <p style={{ marginTop: 8, fontSize: "1.05rem" }}>
          Discover curated dresses — premium fabrics, runway looks.
        </p>
      </motion.div>
    </div>
  );
};

export default Banner;
