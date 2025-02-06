import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductList from '../pages/User/ProductList';
import ProductDetail from '../pages/User/ProductDetail';
import Profile from '../pages/User/Profile';

const UserLayout = () => {
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.role) {
      window.location.href = '/login';  // Redirect to login page if role does not exist
    }
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/:productId" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </>
  );
};

export default UserLayout;
