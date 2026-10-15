import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import FeaturedDishes from "./FeaturedDishes";
import About from "./About";
import WhyChooseUs from "./WhyChooseUs ";
import SpecialOffers from "./SpecialOffers";

const Home = () => {
    return (
        <main className="home-page-wrapper">
            <Hero />
            <Categories />
            <FeaturedDishes />
            <About />
            <WhyChooseUs />
            <SpecialOffers />
        </main>
    );
};

export default Home;