import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import HomeProductsSection from "../components/HomeProductSection";

export default function Home({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} onLogout={onLogout} />
      <HeroSection />
      <HomeProductsSection />
    </div>
  );
}
