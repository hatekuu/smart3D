import React, { useEffect, useState } from 'react';
import { getCart, updateCart, removeFromCart, checkout, getDiscount,applyDiscount } from '../../api/product';
import {payment,transactionStatus} from '../../api/payment'
import { useLocation } from 'react-router-dom';
import {getUserProfile} from '../../api/auth'
import './css/Cart.css'; // Import file CSS

const Cart = () => {
  const [cart, setCart] = useState([]); // Khởi tạo cart với mảng rỗng
  const [addresses, setAddress] = useState([]);
  const [discounts, setDiscounts] = useState([]); // Lưu trữ các discount codes
  const [selectedDiscount, setSelectedDiscount] = useState(null); // Discount code được chọn
  const [discountApplied, setDiscountApplied] = useState(false); // 
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [total,setTotal]=useState(0)
  const [paymentMethod,setPaymentMethod]=useState(null)
  const user = JSON.parse(localStorage.getItem('userData')) || {};
  const location = useLocation();
  useEffect(() => {
   
  
    fetchData();
    CheckPaymentStatus();
  }, []); // Không cần phụ thuộc vào `total`, chỉ chạy một lần khi component mount.
   const fetchData = async () => {
      try {
        const data = await getCart(user.userId);
        const discountData = await getDiscount();
        const profile= await getUserProfile()
        
   
        if (profile.address) setAddress(profile.address);
        if (!data.message) {
          setCart(data);
          // Tính tổng tiền ngay sau khi nhận dữ liệu giỏ hàng
          console.log(data)
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
const CheckPaymentStatus=async()=>{
    
  const params = new URLSearchParams(location.search);
  const requestId = params.get('requestId');
  if (requestId) {
    try {
      const response = await transactionStatus({ orderId: requestId,userId:user.userId });
      if (response.resultCode === 0) {
        alert("Thanh toán thành công!");
        window.location.href = "/smart3D/products";
      } else {
        alert("Thanh toán thất bại!");
      }
    } catch (error) {
      console.log(error);
    }
  }
}
  // Hàm để xử lý khi muốn xóa một sản phẩm khỏi giỏ hàng
  const handleRemove = async (productId) => {

    try {
      await removeFromCart({ userId: user.userId, productId });
      const updatedCart = cart.filter(item => item._id !== productId);
      setCart(updatedCart);
      // Cập nhật total sau khi xóa sản phẩm
      const newcart=cart.filter(item => item._id !== productId)
      setTotal(newcart.reduce((sum=0, product) => sum + product.price * product.quantity, 0));
    
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
         const newcart=cart.filter(item => item._id !== productId)
         setCart(newcart);
         setTotal(newcart.reduce((sum=0, product) => sum + product.price * product.quantity, 0));
      } else {
        await updateCart({ userId: user.userId, productId, quantity });
        setCart(cart.map((item) => 
          item._id === productId ? { ...item, quantity } : item
        ));
        const newcart=cart.map((item) => 
          item._id === productId ? { ...item, quantity } : item
        )
        setCart(newcart);
           setTotal(newcart.reduce((sum=0, product) => sum + product.price * product.quantity, 0));
      }


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
      paymentMethod: paymentMethod,
    };
    try {
      if (paymentMethod === "Cash") {
     
        await checkout(checkoutData);
        window.location.href = "/smart3D/products";
      } else if (paymentMethod === "Momo") {
        const response = await payment({amount:total/1000});
        await checkout(checkoutData);
        console.log(response)
        if (response && response.payUrl) {
          window.location.href = response.payUrl; // Chuyển hướng đến trang thanh toán Momo
        } else {
          alert("Lỗi khi tạo đơn thanh toán Momo!");
        }
      }
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
          <select name="Filament" value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)}>
          <option value="">Chọn phương thức thanh toán</option>
          <option value="Momo">Momo</option>
          <option value="Cash">Thanh toán tiền mặt</option>
       
        </select>
          <button onClick={handleCheckout} className="checkout-btn">Đặt hàng</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
