import React from 'react';
import { useRouter } from 'next/router';
import styles from './ProductCard.module.scss';

const products = [
  {
    code: "VCAFM33",
    name: "Váy Chữ A Thiết Kế Chỉ Nổi Thắt Nơ",
    price: "499,000",
    image: "/static/images/products/product_1.webp",
  },
  {
    code: "QN123",
    name: "Quần Jeans Nam Cao Cấp",
    price: "799,000",
    image: "/static/images/products/product_2.webp",
  },
  {
    code: "AT456",
    name: "Áo Thun Trơn Nam Cotton",
    price: "299,000",
    image: "/static/images/products/product_3.webp",
  }, 
  {
    code: "AK789",
    name: "Áo Khoác Dạ Lót Lông",
    price: "999,000",
    image: "/static/images/products/product_4.webp",
  },
];

const ProductCard = () => {
  const router = useRouter();

  const handleClick = (productCode) => {
    router.push(`/products/${productCode}`);
  };

  return (
    <div className={styles.gridContainer}>
      {products.map((product) => (
        <div
          className={styles.card}
          key={product.code}
          onClick={() => handleClick(product.code)} 
        >
          <img src={product.image} alt={product.name} className={styles.image} />
          <div className={styles.info}>
            <p className={styles.productCode}>Mã: {product.code}</p>
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productPrice}>{product.price}₫</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
