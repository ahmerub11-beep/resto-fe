import React from "react";
import { Link } from "react-router-dom";
import { FireFilled, ArrowRightOutlined, CopyOutlined, ThunderboltFilled } from "@ant-design/icons";

const SpecialOffers = () => {
    const handleCopyCoupon = () => {
        navigator.clipboard.writeText("FOOD50");
        if (window.toastify) {
            window.toastify("Coupon code 'FOOD50' copied to clipboard!", "success");
        }
    };

    return (
        <section className="special-offers-section container">
            <div className="offer-card">

                {/* Ambient Glow Blobs */}
                <div className="offer-bg-blob-1"></div>
                <div className="offer-bg-blob-2"></div>

                <div className="row align-items-center gy-4 position-relative" style={{ zIndex: 1 }}>

                    {/* Left Column: Text & Offer Details */}
                    <div className="col-lg-7 text-center text-lg-start">

                        {/* Subtitle Badge */}
                        <div className="offer-badge">
                            <FireFilled />
                            <span>LIMITED TIME OFFER</span>
                        </div>

                        {/* Title */}
                        <h2 className="offer-title mb-3">
                            Get <span className="offer-highlight">50% OFF</span> On Your First Order!
                        </h2>

                        {/* Description */}
                        <p className="offer-desc mb-4">
                            Treat yourself to delicious, fresh gourmet meals delivered straight to your door. Use our exclusive coupon code at checkout and save big!
                        </p>

                        {/* Coupon Code Box */}
                        <div className="d-flex flex-column flex-sm-row align-items-center align-items-lg-start gap-3 mb-4">
                            <div
                                className="coupon-container"
                                onClick={handleCopyCoupon}
                                title="Click to copy coupon code"
                            >
                                <span className="text-white-50 small">Code:</span>
                                <span className="coupon-code">FOOD50</span>
                                <CopyOutlined className="text-white-50 ms-1" />
                            </div>
                            <small className="text-white-50 align-self-center">* Valid for new users only</small>
                        </div>

                        {/* Action Button */}
                        <div>
                            <Link to="/products" className="text-decoration-none">
                                <button className="btn-offer-primary">
                                    <span>Order Now &amp; Save</span>
                                    <ArrowRightOutlined className="btn-icon" />
                                </button>
                            </Link>
                        </div>

                    </div>

                    {/* Right Column: Floating Offer Image */}
                    <div className="col-lg-5 text-center">
                        <div className="offer-img-wrapper">

                            {/* Floating Discount Tag */}
                            <div className="offer-floating-tag">
                                <ThunderboltFilled />
                                <span>50% INSTANT SAVINGS</span>
                            </div>

                            {/* Main Offer Image */}
                            <img
                                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600"
                                alt="Special Offer Food"
                                className="offer-main-img img-fluid"
                            />
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default SpecialOffers;