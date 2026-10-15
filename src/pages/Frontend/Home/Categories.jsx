import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightOutlined, AppstoreOutlined } from "@ant-design/icons";
import axios from "axios";

const defaultCategories = [
    {
        id: "pizza",
        name: "Artisan Pizza",
        subtitle: "Cheesy & Hot Crusted",
        icon: "🍕",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: "burger",
        name: "Gourmet Burgers",
        subtitle: "Juicy & Double Stacked",
        icon: "🍔",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: "pasta",
        name: "Italian Pastas",
        subtitle: "Creamy Chef's Special",
        icon: "🍝",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: "drinks",
        name: "Chilled Drinks",
        subtitle: "Refreshing & Blended",
        icon: "🍹",
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop&q=80",
    },
];

const Categories = () => {
    const [categories, setCategories] = useState(defaultCategories);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${window.api}/api/products/public-all`);
                if (data?.products && Array.isArray(data.products)) {
                    const products = data.products;
                    // Count items per category
                    const counts = {};
                    products.forEach(p => {
                        const cat = (p.category || "Fast Food").toLowerCase();
                        counts[cat] = (counts[cat] || 0) + 1;
                    });

                    // Update category counts dynamically
                    const updated = defaultCategories.map(c => {
                        const matches = Object.keys(counts).filter(k => 
                            c.name.toLowerCase().includes(k) || k.includes(c.id) || (k.includes("fast") && c.id === "burger")
                        );
                        const total = matches.reduce((sum, key) => sum + (counts[key] || 0), 0);
                        return {
                            ...c,
                            itemsCount: total > 0 ? `${total} Live Items` : `${products.length}+ Items`
                        };
                    });
                    setCategories(updated);
                }
            } catch (err) {
                console.error("Categories fetch error:", err);
            }
        };

        fetchCategories();
    }, []);

    return (
        <section className="categories-section">
            <div className="container">

                {/* Section Header */}
                <div className="text-center mb-4 mb-md-5">
                    <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-danger bg-opacity-10 text-danger fw-semibold mb-2" style={{ fontSize: '0.85rem' }}>
                        <AppstoreOutlined />
                        <span>EXPLORE OUR MENU</span>
                    </div>
                    <h2 className="display-6 fw-bold text-dark mb-2">
                        Shop By <span className="text-gradient">Categories</span>
                    </h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: "560px" }}>
                        Discover our wide selection of delicious cuisines handcrafted with fresh ingredients for every craving.
                    </p>
                </div>

                {/* Responsive Categories Grid: 1 col on xs, 2 col on sm/md, 4 col on lg */}
                <div className="row g-3 g-md-4">
                    {categories.map((item) => (
                        <div className="col-12 col-sm-6 col-lg-3" key={item.id}>
                            <Link to="/products" className="text-decoration-none d-block h-100">
                                <div className="category-card">
                                    <div className="category-img-wrapper">
                                        <span className="category-item-count">{item.itemsCount}</span>
                                        <span className="category-icon-tag">{item.icon}</span>
                                        <img
                                            src={item.image}
                                            className="category-img"
                                            alt={item.name}
                                            loading="lazy"
                                        />
                                        <div className="category-img-overlay"></div>
                                    </div>

                                    <div className="category-body">
                                        <div className="category-info">
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