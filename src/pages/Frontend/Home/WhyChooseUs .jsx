import React from "react";
import { ThunderboltFilled, SafetyCertificateFilled, TrophyFilled, CreditCardFilled, CheckCircleOutlined } from "@ant-design/icons";

const services = [
    {
        title: "30 Min Delivery",
        icon: <ThunderboltFilled />,
        iconColor: "#ffb703",
        iconBg: "rgba(255, 183, 3, 0.14)",
        desc: "Get your order delivered fresh & piping hot within 30 minutes guaranteed to your doorstep."
    },
    {
        title: "Fresh Ingredients",
        icon: <SafetyCertificateFilled />,
        iconColor: "#10b981",
        iconBg: "rgba(16, 185, 129, 0.14)",
        desc: "Hand-picked 100% organic ingredients sourced daily from verified local trusted farms."
    },
    {
        title: "Master Chefs",
        icon: <TrophyFilled />,
        iconColor: "#e63946",
        iconBg: "rgba(230, 57, 70, 0.14)",
        desc: "Crafted with love and culinary finesse by award-winning experienced master chefs."
    },
    {
        title: "Secure Payment",
        icon: <CreditCardFilled />,
        iconColor: "#3b82f6",
        iconBg: "rgba(59, 130, 246, 0.14)",
        desc: "100% encrypted & secure payment gateways for a seamless, hassle-free checkout."
    },
];

const WhyChooseUs = () => {
    return (
        <section className="why-choose-section">
            <div className="container">

                {/* Section Header */}
                <div className="text-center mb-4 mb-md-5">
                    <div className="why-choose-badge">
                        <CheckCircleOutlined />
                        <span>OUR PROMISE &amp; QUALITY</span>
                    </div>

                    <h2 className="display-6 fw-bold text-dark mb-2">
                        Why Choose <span className="text-gradient">Our Store</span>
                    </h2>

                    <p className="text-muted mx-auto" style={{ maxWidth: "560px" }}>
                        We deliver exceptional food quality and express service that makes every meal an unforgettable dining experience.
                    </p>
                </div>

                {/* Responsive Services Cards Grid: 1 col on xs, 2 col on sm/md, 4 col on lg */}
                <div className="row g-3 g-md-4">
                    {services.map((item, index) => (
                        <div className="col-12 col-sm-6 col-lg-3" key={index}>
                            <div className="feature-card h-100">
                                <div
                                    className="feature-icon-box"
                                    style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                                >
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