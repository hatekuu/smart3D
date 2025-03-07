import React, { useEffect, useState } from "react";
import { getUserOrders, cancelOrder, confirmReceived } from "../../api/product";
import { processGcodePricing, confirmOrder } from "../../api/3dprint";
import { FaTrash, FaCheckCircle, FaCheck } from "react-icons/fa";
import { getUserProfile } from "../../api/auth";
import { useLocation } from 'react-router-dom';
import { payment,transactionStatus } from "../../api/payment";
import "./css/Bills.css"; // Import file CSS

const Bills = () => {
  const user = JSON.parse(localStorage.getItem("userData")) || {};
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pricingResult, setPricingResult] = useState(null); // Lưu kết quả tính giá
  const [addresses, setAddress] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
     const [paymentMethod,setPaymentMethod]=useState(null)
       const location = useLocation();
  useEffect(() => {
    fetchOrders();
    FetchProcessGcodePricing();
    CheckPaymentStatus();
  }, []);
const CheckPaymentStatus=async()=>{
    
  const params = new URLSearchParams(location.search);
  const requestId = params.get('requestId');
  if (requestId) {
    try {
      const response = await transactionStatus({ orderId: requestId,userId:user.userId , orderType:"3dPrint"});
      if (response.resultCode === 0) {
        alert("Thanh toán thành công!");
        window.location.href = "/smart3D/products";
      } else {
        alert("Thanh toán thất bại!");
        window.location.href = "/smart3D/products";
      }
    } catch (error) {
      console.log(error);
    }
  }
}
  const fetchOrders = async () => {
    try {
  const profile= await getUserProfile()
 
  if (profile.address) setAddress(profile.address);
  if(profile.address.length==0) {
    alert("Vui lòng cập nhật thông tin địa chỉ mua hàng")
    window.location.href = "/smart3D/products/profile";
  }
      const data = await getUserOrders(user.userId);
      if(data.length > 0) {
        setBills(data);
      }

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

      if (response.pricing) {
        setPricingResult(response.pricing[0]); // Lưu kết quả

      }
    } catch (error) {
      console.log("Lỗi khi tính giá G-code:", error);
    }
    setLoading(false);
  };

  // Function xác nhận đơn hàng sau khi có giá
  const handleConfirmOrder = async (fileId, fileName, totalPrice, printId) => {
    setLoading(true);
    if (!selectedAddress&&!paymentMethod){alert("Chưa nhập địa chỉ hoặc hình thức thanh toán")}

    const confirmData={
      address:selectedAddress,
      fileId,
      printId, // Giả lập printId
      userId: user.userId,
      confirm: true,
      totalPrice,
      fileName,
      paymentMethod
    }
  
    try {
      if(paymentMethod==="Momo"){
        await confirmOrder(confirmData);
        const response = await payment({ amount: Math.round(totalPrice * 1000), orderType: "3dPrint" });

       
        if(response && response.payUrl){
          window.location.href = response.payUrl;}
          else{
            alert("Lỗi khi tạo đơn thanh toán Momo!");
            window.location.reload(); 
          }
      }else if(paymentMethod==="Cash"){
        await confirmOrder(confirmData);
        alert("Đơn hàng đã được xác nhận!");
        window.location.reload(); 
      }
    } catch (error) {
      console.log("Lỗi khi xác nhận đơn:", error);
    }
    setLoading(false);
  };
  const handleCancel = async (fileId, fileName, totalPrice, printId) => {
    setLoading(true);

    try {
      await confirmOrder({
        fileId,
        printId, // Giả lập printId
        userId: user.userId,
        confirm: false,
        totalPrice,
        fileName,
      });
      alert("Đơn hàng đã hủy!");
      window.location.reload(); 
    } catch (error) {
      console.log("Lỗi khi xác hủy:", error);
    }
    setLoading(false);
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
        <div>đang tải...</div>
      ) : (
        <div>
          {/* 🔹 Hiển thị kết quả tính giá */}
          {pricingResult && (
            <div className="pricing-result">
              <h3>💰Tính tiền file in 3D</h3>
              <ul>

                   <strong>Tổng giá tiền:{pricingResult.totalPrice.toLocaleString("vi-VN")} VND.</strong>
                   <strong> Số file cần in:{pricingResult.fileName.length} </strong>
                      <select onChange={(e) => setSelectedAddress(e.target.value)} value={selectedAddress}>
                    <option value="">Chọn địa chỉ</option>
                    {addresses.map((address, index) => (
                      <option key={index} value={index}>
                        {address.address} - {address.phone} - {address.note}
                      </option>
                    ))}
          </select>
          <select name="Filament" value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)}>
                    <option value="">Chọn phương thức thanh toán</option>
                    <option value="Momo">Momo</option>
                    <option value="Cash">Thanh toán tiền mặt</option>
                    </select>
                      <button
                        className="bills-btn confirm"
                        onClick={() => handleConfirmOrder(pricingResult._id.fileId, pricingResult.fileName, pricingResult.totalPrice, pricingResult._id.printId, )}
                        disabled={loading}
                      >
                        <FaCheck className="bill-icon" /> Xác nhận đơn
                      </button>
                      <button
                        className="bills-btn cancel"
                        onClick={() => handleCancel(pricingResult._id.fileId, pricingResult.fileName, pricingResult.totalPrice, pricingResult._id.printId)}
                        disabled={loading}
                      >
                        <FaCheck className="bill-icon" /> Hủy đơn
                      </button>
                   
                
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
                  <p><strong>Tổng tiền</strong> {order.totalPrice}</p>
                  {order.discount && <p><strong>Mã giảm giá:</strong> {order.discount}</p>}
                  {order.ordertype && <p><strong>Loại đơn:</strong> {order.ordertype}</p>}
                  {order.paymentMethod && <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>}
                  {order.products && <p><strong>Sản phẩm:</strong> {order.products.map((p) => p.name).join(", ")}</p>}
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
