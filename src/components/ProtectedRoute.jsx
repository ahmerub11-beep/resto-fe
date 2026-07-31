import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/Auth'

const ProtectedRoute = ({ Component, allowedRoles }) => {

    const { isAuth, user } = useAuth()

    if (!isAuth) { return <Navigate to="/auth/login" replace /> }

    if (allowedRoles && !allowedRoles.includes(user?.role)) { return <Navigate to="/dashboard" replace /> }

    return <Component />

}

export default ProtectedRoute