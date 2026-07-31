import React, { useState } from 'react'
import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

const { Title, Paragraph } = Typography;

const initialState = { name: "", email: "", password: "", confirmPassword: "" }

const Register = () => {

    const navigate = useNavigate()

    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    // Ant Design's onFinish triggers on submit (Works seamlessly on Mobile Keyboards)
    const handleSubmit = () => {

        let { name, email, password, confirmPassword } = state

        name = name.trim()

        if (name.length < 3) { return window.toastify("Please enter your name", "error") }
        if (password.length < 6) { return window.toastify("Password must be at least 6 characters long", "error") }
        if (password !== confirmPassword) { return window.toastify("Passwords do not match", "error") }

        const formData = { name, email, password }

        setIsProcessing(true)

        axios.post("http://localhost:8000/api/auth/register", formData)
            .then(res => {
                const { status, data } = res
                if (status === 201) {
                    window.toastify(data.message, "success")
                    setState(initialState)
                    navigate("/auth/login")
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

    return (
        <main className='auth p-3 p-md-4 p-lg-5'>
            <div className="card p-3 p-md-4">
                <Row>
                    <Col span={24} className='text-center mb-4'>
                        <Title level={2} className='text-center'>Register</Title>
                        <Paragraph>Already have an account? <Link to="/auth/login">Login</Link></Paragraph>
                    </Col>
                    <Col span={24}>
                        {/* Added onFinish here */}
                        <Form layout="vertical" onFinish={handleSubmit}>
                            <Form.Item label="Name" required>
                                <Input placeholder='Enter your name' size='large' name='name' value={state.name} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Email" required>
                                <Input placeholder='Enter your email' size='large' name='email' type="email" value={state.email} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Password" required>
                                <Input.Password placeholder='Enter your password' size='large' name='password' value={state.password} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Confirm Password" required>
                                <Input.Password placeholder='Confirm your password' size='large' name='confirmPassword' value={state.confirmPassword} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item className='mb-0'>
                                {/* Removed onClick={handleSubmit} from Button */}
                                <Button type="primary" size='large' block className='mb-2' htmlType="submit" loading={isProcessing}>
                                    Register
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </main>
    )
}

export default Register