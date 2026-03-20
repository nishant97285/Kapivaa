import { useState } from "react";
import HeroSection from "../components/HeroSection";
import CategoryBar from "../components/CategoryBar";
import ProductGrid from "../components/ProductGrid";
import WhyKapiva from "../components/WhyKapiva";
import Footer from "../components/Footer";
import NewArrivals from "../components/NewArrivalsComponent";
import LearnAyurveda from "../components/LearnAyurveda";
// import Dashboard from "./Dashboard";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("Gym Foods");

  return (
    <div>
      <HeroSection />
      <CategoryBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
       <ProductGrid activeCategory={activeCategory} />
      <WhyKapiva />
      <NewArrivals />
      <LearnAyurveda />
      <Footer />
      {/* <Dashboard /> */}
    </div>
  );
};

export default Home;