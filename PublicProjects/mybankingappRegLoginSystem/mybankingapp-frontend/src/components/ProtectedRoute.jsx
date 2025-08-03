import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuth(false);
      setLoading(false);
      return;
    }

    axios.get('https://mybankingapp-regandlogin-backend.onrender.com/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      setIsAuth(true);
    })
    .catch(() => {
      setIsAuth(false);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/loginOrRegister" replace />;
}

export default ProtectedRoute;
