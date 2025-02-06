import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../api/auth';
import { suggestKeyword } from '../api/product';
import LogoutButton from './Auth/LogoutButton';
import './css/Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Để kiểm soát sự hiển thị của menu gợi ý
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Để kiểm soát sự hiển thị của menu dropdown
  const menuRef = useRef(null); // Thêm ref cho menu gợi ý
  const dropdownRef = useRef(null); // Thêm ref cho dropdown menu
  const userData = JSON.parse(localStorage.getItem('userData'));
  const role = userData?.role;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        await getUserProfile();
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.clear();
        setIsLoggedIn(false);
      }
    };

    fetchUserProfile();

    // Xử lý sự kiện click ra ngoài
    const handleClickOutside = () => {
      setIsDropdownVisible(false); // Ẩn dropdown khi click vào bất kỳ đâu
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (searchTerm.trim() !== '') {
      window.location.href = `/smart3D/products/search?query=${encodeURIComponent(searchTerm)}`;
    }
  };
  
  const handleSuggestionClick = (keyword) => {
    window.location.href = `/smart3D/products/search?query=${encodeURIComponent(keyword)}`;
  };

  const handleDropdownToggle = (e) => {
    e.stopPropagation(); // Ngừng lan truyền sự kiện click
    setIsDropdownVisible((prev) => !prev);
  };

  const handleMenuItemClick = () => {
    setIsDropdownVisible(false); // Ẩn dropdown khi click vào mục trong menu
  };

  return (
    <div className="header-container">
      <div className="left">
        <Link to="/" className="logo">Home</Link>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={async (e) => {
              const keyword = e.target.value;
              setSearchTerm(keyword);
              if (keyword.trim() !== '') {
                try {
                  const suggestions = await suggestKeyword(keyword);
                  setSuggestions(suggestions); // Cập nhật gợi ý
                  setIsMenuVisible(true); // Hiển thị menu gợi ý
                } catch (error) {
                  console.error(error);
                }
              } else {
                setSuggestions([]);
                setIsMenuVisible(false); // Ẩn menu nếu không có từ khóa
              }
            }}
            onKeyDown={handleSearch}
          />
          {isMenuVisible && suggestions.length > 0 && (
            <ul className="suggestion-list" ref={menuRef}>
              {suggestions.map((item, index) => (
                <li key={index} onClick={() => handleSuggestionClick(item)}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" onClick={handleSubmit}>Search</button>
      </div>
      <nav className="right">
        <ul>
          {isLoggedIn ? (
            <>
              {role === 'manager' && <li><Link to="/manager/upload-gcode">Upload Gcode</Link></li>}
              <li><Link to="/products">Products</Link></li>
              <li>
                <div className="user-menu" onClick={handleDropdownToggle}>
                  User
                  {isDropdownVisible && (
                    <div className="dropdown-menu" ref={dropdownRef}>
                      <Link to="/products/profile" onClick={handleMenuItemClick}>Profile</Link>
                      <Link to="/products/cart" onClick={handleMenuItemClick}>Cart</Link>
                      <LogoutButton />
                    </div>
                  )}
                </div>
              </li>
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
