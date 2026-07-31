import React, { useState } from 'react'
import { Button, Col, Form, Input, Row, Select, Typography, Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useAuth } from '@/context/Auth'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography
const { TextArea } = Input
const { Dragger } = Upload

const categories = ["Electronics", "Clothing", "Footwear", "Books", "Home & Kitchen", "Sports", "Toys", "Beauty", "Grocery", "Other", "Fast Food",]

const initialState = { name: "", price: "", stock: "", category: "", description: "", image: null, }

const Add = () => {

    const navigate = useNavigate();

    const { user } = useAuth()

    const [state, setState] = useState(initialState)
    const [image, setImage] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSubmit = e => {

        e.preventDefault()

        const { name, price, stock, category, description, image } = state

        if (name.trim().length < 3) { return window.toastify("Please enter a valid product name (min 3 chars)", "error") }
        if (!price || Number(price) <= 0) { return window.toastify("Please enter a valid price", "error") }
        if (!stock || Number(stock) < 0) { return window.toastify("Please enter a valid stock quantity", "error") }
        if (!category) { return window.toastify("Please select a category", "error") }
        if (description.trim().length < 10) { return window.toastify("Description must be at least 10 characters", "error") }
        if (!image) { return window.toastify("Please upload a product image", "error") }

        const formData = new FormData()
        formData.append("name", name.trim())
        formData.append("price", price)
        formData.append("stock", stock)
        formData.append("category", category)
        formData.append("description", description.trim())
        formData.append("image", image)

        setIsProcessing(true)

        const jwt = localStorage.getItem("jwt")

        axios.post(window.api + "/api/products/create", formData, { headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "multipart/form-data", } })
            .then(res => {
                const { status, data } = res
                if (status === 201) {
                    window.toastify(data.message || "A new Product has been successfully created", "success")
                    setState(initialState)
                    navigate("/dashboard/products")
                }
            })
            .catch(err => {
                console.log("err", err)
                if (err?.response) {
                    const { status, data } = err.response
                    if (status === 400) { window.toastify(data?.message || "Invalid input", "error") }
                    else { window.toastify(data?.message || "Something went wrong", "error") }
                } else {
                    window.toastify("Network error or server unreachable", "error")
                }
            })
            .finally(() => {
                setIsProcessing(false)
            })

    }

    // Custom upload handler — sirf file store karo, server pe mat bhejo
    const beforeUpload = file => {
        setState(s => ({ ...s, image: file }))
        return false // Ant Design ka auto-upload rok do
    }

    const onRemoveImage = () => {
        setState(s => ({ ...s, image: null }))
    }

    return (
        <main className='p-3 p-md-4 p-lg-5'>
            <div className="card p-3 p-md-4">
                <div className='mb-4 d-flex justify-content-between align-items-center'>
                    <Col span={12}>
                        <Title level={2}>Add Product</Title>
                    </Col>
                    <Col span={12}>
                        <Button type="primary" onClick={() => navigate("/dashboard/products")}>All Products</Button>
                    </Col>
                </div>
                <Row>
                    <Col span={24}>
                        <Form layout="vertical">

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Product Name" required>
                                        <Input
                                            placeholder='Enter product name'
                                            size='large'
                                            name='name'
                                            value={state.name}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Category" required>
                                        <Select
                                            placeholder='Select a category'
                                            size='large'
                                            value={state.category || undefined}
                                            onChange={val => setState(s => ({ ...s, category: val }))}
                                            options={categories.map(c => ({ label: c, value: c }))}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Price (PKR)" required>
                                        <Input
                                            placeholder='Enter price'
                                            size='large'
                                            name='price'
                                            type='number'
                                            min={0}
                                            value={state.price}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Stock Quantity" required>
                                        <Input placeholder='Enter stock quantity' size='large' name='stock' type='number' min={0} value={state.stock} onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Description" required>
                                <TextArea placeholder='Enter product description' size='large' name='description' rows={4} value={state.description} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item label="Product Image" required>
                                <Dragger name='image' multiple={false} beforeUpload={beforeUpload} onRemove={onRemoveImage} maxCount={1} accept='image/*' fileList={state.image ? [{ uid: '-1', name: state.image.name, status: 'done', originFileObj: state.image }] : []}>

                                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                                    <p className="ant-upload-text">Click or drag image to upload</p>
                                    <p className="ant-upload-hint">Only image files are supported</p>
                                </Dragger>
                            </Form.Item>

                            <Form.Item className='mb-0'>
                                <Button type="primary" size='large' block htmlType="submit" loading={isProcessing} onClick={handleSubmit}>Add Product</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </main>
    )
}

export default Add