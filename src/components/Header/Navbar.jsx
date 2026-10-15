import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/context/Auth';
import { FireFilled, UserOutlined, DashboardOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';

const Navbar = () => {
    const { isAuth, handleLogout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark main-navbar">
            <div className="container">
                {/* Brand / Logo */}
                <Link to="/" className="navbar-brand">
                    <div className="brand-logo-icon">
                        <FireFilled />
                    </div>
                    <span className="brand-text">
                        Food<span className="brand-highlight">ie</span>
                    </span>
                </Link>

                {/* Mobile Hamburger Toggle Button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbarNav"
                    aria-controls="mainNavbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <MenuOutlined style={{ color: '#fff', fontSize: '1.2rem' }} />
                </button>

                {/* Nav Links & Actions Collapse */}
                <div className="collapse navbar-collapse" id="mainNavbarNav">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                end
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/about"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                About
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/products"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                Products &amp; Menu
                            </NavLink>
                        </li>
                    </ul>

                    {/* Authentication Action Buttons */}
                    <div className="nav-auth-actions d-flex align-items-center gap-2">
                        {isAuth ? (
                            <>
                                <Link to="/dashboard" className="btn-nav-primary">
                                    <DashboardOutlined />
                                    <span>Dashboard</span>
                                </Link>
                                <button className="btn-nav-danger" onClick={handleLogout}>
                                    <LogoutOutlined />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/auth/login" className="btn-nav-outline">
                                    <UserOutlined />
                                    <span>Sign In</span>
                                </Link>
                                <Link to="/auth/register" className="btn-nav-primary">
                                    <span>Get Started</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;