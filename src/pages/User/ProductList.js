import React, { useEffect, useState } from 'react';
import { getProducts,addToCart } from '../../api/product';
import './css/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(20);
  const [user, setUser] = useState({});
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
        console.log(data);
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, [currentPage, productsPerPage]);

  // Go to next page
  const nextPage = () => setCurrentPage((prev) => prev + 1);

  // Go to previous page
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Handle change in products per page
  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when limit changes
  };
const addTocart = async (productId,userId,quantity) => {
    try {
      const cart = {
        productId,
        userId,
        quantity,
      };
      const data = await addToCart(cart);
      console.log(data);
    } catch (err) {
      setError(err.message);
    }
}
  return (
    <div className="product-list-container">
      <h1>Product List</h1>
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
            <p>{product.price}-VNĐ</p>
            <button onClick={() => addTocart(product._id,user.userId,1)}>Add to cart</button>
          </div>
        ))}
      </div>
      <div className="pagination-buttons">
        <button onClick={prevPage}>&lt;</button>
        <span>Page {currentPage}</span>
        <button onClick={nextPage}>&gt;</button>
      </div>
    </div>
  );
};

export default ProductList;