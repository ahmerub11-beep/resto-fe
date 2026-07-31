import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FacebookFilled,
    InstagramOutlined,
    TwitterOutlined,
    LinkedinFilled,
    SendOutlined,
    EnvironmentFilled,
    PhoneFilled,
    MailFilled,
    RightOutlined,
    ShoppingFilled
} from "@ant-design/icons";

const Footer = () => {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email.trim()) {
            if (window.toastify) window.toastify("Please enter a valid email address", "error");
            return;
        }
        if (window.toastify) {
            window.toastify("Thank you for subscribing to our newsletter!", "success");
        }
        setEmail("");
    };

    return (
        <footer className="app-footer">
            <div className="container">
                <div className="row gy-4 gx-lg-5">

                    {/* Column 1: Brand & About */}
                    <div className="col-lg-4 col-md-6">
                        <Link to="/" className="text-decoration-none">
                            <div className="footer-brand">
                                <ShoppingFilled className="brand-icon" />
                                <span>My Store</span>
                            </div>
                        </Link>

                        <p style={{ lineHeight: "1.7" }}>
                            Delicious gourmet meals prepared fresh daily with 100% organic ingredients &amp; delivered piping hot straight to your doorstep within minutes.
                        </p>

                        <div className="footer-social-box">
                            <a href="#facebook" className="social-icon-btn" aria-label="Facebook">
                                <FacebookFilled />
                            </a>
                            <a href="#instagram" className="social-icon-btn" aria-label="Instagram">
                                <InstagramOutlined />
                            </a>
                            <a href="#twitter" className="social-icon-btn" aria-label="Twitter">
                                <TwitterOutlined />
                            </a>
                            <a href="#linkedin" className="social-icon-btn" aria-label="LinkedIn">
                                <LinkedinFilled />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="col-lg-2 col-md-6 col-6">
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-links-list">
                            <li>
                                <RightOutlined className="link-bullet" />
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <RightOutlined className="link-bullet" />
                                <Link to="/about">About Us</Link>
                            </li>
                            <li>
                                <RightOutlined className="link-bullet" />
                                <Link to="/products">Menu &amp; Products</Link>
                            </li>
                            <li>
                                <RightOutlined className="link-bullet" />
                                <Link to="/auth/login">Customer Login</Link>
                            </li>
                            <li>
                                <RightOutlined className="link-bullet" />
                                <Link to="/auth/register">Create Account</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Categories */}
                    <div className="col-lg-2 col-md-6 col-6">
                        <h4 className="footer-title">Categories</h4>
                        <ul className="footer-links-list">
                            <li>
                                <RightOutlined className="link-bullet" />
                                <Link to="/products">Pizza Special</Link>
                            </li>
                            <li>
                                <RightOutlined className="link-bullet" />
                                <Link to="/products">Juicy Burgers</Link>
                            </li>
                            <li>
                                <RightOutlined className="link-bullet" />
                                <Link to="/products">Italian Pasta</Link>
                            </li>
                            <li>
                                <RightOutlined className="link-bullet" />
                                <Link to="/products">Cold Drinks</Link>
                            </li>
                            <li>
                                <RightOutlined className="link-bullet" />
                                <Link to="/products">Fresh Salads</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter & Contact */}
                    <div className="col-lg-4 col-md-6">
                        <h4 className="footer-title">Newsletter</h4>
                        <p className="small mb-2">
                            Subscribe to receive exclusive discount coupons &amp; weekly food offers!
                        </p>

                        <form className="newsletter-form" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                className="newsletter-input"
                                placeholder="Enter your email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="newsletter-btn">
                                <SendOutlined />
                            </button>
                        </form>

                        <div className="mt-3">
                            <div className="footer-contact-item">
                                <EnvironmentFilled className="contact-icon" />
                                <span className="small">faisalabad, Pakistan</span>
                            </div>
                            <div className="footer-contact-item">
                                <PhoneFilled className="contact-icon" />
                                <span className="small">+92 324 9682011</span>
                            </div>
                            <div className="footer-contact-item">
                                <MailFilled className="contact-icon" />
                                <span className="small">ahmerub11@gmail.com</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom-bar text-center text-md-between d-md-flex align-items-center justify-content-between">
                    <p className="mb-2 mb-md-0">
                        &copy; {new Date().getFullYear()} <strong>My Store</strong>. All Rights Reserved. Built with ❤️ for Food Lovers.
                    </p>
                    <div className="small text-white-50">
                        <span className="me-3">Privacy Policy</span>
                        <span className="me-3">Terms of Service</span>
                        <span>Cookie Policy</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;