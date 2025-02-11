import React, { useEffect, useState } from 'react';
import { getProducts } from '../../api/product';
import {updateProduct,deleteProduct,addProduct} from '../../api/manager'

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(20);
  const [limit, setLimit] = useState(null);
  const [notification, setNotification] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({ name: '', description: '', price: 0 });
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          limit: productsPerPage,
          page: currentPage,
          sortBy: 'name',
          order: 'asc',
        };
        const data = await getProducts(params);
        setProducts(data.products);
        console.log(data)
        setLimit(Math.ceil(data.totalProducts / productsPerPage));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, [currentPage, productsPerPage]);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, limit));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handlePageChange = (event) => {
    let page = parseInt(event.target.value, 10);
    if (!isNaN(page)) setCurrentPage(Math.min(Math.max(page, 1), limit));
  };
  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter((product) => product._id !== productId));
        setNotification('Xóa sản phẩm thành công!');
      } catch (error) {
        setNotification('Lỗi khi xóa sản phẩm.');
      }
    }
  };

  const handleEditProduct = async (product, event) => {
    try {
    
    console.log(product)
      setSelectedProduct(product);
      setShowEditModal(true);
  
      // Lấy vị trí của sản phẩm
      const rect = event.target.closest('.product-card').getBoundingClientRect();
      setModalPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
    } catch (error) {
      setNotification('Lỗi khi lấy thông tin sản phẩm.');
    }
  };
  // Lưu chỉnh sửa sản phẩm
  const handleSaveEdit = async () => {
    try {
      await updateProduct(selectedProduct);
      setProducts(products.map((p) => (p._id === selectedProduct._id ? selectedProduct : p)));
     
      setNotification('Cập nhật sản phẩm thành công!');
      setShowEditModal(false);
    } catch (error) {
      setNotification('Lỗi khi cập nhật sản phẩm.');
    }
  };

  // Mở modal thêm sản phẩm
  const handleAddProduct = () => {
    setSelectedProduct({ name: '', description: '', price: 0 });
    setShowAddModal(true);
  };

  // Lưu sản phẩm mới
  const handleSaveNewProduct = async () => {
    try {
      const newProduct = await addProduct(selectedProduct);
      setProducts([...products, newProduct]);
      setNotification('Thêm sản phẩm thành công!');
      setShowAddModal(false);
    } catch (error) {
      setNotification('Lỗi khi thêm sản phẩm.');
    }
  };

  return (
    <div className="product-list-container">
      <h1>Danh mục sản phẩm</h1>
      {error && <p>{error}</p>}

      <button onClick={handleAddProduct}>Thêm sản phẩm</button>

      <div className="controls">
        <label htmlFor="productsPerPage">Số sản phẩm mỗi trang:</label>
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
            <button  style={{background:`red`}} onClick={() => handleDeleteProduct(product._id)}>Xóa</button>
            <button  onClick={(event) => handleEditProduct(product, event)}>Chỉnh sửa</button>
          </div>
        ))}
      </div>

      <div className="pagination-buttons">
        <button onClick={prevPage}>&lt;</button>
        <input type="number" value={currentPage} onChange={handlePageChange} min="1" max={limit} className="page-input" />
        <button onClick={nextPage}>&gt;</button>
      </div>

      {notification && <div className="notification">{notification}</div>}

      {/* Modal Chỉnh sửa sản phẩm */}
      {showAddModal && (
        <div className="modal"
        style={{
          top: `200px`,
          left: `300px`,
        }}
        >
          <h2>Thêm sản phẩm</h2>
          <label>Tên sản phẩm:</label>
          <input type="text" value={selectedProduct.name} onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} />
          <label>Mô tả:</label>
          <textarea  value={selectedProduct.description} onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })} />
          <label>Giá:</label>
              <input 
                type="text" 
                value={selectedProduct.price.toLocaleString('vi-VN')} 
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\./g, ""); // Xóa dấu chấm trước khi lưu
                  if (!isNaN(rawValue)) { 
                    setSelectedProduct({ ...selectedProduct, price: Number(rawValue) });
                  }
                }} 
              />
          <label>Số lượng:</label>
          <input type="number" value={selectedProduct.stock} onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: e.target.value })} />
          <label>Loại:</label>
          <input type="text" value={selectedProduct.category} onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: e.target.category })} />
          <button onClick={handleSaveNewProduct}>Thêm</button>
          <button onClick={() => setShowAddModal(false)}>Hủy</button>
        </div>
      )}

          {showEditModal && (
            <div
              className="modal"
              style={{
                top: `${modalPosition.top-140}px`,
                left: `${modalPosition.left-60}px`,
              }}
            >
              <h2>Chỉnh sửa sản phẩm</h2>
              <label>Tên sản phẩm:</label>
              <input type="text" value={selectedProduct.name} onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} />
              <label>Mô tả:</label>
              <textarea  value={selectedProduct.description} onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })} />
              <label>Giá:</label>
                    <input 
                      type="text" 
                      value={selectedProduct.price.toLocaleString('vi-VN')} 
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\./g, ""); // Xóa dấu chấm trước khi lưu
                        if (!isNaN(rawValue)) { 
                          setSelectedProduct({ ...selectedProduct, price: Number(rawValue) });
                        }
                      }} 
                    />
              <label>Số lượng:</label>
              <input type="number" value={selectedProduct.stock} onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: e.target.value })} />
              <label>Loại:</label>
              <input type="text" value={selectedProduct.category} onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: e.target.category })} />
              <button onClick={handleSaveEdit}>Lưu</button>
              <button onClick={() => setShowEditModal(false)}>Hủy</button>
            </div>
          )}

    </div>
  );
};

export default ProductList;