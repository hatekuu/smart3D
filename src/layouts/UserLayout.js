import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductList from '../pages/User/ProductList';
import ProductDetail from '../pages/User/ProductDetail';
import Profile from '../pages/User/Profile';
import SearchResults from '../pages/User/search';
import Cart from '../pages/User/Cart';
import Print3D from '../pages/User/Print3D';
import './css/UserLayout.css'; // Đảm bảo import CSS đã chỉnh sửa

const UserLayout = () => {
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.role) {
      window.location.href = '/smart3D/login';  // Redirect to login page if role does not exist
    }
  }, []);

  return (
    <div className="layout-container"> {/* Đóng gói tất cả trong layout-container */}
      <Header />
      <div className="contentUser"> {/* Thêm lớp content để chứa nội dung */}
        <Routes>
          <Route path="/cart" element={<Cart />} />
          <Route path="/3dprint" element={<Print3D />} />
          <Route path="/" element={<ProductList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/:productId" element={<ProductDetail />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
