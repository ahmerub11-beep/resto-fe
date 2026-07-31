import React from "react";
import {
    HeartFilled,
    ThunderboltFilled,
    SafetyCertificateFilled,
    TrophyFilled,
    StarFilled,
    CheckCircleFilled,
    TeamOutlined
} from "@ant-design/icons";

const About = () => {
    return (
        <main className="about-page-section">
            <div className="container">

                {/* 1. Header Banner */}
                <div className="text-center mb-5">
                    <div className="about-page-badge">
                        <HeartFilled />
                        <span>WHO WE ARE</span>
                    </div>

                    <h1 className="about-page-title mb-3">
                        Crafting Unforgettable <span className="text-gradient">Culinary Experiences</span>
                    </h1>

                    <p className="text-muted fs-5 col-lg-8 mx-auto" style={{ lineHeight: "1.7" }}>
                        We are more than just a food delivery platform. We are a community of passionate food lovers, dedicated master chefs, and hyper-fast drivers working together to bring happiness &amp; gourmet flavor straight to your doorstep.
                    </p>
                </div>

                {/* 2. Brand Story Section */}
                <div className="row align-items-center my-5 gy-5">

                    {/* Left Column: Image with Float Animation & Floating Badge */}
                    <div className="col-lg-6 text-center">
                        <div className="about-story-img-wrapper">

                            {/* Floating Badge overlay */}
                            <div className="about-story-floating-tag">
                                <div className="story-tag-icon">
                                    <TrophyFilled />
                                </div>
                                <div className="text-start">
                                    <div className="fw-bold fs-6 text-dark mb-0">100% Fresh Promise</div>
                                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Organically Sourced Ingredients</small>
                                </div>
                            </div>

                            {/* Main Story Image */}
                            <img
                                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=700"
                                alt="Master Chef Preparing Gourmet Food"
                                className="about-story-img img-fluid"
                            />

                        </div>
                    </div>

                    {/* Right Column: Story Content */}
                    <div className="col-lg-6 ps-lg-4">
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-danger bg-opacity-10 text-danger fw-semibold mb-2" style={{ fontSize: '0.85rem' }}>
                            <TeamOutlined />
                            <span>OUR PASSION &amp; JOURNEY</span>
                        </div>

                        <h2 className="fw-bold text-dark display-6 mb-3">
                            Driven By Passion, Fueled By Freshness
                        </h2>

                        <p className="text-muted fs-6 mb-3">
                            Founded with a simple vision, <strong>My Store</strong> was built to make restaurant-quality, chef-crafted food accessible to everyone at home—without ever compromising on taste, temperature, or nutritional value.
                        </p>

                        <p className="text-muted fs-6 mb-4">
                            We partner directly with local organic farms and top-tier certified suppliers to ensure that every single dish served is packed with authentic flavor and premium ingredients.
                        </p>

                        {/* Quote Box */}
                        <div className="about-quote-card">
                            "Our promise is simple: If it isn't fresh enough for our own family, it doesn't leave our kitchen."
                        </div>

                        {/* Checkpoint Highlights */}
                        <div className="d-flex flex-column gap-2 mt-3">
                            <div className="d-flex align-items-center gap-2 text-dark fw-semibold">
                                <CheckCircleFilled className="text-danger" />
                                <span>30 Minutes Express Hot Delivery</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 text-dark fw-semibold">
                                <CheckCircleFilled className="text-danger" />
                                <span>Strict Quality &amp; Hygiene Standards</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 text-dark fw-semibold">
                                <CheckCircleFilled className="text-danger" />
                                <span>24/7 Dedicated Customer Care</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 3. Core Values Section */}
                <div className="my-5 py-4">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold display-6 text-dark mb-2">
                            Why Food Lovers <span className="text-gradient">Choose Us</span>
                        </h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: "550px" }}>
                            The core pillars that define our service excellence every single day.
                        </p>
                    </div>

                    <div className="row g-4">
                        {/* Card 1 */}
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="value-card">
                                <div className="value-icon-box">
                                    <SafetyCertificateFilled />
                                </div>
                                <h5 className="value-card-title">100% Farm Fresh</h5>
                                <p className="value-card-desc">
                                    Ingredients are sourced daily from local organic farms to guarantee maximum flavor.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="value-card">
                                <div className="value-icon-box">
                                    <ThunderboltFilled />
                                </div>
                                <h5 className="value-card-title">Hyper-Fast Delivery</h5>
                                <p className="value-card-desc">
                                    Smart route optimization ensures your order arrives piping hot within 30 minutes.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="value-card">
                                <div className="value-icon-box">
                                    <TrophyFilled />
                                </div>
                                <h5 className="value-card-title">Master Chefs</h5>
                                <p className="value-card-desc">
                                    Recipes curated and crafted by certified culinary experts with years of experience.
                                </p>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="value-card">
                                <div className="value-icon-box">
                                    <StarFilled />
                                </div>
                                <h5 className="value-card-title">Zero Contact Safety</h5>
                                <p className="value-card-desc">
                                    Strict hygiene protocols, sealed packaging, and safe delivery options for peace of mind.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Stats Banner */}
                <div className="about-stats-banner my-5">
                    <div className="row text-center gy-4">
                        <div className="col-6 col-md-3">
                            <div className="stat-banner-number">150+</div>
                            <p className="stat-banner-label">Daily Dishes</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-banner-number">50K+</div>
                            <p className="stat-banner-label">Happy Foodies</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-banner-number">99.8%</div>
                            <p className="stat-banner-label">On-Time Orders</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-banner-number">4.9★</div>
                            <p className="stat-banner-label">Customer Rating</p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default About;