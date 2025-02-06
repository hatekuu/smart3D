import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../api/product';

const ProductDetail = () => {
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

  return (
    <div>
      <h2>Chi Tiết Sản Phẩm</h2>
      {error && <p>{error}</p>}
      {product && (
        <div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Giá: {product.price}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;