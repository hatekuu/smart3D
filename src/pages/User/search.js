import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { findProduct ,addToCart} from '../../api/product';


const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  useEffect(() => {
    setUser( JSON.parse(localStorage.getItem('userData')));
    const fetchProducts = async () => {
      if (!query) return;
      try {
        const data={
            name:query,
            page:1,
            limit:10
        }
        const result = await findProduct(data);
        console.log(result.products);
        setProducts(result.products);
      } catch (error) {
        console.error('Lỗi lấy sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [query]);

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
              <p>{product.price} VND</p>
              <button onClick={ async(e) => {
                try {
                  const cart = {
                    productId:product._id,
                    userId:user.userId,
                    quantity:1
                  };
                  const data = await addToCart(cart);
                  console.log(data);
                } catch (err) {
                  console.error('Lỗi thêm vào giỏ hàng:', err);
                }
               } }>Add to cart</button>
            </div>
          ))}
        </div>
      ) : (
        <p>Không tìm thấy sản phẩm nào.</p>
      )}
    </div>
  );
};

export default SearchResults;
