import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../api/manager";

import { FaCheckCircle, FaTimesCircle, FaTruck } from "react-icons/fa";

import "./css/ManagerOrders.css";

const statusText = {
  pending: "🕒 Đang đợi xác nhận đơn",
  cancelled: "❌ Đã hủy đơn",
  processing: "📦 Đang chuẩn bị hàng",
  shipped: "🚚 Đã giao hàng",
  completed: "✅ Đã nhận hàng"
};

const ManagerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Lỗi lấy đơn hàng:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    console.log(orderId)
    try {
      await updateOrderStatus({orderId, newStatus});
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  };

  return (
    <div className="manager-orders">
      <h2>Quản lý Đơn Hàng</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customerName}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td className={`status ${order.status}`}>
                {statusText[order.status]}
              </td>
              <td>
                {order.status === "pending" && (
                  <>
                    <button
                      className="confirm-btn"
                      onClick={() => handleUpdateStatus(order._id, "processing")}
                    >
                      <FaCheckCircle /> Xác nhận
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => handleUpdateStatus(order._id, "cancelled")}
                    >
                      <FaTimesCircle /> Hủy đơn
                    </button>
                  </>
                )}
                {order.status === "processing" && (
                  <button
                    className="shipped-btn"
                    onClick={() => handleUpdateStatus(order._id, "shipped")}
                  >
                    <FaTruck /> Đã giao hàng
                  </button>
                )}
                {order.status !== "pending" && order.status !== "processing" && (
                  <span>Không thể thay đổi</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerOrders;
