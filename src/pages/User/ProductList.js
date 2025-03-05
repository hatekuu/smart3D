import React, { useEffect, useState, useCallback } from 'react';
import { getProducts, addToCart } from '../../api/product';
import './css/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(20);
  const [user, setUser] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  
  const [notification, setNotification] = useState('');
  const [filters, setFilters] = useState({ category: '', priceRange: 'all' });
  const priceRanges = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Trên 1 triệu', value: '1000000-' },
    { label: 'Dưới 1 triệu', value: '0-1000000' },
    { label: '1 - 3 triệu', value: '1000000-3000000' },
    { label: '3 - 5 triệu', value: '3000000-5000000' },
    { label: '5 - 10 triệu', value: '5000000-10000000' },
    { label: '10 - 20 triệu', value: '10000000-20000000' },
   // Lọc sản phẩm có giá từ 1 triệu trở lên
  ];
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) setUser(userData);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        limit: productsPerPage,
        page: currentPage,
        sortBy: 'name',
        order: 'asc',

      };

      // Thêm khoảng giá vào params nếu có chọn
      if (filters.priceRange !== 'all') {
        const [minPrice, maxPrice] = filters.priceRange.split('-').map(Number);
        params.minPrice = minPrice;
        params.maxPrice = maxPrice;
      }
      const data = await getProducts(params);
      setProducts(data.products);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Lỗi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [currentPage, productsPerPage, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const firstPage = () => setCurrentPage(1);
  const lastPage = () => setCurrentPage(totalPages);

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const addToCartHandler = async (productId, productName) => {
    if (!user.userId) {
      setNotification('Bạn cần đăng nhập để thêm vào giỏ hàng!');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    try {
      const cart = { productId, userId: user.userId, quantity: 1 };
      const data = await addToCart(cart);
      setNotification(`${data.message} sản phẩm ${productName}`);
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      setError(err.message || 'Lỗi thêm vào giỏ hàng');
    }
  };

  const handlePageChange = (event) => {
    let page = parseInt(event.target.value, 10);
    if (!isNaN(page)) {
      setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handlePriceChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: event.target.value,
    }));
    setCurrentPage(1);
  };
  return (
    <div className='product-list'>
      <div className="product-list-container">
        <h1>Danh mục sản phẩm</h1>
        {error && <p className="error">{error}</p>}

        {/* Bộ lọc */}
        <div className="filters">
          <label htmlFor="category">Danh mục:</label>
          <select id="category" name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">Tất cả</option>
            <option value="FDM 3D Printer">FDM 3D Printer</option>
            <option value="Resin 3D Printer">Resin 3D Printer</option>
            <option value="FDM 3D Printer">3D Printing Resin</option>
            <option value="Resin 3D Printer">Resin 3D Printer</option>
            <option value="Resin 3D Printer">3D Printer Accessories</option>
          </select>

          <label htmlFor="priceFilter">Khoảng giá:</label>
          <select id="priceFilter" value={filters.priceRange} onChange={handlePriceChange}>
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option> ))}
          </select>
        </div>

        {/* Chọn số sản phẩm/trang */}
        <div className="controls">
          <label htmlFor="productsPerPage">Số sản phẩm/trang:</label>
          <select id="productsPerPage" value={productsPerPage} onChange={handleProductsPerPageChange}>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : (
          <div className="product-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="product-card">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>Số lượng: {product.stock > 0 ? product.stock : <span style={{ color: 'red' }}>Hết hàng</span>}</p>
                  <p>{product.price.toLocaleString('vi-VN')} VND</p>
                  <button onClick={() => addToCartHandler(product._id, product.name)}>
                    Thêm vào giỏ hàng
                  </button>
                </div>
              ))
            ) : (
              <p>Không có sản phẩm nào phù hợp.</p>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="pagination-buttons">
          <button onClick={firstPage} disabled={currentPage === 1}>Trang đầu</button>
          <button onClick={prevPage} disabled={currentPage === 1}>&lt;</button>
          
          <input
            type="number"
            value={currentPage}
            onChange={handlePageChange}
            min="1"
            max={totalPages}
            className="page-input"
          />
          
          <button onClick={nextPage} disabled={currentPage === totalPages}>&gt;</button>
          <button onClick={lastPage} disabled={currentPage === totalPages}>Trang cuối</button>
        </div>

        {notification && <div className="notification">{notification}</div>}
      </div>
    </div>
  );
};

export default ProductList;
