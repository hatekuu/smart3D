import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Dashboard from '../pages/Manager/Dashboard';
import ProductList from '../pages/Manager/ProductList';
import UploadGcode from '../pages/Manager/UploadGcode';
const ManagerLayout = () => {
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || userData.role !== 'manager') {
      window.location.href = '/products';  // Redirect to user route if not a manager
    }
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/upload-gcode" element={<UploadGcode />} />
      </Routes>
      <Footer />
    </>
  );
};

export default ManagerLayout;
