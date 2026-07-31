import React, { useState } from 'react'
import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { Link, useNavigate, } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '@/context/Auth';


const { Title, Paragraph } = Typography;

const initialState = { email: "", password: "" }

const Login = () => {

    const { readProfile } = useAuth()

    const navigate = useNavigate()

    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)


    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSubmit = e => {

        e.preventDefault()

        let { email, password } = state

        const formData = { email, password }

        setIsProcessing(true)

        axios.post(window.api + "/api/auth/login", formData)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    const { token } = data
                    localStorage.setItem("jwt", token)
                    window.toastify(data.message, "success")
                    setState(initialState)
                    readProfile(token)
                    navigate("/")
                }
            })
            .catch(err => {
                console.log('err', err)
                if (err?.response) {
                    const { status, data } = err.response
                    if (status === 400 || status === 401) { window.toastify(data?.message || "Invalid credentials", "error") }
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
        <main className='auth p-3 p-md-4 p-lg-5 ' >
            <div className="card p-3 p-md-4">
                <Row>
                    <Col span={24} className='text-center mb-4'>
                        <Title level={2} className='text-center'>Login</Title>
                        <Paragraph>Don't have an account? <Link to="/auth/register">Register</Link></Paragraph>
                    </Col>
                    <Col span={24}>
                        <Form layout="vertical">
                            <Form.Item label="Email" required>
                                <Input placeholder='Enter your email' size='large' name='email' value={state.email} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Password" required>
                                <Input.Password placeholder='Enter your password' size='large' name='password' value={state.password} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item className='mb-0'>
                                <Button type="primary" size='large' block className='mb-2' htmlType="submit" loading={isProcessing} onClick={handleSubmit}>Login</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </main>
    )
}

export default Login