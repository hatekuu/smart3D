import React, { useState } from 'react';
import axiosInstance from '../../api/axios';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  const handleAddProduct = async () => {
    try {
      await axiosInstance.post('/product', { name, description, price });
      alert('Thêm sản phẩm thành công!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <div>
      <h2>Thêm Sản Phẩm Mới</h2>
      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder="Tên sản phẩm"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Mô tả sản phẩm"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Giá sản phẩm"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={handleAddProduct}>Thêm Sản Phẩm</button>
    </div>
  );
};

export default AddProduct;