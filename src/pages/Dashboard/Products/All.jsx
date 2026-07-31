import React, { useEffect, useRef, useState } from 'react'
import { Typography, Button, Table, Image, Popconfirm, Modal, Form, Input, Select, Row, Col, Grid } from 'antd'
import { useNavigate } from 'react-router-dom'
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
import axios from 'axios'


const { TextArea } = Input;

const categories = ["Electronics", "Clothing", "Footwear", "Books", "Home & Kitchen", "Sports", "Toys", "Beauty", "Grocery", "Other", "Fast Food"]

const All = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [previewImageURL, setPreviewImageURL] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const { xs } = Grid.useBreakpoint();

    const fileInputRef = useRef(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const getDocuments = () => {
        axios.get(window.api + "/api/products/all", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        })
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setDocuments(data.products)
                }
            })
            .catch(err => {
                console.log("err", err)
                const status = err.response ? err.response.status : 500
                const data = err.response ? err.response.data : { message: "Internal server error" }
                if (status === 400) { window.toastify(data.message, "error") }
                else { window.toastify("Something went wrong", "error") }
            })
    }

    useEffect(() => { getDocuments() }, [])

    const handleDelete = (product) => {

        const token = localStorage.getItem("jwt");

        setDeletingId(product.id)

        axios.delete(window.api + "/api/products/delete/" + product.id, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    window.toastify(data.message, "success");
                    setDocuments(prev => prev.filter((doc) => doc.id !== product.id));
                } else {
                    window.toastify(data.message, "error")
                }
            })
            .catch(err => {
                console.log("err", err);
                const status = err.response ? err.response.status : 500
                const data = err.response ? err.response.data : { message: "Internal server error" }
                if (status === 401) { window.toastify(data.message, "error") }
                else { window.toastify("Something went wrong while deleting the product", "error") }
            })
            .finally(() => {
                setDeletingId(null)
            });
    };

    const handleEdit = (product) => {
        setProductToEdit(product);
        setPreviewImageURL(product.imageURL || "");
        setSelectedFile(null);
        setIsModalOpen(true);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            return window.toastify("Please select a valid image file", "error");
        }

        setSelectedFile(file);
        const localURL = URL.createObjectURL(file);
        setPreviewImageURL(localURL);
        form.setFieldValue("imageURL", "");
    }

    const resetModal = () => {
        setIsModalOpen(false);
        setPreviewImageURL("");
        setSelectedFile(null);
        form.resetFields();
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const handleUpdate = () => {

        const { name, price, stock, category, description, imageURL } = form.getFieldsValue()

        if (!name || name.trim().length < 3) { return window.toastify("Please enter a valid product name (min 3 chars)", "error") }
        if (!price || Number(price) <= 0) { return window.toastify("Please enter a valid price", "error") }
        if (stock === undefined || stock === "" || Number(stock) < 0) { return window.toastify("Please enter a valid stock quantity", "error") }
        if (!category) { return window.toastify("Please select a category", "error") }
        if (!description || description.trim().length < 10) { return window.toastify("Description must be at least 10 characters", "error") }
        if (!selectedFile && (!imageURL || imageURL.trim().length === 0)) {
            return window.toastify("Please select an image file or enter an image URL", "error")
        }

        setIsProcessing(true);

        if (selectedFile) {
            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("price", price);
            formData.append("stock", stock);
            formData.append("category", category);
            formData.append("description", description.trim());
            formData.append("image", selectedFile);

            axios.patch(`${window.api}/api/products/update/${productToEdit.id}`,
                formData,
                { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
            )
                .then((res) => {
                    const { status, data } = res
                    if (status === 200) {
                        window.toastify(data.message || "Product updated successfully", "success");
                        setDocuments(prev => prev.map(doc =>
                            doc.id === productToEdit.id ? data.updatedProduct : doc
                        ));
                        resetModal();
                    }
                })
                .catch((err) => {
                    console.error(err);
                    const status = err.response ? err.response.status : 500
                    const data = err.response ? err.response.data : { message: "Internal server error" }
                    if (status === 400 || status === 401) { window.toastify(data.message, "error") }
                    else { window.toastify("Something went wrong", "error") }
                })
                .finally(() => { setIsProcessing(false) })

        } else {
            axios.patch(`${window.api}/api/products/update/${productToEdit.id}`,
                { name: name.trim(), price, stock, category, description: description.trim(), imageURL: imageURL.trim() },
                { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
            )
                .then((res) => {
                    const { status, data } = res
                    if (status === 200) {
                        window.toastify(data.message || "Product updated successfully", "success");
                        setDocuments(prev => prev.map(doc =>
                            doc.id === productToEdit.id ? data.updatedProduct : doc
                        ));
                        resetModal();
                    }
                })
                .catch((err) => {
                    console.error(err);
                    const status = err.response ? err.response.status : 500
                    const data = err.response ? err.response.data : { message: "Internal server error" }
                    if (status === 400 || status === 401) { window.toastify(data.message, "error") }
                    else { window.toastify("Something went wrong", "error") }
                })
                .finally(() => { setIsProcessing(false) })
        }
    }

    const columns = [
        {
            title: "Image",
            dataIndex: "imageURL",
            key: "imageURL",
            render: (text) => <Image src={text} alt="Product" width={64} height={64} style={{ borderRadius: "50%" }} />,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (val) => `Rs. ${val}`,
        },
        {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            responsive: ["md"]
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="d-flex gap-3">
                    <Button
                        type="primary"
                        shape="circle"
                        onClick={() => handleEdit(record)}
                        icon={<EditOutlined />}
                        className="d-inline-flex align-items-center justify-content-center"
                    />
                    <Popconfirm
                        title="Delete Product"
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
                            icon={deletingId !== record.id && <DeleteOutlined />}
                            loading={deletingId === record.id}
                            className="d-inline-flex align-items-center justify-content-center"
                        />
                    </Popconfirm>
                </div>
            )
        },
    ];

    return (
        <>
            <div className='mb-4 d-flex justify-content-between align-items-center'>
                <Typography.Title level={2}>All Products</Typography.Title>
                <Button type="primary" onClick={() => navigate("/dashboard/products/add")}>Add Product</Button>
            </div>
            <div className='mt-5'>
                <div style={{ overflowX: 'auto' }}>
                    <Table columns={columns} dataSource={documents} rowKey="id" scroll={{ x: 600 }} />
                </div>
            </div>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            <Modal
                title="Edit Product"
                open={isModalOpen}
                onCancel={resetModal}
                onOk={handleUpdate}
                okText="Update Product"
                confirmLoading={isProcessing}
                okButtonProps={{ type: "primary" }}
                style={{ width: xs ? '95%' : 600 }}
                afterOpenChange={(open) => {
                    if (open && productToEdit) {
                        form.setFieldsValue({
                            name: productToEdit.name,
                            price: productToEdit.price,
                            stock: productToEdit.stock,
                            category: productToEdit.category,
                            description: productToEdit.description,
                            imageURL: productToEdit.imageURL,
                        })
                        setPreviewImageURL(productToEdit.imageURL || "");
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                    }
                }}
            >
                <Form form={form} layout="vertical" className='mt-3'>
                    <Form.Item label="Product Name" name="name" required>
                        <Input placeholder='Enter product name' size='large' />
                    </Form.Item>
                    <Form.Item label="Category" name="category" required>
                        <Select
                            placeholder='Select a category'
                            size='large'
                            options={categories.map(c => ({ label: c, value: c }))}
                        />
                    </Form.Item>
                    <Form.Item label="Price (PKR)" name="price" required>
                        <Input placeholder='Enter price' size='large' type='number' min={0} />
                    </Form.Item>
                    <Form.Item label="Stock Quantity" name="stock" required>
                        <Input placeholder='Enter stock quantity' size='large' type='number' min={0} />
                    </Form.Item>
                    <Form.Item label="Description" name="description" required>
                        <TextArea placeholder='Enter product description' size='large' rows={3} />
                    </Form.Item>

                    <Form.Item label="Product Image" required>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <Form.Item name="imageURL" noStyle>
                                <Input
                                    placeholder='Paste image URL (e.g. https://...)'
                                    size='large'
                                    onChange={(e) => {
                                        setPreviewImageURL(e.target.value);
                                        setSelectedFile(null);
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                    }}
                                />
                            </Form.Item>
                            <Button
                                size='large'
                                icon={<UploadOutlined />}
                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                            >
                                Select Image
                            </Button>
                        </div>
                        {selectedFile && (
                            <p style={{ marginTop: 6, fontSize: 12, color: "#52c41a" }}>
                                ✅ {selectedFile.name}
                            </p>
                        )}
                    </Form.Item>

                    {previewImageURL && (
                        <div style={{ marginBottom: 16, textAlign: "center" }}>
                            <p style={{ marginBottom: 6, color: "#888", fontSize: 12 }}>Image Preview:</p>
                            <img
                                src={previewImageURL}
                                alt="Preview"
                                onError={(e) => { e.target.style.display = "none" }}
                                onLoad={(e) => { e.target.style.display = "block" }}
                                style={{
                                    width: 120,
                                    height: 120,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    border: "1px solid #d9d9d9",
                                    display: "block",
                                    margin: "0 auto"
                                }}
                            />
                        </div>
                    )}
                </Form>
            </Modal>
        </>
    )
}

export default All