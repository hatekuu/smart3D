import React, { useEffect, useState } from 'react';
import { getCart, updateCart, removeFromCart, checkout, applyDiscount } from '../../api/product';

const Cart = () => {
  const [cart, setCart] = useState([]); // Khởi tạo cart với mảng rỗng
  const user = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API để lấy giỏ hàng
        const data = await getCart(user.userId);
        console.log(data);
        
        // Cập nhật state cart với dữ liệu trả về
        if(!data.message){
            setCart(data);
        }
       
      } catch (error) {
        console.log(error.error);
      }
    };
    fetchData();
  }, []);

  // Hàm để xử lý khi muốn xóa một sản phẩm khỏi giỏ hàng
  const handleRemove = async (productId) => {
    try {
      await removeFromCart({ userId: user.userId, productId: productId });
      // Cập nhật lại giỏ hàng sau khi xóa
      const updatedCart = cart.filter(item => item._id !== productId);
      setCart(updatedCart);
    } catch (error) {
      console.log(error.error);
    }
  };

  // Hàm để xử lý khi muốn cập nhật quantity của sản phẩm
  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      if (quantity === 0) {
        // Nếu quantity là 0, gọi handleRemove để xóa sản phẩm khỏi giỏ hàng
        await handleRemove(productId);
      } else {
        // Gửi yêu cầu API để cập nhật quantity
        await updateCart({ userId: user.userId, productId, quantity });

        // Cập nhật lại giỏ hàng sau khi thay đổi quantity
        const updatedCart = cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        );
        setCart(updatedCart);
      }
    } catch (error) {
      console.log(error.error);
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ||!cart? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart?.map((product) => (
            <div key={product?._id} style={{ marginBottom: '20px' }}>
              <h3>{product?.name}</h3>
              <p>{product?.description}</p>
              <p>Price: {(product?.price * product?.quantity).toLocaleString()} VND</p>
              <p>Số Lượng: {product?.quantity}</p>

              {/* Chỉnh sửa số lượng */}
              <input
                type="number"
                value={product.quantity}
                min="0"
                onChange={(e) => handleUpdateQuantity(product?._id, parseInt(e.target.value))}
              />
              <button onClick={() => handleRemove(product?._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
