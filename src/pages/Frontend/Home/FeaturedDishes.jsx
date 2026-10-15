import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FireFilled, ArrowRightOutlined, ShoppingCartOutlined, StarFilled } from "@ant-design/icons";
import { Skeleton } from "antd";

const FeaturedDishes = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const { data } = await axios.get(`${window.api}/api/products/public-all`);
                if (data?.products && Array.isArray(data.products)) {
                    setDishes(data.products);
                }
            } catch (err) {
                console.error("Failed to load featured dishes:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDishes();
    }, []);

    return (
        <section className="featured-dishes-section py-5" style={{ background: "#f8fafc" }}>
            <div className="container py-2 py-md-4">

                {/* Section Header */}
                <div className="text-center mb-4 mb-md-5">
                    <div
                        className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-danger bg-opacity-10 text-danger fw-semibold mb-2"
                        style={{ fontSize: "0.85rem" }}
                    >
                        <FireFilled />
                        <span>CHEF'S SIGNATURE SELECTION</span>
                    </div>
                    <h2 className="display-6 fw-bold text-dark mb-2">
                        Popular &amp; Trending <span className="text-gradient">Dishes</span>
                    </h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: "580px" }}>
                        Handcrafted by our master chefs with premium, farm-fresh ingredients. Available for 30-minute hot delivery across the city.
                    </p>
                </div>

                {/* Loading Skeleton */}
                {loading ? (
                    <div className="row g-3 g-md-4">
                        {[1, 2, 3].map((n) => (
                            <div className="col-12 col-md-4" key={n}>
                                <div className="card border-0 shadow-sm p-3 rounded-4">
                                    <Skeleton.Image active style={{ width: "100%", height: 200, borderRadius: 12 }} />
                                    <Skeleton active paragraph={{ rows: 2 }} className="mt-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : dishes.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded-4 shadow-sm p-4">
                        <span className="fs-1 d-block mb-2">🍽️</span>
                        <h4 className="fw-bold text-dark">Fresh Menu Is Cooking!</h4>
                        <p className="text-muted mb-3">Our chefs are preparing new dishes. Explore our store to see available items.</p>
                        <Link to="/products" className="btn btn-danger px-4 py-2 rounded-pill fw-bold">
                            Visit Live Store
                        </Link>
                    </div>
                ) : (
                    <div className="row g-3 g-md-4">
                        {dishes.slice(0, 6).map((dish) => (
                            <div className="col-12 col-sm-6 col-lg-4" key={dish._id || dish.id}>
                                <div
                                    className="card h-100 border-0 rounded-4 overflow-hidden shadow-sm"
                                    style={{
                                        transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                        background: "#ffffff",
                                    }}
                                >
                                    {/* Dish Image */}
                                    <div className="position-relative overflow-hidden" style={{ height: "220px", background: "#f1f5f9" }}>
                                        <img
                                            src={dish.imageURL || "/images/hero_burger.jpg"}
                                            alt={dish.name}
                                            className="w-100 h-100"
                                            style={{ objectFit: "cover" }}
                                            loading="lazy"
                                        />
                                        <span
                                            className="position-absolute top-0 start-0 m-3 badge rounded-pill px-3 py-2 text-white fw-semibold"
                                            style={{ background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)", fontSize: "0.78rem" }}
                                        >
                                            {dish.category || "Chef Special"}
                                        </span>
                                        <span
                                            className="position-absolute top-0 end-0 m-3 badge rounded-pill px-2 py-1 bg-white text-warning fw-bold shadow-sm d-flex align-items-center gap-1"
                                            style={{ fontSize: "0.78rem" }}
                                        >
                                            <StarFilled style={{ color: "#f59e0b" }} /> 4.9
                                        </span>
                                    </div>

                                    {/* Dish Details */}
                                    <div className="card-body p-3 p-md-4 d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-baseline mb-2">
                                            <h4 className="fw-bold text-dark mb-0 fs-5 text-truncate" title={dish.name}>
                                                {dish.name}
                                            </h4>
                                        </div>

                                        <p
                                            className="text-muted small mb-3 flex-grow-1"
                                            style={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {dish.description || "Freshly cooked gourmet food prepared with premium chef ingredients."}
                                        </p>

                                        {/* Price & Action */}
                                        <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                                            <div>
                                                <small className="text-muted d-block" style={{ fontSize: "0.72rem", textTransform: "uppercase" }}>Price (PKR)</small>
                                                <span className="fw-bolder fs-5" style={{ color: "#e63946" }}>
                                                    Rs. {Number(dish.price).toLocaleString()}
                                                </span>
                                            </div>

                                            <Link to="/products" className="text-decoration-none">
                                                <button
                                                    className="btn btn-danger rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
                                                    style={{ fontSize: "0.85rem" }}
                                                >
                                                    <ShoppingCartOutlined /> Order
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom Call to Action */}
                <div className="text-center mt-5">
                    <Link to="/products" className="text-decoration-none">
                        <button
                            className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 shadow-sm"
                            style={{ fontSize: "0.95rem" }}
                        >
                            <span>Explore Full Menu ({dishes.length} Items)</span>
                            <ArrowRightOutlined />
                        </button>
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default FeaturedDishes;
