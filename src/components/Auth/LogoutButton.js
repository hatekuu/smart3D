import React from 'react';
import axiosInstance from '../../api/axios'; // Import axios instance
import '../css/Logout.css'
const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      // Gửi yêu cầu tới API logout
      await axiosInstance.post('/auth/logout');
      
      // Xóa userData khỏi localStorage
      localStorage.removeItem('userData');
      alert('Đăng xuất thành công!');

      // Điều hướng về trang đăng nhập
      window.location.href = '/smart3D/login';
    } catch (error) {
      console.error('Lỗi khi logout:', error);
      alert('Đăng xuất thất bại! Vui lòng thử lại.');
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default LogoutButton;
