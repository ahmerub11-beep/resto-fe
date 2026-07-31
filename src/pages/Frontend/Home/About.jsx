import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";

const About = () => {
    return (
        <section className="about-section">
            <div className="container">
                <div className="row align-items-center gy-4">

                {/* Left Column: Animated Image */}
                <div className="col-lg-6 mb-4 mb-lg-0">
                    <img
                        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700"
                        alt="About Food Store"
                        className="img-fluid about-img"
                    />
                </div>

                {/* Right Column: Text Content */}
                <div className="col-lg-6">

                    <h2 className="fw-bold display-6 text-dark mb-3">
                        Fresh, Healthy &amp; Delicious Food For Everyone
                    </h2>

                    <p className="text-muted fs-6 mb-3">
                        Welcome to <strong>My Store</strong>, where every meal is prepared with passion and the freshest ingredients. Our mission is to provide delicious food that satisfies your taste while ensuring quality, hygiene, and affordability.
                    </p>

                    <p className="text-muted fs-6 mb-3">
                        From mouth-watering burgers and crispy pizzas to healthy salads, refreshing drinks, and delightful desserts, we offer a wide variety of meals carefully prepared by our experienced chefs. Every order is made fresh to guarantee the best taste and quality.
                    </p>

                    <p className="text-muted fs-6 mb-4">
                        We believe that great food brings people together. That's why we focus on fast delivery, premium ingredients, excellent customer service, and affordable prices so you can enjoy your favorite meals anytime, anywhere.
                    </p>

                    {/* Stats Grid */}
                    <div className="row text-center gy-3 mb-4">

                        <div className="col-6 col-md-3 about-stat-item">
                            <h3 className="text-danger fw-bold mb-1 stat-number">100+</h3>
                            <p className="text-muted mb-0 small fw-semibold">Food Items</p>
                        </div>

                        <div className="col-6 col-md-3 about-stat-item">
                            <h3 className="text-danger fw-bold mb-1 stat-number">10K+</h3>
                            <p className="text-muted mb-0 small fw-semibold">Customers</p>
                        </div>

                        <div className="col-6 col-md-3 about-stat-item">
                            <h3 className="text-danger fw-bold mb-1 stat-number">30 Min</h3>
                            <p className="text-muted mb-0 small fw-semibold">Delivery</p>
                        </div>

                        <div className="col-6 col-md-3 about-stat-item">
                            <h3 className="text-danger fw-bold mb-1 stat-number">24/7</h3>
                            <p className="text-muted mb-0 small fw-semibold">Support</p>
                        </div>

                    </div>

                    {/* Action Button */}
                    <Link to="/about" className="text-decoration-none">
                        <button className="btn btn-danger about-btn">
                            <span>Learn More</span>
                            <ArrowRightOutlined className="btn-icon" />
                        </button>
                    </Link>

                </div>
            </div>
            </div>
        </section>
    );
};

export default About;