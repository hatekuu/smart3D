import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../api/auth';
import { suggestKeyword } from '../api/product';
import LogoutButton from './Auth/LogoutButton';
import { FaUpload, FaBoxOpen, FaShoppingCart, FaUser, FaSignInAlt, FaUserPlus,FaHome,FaClipboardList} from 'react-icons/fa';
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
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/products')||location.pathname.startsWith('/manager/products'); // Kiểm tra router

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
      if(role==='user')
      window.location.href = `/smart3D/products/search?query=${encodeURIComponent(searchTerm)}`;
      if(role==='manager')
        window.location.href = `/smart3D/manager/products/search?query=${encodeURIComponent(searchTerm)}`;
    }
  };
  
  const handleSuggestionClick = (keyword) => {
          if(role==='user')
      window.location.href = `/smart3D/products/search?query=${encodeURIComponent(keyword)}`;
      if(role==='manager')
        window.location.href = `/smart3D/manager/products/search?query=${encodeURIComponent(keyword)}`;
  };

  const handleDropdownToggle = (e) => {
    e.stopPropagation(); // Ngừng lan truyền sự kiện click
    setIsDropdownVisible((prev) => !prev);
  };

  const handleMenuItemClick = () => {
    setIsDropdownVisible(false); // Ẩn dropdown khi click vào mục trong menu
  };

  return (
    <div className="header-container icon">
         <div className="left">
       {role==='user'&&( <Link to="/" className="logo">
          <FaHome /> Trang Chủ
        </Link>)}
        {role==='manager'&&( <Link to="/manager" className="logo">
          <FaHome /> Trang Chủ
        </Link>)}
        {isProductPage && ( // Chỉ hiển thị thanh tìm kiếm nếu đang ở trang sản phẩm
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
                    console.log(suggestions);
                    setSuggestions(suggestions);
                    setIsMenuVisible(true);
                  } catch (error) {
                    console.error(error);
                  }
                } else {
                  setSuggestions([]);
                  setIsMenuVisible(false);
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
        )}
        {isProductPage && <button type="submit" onClick={handleSubmit}>Search</button>}
      </div>
      <nav className="right">
        <ul>
        {isLoggedIn ? (
                      <>
                        {role === 'manager' && (
                          <li>
                            <Link to="/manager/upload-gcode" className="nav-link">
                              <FaUpload /> Upload Gcode
                            </Link>
                          </li>
                        )}
                       
                        {role === 'manager' && (
                          <li>
                            <Link to="/manager/products" className="nav-link">
                              <FaBoxOpen /> Sản phẩm
                            </Link>
                          </li>
                        )}
                        {role === 'user' && (
                          <li>
                            <Link to="/products/3dprint" className="nav-link">
                              <FaBoxOpen /> Dịch vụ
                            </Link>
                            <Link to="/products" className="nav-link">
                              <FaBoxOpen /> Sản phẩm
                            </Link>
                          </li>
                        )}
                        <li>
                          <div className="user-menu" onClick={handleDropdownToggle}>
                            <FaUser /> Cá nhân
                            {isDropdownVisible && (
                              <div className="dropdown-menu" ref={dropdownRef}>
                                <Link to="/products/profile" className="dropdown-link" onClick={handleMenuItemClick}>
                                  <FaUser /> Thông tin cá nhân
                                </Link>
                                {role === 'user' && (
                                  <>
                                  <Link to="/products/cart" className="dropdown-link" onClick={handleMenuItemClick}>
                                    <FaShoppingCart /> Giỏ Hàng
                                  </Link>
                                  <Link to="/products/bills" className="dropdown-link" onClick={handleMenuItemClick}>
                                    <FaClipboardList /> Đơn mua
                                  </Link>
                                  </>
                                )}
                                 {role === 'manager' && (
                                  <>
                                    <Link to="/manager/bills" className="dropdown-link" onClick={handleMenuItemClick}>
                                    <FaClipboardList /> Đơn hàng
                                  </Link>
                                  
                                  </>
                                
                                )}

                                <LogoutButton />
                              </div>
                            )}
                          </div>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link to="/login" className="nav-link">
                            <FaSignInAlt /> Đăng Nhập
                          </Link>
                        </li>
                        <li>
                          <Link to="/register" className="nav-link">
                            <FaUserPlus /> Đăng Ký
                          </Link>
                        </li>
                      </>
                    )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
