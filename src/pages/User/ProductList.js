import React, { useEffect, useState } from 'react';
import { getProducts,addToCart } from '../../api/product';
import './css/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(20);
  const [user, setUser] = useState({});
  const [limit,setLimit]=useState(null)
  const [notification, setNotification] = useState('');
  useEffect(() => {
    const fetchProducts = async () => {
      setUser( JSON.parse(localStorage.getItem('userData')));
      try {
        const params = {
          limit: productsPerPage, // Số sản phẩm mỗi trang
          page: currentPage, // Trang hiện tại
          sortBy: 'name', // Sắp xếp theo tên
          order: 'asc', // Thứ tự tăng dần
        };
        const data = await getProducts(params);
        setProducts(data.products);
   setLimit(Math.ceil(data.totalProducts / (productsPerPage )));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, [currentPage, productsPerPage]);

  // Go to next page
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, limit)); // Không vượt quá limit
  };
  
  // Go to previous page
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1)); // Không nhỏ hơn 1
  };

  // Handle change in products per page
  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when limit changes
  };
const addTocart = async (productId,userId,quantity,productName) => {
    try {
      const cart = {
        productId,
        userId,
        quantity,
      };
      const data = await addToCart(cart);
      setNotification(`${data.message} sản phẩm ${productName}`); // Hiển thị thông báo
        setTimeout(() => setNotification(''), 3000); // Ẩn sau 2 giây
    } catch (err) {
      setError(err.message);
    }
}
const handlePageChange = (event) => {
  let page = parseInt(event.target.value, 10);
  if (!isNaN(page)) {
    setCurrentPage(Math.min(Math.max(page, 1), limit)); // Đảm bảo trong khoảng [1, limit]
  }
};

  return (
    <div className='product-list'>
    <div className="product-list-container">
      <h1>Danh mục sản phẩm</h1>
      {error && <p>{error}</p>}
      <div className="controls">
        <label htmlFor="productsPerPage">Products per page:</label>
        <select id="productsPerPage" value={productsPerPage} onChange={handleProductsPerPageChange}>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Số lượng: {product.stock > 0 ? product.stock : <span style={{ color: 'red' }}>Hết hàng</span>}</p>
            <p>{product.price.toLocaleString('vi-VN')} VND</p>
            <button onClick={() => addTocart(product._id,user.userId,1,product.name)}>Thêm vào giỏ hàng</button>
          </div>
        ))}
      </div>
      <div className="pagination-buttons" >
  <button onClick={prevPage}>&lt;</button>
  
  <input 
    type="number" 
    value={currentPage} 
    onChange={handlePageChange} 
    min="1" 
    max={limit} 
    className="page-input"
  />
  
  <button onClick={nextPage}>&gt;</button>
</div>
{notification && <div className="notification">{notification}</div>}

    </div></div>
  );
};

export default ProductList;