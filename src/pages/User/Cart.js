import React, { useEffect, useState } from 'react';
import { getCart, updateCart, removeFromCart, checkout, applyDiscount, getDiscount } from '../../api/product';
import {getUserProfile} from '../../api/auth'
import './css/Cart.css'; // Import file CSS

const Cart = () => {
  const [cart, setCart] = useState([]); // Khởi tạo cart với mảng rỗng
  const [discounts, setDiscounts] = useState([]); // Lưu trữ các discount codes
  const [selectedDiscount, setSelectedDiscount] = useState(null); // Discount code được chọn
  const [discountApplied, setDiscountApplied] = useState(false); // Kiểm tra xem giảm giá đã được áp dụng chưa
  const [addresses, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [total,setTotal]=useState(0)
  const user = JSON.parse(localStorage.getItem('userData')) || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCart(user.userId);
        const discountData = await getDiscount();
        const profile= await getUserProfile()
        
        console.log(profile.address)
        if (profile.address) setAddress(profile.address);
        if (!data.message) {
          setCart(data);
          // Tính tổng tiền ngay sau khi nhận dữ liệu giỏ hàng
          const newTotal = data.reduce((sum, product) => sum + product.price * product.quantity, 0);
          setTotal(newTotal);
        }
  
         if (discountData.length > 0) {
        setDiscounts(discountData.filter(discount => discount.isActive));
      }
      } catch (error) {
        console.log(error.error);
      }
    };
  
    fetchData();
  }, []); // Không cần phụ thuộc vào `total`, chỉ chạy một lần khi component mount.
  

  // Hàm để xử lý khi muốn xóa một sản phẩm khỏi giỏ hàng
  const handleRemove = async (productId) => {
    try {
      await removeFromCart({ userId: user.userId, productId });
      const updatedCart = cart.filter(item => item._id !== productId);
      setCart(updatedCart);
      
      // Cập nhật total sau khi xóa sản phẩm
      const newTotal = updatedCart.reduce((sum, product) => sum + product.price * product.quantity, 0);
      setTotal(newTotal);
    } catch (error) {
      console.log(error.error);
    }
  };
  

  // Hàm để xử lý khi muốn cập nhật quantity của sản phẩm
  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      if (quantity === 0) {
        // Nếu số lượng về 0, gọi API xóa trực tiếp
        await removeFromCart({ userId: user.userId, productId });
        setCart(cart.filter(item => item._id !== productId));
      } else {
        await updateCart({ userId: user.userId, productId, quantity });
  
        setCart(cart.map((item) => 
          item._id === productId ? { ...item, quantity } : item
        ));
      }
      
      // Tính lại total sau mỗi thay đổi
      setTotal(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  
    } catch (error) {
      console.log(error.error);
    }
  };
  
  // Hàm áp dụng discount
  const handleApplyDiscount = async () => {
    if (selectedDiscount) {
      try {
        const result = await applyDiscount({ discountCode: selectedDiscount, userId: user.userId });
  
        if (result.length > 0 && result[0].totalAmountWithDiscount !== undefined) {
          setTotal(result[0].totalAmountWithDiscount);
          setDiscountApplied(true);
        } else {
          alert("Invalid discount code or error applying discount.");
        }
      } catch (error) {
        console.log("Error applying discount:", error);
      }
    } else {
      alert("Please select a discount code.");
    }
  };
  

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select a shipping address before checkout.");
      return;
    }
    const checkoutData = {
      userId: user.userId,
      totalPrice:total,
      address: selectedAddress,
      ...(discountApplied && { discount: selectedDiscount }),
    };
    try {
      await checkout(checkoutData);
      window.location.href='/smart3D/products'
    } catch (error) {
     console.log(error) 
    }
   

  };

  return (
    <div>
   
      {cart.length === 0 || !cart ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <div>
          <table className="table-container">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng tiền sản phẩm</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.price.toLocaleString('vi-VN')} VND</td>
                  <td>
                    <input
                      type="number"
                      value={product.quantity}
                      min="0"
                      onChange={(e) => handleUpdateQuantity(product._id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>{(product.price * product.quantity).toLocaleString('vi-VN')} VND</td>
                  <td>
                    <button className="remove-btn" onClick={() => handleRemove(product._id)}>Xóa sản phẩm</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Hiển thị danh sách mã giảm giá */}
          <div className="discount-container">
       
            <select onChange={(e) => setSelectedDiscount(e.target.value)} value={selectedDiscount}>
              <option value="">Chọn mã giảm giá</option>
              {discounts.map((discount) => (
                <option key={discount._id} value={discount.code}>
                  {discount.code} - {discount.discountPercentage}% off
                </option>
              ))}
            </select>
            <button onClick={handleApplyDiscount}>Áp dụng mã giảm giá</button>
          </div>
               {/* Hiển thị địa chỉ */}
          <div className="discount-container">
            <h3>Địa Chỉ</h3>
            <select onChange={(e) => setSelectedAddress(e.target.value)} value={selectedAddress}>
                    <option value="">Chọn địa chỉ</option>
                    {addresses.map((address, index) => (
                      <option key={index} value={index}>
                        {address.address} - {address.phone} - {address.note}
                      </option>
                    ))}
          </select>

          </div>
          {/* Hiển thị tổng tiền */}
          <div className="total-container">
            <h3>Tổng tiền: {total.toLocaleString('vi-VN')} VND</h3>
          </div>

          {/* Nút Checkout */}
          <button onClick={handleCheckout} className="checkout-btn">Đặt hàng</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
