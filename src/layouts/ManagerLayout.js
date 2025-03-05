import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Dashboard from '../pages/Manager/Dashboard';
import ProductList from '../pages/Manager/ProductList';
import UploadGcode from '../pages/Manager/UploadGcode';
import SearchResults from '../pages/Manager/search';
import Bills from '../pages/Manager/Bills';
import PrintControll from '../pages/Manager/3dPrintControll';
import Profit from '../pages/Manager/Profit';
const ManagerLayout = () => {
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || userData.role !== 'manager') {
      window.location.href = '/smart3D/products';  // Redirect to user route if not a manager
    }
  }, []);

  return (
    <div className="layout-container">
      <Header />
      <div className="contentUser">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/upload-gcode" element={<UploadGcode />} />
        <Route path="/controll" element={<PrintControll />} />
        <Route path="/products/search" element={<SearchResults />} />
        <Route path="/profit" element={<Profit />} />
      </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default ManagerLayout;
