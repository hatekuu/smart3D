import React, { useEffect, useState } from "react";
import { getUserOrders, cancelOrder, confirmReceived } from "../../api/product";
import { processGcodePricing, confirmOrder } from "../../api/3dprint";
import { FaTrash, FaCheckCircle, FaCheck } from "react-icons/fa";
import "./css/Bills.css"; // Import file CSS

const Bills = () => {
  const user = JSON.parse(localStorage.getItem("userData")) || {};
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pricingResult, setPricingResult] = useState(null); // Lưu kết quả tính giá

  useEffect(() => {
    fetchOrders();
    FetchProcessGcodePricing();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getUserOrders(user.userId);
      if(data.length>0){

  
      setBills(data);
    }
      console.log(data)
    } catch (error) {
      console.log("Lỗi khi lấy đơn hàng:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    setLoading(true);
    try {
      await cancelOrder({ userId: user.userId, orderId });
      alert("Đã hủy đơn hàng!");
      fetchOrders();
    } catch (error) {
      console.log("Lỗi khi hủy đơn hàng:", error);
    }
    setLoading(false);
  };

  const handleConfirmReceived = async (orderId) => {
    setLoading(true);
    try {
      await confirmReceived({ userId: user.userId, orderId });
      alert("Đã xác nhận đã nhận hàng!");
      fetchOrders();
    } catch (error) {
      console.log("Lỗi khi xác nhận đơn hàng:", error);
    }
    setLoading(false);
  };

  // ✅ Function tính giá G-code
  const FetchProcessGcodePricing = async () => {
    setLoading(true);
    try {
      const response = await processGcodePricing({ userId: user.userId });
      console.log("giá",response)
      if(response.pricing){
      setPricingResult(response.pricing); // Lưu kết quả
    }
    } catch (error) {
      console.log("Lỗi khi tính giá G-code:", error);
    }
    setLoading(false);
  };

  // Function xác nhận đơn hàng sau khi có giá
  const handleConfirmOrder = async (fileId, fileName, price,printId,gcodeId) => {
    setLoading(true);
  
    try {

      await confirmOrder({
        gcodeId,
        fileId,
        printId: printId, // Giả lập printId
        userId: user.userId,
        confirm: true,
        price,
        fileName,
      });
      alert("Đơn hàng đã được xác nhận!");
      fetchOrders();
    } catch (error) {
      console.log("Lỗi khi xác nhận đơn hàng:", error);
    }
    setLoading(false);
    console.log(fileId,fileName,price)
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "🕒 Đang đợi xác nhận đơn";
      case "cancelled":
        return "❌ Đã hủy đơn";
      case "processing":
        return "📦 Đang chuẩn bị hàng";
      case "shipped":
        return "🚚 Đã giao hàng";
      case "completed":
        return "✅ Đã nhận hàng";
      default:
        return status;
    }
  };

  return (
    <div className="bills-container">
      <h2 className="bills-title">📦 Danh sách đơn hàng</h2>
      {loading ? (
  <div>
    đang tải...
  </div>
) : (
  <div>
     {/* 🔹 Hiển thị kết quả tính giá */}
     {pricingResult && (
        <div className="pricing-result">
          <h3>💰 Các file gcode hiện có</h3>
          <ul>
            {pricingResult.map((item) => (
              <li key={item.fileName}>
                {item.fileName} - <strong>{item.price.toLocaleString('vi-VN')} VND</strong>
                <button
                  className="bills-btn confirm"
                  onClick={() => handleConfirmOrder(item.fileId, item.fileName, item.price,item.printId,item.gcodeId)}
                  disabled={loading}
                >
                  <FaCheck className="bill-icon" /> Xác nhận đơn
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {bills.length === 0 ? (
        <p className="bills-empty">Không có đơn hàng nào.</p>
      ) : (
        <ul className="bills-list">
          {bills.map((order) => (
            <li key={order._id} className="bills-item">
              <p><strong>Mã đơn hàng:</strong> {order._id}</p>
              <p><strong>Trạng thái:</strong> <span className={`status ${order.status}`}>{getStatusText(order.status)}</span></p>
              <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              {order.discount && <p><strong>Mã giảm giá:</strong> {order.discount}</p>}
              {order.products&& <p><strong>Sản phẩm:</strong> {order.products.map((p) => p.name).join(", ")}</p>}
              <div className="bills-btn-group">
                {order.status === "pending" && (
                  <button className="bills-btn cancel" onClick={() => handleCancelOrder(order._id)} disabled={loading}>
                    <FaTrash className="bill-icon" /> Hủy đơn hàng
                  </button>
                )}
                {order.status === "shipped" && (
                  <button className="bills-btn confirm" onClick={() => handleConfirmReceived(order._id)} disabled={loading}>
                    <FaCheckCircle className="bill-icon" /> Xác nhận đã nhận
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
  </div>
)}
     
    </div>
  );
};

export default Bills;
