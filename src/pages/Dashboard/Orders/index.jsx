import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Typography,
    Button,
    Table,
    Tag,
    Modal,
    Form,
    Select,
    Tooltip,
    Dropdown,
    Popconfirm,
    Input,
    Skeleton,
} from 'antd';
import {
    ShoppingOutlined,
    CheckCircleFilled,
    ClockCircleFilled,
    DollarOutlined,
    SearchOutlined,
    CopyOutlined,
    CheckOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    FireFilled,
} from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '@/context/Auth';

const orderStatusOptions = [
    { label: '✓ Delivered (Paid)', value: 'delivered' },
    { label: '⏳ Processing / Cooking', value: 'processing' },
    { label: '✕ Cancelled', value: 'cancelled' },
];

const paymentStatusOptions = [
    { label: '✓ Paid', value: 'paid' },
    { label: '⏳ Pending', value: 'pending' },
    { label: '✕ Failed', value: 'failed' },
];

const Orders = () => {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'superAdmin';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [deliveringId, setDeliveringId] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const [form] = Form.useForm();

    // ── Fetch Orders ──────────────────────────────────────────────────
    const getDocuments = useCallback(() => {
        setLoading(true);
        axios
            .get(`${window.api}/api/orders/all`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
            })
            .then((res) => {
                const { status, data } = res;
                if (status === 200) {
                    setDocuments(data.orders || []);
                }
            })
            .catch((err) => {
                console.error('Fetch orders error:', err);
                const msg = err.response?.data?.message || 'Failed to load orders';
                window.toastify(msg, 'error');
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        getDocuments();
    }, [getDocuments]);

    // ── One-Click Mark as Delivered (Sets Payment to Paid) ─────────────
    const handleMarkDelivered = async (order) => {
        try {
            setDeliveringId(order.id);
            const token = localStorage.getItem('jwt');
            const res = await axios.patch(
                `${window.api}/api/orders/update/${order.id}`,
                { orderStatus: 'delivered', paymentStatus: 'paid' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                window.toastify(`Order #${order.id.substring(0, 8)} Delivered & Payment Paid! 🎉`, 'success');
                setDocuments((prev) =>
                    prev.map((doc) => (doc.id === order.id ? res.data.order : doc))
                );
            } else {
                window.toastify(res.data?.message || 'Failed to update order', 'error');
            }
        } catch (err) {
            console.error('Deliver error:', err);
            const msg = err.response?.data?.message || 'Something went wrong';
            window.toastify(msg, 'error');
        } finally {
            setDeliveringId(null);
        }
    };

    // ── Delete Order ──────────────────────────────────────────────────
    const handleDelete = (order) => {
        const token = localStorage.getItem('jwt');
        setDeletingId(order.id);

        axios
            .delete(`${window.api}/api/orders/delete/${order.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const { status, data } = res;
                if (status === 200) {
                    window.toastify(data.message || 'Order deleted successfully', 'success');
                    setDocuments((prev) => prev.filter((doc) => doc.id !== order.id));
                } else {
                    window.toastify(data.message || 'Failed to delete order', 'error');
                }
            })
            .catch((err) => {
                console.error(err);
                const msg = err.response?.data?.message || 'Failed to delete order';
                window.toastify(msg, 'error');
            })
            .finally(() => setDeletingId(null));
    };

    // ── Open Edit Modal ───────────────────────────────────────────────
    const handleEdit = (order) => {
        setOrderToEdit(order);
        setIsModalOpen(true);
    };

    const resetModal = () => {
        setIsModalOpen(false);
        setOrderToEdit(null);
        form.resetFields();
    };

    useEffect(() => {
        if (isModalOpen && orderToEdit) {
            form.setFieldsValue({
                orderStatus: orderToEdit.orderStatus || 'processing',
                paymentStatus: orderToEdit.orderStatus === 'delivered' ? 'paid' : (orderToEdit.paymentStatus || 'pending'),
            });
        }
    }, [isModalOpen, orderToEdit, form]);

    // When status changes in form, automatically set payment to paid if delivered
    const handleStatusChangeInForm = (newStatus) => {
        if (newStatus === 'delivered') {
            form.setFieldsValue({ paymentStatus: 'paid' });
        }
    };

    // ── Update Order Status via Modal ─────────────────────────────────
    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const { orderStatus, paymentStatus } = values;

            setIsProcessing(true);
            const res = await axios.patch(
                `${window.api}/api/orders/update/${orderToEdit.id}`,
                {
                    orderStatus,
                    paymentStatus: orderStatus === 'delivered' ? 'paid' : paymentStatus,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
            );

            if (res.status === 200) {
                window.toastify('Order updated successfully! 🎉', 'success');
                setDocuments((prev) =>
                    prev.map((doc) => (doc.id === orderToEdit.id ? res.data.order : doc))
                );
                resetModal();
            } else {
                window.toastify(res.data?.message || 'Failed to update order', 'error');
            }
        } catch (err) {
            if (err?.errorFields) return;
            console.error(err);
            const msg = err.response?.data?.message || 'Failed to update order';
            window.toastify(msg, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    // ── Filter & Search Computations ──────────────────────────────────
    const filteredOrders = useMemo(() => {
        return documents.filter((order) => {
            const q = searchQuery.toLowerCase().trim();
            const matchesQuery =
                !q ||
                order.id?.toLowerCase().includes(q) ||
                order.shippingAddress?.fullName?.toLowerCase().includes(q) ||
                order.shippingAddress?.phone?.includes(q) ||
                order.shippingAddress?.city?.toLowerCase().includes(q) ||
                order.products?.some((p) => p.name?.toLowerCase().includes(q));

            const matchesStatus =
                selectedStatus === 'all' ||
                order.orderStatus?.toLowerCase() === selectedStatus.toLowerCase();

            return matchesQuery && matchesStatus;
        });
    }, [documents, searchQuery, selectedStatus]);

    // ── KPI Summary Calculations ──────────────────────────────────────
    const stats = useMemo(() => {
        const total = documents.length;
        const delivered = documents.filter((d) => d.orderStatus === 'delivered').length;
        const processing = documents.filter((d) => d.orderStatus === 'processing').length;
        const revenue = documents.reduce(
            (acc, curr) => acc + (Number(curr.totalAmount || curr.totalPrice) || 0),
            0
        );
        return { total, delivered, processing, revenue };
    }, [documents]);

    // ── Unique Table Columns ──────────────────────────────────────────
    const columns = [
        {
            title: 'Order ID & Date',
            key: 'orderId',
            width: 170,
            render: (_, record) => (
                <div>
                    <div className="d-flex align-items-center gap-1">
                        <span className="order-id-badge">#{record.id?.substring(0, 8)}</span>
                        <Tooltip title="Copy Order ID">
                            <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined style={{ fontSize: '0.78rem', color: '#64748b' }} />}
                                onClick={() => {
                                    navigator.clipboard.writeText(record.id);
                                    window.toastify('Order ID copied!', 'success');
                                }}
                            />
                        </Tooltip>
                    </div>
                    <span className="order-date-text">
                        {record.createdAt
                            ? new Date(record.createdAt).toLocaleDateString('en-PK', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                              })
                            : 'Recent'}
                    </span>
                    <span className="payment-method-pill">
                        {record.paymentMethod || 'COD'}
                    </span>
                </div>
            ),
        },
        {
            title: 'Food Products',
            key: 'products',
            width: 250,
            render: (_, record) => {
                const products = record.products || [];
                return (
                    <div className="d-flex flex-column gap-2">
                        {products.map((item, i) => (
                            <div className="product-cell-item" key={i}>
                                <img
                                    src={item.imageURL || '/images/hero_burger.jpg'}
                                    alt={item.name}
                                    className="product-avatar-img"
                                    loading="lazy"
                                />
                                <div>
                                    <div className="product-name-title">
                                        {item.name}
                                        <span className="product-qty-tag">×{item.quantity}</span>
                                    </div>
                                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                                        Rs. {Number(item.price).toLocaleString()} each
                                    </small>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            },
        },
        {
            title: 'Customer & Shipping Address',
            key: 'shipping',
            width: 240,
            render: (_, record) => {
                const addr = record.shippingAddress || {};
                return (
                    <div className="customer-info-cell">
                        <div className="customer-name">{addr.fullName || 'Valued Customer'}</div>
                        <div className="customer-phone">
                            <PhoneOutlined style={{ color: '#059669', fontSize: '0.75rem' }} />
                            <span>{addr.phone || 'No phone'}</span>
                        </div>
                        <div className="customer-address">
                            <EnvironmentOutlined style={{ color: '#e63946', fontSize: '0.75rem', marginRight: 4 }} />
                            <span>
                                {addr.address ? `${addr.address}, ${addr.city || ''}` : 'Store Pickup'}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Total (PKR)',
            key: 'totalAmount',
            width: 130,
            render: (_, record) => (
                <div>
                    <div className="order-total-price">
                        Rs. {Number(record.totalAmount || 0).toLocaleString()}
                    </div>
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                        {record.products?.reduce((sum, p) => sum + (p.quantity || 1), 0) || 1} Items total
                    </small>
                </div>
            ),
        },
        {
            title: 'Order Status',
            key: 'orderStatus',
            width: 140,
            render: (_, record) => {
                const status = (record.orderStatus || 'processing').toLowerCase();
                if (status === 'delivered') {
                    return (
                        <span className="status-badge-delivered">
                            <CheckOutlined /> Delivered
                        </span>
                    );
                }
                if (status === 'cancelled') {
                    return (
                        <span className="status-badge-cancelled">
                            ✕ Cancelled
                        </span>
                    );
                }
                return (
                    <span className="status-badge-processing">
                        <ClockCircleFilled /> Cooking / Active
                    </span>
                );
            },
        },
        {
            title: 'Payment Status',
            key: 'paymentStatus',
            width: 130,
            render: (_, record) => {
                // If order is delivered, payment is guaranteed Paid!
                const isPaid = record.orderStatus === 'delivered' || record.paymentStatus === 'paid';
                if (isPaid) {
                    return (
                        <span className="payment-badge-paid">
                            <CheckCircleFilled /> Paid
                        </span>
                    );
                }
                if (record.paymentStatus === 'failed') {
                    return <Tag color="error">✕ Failed</Tag>;
                }
                return (
                    <span className="payment-badge-pending">
                        <ClockCircleFilled /> Pending
                    </span>
                );
            },
        },
        {
            title: 'Actions',
            key: 'action',
            fixed: 'right',
            width: 160,
            render: (_, record) => {
                if (!isSuperAdmin) return null;
                const isDelivered = record.orderStatus === 'delivered';

                return (
                    <div className="d-flex align-items-center gap-2">
                        {/* Quick One-Click Deliver Button */}
                        {!isDelivered ? (
                            <Tooltip title="Mark Delivered & Settle Payment as Paid">
                                <button
                                    className="btn-quick-deliver"
                                    onClick={() => handleMarkDelivered(record)}
                                    disabled={deliveringId === record.id}
                                >
                                    {deliveringId === record.id ? (
                                        'Updating...'
                                    ) : (
                                        <>
                                            <CheckOutlined /> Deliver
                                        </>
                                    )}
                                </button>
                            </Tooltip>
                        ) : (
                            <span className="badge bg-success-subtle text-success px-2 py-1 rounded-pill" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                                ✓ Settled
                            </span>
                        )}

                        {/* More Action Dropdown */}
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        label: 'Edit Status',
                                        icon: <EditOutlined />,
                                        key: 'edit',
                                        onClick: () => handleEdit(record),
                                    },
                                    {
                                        type: 'divider',
                                    },
                                    {
                                        label: (
                                            <Popconfirm
                                                title="Delete Order"
                                                description="Are you sure you want to permanently delete this order?"
                                                onConfirm={() => handleDelete(record)}
                                                okText="Yes, Delete"
                                                okButtonProps={{ danger: true }}
                                            >
                                                <span style={{ color: '#ef4444' }}>Delete Order</span>
                                            </Popconfirm>
                                        ),
                                        icon: <DeleteOutlined style={{ color: '#ef4444' }} />,
                                        key: 'delete',
                                        danger: true,
                                    },
                                ],
                            }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <button className="btn-table-action-dots" title="More options">
                                <MoreOutlined />
                            </button>
                        </Dropdown>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="orders-page-container">
            {/* 1. Header Title Strip */}
            <div className="orders-header-strip">
                <h1 className="orders-page-title">
                    <ShoppingOutlined style={{ color: '#e63946' }} />
                    Order Management &amp; Tracking
                </h1>
                <p className="orders-page-sub">
                    Live restaurant orders, one-click delivery settlements, and payment tracking in PKR.
                </p>
            </div>

            {/* 2. Top 4 Metric KPI Summary Cards */}
            <div className="orders-metrics-grid">
                <div className="order-kpi-card">
                    <div className="kpi-icon-wrap" style={{ background: 'rgba(230, 57, 70, 0.1)', color: '#e63946' }}>
                        <ShoppingOutlined />
                    </div>
                    <div className="kpi-text-box">
                        <div className="kpi-number">{stats.total} Orders</div>
                        <div className="kpi-title">Total Placed</div>
                    </div>
                </div>

                <div className="order-kpi-card">
                    <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                        <CheckCircleFilled />
                    </div>
                    <div className="kpi-text-box">
                        <div className="kpi-number text-success">{stats.delivered} Delivered</div>
                        <div className="kpi-title">Paid &amp; Settled</div>
                    </div>
                </div>

                <div className="order-kpi-card">
                    <div className="kpi-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
                        <ClockCircleFilled />
                    </div>
                    <div className="kpi-text-box">
                        <div className="kpi-number text-primary">{stats.processing} Cooking</div>
                        <div className="kpi-title">Kitchen In-Progress</div>
                    </div>
                </div>

                <div className="order-kpi-card">
                    <div className="kpi-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#d97706' }}>
                        <DollarOutlined />
                    </div>
                    <div className="kpi-text-box">
                        <div className="kpi-number" style={{ color: '#e63946' }}>
                            Rs. {stats.revenue.toLocaleString()}
                        </div>
                        <div className="kpi-title">Gross Revenue (PKR)</div>
                    </div>
                </div>
            </div>

            {/* 3. Search & Quick Status Filters Toolbar */}
            <div className="orders-toolbar-card">
                <div className="toolbar-search-input">
                    <Input
                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                        placeholder="Search by ID, customer, phone, or dish..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        allowClear
                        size="middle"
                        style={{ borderRadius: 10 }}
                    />
                </div>

                <div className="toolbar-filter-group">
                    <span
                        className={`filter-pill ${selectedStatus === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('all')}
                    >
                        All Orders <span className="badge-count">{documents.length}</span>
                    </span>
                    <span
                        className={`filter-pill ${selectedStatus === 'delivered' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('delivered')}
                    >
                        Delivered &amp; Paid{' '}
                        <span className="badge-count">
                            {documents.filter((d) => d.orderStatus === 'delivered').length}
                        </span>
                    </span>
                    <span
                        className={`filter-pill ${selectedStatus === 'processing' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('processing')}
                    >
                        Cooking{' '}
                        <span className="badge-count">
                            {documents.filter((d) => d.orderStatus === 'processing').length}
                        </span>
                    </span>
                    <span
                        className={`filter-pill ${selectedStatus === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setSelectedStatus('cancelled')}
                    >
                        Cancelled{' '}
                        <span className="badge-count">
                            {documents.filter((d) => d.orderStatus === 'cancelled').length}
                        </span>
                    </span>
                </div>
            </div>

            {/* 4. Unique High-End Orders Table */}
            <div className="unique-orders-card">
                <Table
                    columns={isSuperAdmin ? columns : columns.filter((col) => col.key !== 'action')}
                    dataSource={filteredOrders}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1080 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '25', '50'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
                    }}
                    locale={{
                        emptyText: (
                            <div className="text-center py-5">
                                <span className="fs-1 d-block mb-2">🍽️</span>
                                <h5 className="fw-bold text-dark mb-1">No Orders Found</h5>
                                <p className="text-muted small">
                                    {searchQuery || selectedStatus !== 'all'
                                        ? 'No orders match your filter criteria.'
                                        : 'Customer food orders will appear here automatically.'}
                                </p>
                            </div>
                        ),
                    }}
                />
            </div>

            {/* ── Edit Order Status Modal ───────────────────────────────── */}
            <Modal
                title={
                    <div className="d-flex align-items-center gap-2">
                        <EditOutlined style={{ color: '#e63946' }} />
                        <span className="fw-bold">Update Order Status</span>
                    </div>
                }
                open={isModalOpen}
                onCancel={resetModal}
                onOk={handleUpdate}
                okText="Save Changes"
                confirmLoading={isProcessing}
                okButtonProps={{ style: { background: '#e63946', borderColor: '#e63946' } }}
                centered
            >
                {orderToEdit && (
                    <div
                        style={{
                            marginBottom: 16,
                            padding: '14px 16px',
                            background: '#f8fafc',
                            borderRadius: 12,
                            border: '1px solid #e2e8f0',
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small">Order ID</span>
                            <span className="order-id-badge">#{orderToEdit.id}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small">Customer</span>
                            <span className="fw-bold text-dark">
                                {orderToEdit.shippingAddress?.fullName || 'Customer'}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted small">Total Bill (PKR)</span>
                            <span className="fw-bold fs-6" style={{ color: '#e63946' }}>
                                Rs. {Number(orderToEdit.totalAmount).toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}

                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Order Status"
                        name="orderStatus"
                        rules={[{ required: true, message: 'Please select an order status' }]}
                        help="Note: Setting status to 'Delivered' will automatically mark payment as Paid."
                    >
                        <Select
                            placeholder="Select order status"
                            size="large"
                            options={orderStatusOptions}
                            onChange={handleStatusChangeInForm}
                        />
                    </Form.Item>

                    <Form.Item label="Payment Status" name="paymentStatus">
                        <Select placeholder="Select payment status" size="large" options={paymentStatusOptions} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Orders;