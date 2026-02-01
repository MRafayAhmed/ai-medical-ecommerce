import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ redirectPath = '/admin/login', tokenKey = 'token' }) => {
    const token = localStorage.getItem(tokenKey);

    if (!token) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
