import React, { useEffect, useState } from 'react';
import { getProducts } from '../../api/product';
import './css/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(20);

  useEffect(() => {
    const fetchProducts = async () => {
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
            <p>{product.price} USD</p>
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