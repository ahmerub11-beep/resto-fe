import React, { useState } from "react";
import { Layout, Menu, theme, Typography, Button } from "antd";
import { Link } from "react-router-dom";
import { items } from "./sitebarItems";
import { useAuth } from "@/context/Auth";
import Routes from "./Routes";

const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
    const { handleLogout, user } = useAuth();

    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const filteredItems = items
        .filter(item => !item.allowedroles || item.allowedroles.includes(user?.role))
        .map(({ allowedRoles, ...rest }) => rest);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                breakpoint="lg"
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div className="py-3 text-center">
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        <Link to="/" className="text-white text-decoration-none">
                            My Store
                        </Link>
                    </Typography.Title>
                </div>

                <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={filteredItems} />

            </Sider>

            <Layout>
                <Header
                    className="text-end"
                    style={{ background: colorBgContainer }}
                >
                    <Button
                        type="primary"
                        danger
                        size="large"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Header>

                <Content className="p-3">
                    <Routes />
                </Content>

                <Footer style={{ textAlign: 'center' }}>
                    <span className="fw-bold">My Store</span> ©{new Date().getFullYear()}. All Right Reserved.
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
