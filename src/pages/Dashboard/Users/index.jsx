import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    Table,
    Button,
    Input,
    Modal,
    Form,
    Select,
    Popconfirm,
    Tooltip,
    Tag,
} from 'antd';
import {
    TeamOutlined,
    UserOutlined,
    CrownOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    CopyOutlined,
    MailOutlined,
    SafetyCertificateFilled,
    SwapOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '@/context/Auth';

const Users = () => {
    const { user: currentUser } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [deletingUid, setDeletingUid] = useState(null);
    const [togglingUid, setTogglingUid] = useState(null);

    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [form] = Form.useForm();

    // ── Fetch Users ───────────────────────────────────────────────────
    const getDocuments = useCallback(() => {
        setIsLoading(true);
        axios
            .get(`${window.api}/api/auth/users`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
            })
            .then((res) => {
                if (res.data?.isError) {
                    window.toastify(res.data.message, 'error');
                } else {
                    setDocuments(res.data?.users || []);
                }
            })
            .catch((error) => {
                console.error('Fetch users error:', error);
                window.toastify('Failed to fetch customer accounts', 'error');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        getDocuments();
    }, [getDocuments]);

    // ── Delete User ───────────────────────────────────────────────────
    const handleDelete = (targetUser) => {
        setDeletingUid(targetUser.uid);
        axios
            .delete(`${window.api}/api/auth/delete-user-by-superAdmin/${targetUser.uid}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
            })
            .then((res) => {
                if (res.data?.isError) {
                    window.toastify(res.data.message, 'error');
                } else {
                    window.toastify('User account deleted successfully', 'success');
                    setDocuments((prev) => prev.filter((doc) => doc.uid !== targetUser.uid));
                }
            })
            .catch((err) => {
                console.error(err);
                window.toastify('Failed to delete user account', 'error');
            })
            .finally(() => {
                setDeletingUid(null);
            });
    };

    // ── One-Click Quick Toggle Active / Inactive Status ───────────────
    const handleToggleStatus = (targetUser) => {
        const newStatus = targetUser.status === 'active' ? 'inactive' : 'active';
        setTogglingUid(targetUser.uid);

        axios
            .patch(
                `${window.api}/api/auth/update-user`,
                { uid: targetUser.uid, status: newStatus },
                { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
            )
            .then((res) => {
                if (res.data?.isError) {
                    window.toastify(res.data.message, 'error');
                } else {
                    window.toastify(`Status changed to ${newStatus.toUpperCase()}`, 'success');
                    setDocuments((prev) =>
                        prev.map((doc) => (doc.uid === targetUser.uid ? res.data.updatedUser : doc))
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                window.toastify('Failed to update status', 'error');
            })
            .finally(() => {
                setTogglingUid(null);
            });
    };

    // ── Edit User Modal ───────────────────────────────────────────────
    const handleEdit = (targetUser) => {
        setUserToEdit(targetUser);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (isModalOpen && userToEdit) {
            form.setFieldsValue({
                name: userToEdit.name,
                role: userToEdit.role || 'customer',
                status: userToEdit.status || 'active',
            });
        }
    }, [isModalOpen, userToEdit, form]);

    const handleUpdate = () => {
        form.validateFields().then((values) => {
            setIsProcessing(true);
            axios
                .patch(
                    `${window.api}/api/auth/update-user`,
                    { ...values, uid: userToEdit.uid },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
                )
                .then((res) => {
                    if (res.data?.isError) {
                        window.toastify(res.data.message, 'error');
                    } else {
                        window.toastify('User account updated successfully! 🎉', 'success');
                        setDocuments((prev) =>
                            prev.map((doc) => (doc.uid === userToEdit.uid ? res.data.updatedUser : doc))
                        );
                        setIsModalOpen(false);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    window.toastify('Failed to update user', 'error');
                })
                .finally(() => {
                    setIsProcessing(false);
                });
        });
    };

    // ── KPI Summary Calculations ──────────────────────────────────────
    const stats = useMemo(() => {
        const total = documents.length;
        const activeCount = documents.filter((u) => u.status === 'active').length;
        const adminCount = documents.filter((u) => u.role === 'superAdmin').length;
        const customerCount = documents.filter((u) => u.role !== 'superAdmin').length;
        const inactiveCount = documents.filter((u) => u.status === 'inactive').length;
        return { total, activeCount, adminCount, customerCount, inactiveCount };
    }, [documents]);

    // ── Filtered Users Computation ────────────────────────────────────
    const filteredUsers = useMemo(() => {
        return documents.filter((u) => {
            const q = searchQuery.toLowerCase().trim();
            const matchesQuery =
                !q ||
                u.name?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q) ||
                u.uid?.toLowerCase().includes(q);

            const matchesRole =
                roleFilter === 'all' ||
                (roleFilter === 'superAdmin' && u.role === 'superAdmin') ||
                (roleFilter === 'customer' && u.role !== 'superAdmin');

            const matchesStatus =
                statusFilter === 'all' ||
                u.status?.toLowerCase() === statusFilter.toLowerCase();

            return matchesQuery && matchesRole && matchesStatus;
        });
    }, [documents, searchQuery, roleFilter, statusFilter]);

    // ── Unique Table Columns ──────────────────────────────────────────
    const columns = [
        {
            title: 'Customer Profile',
            key: 'profile',
            width: 250,
            render: (_, record) => {
                const isAdmin = record.role === 'superAdmin';
                const initial = (record.name?.[0] || 'U').toUpperCase();
                return (
                    <div className="user-profile-cell">
                        <div
                            className="user-avatar-initial"
                            style={{
                                background: isAdmin
                                    ? 'linear-gradient(135deg, #1e293b, #0f172a)'
                                    : 'linear-gradient(135deg, #e63946, #f43f5e)',
                                border: isAdmin ? '2px solid #fbbf24' : '2px solid #ffffff',
                            }}
                        >
                            {isAdmin ? <CrownOutlined style={{ color: '#fbbf24', fontSize: '1rem' }} /> : initial}
                        </div>
                        <div className="user-info-text">
                            <div className="user-name-title">
                                {record.name || 'Anonymous User'}
                                {record.uid === currentUser?.uid && (
                                    <span className="badge bg-danger ms-1" style={{ fontSize: '0.65rem' }}>You</span>
                                )}
                            </div>
                            <div className="d-flex align-items-center gap-1">
                                <span className="user-uid-pill">#{record.uid?.substring(0, 8)}</span>
                                <Tooltip title="Copy Full UID">
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<CopyOutlined style={{ fontSize: '0.72rem', color: '#94a3b8' }} />}
                                        onClick={() => {
                                            navigator.clipboard.writeText(record.uid);
                                            window.toastify('UID copied to clipboard!', 'success');
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Email Address',
            key: 'email',
            width: 240,
            render: (_, record) => (
                <div className="user-email-cell">
                    <a href={`mailto:${record.email}`} className="email-link">
                        <MailOutlined className="me-1 text-muted" />
                        {record.email}
                    </a>
                    <span className="verified-subtext">
                        <SafetyCertificateFilled /> Verified Foodie Member
                    </span>
                </div>
            ),
        },
        {
            title: 'Access Role',
            key: 'role',
            width: 170,
            render: (_, record) => {
                const isAdmin = record.role === 'superAdmin';
                if (isAdmin) {
                    return (
                        <span className="role-badge-superAdmin">
                            <CrownOutlined /> SUPER ADMIN
                        </span>
                    );
                }
                return (
                    <span className="role-badge-customer">
                        <UserOutlined /> CUSTOMER
                    </span>
                );
            },
        },
        {
            title: 'Account Status',
            key: 'status',
            width: 160,
            render: (_, record) => {
                const isActive = record.status === 'active';
                if (isActive) {
                    return (
                        <span className="status-badge-active">
                            <span className="pulse-dot-green"></span> ACTIVE
                        </span>
                    );
                }
                return (
                    <span className="status-badge-inactive">
                        <CloseCircleFilled /> INACTIVE
                    </span>
                );
            },
        },
        {
            title: 'Registered Date',
            key: 'createdAt',
            width: 150,
            render: (_, record) => (
                <span className="text-muted" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    {record.createdAt
                        ? new Date(record.createdAt).toLocaleDateString('en-PK', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                          })
                        : 'Active Member'}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            width: 140,
            render: (_, record) => (
                <div className="d-flex align-items-center gap-2">
                    {/* One-Click Quick Toggle Active/Inactive */}
                    <Tooltip title={record.status === 'active' ? 'Deactivate Account' : 'Activate Account'}>
                        <button
                            className="btn-table-action-dots"
                            onClick={() => handleToggleStatus(record)}
                            disabled={togglingUid === record.uid}
                            style={{
                                color: record.status === 'active' ? '#e63946' : '#10b981',
                            }}
                        >
                            <SwapOutlined />
                        </button>
                    </Tooltip>

                    {/* Edit Details */}
                    <Tooltip title="Edit Member Profile">
                        <button
                            className="btn-action-edit"
                            onClick={() => handleEdit(record)}
                        >
                            <EditOutlined />
                        </button>
                    </Tooltip>

                    {/* Delete Account */}
                    {record.uid !== currentUser?.uid && (
                        <Popconfirm
                            title="Delete Customer Account"
                            description={`Are you sure you want to delete "${record.name}"? This action cannot be undone.`}
                            onConfirm={() => handleDelete(record)}
                            okText="Yes, Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Delete Account">
                                <button
                                    className="btn-action-delete"
                                    disabled={deletingUid === record.uid}
                                >
                                    <DeleteOutlined />
                                </button>
                            </Tooltip>
                        </Popconfirm>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="users-page-container">
            {/* 1. Header Title Strip */}
            <div className="users-header-strip">
                <h1 className="users-page-title">
                    <TeamOutlined style={{ color: '#e63946' }} />
                    Customer Accounts Management
                </h1>
                <p className="users-page-sub">
                    Manage registered store foodies, administrator security privileges, and account activity states.
                </p>
            </div>

            {/* 2. Top 4 Metric KPI Summary Cards */}
            <div className="users-metrics-grid">
                <div className="user-kpi-card">
                    <div className="kpi-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
                        <TeamOutlined />
                    </div>
                    <div className="kpi-text-box">
                        <div className="kpi-number">{stats.total} Foodies</div>
                        <div className="kpi-title">Total Registered</div>
                    </div>
                </div>

                <div className="user-kpi-card">
                    <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                        <CheckCircleFilled />
                    </div>
                    <div className="kpi-text-box">
                        <div className="kpi-number text-success">{stats.activeCount} Active</div>
                        <div className="kpi-title">Active Members</div>
                    </div>
                </div>

                <div className="user-kpi-card">
                    <div className="kpi-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#d97706' }}>
                        <CrownOutlined />
                    </div>
                    <div className="kpi-text-box">
                        <div className="kpi-number" style={{ color: '#d97706' }}>
                            {stats.adminCount} Admins
                        </div>
                        <div className="kpi-title">Super Administrators</div>
                    </div>
                </div>

                <div className="user-kpi-card">
                    <div className="kpi-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' }}>
                        <CloseCircleFilled />
                    </div>
                    <div className="kpi-text-box">
                        <div className="kpi-number text-danger">{stats.inactiveCount} Inactive</div>
                        <div className="kpi-title">Suspended Accounts</div>
                    </div>
                </div>
            </div>

            {/* 3. Search & Quick Filter Toolbar */}
            <div className="users-toolbar-card">
                <div className="toolbar-search-input">
                    <Input
                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                        placeholder="Search by name, email, or UID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        allowClear
                        size="middle"
                        style={{ borderRadius: 10 }}
                    />
                </div>

                <div className="toolbar-filter-group">
                    {/* Role Filters */}
                    <span
                        className={`filter-pill ${roleFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setRoleFilter('all')}
                    >
                        All Roles <span className="badge-count">{documents.length}</span>
                    </span>
                    <span
                        className={`filter-pill ${roleFilter === 'customer' ? 'active' : ''}`}
                        onClick={() => setRoleFilter('customer')}
                    >
                        <UserOutlined /> Customers <span className="badge-count">{stats.customerCount}</span>
                    </span>
                    <span
                        className={`filter-pill ${roleFilter === 'superAdmin' ? 'active' : ''}`}
                        onClick={() => setRoleFilter('superAdmin')}
                    >
                        <CrownOutlined /> Admins <span className="badge-count">{stats.adminCount}</span>
                    </span>

                    {/* Status Filters */}
                    <span
                        className={`filter-pill ${statusFilter === 'active' ? 'active' : ''}`}
                        onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
                        style={{ borderColor: statusFilter === 'active' ? '#10b981' : undefined }}
                    >
                        ● Active <span className="badge-count">{stats.activeCount}</span>
                    </span>
                </div>
            </div>

            {/* 4. Unique High-End Customer Accounts Table */}
            <div className="unique-users-card">
                <Table
                    dataSource={filteredUsers}
                    columns={columns}
                    loading={isLoading}
                    rowKey="uid"
                    scroll={{ x: 1000 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '25', '50'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} accounts`,
                    }}
                    locale={{
                        emptyText: (
                            <div className="text-center py-5">
                                <span className="fs-1 d-block mb-2">👥</span>
                                <h5 className="fw-bold text-dark mb-1">No Accounts Found</h5>
                                <p className="text-muted small">
                                    {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                                        ? 'No customer accounts match your search filters.'
                                        : 'Registered user accounts will be listed here automatically.'}
                                </p>
                            </div>
                        ),
                    }}
                />
            </div>

            {/* ── Edit User Modal ───────────────────────────────────────── */}
            <Modal
                title={
                    <div className="d-flex align-items-center gap-2">
                        <EditOutlined style={{ color: '#e63946' }} />
                        <span className="fw-bold">Edit Customer Account</span>
                    </div>
                }
                open={isModalOpen}
                onOk={handleUpdate}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                okText="Save Changes"
                confirmLoading={isProcessing}
                okButtonProps={{ style: { background: '#e63946', borderColor: '#e63946' } }}
                destroyOnHidden
                centered
            >
                {userToEdit && (
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
                            <span className="text-muted small">UID</span>
                            <span className="user-uid-pill">#{userToEdit.uid}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted small">Email</span>
                            <span className="fw-bold text-dark">{userToEdit.email}</span>
                        </div>
                    </div>
                )}

                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter customer name' }]}
                    >
                        <Input placeholder="Enter customer full name" size="large" style={{ borderRadius: 8 }} />
                    </Form.Item>

                    <Form.Item
                        label="Account Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select an account role' }]}
                    >
                        <Select size="large" style={{ borderRadius: 8 }}>
                            <Select.Option value="customer">
                                <UserOutlined className="me-2 text-primary" /> Customer Member
                            </Select.Option>
                            <Select.Option value="superAdmin">
                                <CrownOutlined className="me-2 text-warning" /> Super Administrator
                            </Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Account Access Status"
                        name="status"
                        rules={[{ required: true, message: 'Please select access status' }]}
                    >
                        <Select size="large" style={{ borderRadius: 8 }}>
                            <Select.Option value="active">
                                <span className="text-success fw-bold">● Active (Access Allowed)</span>
                            </Select.Option>
                            <Select.Option value="inactive">
                                <span className="text-danger fw-bold">✕ Inactive (Suspended)</span>
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Users;
