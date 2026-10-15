import React from "react";
import { Link } from "react-router-dom";
import { FireFilled, ArrowRightOutlined, CopyOutlined, ThunderboltFilled } from "@ant-design/icons";

const SpecialOffers = () => {
    const handleCopyCoupon = () => {
        try {
            navigator.clipboard.writeText("FOOD50");
            if (window.toastify) {
                window.toastify("Coupon code 'FOOD50' copied to clipboard!", "success");
            }
        } catch {
            if (window.toastify) {
                window.toastify("Coupon code: FOOD50", "info");
            }
        }
    };

    return (
        <section className="special-offers-section">
            <div className="container">
                <div className="offer-card">

                    {/* Ambient Glow Blobs */}
                    <div className="offer-bg-blob-1"></div>
                    <div className="offer-bg-blob-2"></div>

                    <div className="row align-items-center gy-4 gy-lg-0 position-relative" style={{ zIndex: 1 }}>

                        {/* Left Column: Text & Offer Details */}
                        <div className="col-lg-7 text-center text-lg-start">

                            {/* Subtitle Badge */}
                            <div className="offer-badge">
                                <FireFilled />
                                <span>LIMITED TIME PROMO</span>
                            </div>

                            {/* Title */}
                            <h2 className="offer-title mb-3">
                                Get <span className="offer-highlight">50% OFF</span> On Your First Order!
                            </h2>

                            {/* Description */}
                            <p className="offer-desc mb-4 mx-auto mx-lg-0">
                                Treat yourself to delicious, fresh gourmet meals delivered straight to your door. Use our exclusive coupon code at checkout and save big!
                            </p>

                            {/* Coupon Code Box */}
                            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-lg-start gap-3 mb-4">
                                <div
                                    className="coupon-container"
                                    onClick={handleCopyCoupon}
                                    title="Click to copy coupon code"
                                    role="button"
                                    tabIndex={0}
                                >
                                    <span className="text-white-50 small">Code:</span>
                                    <span className="coupon-code">FOOD50</span>
                                    <CopyOutlined className="text-white-50 ms-1" />
                                </div>
                                <small className="text-white-50">* Valid on orders above Rs. 1,500</small>
                            </div>

                            {/* Action Button */}
                            <div className="d-flex justify-content-center justify-content-lg-start">
                                <Link to="/products" className="text-decoration-none w-100 w-sm-auto">
                                    <button className="btn-offer-primary w-100">
                                        <span>Order Now &amp; Save 50%</span>
                                        <ArrowRightOutlined className="btn-icon" />
                                    </button>
                                </Link>
                            </div>

                        </div>

                        {/* Right Column: Floating Offer Image */}
                        <div className="col-lg-5 text-center mt-4 mt-lg-0">
                            <div className="offer-img-wrapper">

                                {/* Floating Discount Tag */}
                                <div className="offer-floating-tag">
                                    <FireFilled style={{ color: "#e63946" }} />
                                    <span>50% INSTANT SAVINGS</span>
                                </div>

                                {/* Main Offer Image: Custom Sizzling Cheese Pull Pizza */}
                                <img
                                    src="/images/offer_pizza.jpg"
                                    alt="Special Offer Loaded Italian Pizza with Cheese Pull"
                                    className="offer-main-img img-fluid"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default SpecialOffers;