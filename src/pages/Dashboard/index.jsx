import React, { useState } from "react";
import { Layout, Menu, Avatar, Drawer } from "antd";
import { Link, useLocation } from "react-router-dom";
import { items } from "./sitebarItems";
import { useAuth } from "@/context/Auth";
import Routes from "./Routes";
import {
    FireFilled,
    UserOutlined,
    LogoutOutlined,
    ShopOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MenuOutlined
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
    const { handleLogout, user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const location = useLocation();

    // Determine active menu key based on pathname
    const getActiveKey = () => {
        const path = location.pathname;
        if (path.includes("/products")) return ["2"];
        if (path.includes("/orders")) return ["3"];
        if (path.includes("/users")) return ["4"];
        return ["1"];
    };

    const isSuperAdmin = user?.role === "superAdmin";

    const filteredItems = items
        .filter(item => !item.allowedroles || item.allowedroles.includes(user?.role))
        .map(({ allowedroles, ...rest }) => rest);

    // Toggle handler for both desktop and mobile
    const handleToggle = () => {
        if (window.innerWidth < 992) {
            setMobileDrawerOpen(!mobileDrawerOpen);
        } else {
            setCollapsed(!collapsed);
        }
    };

    // Shared navigation sidebar content
    const renderSidebarContent = (isMobile = false) => (
        <div className="d-flex flex-column h-100 bg-slate-900" style={{ background: '#0f172a' }}>
            {/* Brand Logo Header */}
            <div className="dashboard-brand-header py-3 px-3">
                <Link
                    to="/"
                    onClick={() => isMobile && setMobileDrawerOpen(false)}
                    className="d-flex align-items-center gap-2 text-decoration-none"
                >
                    <div className="brand-logo-icon">
                        <FireFilled />
                    </div>
                    {(!collapsed || isMobile) && (
                        <div className="text-start">
                            <span className="brand-title">Foodie</span>
                            <span className="brand-role-badge">
                                {isSuperAdmin ? "Admin Center" : "Customer Hub"}
                            </span>
                        </div>
                    )}
                </Link>
            </div>

            {/* Navigation Menu */}
            <div className="flex-grow-1 overflow-auto">
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={getActiveKey()}
                    onClick={() => isMobile && setMobileDrawerOpen(false)}
                    items={filteredItems}
                />
            </div>

            {/* Sider User Card (Bottom) */}
            {(!collapsed || isMobile) && (
                <div className="dashboard-sider-user-card p-3 m-3">
                    <div className="d-flex align-items-center gap-2">
                        <Avatar
                            style={{ backgroundColor: isSuperAdmin ? '#e63946' : '#3b82f6' }}
                            icon={<UserOutlined />}
                        >
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                        <div className="overflow-hidden">
                            <div className="text-truncate text-white fw-bold small">
                                {user?.name || (isSuperAdmin ? 'Admin' : 'Customer')}
                            </div>
                            <div className="small text-white-50">
                                {isSuperAdmin ? 'Super Admin' : 'Customer Member'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <Layout className="dashboard-layout">
            {/* Desktop Persistent Sider (Hidden on Mobile < 992px) */}
            <Sider
                className="d-none d-lg-block"
                collapsedWidth={80}
                collapsible
                trigger={null}
                collapsed={collapsed}
                width={260}
            >
                {renderSidebarContent(false)}
            </Sider>

            {/* Mobile Drawer (Only for < 992px) */}
            <Drawer
                placement="left"
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
                width={270}
                closable={false}
                styles={{ body: { padding: 0, backgroundColor: '#0f172a' } }}
            >
                {renderSidebarContent(true)}
            </Drawer>

            <Layout className="dashboard-main-area">
                {/* Modern Sticky Topbar Header */}
                <Header className="dashboard-topbar">
                    <div className="topbar-left-group">
                        {/* Toggle Button */}
                        <span
                            className="topbar-toggle-btn"
                            onClick={handleToggle}
                            role="button"
                            tabIndex={0}
                            title="Toggle Menu"
                        >
                            <span className="d-none d-lg-inline">
                                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            </span>
                            <span className="d-lg-none">
                                <MenuOutlined />
                            </span>
                        </span>

                        <span className="topbar-page-title">
                            {isSuperAdmin ? "Administrator Dashboard" : "Customer Dashboard"}
                        </span>
                    </div>

                    {/* Right-side Topbar Controls */}
                    <div className="topbar-actions-group">
                        {/* Live Store Quick Link */}
                        <Link to="/" className="btn-visit-store" title="Go to Live Store">
                            <ShopOutlined />
                            <span className="d-none d-sm-inline">Live Store</span>
                        </Link>

                        {/* User Profile Pill */}
                        <div className="topbar-user-pill" title={user?.name || "User Profile"}>
                            <Avatar
                                size={28}
                                style={{ backgroundColor: isSuperAdmin ? '#e63946' : '#3b82f6', fontSize: '0.82rem', flexShrink: 0 }}
                            >
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </Avatar>
                            <span className="user-name-text d-none d-md-inline">
                                {user?.name || (isSuperAdmin ? 'Admin' : 'User')}
                            </span>
                        </div>

                        {/* Modern Logout Action Button */}
                        <button className="btn-dashboard-logout" onClick={handleLogout} title="Logout">
                            <LogoutOutlined />
                            <span className="d-none d-sm-inline">Logout</span>
                        </button>
                    </div>
                </Header>

                {/* Dashboard Main Content Body (Takes 100% width on Mobile) */}
                <Content className="dashboard-content-wrapper">
                    <Routes />
                </Content>

                {/* Dashboard Footer */}
                <Footer style={{ textAlign: 'center', background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '1rem' }}>
                    <span className="fw-bold text-dark">Foodie</span> ©{new Date().getFullYear()}. Handcrafted with ❤️ for Food Lovers.
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
