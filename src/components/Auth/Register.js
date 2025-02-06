import React, { useState } from 'react';
import { register } from '../../api/auth';
import { Link } from 'react-router-dom';
import '../css/Auth.css';
const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      await register(username, password, confirmPassword, secretKey);
      window.location.href = '/smart3D/login';  // Redirect to login page after successful registration
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='auth-container'>
       <div className='input-container'>
      <h2>Đăng Ký</h2>
      {error && <p>{error}</p>}
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
      />
      <input
        type="password"
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Khóa bí mật"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
      />
      <button onClick={handleRegister}>Đăng Ký</button>
      <div>
        <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
      </div>
    </div>
    </div>
  );
};

export default Register;