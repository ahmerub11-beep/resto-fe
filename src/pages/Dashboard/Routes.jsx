import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Products from './Products'
import Orders from './Orders'
import Users from './Users'
import ProtectedRoute from '@/components/ProtectedRoute'

const Index = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/*" element={<ProtectedRoute Component={Products} allowedRoles={["superAdmin"]} />} />
            <Route path="/orders/*" element={<ProtectedRoute Component={Orders} allowedRoles={["superAdmin", "customer"]} />} />
            <Route path="/users/*" element={<ProtectedRoute Component={Users} allowedRoles={["superAdmin"]} />} />
        </Routes>
    )
}

export default Index