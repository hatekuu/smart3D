import React, { useState } from 'react';
import { login } from '../../api/auth';
import { Link } from 'react-router-dom';
import '../css/Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await login(username, password);
      const userData = JSON.parse(localStorage.getItem('userData')) || {};
      const role = userData.role || 'user';

      if (role === 'manager') {
        window.location.href = '/smart3D/manager';
      } else {
        window.location.href = '/smart3D/products';
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className='input-container'>
        <h2>Đăng Nhập</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Tên người dùng"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
        />
        <button onClick={handleLogin}>Đăng Nhập</button>
        <div>
          <Link to="/">Trang chủ</Link>
          <Link to="/register">Đăng ký</Link>
          <Link to="/forgot-password">Quên mật khẩu</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
