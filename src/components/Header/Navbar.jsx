import React from 'react'
import { Space } from 'antd';
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/Auth';


const Navbar = () => {

    const { isAuth, handleLogout } = useAuth();
    console.log('isAuth', isAuth)
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1b263b' }}>
            <div className="container">
                <Link to="/" className="navbar-brand fw-bold">My store</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/" className="nav-link active" >Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/about" className="nav-link active" >About</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/products" className="nav-link active" >Products</Link>
                        </li>

                    </ul>
                    <div className="d-flex">
                        <Space size="middle">
                            {isAuth
                                ?
                                <>
                                    <Link to="/dashboard" className='btn btn-success'>Dashboard</Link>
                                    <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
                                </>

                                : <>
                                    <Link to="/auth/login" className='btn btn-success'>Login</Link>
                                    <Link to="/auth/register" className='btn btn-success'>Register</Link>
                                </>}
                        </Space>
                    </div>
                </div>
            </div>
        </nav >
    )
}

export default Navbar