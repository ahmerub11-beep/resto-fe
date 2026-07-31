import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, CrownOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import React, { useEffect, useState } from 'react'


const Users = () => {
    const [documents, setDocuments] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [deletingUid, setDeletingUid] = useState(null);
    const [form] = Form.useForm();


    const getDocuments = () => {

        setIsLoading(true);

        axios.get(`${window.api}/api/auth/users`, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
            .then((res) => {
                if (res.data.isError) {
                    window.toastify(res.data.message, "error");
                } else {
                    setDocuments(res.data.users);
                }
            })
            .catch((error) => {
                console.log(error);
                window.toastify("Something went wrong", "error");
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
    useEffect(() => { getDocuments(); }, [])

    // Set form values only after modal is open (Form is mounted)
    useEffect(() => {
        if (isModalOpen && userToEdit) {
            form.setFieldsValue({ name: userToEdit.name, role: userToEdit.role, status: userToEdit.status });
        }
    }, [isModalOpen, userToEdit])

    const handleDelete = (user) => {
        setIsProcessing(true)
        axios.delete(`${window.api}/api/auth/delete-user-by-superAdmin/${user.uid}`, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, })
            .then((res) => {
                if (res.data.isError) {
                    window.toastify(res.data.message, "error");
                } else {
                    window.toastify("User deleted successfully", "success");
                    setDocuments(prev => prev.filter(doc => doc.uid !== user.uid));
                }
            })
            .catch((err) => {
                console.error(err);
                window.toastify("Something went wrong", "error");
            })
            .finally(() => {
                setIsProcessing(false)
            })
    }

    const handleEdit = (user) => {
        setUserToEdit(user);
        setIsModalOpen(true);
    }

    const handleUpdate = () => {
        form.validateFields().then((values) => {
            setIsProcessing(true);
            axios.patch(`${window.api}/api/auth/update-user`, { ...values, uid: userToEdit.uid }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
            })
                .then((res) => {
                    if (res.data.isError) {
                        window.toastify(res.data.message, "error");
                    } else {
                        window.toastify("User updated successfully", "success");
                        setDocuments(prev => prev.map(doc =>
                            doc.uid === userToEdit.uid ? res.data.updatedUser : doc
                        ));
                        setIsModalOpen(false);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    window.toastify("Something went wrong", "error");
                })
                .finally(() => {
                    setIsProcessing(false)
                })
        })
    }

    const customStyles = `
        .premium-tag {
            cursor: default;
            transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        .premium-tag:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
        }
        .status-active {
            position: relative;
            padding-right: 18px !important;
        }
        .status-active::after {
            content: '';
            position: absolute;
            width: 6px;
            height: 6px;
            background-color: #198754;
            border-radius: 50%;
            right: 8px;
            top: calc(50% - 3px);
            box-shadow: 0 0 0 rgba(25, 135, 84, 0.4);
            animation: pulse-green 2s infinite;
        }
        @keyframes pulse-green {
            0% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.7);
            }
            70% {
                transform: scale(1.1);
                box-shadow: 0 0 0 5px rgba(25, 135, 84, 0);
            }
            100% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(25, 135, 84, 0);
            }
        }
        .action-btn-edit {
            transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            border: none !important;
            width: 32px !important;
            height: 32px !important;
            padding: 0 !important;
        }
        .action-btn-edit:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(13, 110, 253, 0.35) !important;
        }
        .action-btn-edit:active {
            transform: translateY(0);
        }
        .action-btn-delete {
            transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            border: 1px solid currentColor !important;
            width: 32px !important;
            height: 32px !important;
            padding: 0 !important;
        }
        .action-btn-delete:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(220, 53, 69, 0.35) !important;
        }
        .action-btn-delete:active {
            transform: translateY(0);
        }
        .animate-row {
            opacity: 0;
            animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    const columns = [
        { title: "UID", dataIndex: "uid", key: "uid" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },

        {
            title: 'Role', dataIndex: 'role', key: 'role', render: role => {
                const isAdmin = role === "superAdmin";
                return (
                    <span
                        className={`badge ${isAdmin ? 'bg-dark text-warning border border-warning' : 'bg-primary-subtle text-primary border border-primary-subtle'} d-inline-flex align-items-center gap-1 px-3 py-2 premium-tag`}
                    >
                        {isAdmin ? <CrownOutlined className="me-1" style={{ color: '#ffc107' }} /> : <UserOutlined className="me-1" />}
                        {isAdmin ? "SUPER ADMIN" : "CUSTOMER"}
                    </span>
                );
            }
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status', render: status => {
                const isActive = status === "active";
                return (
                    <span
                        className={`badge ${isActive ? 'bg-success-subtle text-success border border-success-subtle status-active' : 'bg-danger-subtle text-danger border border-danger-subtle status-inactive'} d-inline-flex align-items-center gap-1 px-3 py-2 premium-tag`}
                    >
                        {isActive ? <CheckCircleOutlined className="me-1" /> : <CloseCircleOutlined className="me-1" />}
                        {isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="d-flex gap-2">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        className="btn btn-primary d-inline-flex align-items-center justify-content-center action-btn-edit"
                    />
                    <Popconfirm
                        title="Delete User"
                        description={`Are you sure you want to delete "${record.name}"?`}
                        onConfirm={() => handleDelete(record)}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            type="dashed"
                            shape="circle"
                            icon={deletingUid !== record.uid && <DeleteOutlined />}
                            loading={deletingUid === record.uid}
                            className="btn btn-outline-danger d-inline-flex align-items-center justify-content-center action-btn-delete"
                        />

                    </Popconfirm>
                </div>
            )
        },
    ]

    return (
        <div className='container-fluid py-4 px-3 bg-white rounded-3 shadow-sm my-3'>
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />
            <Typography.Title level={3} className='text-center mb-4 text-dark fw-bold'>
                Users Management
            </Typography.Title>
            <Table
                dataSource={documents}
                columns={columns}
                loading={isLoading}
                rowKey="uid"
                scroll={{ x: 'max-content' }}
                rowClassName={() => 'animate-row'}
            />

            {/* Edit Modal */}
            <Modal
                title={`Edit User — ${userToEdit?.name}`}
                open={isModalOpen}
                onOk={handleUpdate}
                onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
                okText="Save Changes"
                confirmLoading={isProcessing}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" className='mt-3'>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter a name' }]}
                    >
                        <Input placeholder="Enter name" />
                    </Form.Item>
                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select>
                            <Select.Option value="customer">Customer</Select.Option>
                            <Select.Option value="superAdmin">Super Admin</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please select a status' }]}
                    >
                        <Select>
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Users
