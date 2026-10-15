import React from 'react';
import {
    DashboardOutlined,
    AppstoreOutlined,
    ShoppingOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const root = "/dashboard";

export const items = [
    {
        key: "1",
        label: <Link to={`${root}`} className="text-decoration-none">Dashboard Overview</Link>,
        icon: <DashboardOutlined />
    },
    {
        key: "2",
        label: <Link to={`${root}/products`} className="text-decoration-none">Food Products</Link>,
        icon: <AppstoreOutlined />,
        allowedroles: ["superAdmin"]
    },
    {
        key: "3",
        label: <Link to={`${root}/orders`} className="text-decoration-none">Orders &amp; Tracking</Link>,
        icon: <ShoppingOutlined />,
        allowedroles: ["superAdmin", "customer"]
    },
    {
        key: "4",
        label: <Link to={`${root}/users`} className="text-decoration-none">Customer Accounts</Link>,
        icon: <TeamOutlined />,
        allowedroles: ["superAdmin"]
    }
];