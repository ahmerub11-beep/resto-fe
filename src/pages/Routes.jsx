import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import NotFound from '@/components/NotFound'
import Frontend from './Frontend'
import Auth from './Auth'
import Dashboard from './Dashboard'
import { useAuth } from '@/context/Auth'
import ProtectedRoute from '@/components/ProtectedRoute'

const Index = () => {

    const { isAuth } = useAuth()

    return (
        <>
            <Routes>
                <Route path='/*' element={<Frontend />} />
                <Route path='/auth/*' element={isAuth ? <Navigate to="/" replace /> : <Auth />} />
                <Route path='/dashboard/*' element={<ProtectedRoute Component={Dashboard} />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </>
    )
}

export default Index