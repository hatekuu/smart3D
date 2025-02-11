import React from 'react';
import Header from '../components/Header';
import './css/Home.css';

const Home = () => {
  return (
    <div>
      <Header />
      <div className="home-hero">
        <div className="home-hero-content">
          <h1>Chào mừng đến với dịch vụ in 3D chuyên nghiệp</h1>
          <p>Chúng tôi cung cấp dịch vụ in 3D chất lượng cao với giá cả hợp lý. Đặt hàng ngay để hiện thực hóa ý tưởng của bạn!</p>
          <div className="home-buttons">
            <button className="home-btn primary">Đặt hàng ngay</button>
            <button className="home-btn secondary">Tìm hiểu thêm</button>
          </div>
        </div>
      </div>

      <div className="home-features">
        <h2>Tại sao chọn chúng tôi?</h2>
        <div className="home-feature-list">
          <div className="home-feature">
            <h3>🎨 Đa dạng vật liệu</h3>
            <p>Cung cấp nhiều loại nhựa như PLA, ABS, PETG,...</p>
          </div>
          <div className="home-feature">
            <h3>⚡ In nhanh, chất lượng cao</h3>
            <p>Hệ thống máy in hiện đại, đảm bảo chi tiết sắc nét.</p>
          </div>
          <div className="home-feature">
            <h3>💰 Giá cả hợp lý</h3>
            <p>Giá cả phải chăng, phù hợp với mọi nhu cầu.</p>
          </div>
        </div>
      </div>
   
    </div>
  );
};

export default Home;
