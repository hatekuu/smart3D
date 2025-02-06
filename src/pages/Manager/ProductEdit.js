import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../api/product';

const ProductEdit = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSave = () => {
    // Logic to save the edited product
  };

  return (
    <div>
      <h2>Chỉnh Sửa Sản Phẩm</h2>
      {error && <p>{error}</p>}
      {product && (
        <div>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
          <textarea
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
          <button onClick={handleSave}>Lưu</button>
        </div>
      )}
    </div>
  );
};

export default ProductEdit;