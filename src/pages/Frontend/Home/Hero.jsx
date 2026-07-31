import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightOutlined, ThunderboltFilled, StarFilled, FireFilled, UserOutlined } from "@ant-design/icons";

const Hero = () => {
    return (
        <section className="hero-section container">
            {/* Background Glow Blobs */}
            <div className="hero-blob-1"></div>
            <div className="hero-blob-2"></div>

            <div className="row align-items-center gy-5 position-relative" style={{ zIndex: 1 }}>

                {/* Text Content Block */}
                <div className="col-lg-6 text-center text-lg-start">

                    {/* Pill Tag */}
                    <div className="hero-badge">
                        <span className="pulse-dot"></span>
                        <FireFilled style={{ color: '#e63946' }} />
                        <span>#1 Rated Food Delivery Service</span>
                    </div>

                    <h1 className="hero-title mb-3">
                        Fresh &amp; Delicious <span className="text-gradient">Food Delivered</span> To Your Door
                    </h1>

                    <p className="hero-description my-3 my-md-4">
                        Order your favorite gourmet meals anytime. We deliver fresh, hot, and healthy culinary delights straight to your doorstep within minutes.
                    </p>

                    {/* Feature Chips */}
                    <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-2 mb-4">
                        <span className="hero-feature-chip">
                            <ThunderboltFilled style={{ color: '#ffb703' }} /> 30 Min Express Delivery
                        </span>
                        <span className="hero-feature-chip">
                            <StarFilled style={{ color: '#ffb703' }} /> 4.9 Superb Rating
                        </span>
                        <span className="hero-feature-chip">
                            🥗 100% Organic &amp; Fresh
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                        <Link to="/products" className="text-decoration-none">
                            <button className="btn-hero-primary w-100">
                                Order Now
                                <ArrowRightOutlined className="btn-icon" />
                            </button>
                        </Link>

                        <Link to="/auth/register" className="text-decoration-none">
                            <button className="btn-hero-secondary w-100">
                                <UserOutlined />
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Hero Image Block */}
                <div className="col-lg-6 text-center">
                    <div className="hero-img-wrapper">

                        {/* Floating Glass Card Top Left */}
                        <div className="floating-card floating-card-1">
                            <div className="floating-icon-box yellow">
                                <StarFilled />
                            </div>
                            <div className="text-start">
                                <div className="fw-bold fs-6 text-dark mb-0">4.9 Rating</div>
                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>From 10k+ Customers</small>
                            </div>
                        </div>

                        {/* Main Hero Image */}
                        <img
                            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700"
                            alt="Delicious Food"
                            className="hero-main-img"
                        />

                        {/* Floating Glass Card Bottom Right */}
                        <div className="floating-card floating-card-2">
                            <div className="floating-icon-box green">
                                <ThunderboltFilled />
                            </div>
                            <div className="text-start">
                                <div className="fw-bold fs-6 text-dark mb-0">25 Mins</div>
                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>Average Delivery Time</small>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;