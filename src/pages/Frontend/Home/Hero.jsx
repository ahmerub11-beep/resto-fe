import React from "react";
import { Link } from "react-router-dom";
import {
    ArrowRightOutlined,
    ThunderboltFilled,
    StarFilled,
    FireFilled,
    UserOutlined,
    CheckCircleFilled,
    SmileFilled
} from "@ant-design/icons";

const Hero = () => {
    return (
        <section className="hero-section">
            {/* Background Ambient Glow Blobs */}
            <div className="hero-blob-1"></div>
            <div className="hero-blob-2"></div>

            <div className="container position-relative" style={{ zIndex: 1 }}>
                <div className="row align-items-center gy-5">

                    {/* Left Column: Text Content & Actions */}
                    <div className="col-lg-6 text-center text-lg-start">

                        {/* Top Pill Badge */}
                        <div className="hero-badge">
                            <span className="pulse-dot"></span>
                            <FireFilled style={{ color: '#e63946' }} />
                            <span>#1 Rated Food Delivery in Town</span>
                        </div>

                        {/* Main Hero Headline */}
                        <h1 className="hero-title mb-3">
                            Fresh &amp; Delicious <span className="text-gradient">Food Delivered</span> To Your Door
                        </h1>

                        <p className="hero-description my-3 my-md-4">
                            Craving gourmet quality at home? We handcraft fresh, artisan meals using 100% organic ingredients and deliver them steaming hot straight to your table in under 30 minutes.
                        </p>

                        {/* Feature Badges */}
                        <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-2 mb-4">
                            <span className="hero-feature-chip">
                                <ThunderboltFilled style={{ color: '#ffb703' }} /> 30 Min Express Delivery
                            </span>
                            <span className="hero-feature-chip">
                                <StarFilled style={{ color: '#ffb703' }} /> 4.9 Superb Rating
                            </span>
                            <span className="hero-feature-chip">
                                🥗 100% Farm-Fresh
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="hero-action-buttons d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3 mb-4">
                            <Link to="/products" className="text-decoration-none flex-grow-1 flex-sm-grow-0">
                                <button className="btn-hero-primary w-100">
                                    <span>Order Now</span>
                                    <ArrowRightOutlined className="btn-icon" />
                                </button>
                            </Link>

                            <Link to="/auth/register" className="text-decoration-none flex-grow-1 flex-sm-grow-0">
                                <button className="btn-hero-secondary w-100">
                                    <UserOutlined />
                                    <span>Sign Up</span>
                                </button>
                            </Link>
                        </div>

                        {/* Social Proof Pill */}
                        <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-2 text-muted small">
                            <div className="avatar-group d-flex align-items-center">
                                <span className="avatar-pill">🔥</span>
                                <span className="avatar-pill ms-n2">🍔</span>
                                <span className="avatar-pill ms-n2">🍕</span>
                            </div>
                            <span className="fw-semibold text-dark">1,500+ happy meals</span> delivered today!
                        </div>

                    </div>

                    {/* Right Column: Unique Interactive Food Showcase */}
                    <div className="col-lg-6 text-center">
                        <div className="hero-showcase-container">

                            {/* Concentric Decorative Pulsing Rings */}
                            <div className="hero-circle-ring-1"></div>
                            <div className="hero-circle-ring-2"></div>

                            {/* Floating Dish Tag (Top Center) */}
                            <div className="hero-floating-dish-tag">
                                <FireFilled style={{ color: "#e63946" }} />
                                <span>Chef's Choice • Double Smash Melt</span>
                            </div>

                            {/* Floating Glass Card Top Left: Customer Rating */}
                            <div className="floating-card floating-card-1">
                                <div className="floating-icon-box yellow">
                                    <StarFilled />
                                </div>
                                <div className="text-start">
                                    <div className="card-val">4.9 / 5.0</div>
                                    <small className="card-sub">From 12k+ Foodies</small>
                                </div>
                            </div>

                            {/* Main Gourmet Showcase Image (Custom High-Res Image) */}
                            <div className="hero-img-frame">
                                <img
                                    src="/images/hero_burger.jpg"
                                    alt="Fresh Artisan Gourmet Burger with Melting Cheese"
                                    className="hero-main-img img-fluid"
                                    loading="eager"
                                />
                                <div className="hero-img-glow-base"></div>
                            </div>

                            {/* Floating Glass Card Bottom Right: Express Speed */}
                            <div className="floating-card floating-card-2">
                                <div className="floating-icon-box green">
                                    <ThunderboltFilled />
                                </div>
                                <div className="text-start">
                                    <div className="card-val">25 Mins</div>
                                    <small className="card-sub">Piping Hot Delivery</small>
                                </div>
                            </div>

                            {/* Floating Price Pill (Bottom Left) */}
                            <div className="hero-price-pill">
                                <span className="price-tag">Rs. 450</span>
                                <span className="price-badge">FREE DELIVERY</span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;