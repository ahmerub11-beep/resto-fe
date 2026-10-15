import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/Auth";
import axios from "axios";
import {
    ShoppingOutlined,
    AppstoreOutlined,
    TeamOutlined,
    DollarOutlined,
    ArrowRightOutlined,
    PlusOutlined,
    FireFilled,
    ThunderboltFilled,
    CheckCircleFilled,
    ClockCircleFilled,
    StarFilled,
    SafetyCertificateFilled
} from "@ant-design/icons";
import { Tag, Progress, Skeleton } from "antd";

const DashboardHome = () => {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === "superAdmin";

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        recentOrders: [],
        productsList: [],
    });
    const [customerOrders, setCustomerOrders] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const fetchData = async () => {
            try {
                setLoading(true);

                if (isSuperAdmin) {
                    // SuperAdmin: Fetch all orders, products, and users
                    const [ordersRes, productsRes, usersRes] = await Promise.allSettled([
                        axios.get(`${window.api}/api/orders/all`, { headers }),
                        axios.get(`${window.api}/api/products/all`, { headers }),
                        axios.get(`${window.api}/api/auth/users`, { headers }),
                    ]);

                    let orders = [];
                    let products = [];
                    let users = [];

                    if (ordersRes.status === "fulfilled" && ordersRes.value?.data?.orders) {
                        orders = ordersRes.value.data.orders;
                    }
                    if (productsRes.status === "fulfilled" && productsRes.value?.data?.products) {
                        products = productsRes.value.data.products;
                    }
                    if (usersRes.status === "fulfilled" && usersRes.value?.data?.users) {
                        users = usersRes.value.data.users;
                    }

                    // Calculate real total revenue in PKR
                    const totalRev = orders.reduce((acc, curr) => acc + (Number(curr.totalAmount || curr.totalPrice) || 0), 0);

                    setStats({
                        totalRevenue: totalRev,
                        totalOrders: orders.length,
                        totalProducts: products.length,
                        totalUsers: users.length,
                        recentOrders: orders.slice(0, 6),
                        productsList: products,
                    });
                } else {
                    // Customer: Fetch own orders and public products
                    const [ordersRes, productsRes] = await Promise.allSettled([
                        axios.get(`${window.api}/api/orders/all`, { headers }),
                        axios.get(`${window.api}/api/products/public-all`),
                    ]);

                    let myOrders = [];
                    let products = [];

                    if (ordersRes.status === "fulfilled" && ordersRes.value?.data?.orders) {
                        myOrders = ordersRes.value.data.orders;
                    }
                    if (productsRes.status === "fulfilled" && productsRes.value?.data?.products) {
                        products = productsRes.value.data.products;
                    }

                    setCustomerOrders(myOrders);
                    setStats((prev) => ({
                        ...prev,
                        totalOrders: myOrders.length,
                        totalProducts: products.length,
                        productsList: products,
                    }));
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isSuperAdmin]);

    // Dynamic Category Calculations for Admin
    const categoryCounts = stats.productsList.reduce((acc, p) => {
        const cat = p.category || "Other";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    const totalMenuCount = stats.productsList.length || 1;

    // Active order for customer (pending, processing, or shipped)
    const activeOrder = customerOrders.find((o) =>
        ["pending", "processing", "shipped"].includes((o.orderStatus || "").toLowerCase())
    );

    // ── SuperAdmin Dashboard View ──────────────────────────────────────────
    if (isSuperAdmin) {
        return (
            <div className="admin-dashboard-container">
                {/* 1. Welcome Banner */}
                <div className="dashboard-welcome-banner">
                    <div className="banner-glow"></div>
                    <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
                        <div className="col-lg-8">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="live-pill">
                                    <span className="pulse-dot"></span> Store Live &amp; Accepting Orders
                                </span>
                            </div>
                            <h2 className="banner-title">
                                Welcome Back, {user?.name || "Administrator"}! 👋
                            </h2>
                            <p className="banner-subtitle">
                                Real-time restaurant store metrics, revenue tracking in PKR, and order management.
                            </p>
                        </div>
                        <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                            <Link to="/dashboard/products/add" className="text-decoration-none">
                                <button className="btn btn-danger px-4 py-2 rounded-3 fw-bold shadow-sm d-inline-flex align-items-center gap-2">
                                    <PlusOutlined /> Add New Dish
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 2. Top 4 KPI Metrics (All Live in PKR) */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div className="metric-kpi-card">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="kpi-icon-box" style={{ background: "rgba(34, 197, 94, 0.12)", color: "#16a34a" }}>
                                    <DollarOutlined />
                                </div>
                                <span className="kpi-trend positive">Live PKR</span>
                            </div>
                            <div className="kpi-label">TOTAL STORE REVENUE</div>
                            <div className="kpi-value">
                                {loading ? <Skeleton.Input active size="small" /> : `Rs. ${stats.totalRevenue.toLocaleString()}`}
                            </div>
                            <small className="text-muted">Lifetime gross order sales (PKR)</small>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                        <div className="metric-kpi-card">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="kpi-icon-box" style={{ background: "rgba(230, 57, 70, 0.12)", color: "#e63946" }}>
                                    <ShoppingOutlined />
                                </div>
                                <span className="kpi-trend positive">Live Orders</span>
                            </div>
                            <div className="kpi-label">TOTAL ORDERS PLACED</div>
                            <div className="kpi-value">
                                {loading ? <Skeleton.Input active size="small" /> : `${stats.totalOrders} Orders`}
                            </div>
                            <small className="text-muted">Fetched from database</small>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                        <div className="metric-kpi-card">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="kpi-icon-box" style={{ background: "rgba(255, 183, 3, 0.15)", color: "#d97706" }}>
                                    <AppstoreOutlined />
                                </div>
                                <span className="kpi-trend neutral">Active</span>
                            </div>
                            <div className="kpi-label">ACTIVE MENU DISHES</div>
                            <div className="kpi-value">
                                {loading ? <Skeleton.Input active size="small" /> : `${stats.totalProducts} Dishes`}
                            </div>
                            <small className="text-muted">Live food catalogue</small>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                        <div className="metric-kpi-card">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="kpi-icon-box" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#2563eb" }}>
                                    <TeamOutlined />
                                </div>
                                <span className="kpi-trend positive">Registered</span>
                            </div>
                            <div className="kpi-label">REGISTERED USERS</div>
                            <div className="kpi-value">
                                {loading ? <Skeleton.Input active size="small" /> : `${stats.totalUsers} Accounts`}
                            </div>
                            <small className="text-muted">Active store accounts</small>
                        </div>
                    </div>
                </div>

                {/* 3. Quick Action Hub */}
                <div className="row g-2 g-sm-3 mb-3 mb-sm-4">
                    <div className="col-6 col-md-3">
                        <Link to="/dashboard/products/add" className="dashboard-action-btn-card">
                            <div className="action-card-icon"><PlusOutlined /></div>
                            <div>
                                <div className="action-card-title">Add Food Dish</div>
                                <div className="action-card-sub">Upload new product</div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-6 col-md-3">
                        <Link to="/dashboard/orders" className="dashboard-action-btn-card">
                            <div className="action-card-icon" style={{ background: "rgba(34, 197, 94, 0.12)", color: "#16a34a" }}>
                                <ShoppingOutlined />
                            </div>
                            <div>
                                <div className="action-card-title">Manage Orders</div>
                                <div className="action-card-sub">Update order status</div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-6 col-md-3">
                        <Link to="/dashboard/users" className="dashboard-action-btn-card">
                            <div className="action-card-icon" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#2563eb" }}>
                                <TeamOutlined />
                            </div>
                            <div>
                                <div className="action-card-title">Customer List</div>
                                <div className="action-card-sub">Manage user roles</div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-6 col-md-3">
                        <Link to="/products" className="dashboard-action-btn-card">
                            <div className="action-card-icon" style={{ background: "rgba(255, 183, 3, 0.15)", color: "#d97706" }}>
                                <FireFilled />
                            </div>
                            <div>
                                <div className="action-card-title">Browse Menu</div>
                                <div className="action-card-sub">Preview customer store</div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* 4. Category Breakdown & Recent Orders Table */}
                <div className="row g-4 mb-4">
                    {/* Left: Dynamic Category Sales Progress */}
                    <div className="col-lg-4">
                        <div className="dashboard-section-card h-100">
                            <div className="section-card-header">
                                <h4 className="section-card-title">Live Menu Categories</h4>
                            </div>

                            {Object.keys(categoryCounts).length === 0 ? (
                                <p className="text-muted small">No categories registered yet.</p>
                            ) : (
                                Object.entries(categoryCounts).map(([catName, count], idx) => {
                                    const percent = Math.round((count / totalMenuCount) * 100);
                                    const colors = ["#e63946", "#ffb703", "#10b981", "#3b82f6", "#8b5cf6"];
                                    const stroke = colors[idx % colors.length];
                                    return (
                                        <div className="mb-3" key={catName}>
                                            <div className="d-flex justify-content-between small fw-bold mb-1">
                                                <span>🍴 {catName}</span>
                                                <span>{count} dishes ({percent}%)</span>
                                            </div>
                                            <Progress percent={percent} strokeColor={stroke} showInfo={false} />
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right: Real Live Recent Orders Table */}
                    <div className="col-lg-8">
                        <div className="dashboard-section-card h-100">
                            <div className="section-card-header">
                                <h4 className="section-card-title">Recent Store Orders</h4>
                                <Link to="/dashboard/orders" className="text-decoration-none small text-danger fw-bold">
                                    View All Orders ({stats.totalOrders}) →
                                </Link>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light small">
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Total (PKR)</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {stats.recentOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-4 text-muted">
                                                    <p className="mb-1 fw-semibold">No orders recorded in database yet.</p>
                                                    <small>Customer orders placed from the store will appear here in real time.</small>
                                                </td>
                                            </tr>
                                        ) : (
                                            stats.recentOrders.map((ord, idx) => (
                                                <tr key={ord.id || ord._id || idx}>
                                                    <td className="fw-bold text-dark">
                                                        {ord.id ? ord.id.substring(0, 8) : String(ord._id).slice(-6)}
                                                    </td>
                                                    <td>
                                                        <div className="fw-semibold">
                                                            {ord.shippingAddress?.fullName || ord.user?.name || "Customer"}
                                                        </div>
                                                        <small className="text-muted">{ord.shippingAddress?.phone || ""}</small>
                                                    </td>
                                                    <td className="fw-bold" style={{ color: "#e63946" }}>
                                                        Rs. {Number(ord.totalAmount || ord.totalPrice || 0).toLocaleString()}
                                                    </td>
                                                    <td>
                                                        <Tag
                                                            color={
                                                                (ord.orderStatus || ord.status) === "delivered" ? "green" :
                                                                (ord.orderStatus || ord.status) === "shipped" ? "orange" :
                                                                (ord.orderStatus || ord.status) === "processing" ? "blue" : "default"
                                                            }
                                                        >
                                                            {(ord.orderStatus || ord.status || "PENDING").toUpperCase()}
                                                        </Tag>
                                                    </td>
                                                    <td className="text-muted">
                                                        {ord.createdAt
                                                            ? new Date(ord.createdAt).toLocaleDateString("en-PK", { day: "2-digit", month: "short" })
                                                            : "Recent"}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Regular Customer / User Dashboard View ──────────────────────────────
    return (
        <div className="customer-dashboard-container">
            {/* 1. Customer Welcome Hero Banner */}
            <div className="dashboard-welcome-banner">
                <div className="banner-glow"></div>
                <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
                    <div className="col-lg-8">
                        <span className="live-pill mb-2">
                            ⭐ Valued Member • Foodie Club
                        </span>
                        <h2 className="banner-title">
                            Hey, {user?.name || "Food Lover"}! 👋 What are you craving?
                        </h2>
                        <p className="banner-subtitle">
                            Fresh, piping-hot artisan meals are prepared live and delivered in 30 minutes!
                        </p>
                    </div>
                    <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                        <Link to="/products" className="text-decoration-none">
                            <button className="btn btn-danger px-4 py-2 rounded-3 fw-bold shadow-sm d-inline-flex align-items-center gap-2">
                                <FireFilled /> Order Fresh Meal Now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. Customer Activity KPI Metrics */}
            <div className="row g-2 g-sm-3 mb-3 mb-sm-4">
                <div className="col-6 col-lg-3">
                    <div className="metric-kpi-card">
                        <div className="kpi-icon-box" style={{ background: "rgba(230, 57, 70, 0.12)", color: "#e63946" }}>
                            <ShoppingOutlined />
                        </div>
                        <div className="kpi-label mt-2">TOTAL MEALS ORDERED</div>
                        <div className="kpi-value">{customerOrders.length} Meals</div>
                        <small className="text-muted">Placed from your account</small>
                    </div>
                </div>

                <div className="col-6 col-lg-3">
                    <div className="metric-kpi-card">
                        <div className="kpi-icon-box" style={{ background: "rgba(255, 183, 3, 0.15)", color: "#d97706" }}>
                            <StarFilled />
                        </div>
                        <div className="kpi-label mt-2">FOOD REWARD POINTS</div>
                        <div className="kpi-value">{customerOrders.length * 50} Pts</div>
                        <small className="text-success fw-bold">Redeemable for Rs. 500 OFF</small>
                    </div>
                </div>

                <div className="col-6 col-lg-3">
                    <div className="metric-kpi-card">
                        <div className="kpi-icon-box" style={{ background: "rgba(34, 197, 94, 0.12)", color: "#16a34a" }}>
                            <ThunderboltFilled />
                        </div>
                        <div className="kpi-label mt-2">EXPRESS DELIVERY</div>
                        <div className="kpi-value">30 Mins</div>
                        <small className="text-muted">Guaranteed fast delivery</small>
                    </div>
                </div>

                <div className="col-6 col-lg-3">
                    <div className="metric-kpi-card">
                        <div className="kpi-icon-box" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#2563eb" }}>
                            <SafetyCertificateFilled />
                        </div>
                        <div className="kpi-label mt-2">EXCLUSIVE DISCOUNT</div>
                        <div className="kpi-value">FOOD50</div>
                        <small className="text-primary fw-bold">50% Off On Orders &gt; Rs. 1,500</small>
                    </div>
                </div>
            </div>

            {/* 3. Live Order Tracker Banner (Real Customer Order) */}
            <div className="dashboard-section-card mb-4">
                <div className="section-card-header">
                    <h4 className="section-card-title d-flex align-items-center gap-2">
                        <ClockCircleFilled style={{ color: "#e63946" }} /> Active Order Tracker
                    </h4>
                    {activeOrder ? (
                        <Tag color="orange">IN PROGRESS</Tag>
                    ) : (
                        <Tag color="green">READY TO ORDER</Tag>
                    )}
                </div>

                {activeOrder ? (
                    <div className="p-3 bg-light rounded-3">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
                            <div>
                                <div className="fw-bold fs-6 text-dark">
                                    Order #{activeOrder.id?.substring(0, 8)} •{" "}
                                    {activeOrder.products?.map((p) => `${p.name} (x${p.quantity})`).join(", ") || "Delicious Meal"}
                                </div>
                                <small className="text-muted">
                                    Total: <strong className="text-danger">Rs. {Number(activeOrder.totalAmount).toLocaleString()}</strong> •
                                    Deliver to: {activeOrder.shippingAddress?.address || "Your Delivery Address"}
                                </small>
                            </div>
                            <Link to="/dashboard/orders" className="text-decoration-none">
                                <button className="btn btn-sm btn-outline-danger fw-bold">
                                    View Order Details
                                </button>
                            </Link>
                        </div>
                        {/* Status Progress Bar */}
                        <Progress
                            percent={
                                activeOrder.orderStatus === "shipped" ? 85 :
                                activeOrder.orderStatus === "processing" ? 55 : 25
                            }
                            strokeColor="#e63946"
                            status="active"
                        />
                        <div className="d-flex justify-content-between small text-muted mt-2 fw-semibold">
                            <span className={activeOrder.orderStatus ? "text-danger fw-bold" : ""}>✓ Placed</span>
                            <span className={activeOrder.orderStatus === "processing" || activeOrder.orderStatus === "shipped" ? "text-danger fw-bold" : ""}>
                                Kitchen Cooking
                            </span>
                            <span className={activeOrder.orderStatus === "shipped" ? "text-danger fw-bold" : ""}>
                                🛵 On the Way
                            </span>
                            <span>Delivered</span>
                        </div>
                    </div>
                ) : (
                    <div className="p-3 bg-light rounded-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                        <div>
                            <div className="fw-bold text-dark">No active delivery right now! 🛵</div>
                            <small className="text-muted">
                                Treat yourself to fresh artisanal pizzas, burgers, or pastas. Delivered in 30 minutes!
                            </small>
                        </div>
                        <Link to="/products" className="text-decoration-none">
                            <button className="btn btn-danger btn-sm fw-bold px-3">
                                Browse Store Menu
                            </button>
                        </Link>
                    </div>
                )}
            </div>

            {/* 4. Quick Shortcuts & Real Order History */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="dashboard-section-card h-100">
                        <h4 className="section-card-title mb-3">Quick Food Categories</h4>
                        <div className="row g-2">
                            <div className="col-6">
                                <Link to="/products" className="dashboard-action-btn-card">
                                    <span className="fs-3">🍕</span>
                                    <div>
                                        <div className="action-card-title">Hot Pizzas</div>
                                        <small className="text-muted">Cheesy delights</small>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-6">
                                <Link to="/products" className="dashboard-action-btn-card">
                                    <span className="fs-3">🍔</span>
                                    <div>
                                        <div className="action-card-title">Juicy Burgers</div>
                                        <small className="text-muted">Double stacked</small>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-6">
                                <Link to="/products" className="dashboard-action-btn-card">
                                    <span className="fs-3">🍝</span>
                                    <div>
                                        <div className="action-card-title">Italian Pastas</div>
                                        <small className="text-muted">Chef specials</small>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-6">
                                <Link to="/products" className="dashboard-action-btn-card">
                                    <span className="fs-3">🍹</span>
                                    <div>
                                        <div className="action-card-title">Chilled Drinks</div>
                                        <small className="text-muted">Refreshing juices</small>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="dashboard-section-card h-100">
                        <div className="section-card-header">
                            <h4 className="section-card-title">Recent Order History</h4>
                            <Link to="/dashboard/orders" className="text-decoration-none small text-danger fw-bold">
                                All Orders ({customerOrders.length}) →
                            </Link>
                        </div>

                        {customerOrders.length === 0 ? (
                            <div className="p-4 text-center text-muted border rounded-3 bg-light">
                                <span className="fs-1 d-block mb-2">🍽️</span>
                                <h6 className="fw-bold text-dark mb-1">No Orders Placed Yet</h6>
                                <p className="small mb-3">
                                    You haven't ordered yet. Enjoy 50% discount with promo code <strong className="text-danger">FOOD50</strong>!
                                </p>
                                <Link to="/products" className="btn btn-sm btn-danger rounded-pill px-3 fw-bold">
                                    Start Ordering
                                </Link>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {customerOrders.slice(0, 4).map((ord, idx) => (
                                    <div
                                        className="d-flex align-items-center justify-content-between p-2 rounded-2 border"
                                        key={ord.id || ord._id || idx}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="fs-4">
                                                {ord.products?.[0]?.name?.toLowerCase().includes("pizza") ? "🍕" :
                                                 ord.products?.[0]?.name?.toLowerCase().includes("burger") ? "🍔" :
                                                 ord.products?.[0]?.name?.toLowerCase().includes("pasta") ? "🍝" : "🍽️"}
                                            </span>
                                            <div>
                                                <div className="fw-bold small text-dark">
                                                    {ord.products?.map((p) => `${p.name} (x${p.quantity})`).join(", ") || "Food Order"}
                                                </div>
                                                <small className="text-muted">
                                                    {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString("en-PK") : "Recent"} •{" "}
                                                    <strong className="text-danger">
                                                        Rs. {Number(ord.totalAmount).toLocaleString()}
                                                    </strong>
                                                </small>
                                            </div>
                                        </div>
                                        <Link to="/products" className="btn btn-sm btn-outline-dark">
                                            Reorder
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;