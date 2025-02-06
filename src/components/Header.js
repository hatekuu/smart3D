import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../api/auth';
import LogoutButton from './Auth/LogoutButton';
import './css/Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const role=userData?.role;
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        await getUserProfile();
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.clear(); // Clear all items in localStorage
        setIsLoggedIn(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="header-container">
      <div className="left">
        <Link to="/" className="logo">Home</Link>
      </div>
      <nav className="right">
        <ul>
          {isLoggedIn ? (
            <>
              {role==='manager' && <li><Link to="/manager/upload-gcode">Upload Gcode</Link></li>}
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><LogoutButton /></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
