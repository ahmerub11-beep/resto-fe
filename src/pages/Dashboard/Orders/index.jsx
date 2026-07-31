import React, { useEffect, useState, useCallback } from 'react';
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
} from 'antd';
import { ShoppingOutlined, CarOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '@/context/Auth';

const orderStatusOptions = [
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
];

const orderStatusColors = {
    processing: 'blue',
    shipped: 'orange',
    delivered: 'green',
    cancelled: 'red',
};

const paymentStatusColors = {
    pending: 'green',
    paid: 'gold',
    failed: 'red',
};

const Orders = () => {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'superAdmin';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [shippingId, setShippingId] = useState(null);
    const [documents, setDocuments] = useState([]);

    const [form] = Form.useForm();

    // ── Fetch Orders ──────────────────────────────────────────────────
    const getDocuments = useCallback(() => {
        axios
            .get(`${window.api}/api/orders/all`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
            })
            .then((res) => {
                const { status, data } = res;
                if (status === 200) {
                    setDocuments(data.orders);
                }
            })
            .catch((err) => {
                console.log('err', err);
                const status = err.response ? err.response.status : 500;
                const data = err.response ? err.response.data : { message: 'Internal server error' };
                if (status === 400 || status === 401) {
                    window.toastify(data.message, 'error');
                } else {
                    window.toastify('Something went wrong', 'error');
                }
            });
    }, []);

    useEffect(() => {
        getDocuments();
    }, [getDocuments]);

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
                    window.toastify(data.message, 'success');
                    setDocuments((prev) => prev.filter((doc) => doc.id !== order.id));
                } else {
                    window.toastify(data.message, 'error');
                }
            })
            .catch((err) => {
                console.log('err', err);
                const status = err.response ? err.response.status : 500;
                const data = err.response ? err.response.data : { message: 'Internal server error' };
                if (status === 401 || status === 403) {
                    window.toastify(data.message, 'error');
                } else {
                    window.toastify('Something went wrong while deleting the order', 'error');
                }
            })
            .finally(() => setDeletingId(null));
    };

    // ── Open Edit Modal ───────────────────────────────────────────────
    const handleEdit = (order) => {
        setOrderToEdit(order);
        setIsModalOpen(true);
    };

    // Reset modal and form when closed
    const resetModal = () => {
        setIsModalOpen(false);
        setOrderToEdit(null);
    };

    // Sync form fields when modal opens / order changes
    useEffect(() => {
        if (isModalOpen && orderToEdit) {
            form.setFieldsValue({ orderStatus: orderToEdit.orderStatus });
        } else {
            form.resetFields();
        }
    }, [isModalOpen, orderToEdit, form]);

    // ── Update Order Status ───────────────────────────────────────────
    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const { orderStatus } = values;
            if (!orderStatus) {
                return window.toastify('Please select an order status', 'error');
            }
            setIsProcessing(true);
            const res = await axios.patch(
                `${window.api}/api/orders/update/${orderToEdit.id}`,
                { orderStatus },
                { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } },
            );
            const { status, data } = res;
            if (status === 200) {
                window.toastify(data.message || 'Order updated successfully', 'success');
                setDocuments((prev) =>
                    prev.map((doc) => (doc.id === orderToEdit.id ? data.order : doc)),
                );
                resetModal();
            } else {
                window.toastify(data.message || 'Failed to update order', 'error');
            }
        } catch (err) {
            if (err?.errorFields) {
                return;
            }
            console.error(err);
            const status = err.response ? err.response.status : 500;
            const data = err.response ? err.response.data : { message: 'Internal server error' };
            if (status === 400 || status === 403) {
                window.toastify(data.message, 'error');
            } else {
                window.toastify('Something went wrong', 'error');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    // ── Mark as Shipped ───────────────────────────────────────────────
    const handleMarkShipped = (order) => {
        setShippingId(order.id);
        axios
            .patch(
                `${window.api}/api/orders/update/${order.id}`,
                { orderStatus: 'shipped' },
                { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } },
            )
            .then((res) => {
                const { status, data } = res;
                if (status === 200) {
                    window.toastify('Order marked as Shipped!', 'success');
                    setDocuments((prev) =>
                        prev.map((doc) => (doc.id === order.id ? data.order : doc)),
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                const data = err.response ? err.response.data : { message: 'Internal server error' };
                window.toastify(data.message || 'Something went wrong', 'error');
            })
            .finally(() => setShippingId(null));
    };

    // ── Table Columns ─────────────────────────────────────────────────
    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => (
                <Typography.Text copyable>{text.substring(0, 8)}</Typography.Text>
            ),
        },
        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            render: (products) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {products.map((p, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <img
                                src={p.imageURL}
                                alt={p.name}
                                style={{
                                    width: 36,
                                    height: 36,
                                    objectFit: 'cover',
                                    borderRadius: 6,
                                    border: '1px solid #eee',
                                    flexShrink: 0,
                                }}
                            />
                            <span style={{ fontSize: 13 }}>
                                {p.name}{' '}
                                <span style={{ color: '#888' }}>x{p.quantity}</span>
                            </span>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Shipping Address',
            dataIndex: 'shippingAddress',
            key: 'shippingAddress',
            render: (addr) => (
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                    <div>
                        <strong>{addr.fullName}</strong>
                    </div>
                    <div style={{ color: '#555' }}>{addr.phone}</div>
                    <div style={{ color: '#888' }}>
                        {addr.address}, {addr.city}
                    </div>
                </div>
            ),
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (val) => (
                <strong style={{ color: '#1d3557' }}>Rs. {Number(val).toLocaleString()}</strong>
            ),
        },
        {
            title: 'Order Status',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (status) => (
                <Tag
                    color={orderStatusColors[status] || 'default'}
                    style={{ textTransform: 'capitalize', fontWeight: 600 }}
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Payment',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (status) => (
                <Tag color={paymentStatusColors[status] || 'default'} style={{ textTransform: 'capitalize' }}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Method',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (val) => (
                <Tag color="purple" style={{ textTransform: 'uppercase' }}>
                    {val}
                </Tag>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (val) =>
                new Date(val).toLocaleDateString('en-PK', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                if (!isSuperAdmin) return null;
                return (
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    label: 'Mark as Shipped',
                                    key: 'shipped',
                                    onClick: () => handleMarkShipped(record),
                                    disabled: record.orderStatus === 'shipped' || record.orderStatus === 'delivered',
                                },
                                {
                                    label: (
                                        <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record)}>
                                            Delete
                                        </Popconfirm>
                                    ),
                                    key: 'delete',
                                    danger: true,
                                },
                            ],
                        }}
                    >
                        <Button type="link">Action</Button>
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <>
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <Typography.Title level={2}>
                    <ShoppingOutlined style={{ marginRight: 10 }} />
                    All Orders
                </Typography.Title>
            </div>

            <div className="mt-3">
                <Table
                    columns={isSuperAdmin ? columns : columns.filter((col) => col.key !== 'action')}
                    dataSource={documents}
                    rowKey="id"
                    scroll={{ x: 1200 }}
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                />
            </div>

            {/* ── Edit Order Status Modal ───────────────────────────── */}
            <Modal
                title="Update Order Status"
                open={isModalOpen}
                onCancel={resetModal}
                onOk={handleUpdate}
                okText="Update Order"
                confirmLoading={isProcessing}
                okButtonProps={{ type: 'primary' }}

            >
                {orderToEdit && (
                    <div style={{ marginBottom: 16, padding: '12px 16px', background: '#f8f9fc', borderRadius: 10, border: '1px solid #e5e7eb' }}>
                        <p style={{ margin: 0, fontSize: 13, color: '#888' }}>Order ID</p>
                        <p style={{ margin: 0, fontFamily: 'monospace', fontWeight: 600 }}>#{orderToEdit.id}</p>
                        <p style={{ margin: '8px 0 0', fontSize: 13, color: '#888' }}>Total Amount</p>
                        <p style={{ margin: 0, fontWeight: 700, color: '#1d3557' }}>
                            Rs. {Number(orderToEdit.totalAmount).toLocaleString()}
                        </p>
                    </div>
                )}
                <Form form={form} layout="vertical" className="mt-3">
                    <Form.Item label="Order Status" name="orderStatus" rules={[{ required: true, message: 'Please select an order status' }]}>
                        <Select placeholder="Select order status" size="large" options={orderStatusOptions} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Orders;