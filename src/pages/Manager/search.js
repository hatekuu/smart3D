import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { findProduct } from '../../api/product';
import { updateProduct, deleteProduct } from '../../api/manager';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userData')));

    const fetchProducts = async () => {
      if (!query) return;
      try {
        const data = { name: query, page: 1, limit: 10 };
        const result = await findProduct(data);
        setProducts(result.products);
      } catch (error) {
        console.error('Lỗi lấy sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  // Xử lý mở form chỉnh sửa
  const handleEdit = (product,event) => {
    setSelectedProduct(product);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditDescription(product.description);
    setEditStock(product.stock);
    setEditCategory(product.category);
    const rect = event.target.closest('.product-card').getBoundingClientRect();
    setModalPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
  };

  // Xử lý cập nhật sản phẩm
  const handleUpdate = async () => {
    if (!selectedProduct) return;
    try {
      const updatedProduct = {
        ...selectedProduct,
        _id:selectedProduct._id,
        name: editName,
        price: editPrice,
        description: editDescription,
        stock: editStock,
        category: editCategory,
      };
      await updateProduct( updatedProduct);
      setProducts(products.map((p) => (p._id === selectedProduct._id ? updatedProduct : p)));
      setSelectedProduct(null);
    } catch (error) {
      console.error('Lỗi cập nhật sản phẩm:', error);
    }
  };

  // Xử lý xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Lỗi xóa sản phẩm:', error);
    }
  };

  return (
    <div className="product-list-container">
      <h2>Kết quả tìm kiếm cho: "{query}"</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.price.toLocaleString('vi-VN')} VND</p>
              <p><strong>Mô tả:</strong> {product.description}</p>
              <p><strong>Tồn kho:</strong> {product.stock}</p>
              <button style={{background:`red`}}  onClick={() => handleDelete(product._id)}>Xóa</button>
              <button onClick={(event) => handleEdit(product,event)}>Chỉnh sửa</button>
             
            </div>
          ))}
        </div>
      ) : (
        <p>Không tìm thấy sản phẩm nào.</p>
      )}

      {/* Modal chỉnh sửa sản phẩm */}
      {selectedProduct && (
        <div 
        style={{
          top: `${modalPosition.top-50}px`,
          left: `${modalPosition.left-60}px`,
        }}
        className="modal">
          <h3>Chỉnh sửa sản phẩm</h3>
          <label>Tên sản phẩm:</label>
          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />

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
          <label>Mô tả:</label>
          <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />

          <label>Số lượng:</label>
          <input type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)} />

          <label>Danh mục:</label>
          <input type="text" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />

          <button onClick={handleUpdate}>Cập nhật</button>
          <button onClick={() => setSelectedProduct(null)}>Hủy</button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
