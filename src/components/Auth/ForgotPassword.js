import React, { useState } from 'react';
import { forgotPassword } from '../../api/auth';
import { Link } from 'react-router-dom';
import '../css/Auth.css';
const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await forgotPassword(username, secretKey, newPassword, confirmPassword);
      setMessage(response.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='auth-container'>
        <div className='input-container'>
      <h2>Quên Mật Khẩu</h2>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <input
        type="text"
        placeholder="Tên người dùng"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Khóa bí mật"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleForgotPassword}>Gửi Yêu Cầu</button>
      <div>
        <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
        <Link to="/register">Chưa có tài khoản? Đăng ký</Link>
      </div>
      </div>
    </div>
  );
};

export default ForgotPassword;