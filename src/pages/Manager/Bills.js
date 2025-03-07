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
  const [showProduct, setShowProduct] = useState({}); // Quản lý trạng thái hiển thị sản phẩm cho từng đơn hàng

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        console.log(data);
        setOrders(data);
      } catch (error) {
        console.error("Lỗi lấy đơn hàng:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  };

  // Hàm toggle hiển thị sản phẩm cho đơn hàng
  const toggleShowProduct = (orderId) => {
    setShowProduct((prev) => ({
      ...prev,
      [orderId]: !prev[orderId], // Đảo trạng thái hiển thị sản phẩm
    }));
  };

  return (
    <div className="manager-orders">
      <h2>Quản lý Đơn Hàng</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Loại đơn hàng</th>
            <th>Phương thức thanh toán</th>
            <th>danh sách sản phẩm</th>
            <th>Ngày đặt</th>
            <th>Dịa chỉ</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order._id}>
              <tr>
                <td>{order._id}</td>
                <td>{order.ordertype}</td>
                <td>{order.paymentMethod ? order.paymentMethod : "Cash"}</td>
                <td>
                 {order.ordertype==="Đơn hàng sản phẩm"?(
 <button onClick={() => toggleShowProduct(order._id)}>
 {showProduct[order._id] ? "Ẩn sản phẩm" : "Xem sản phẩm"}
</button>
                 ):(
                  <p></p>
                 )}
                 
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{order.address.address}-{order.address.phone}-{order.address.note}</td>
                <td className={`status ${order.status}`}>{statusText[order.status]}</td>
            
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

              {/* Hiển thị sản phẩm khi showProduct cho đơn hàng này là true */}
              {showProduct[order._id] && order.productInfo && (
                <tr>
                  <td colSpan="7">
                    <table className="product-info-table">
                      <thead>
                        <tr>
                          <th>Tên sản phẩm</th>
                          <th>Số lượng</th>
                          <th>Giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.productInfo.map((product) => (
                          <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>{product.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerOrders;
