import { DesktopOutlined, PieChartOutlined, TeamOutlined, DashboardOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const root = "/dashboard"

export const items = [
    { key: "1", label: <Link to={`${root}`} className="text-decoration-none">Dashboard</Link>, icon: <DashboardOutlined /> },
    { key: "2", label: <Link to={`${root}/products`} className="text-decoration-none">Products</Link>, icon: <DesktopOutlined />, allowedroles: ["superAdmin"] },
    { key: "3", label: <Link to={`${root}/orders`} className="text-decoration-none">Orders</Link>, icon: <PieChartOutlined /> },
    { key: "4", label: <Link to={`${root}/users`} className="text-decoration-none">Users</Link>, icon: <TeamOutlined />, allowedroles: ["superAdmin"] }
];