import React from "react";
import { Link } from "react-router-dom";
import {
    ArrowRightOutlined,
    SafetyCertificateFilled,
    TrophyFilled,
    ThunderboltFilled,
    StarFilled,
    CheckCircleFilled,
    HeartFilled
} from "@ant-design/icons";

const About = () => {
    const highlights = [
        {
            icon: <SafetyCertificateFilled />,
            color: "#10b981",
            bg: "rgba(16, 185, 129, 0.12)",
            title: "100% Farm-Fresh",
            desc: "Daily organic produce & ethically sourced meats.",
        },
        {
            icon: <TrophyFilled />,
            color: "#ffb703",
            bg: "rgba(255, 183, 3, 0.14)",
            title: "Award-Winning Chefs",
            desc: "Masterful recipes curated with authentic taste.",
        },
        {
            icon: <ThunderboltFilled />,
            color: "#e63946",
            bg: "rgba(230, 57, 70, 0.12)",
            title: "Express 30m Delivery",
            desc: "Prepared fresh and delivered hot to your door.",
        },
        {
            icon: <HeartFilled />,
            color: "#8b5cf6",
            bg: "rgba(139, 92, 246, 0.12)",
            title: "Hygienic Sealed Care",
            desc: "Eco-friendly, contactless & sterile packaging.",
        },
    ];

    const stats = [
        { value: "150+", label: "Signature Dishes" },
        { value: "25k+", label: "Happy Foodies" },
        { value: "4.9★", label: "Customer Score" },
        { value: "100%", label: "Fresh Guaranteed" },
    ];

    return (
        <section className="about-section">
            <div className="container">
                <div className="row align-items-center gy-5">

                    {/* Left Column: Multi-layer Image Collage & Floating Badges */}
                    <div className="col-lg-6">
                        <div className="about-visual-collage">
                            {/* Ambient Glow */}
                            <div className="about-visual-glow"></div>

                            {/* Main Showcase Image */}
                            <div className="about-main-frame">
                                <img
                                    src="/images/master_chef.jpg"
                                    alt="Executive Master Chef Plating Gourmet Dish"
                                    className="about-primary-img img-fluid"
                                    loading="lazy"
                                />
                                <div className="about-img-gradient-overlay"></div>
                            </div>

                            {/* Floating Card: Overlapping Gourmet Dish Preview */}
                            <div className="about-sub-frame d-none d-sm-flex align-items-center gap-3">
                                <img
                                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&auto=format&fit=crop&q=80"
                                    alt="Artisan Gourmet Meal"
                                    className="about-secondary-img"
                                    loading="lazy"
                                />
                                <div>
                                    <div className="d-flex align-items-center gap-1 text-warning small mb-1">
                                        <StarFilled />
                                        <StarFilled />
                                        <StarFilled />
                                        <StarFilled />
                                        <StarFilled />
                                    </div>
                                    <div className="fw-bold fs-6 text-dark mb-0">Chef's Signature</div>
                                    <small className="text-muted">Handcrafted Daily</small>
                                </div>
                            </div>

                            {/* Floating Heritage Badge (Top Left) */}
                            <div className="about-float-badge badge-experience">
                                <div className="badge-icon-wrap">
                                    <TrophyFilled style={{ color: "#ffb703" }} />
                                </div>
                                <div className="text-start">
                                    <div className="fw-bold fs-6 text-dark lh-1">12+ Years</div>
                                    <small className="text-muted" style={{ fontSize: "0.72rem" }}>Culinary Heritage</small>
                                </div>
                            </div>

                            {/* Floating Trust Badge (Bottom Right for mobile/tablet) */}
                            <div className="about-float-badge badge-hygiene">
                                <CheckCircleFilled style={{ color: "#10b981", fontSize: "1.2rem" }} />
                                <span>100% Certified Hygiene</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Narrative, Bento Feature Highlights & Action Buttons */}
                    <div className="col-lg-6 text-center text-lg-start">

                        {/* Top Pill Tag */}
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-danger bg-opacity-10 text-danger fw-semibold mb-3" style={{ fontSize: "0.85rem" }}>
                            <span>🌿 OUR CULINARY MISSION</span>
                        </div>

                        {/* Main Heading */}
                        <h2 className="about-title mb-3">
                            We Don’t Just Cook Food — We <span className="text-gradient">Craft Memorable Flavors</span>
                        </h2>

                        {/* Story Paragraph */}
                        <p className="about-text mb-4">
                            Founded with a dedication to authentic taste and wholesome ingredients, <strong>Foodie</strong> elevates your daily dining. Every dish is seasoned with love, masterfully prepared by top-tier chefs, and delivered steaming hot to your doorstep.
                        </p>

                        {/* 4 Feature Highlights Grid (2x2) */}
                        <div className="row g-3 mb-4 text-start">
                            {highlights.map((item, idx) => (
                                <div className="col-12 col-sm-6" key={idx}>
                                    <div className="about-feature-card h-100">
                                        <div
                                            className="feature-card-icon"
                                            style={{ color: item.color, backgroundColor: item.bg }}
                                        >
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h5 className="feature-card-title">{item.title}</h5>
                                            <p className="feature-card-desc">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Responsive Stats Bar */}
                        <div className="about-stats-strip mb-4">
                            <div className="row g-2 text-center">
                                {stats.map((s, idx) => (
                                    <div className="col-6 col-sm-3" key={idx}>
                                        <div className="stat-pill-item">
                                            <div className="stat-val">{s.value}</div>
                                            <div className="stat-name">{s.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                            <Link to="/about" className="text-decoration-none">
                                <button className="btn-about-primary w-100">
                                    <span>Discover Our Story</span>
                                    <ArrowRightOutlined className="btn-arrow" />
                                </button>
                            </Link>

                            <Link to="/products" className="text-decoration-none">
                                <button className="btn-about-secondary w-100">
                                    <span>Explore Full Menu</span>
                                </button>
                            </Link>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;