import React from "react";
import { ThunderboltFilled, SafetyCertificateFilled, TrophyFilled, CreditCardFilled, CheckCircleOutlined } from "@ant-design/icons";

const services = [
    {
        title: "Fast Delivery",
        icon: <ThunderboltFilled />,
        desc: "Get your order delivered fresh & piping hot within 30 minutes guaranteed."
    },
    {
        title: "Fresh Ingredients",
        icon: <SafetyCertificateFilled />,
        desc: "Hand-picked organic ingredients sourced daily from local trusted farms."
    },
    {
        title: "Best Chefs",
        icon: <TrophyFilled />,
        desc: "Crafted with passion by world-class experienced culinary master chefs."
    },
    {
        title: "Secure Payment",
        icon: <CreditCardFilled />,
        desc: "100% encrypted & secure payment options for a seamless checkout experience."
    },
];

const WhyChooseUs = () => {
    return (
        <section className="why-choose-section">
            <div className="container">

                {/* Section Header */}
                <div className="text-center mb-5">
                    <div className="why-choose-badge">
                        <CheckCircleOutlined />
                        <span>OUR PROMISE &amp; QUALITY</span>
                    </div>

                    <h2 className="display-6 fw-bold text-dark mb-2">
                        Why Choose <span className="text-gradient">Our Store</span>
                    </h2>

                    <p className="text-muted mx-auto" style={{ maxWidth: "550px" }}>
                        We deliver exceptional food quality and fast service that makes every meal an unforgettable dining experience.
                    </p>
                </div>

                {/* Services Cards Grid */}
                <div className="row g-4">
                    {services.map((item, index) => (
                        <div className="col-12 col-sm-6 col-md-3" key={index}>
                            <div className="feature-card">
                                <div className="feature-icon-box">
                                    {item.icon}
                                </div>
                                <h4 className="feature-title">{item.title}</h4>
                                <p className="feature-desc">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default WhyChooseUs;