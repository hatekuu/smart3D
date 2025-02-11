import React from "react";
import styles from "./css/Dashboard.module.css";
import { FaBox, FaShoppingCart, FaPrint, FaUserShield } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1>Chào mừng bạn đến với trang quản lý</h1>
        <p>Quản lý đơn hàng, sản phẩm và trạng thái máy in dễ dàng hơn.</p>
      </div>

      {/* Thống kê */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <FaBox className={styles.icon} />
          <h3>Tổng số sản phẩm</h3>
          <p>120</p>
        </div>
        <div className={styles.statCard}>
          <FaShoppingCart className={styles.icon} />
          <h3>Đơn hàng chờ xử lý</h3>
          <p>15</p>
        </div>
        <div className={styles.statCard}>
          <FaPrint className={styles.icon} />
          <h3>Máy in đang hoạt động</h3>
          <p>3 / 5</p>
        </div>
        <div className={styles.statCard}>
          <FaUserShield className={styles.icon} />
          <h3>Người dùng</h3>
          <p>250</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
