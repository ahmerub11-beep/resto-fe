import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightOutlined, AppstoreOutlined } from "@ant-design/icons";

const categories = [
    {
        id: 1,
        name: "Pizza",
        subtitle: "Cheesy & Hot Crusted",
        itemsCount: "25+ Items",
        icon: "🍕",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
    },
    {
        id: 2,
        name: "Burger",
        subtitle: "Juicy & Double Stacked",
        itemsCount: "18+ Items",
        icon: "🍔",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
    },
    {
        id: 3,
        name: "Pasta",
        subtitle: "Creamy Italian Classic",
        itemsCount: "15+ Items",
        icon: "🍝",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500",
    },
    {
        id: 4,
        name: "Drinks",
        subtitle: "Refreshing & Chilled",
        itemsCount: "30+ Items",
        icon: "🍹",
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500",
    },
];

const Categories = () => {
    return (
        <section className="categories-section">
            <div className="container">

                {/* Section Header */}
                <div className="text-center mb-5">
                    <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-danger bg-opacity-10 text-danger fw-semibold mb-2" style={{ fontSize: '0.85rem' }}>
                        <AppstoreOutlined />
                        <span>EXPLORE OUR MENU</span>
                    </div>
                    <h2 className="display-6 fw-bold text-dark mb-2">
                        Shop By <span className="text-gradient">Categories</span>
                    </h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: "550px" }}>
                        Discover our wide selection of delicious cuisines handcrafted with fresh ingredients for every craving.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="row g-4">
                    {categories.map((item) => (
                        <div className="col-12 col-sm-6 col-md-3" key={item.id}>
                            <Link to="/products" className="text-decoration-none">
                                <div className="category-card">
                                    <div className="category-img-wrapper">
                                        <span className="category-item-count">{item.itemsCount}</span>
                                        <span className="category-icon-tag">{item.icon}</span>
                                        <img
                                            src={item.image}
                                            className="category-img"
                                            alt={item.name}
                                        />
                                        <div className="category-img-overlay"></div>
                                    </div>

                                    <div className="category-body">
                                        <div>
                                            <h5 className="category-title">{item.name}</h5>
                                            <p className="category-subtitle">{item.subtitle}</p>
                                        </div>
                                        <div className="category-arrow-icon">
                                            <ArrowRightOutlined />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Categories;