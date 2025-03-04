import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './MainPageProduct.module.scss';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import FilterProduct from '../FilterProduct/FilterProduct';
import ProductCard from '../ProductCard/ProductCard';

const MainPageProduct = () => {
  const router = useRouter();
  
  const defaultBreadcrumbs = [
    { label: 'Trang chủ', link: '/' },
    { label: 'Sản phẩm', link: '/products' },
    { label: 'Quần nam', link: '/products/quan-nam' },
  ];

  const [breadcrumbItems, setBreadcrumbItems] = useState(defaultBreadcrumbs);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    if (!router.isReady) return;

    const fetchBreadcrumb = async () => {
      setIsLoading(true);
      try {
        const category = router.query.category || 'quan-nam';
        // const response = await axios.get(`/api/breadcrumb?category=${category}`);

        // // API data, update state
        // if (response.data.length > 0) {
        //   setBreadcrumbItems(response.data);
        // }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreadcrumb();
  }, [router.isReady, router.query.category]);

  return (
    <div className={styles.container}>
      {isLoading ? <p>Đang tải...</p> : <Breadcrumb items={breadcrumbItems} />}
      
      <div className={styles.main}>
        <FilterProduct />
        <ProductCard />
      </div>
    </div>
  );
};

export default MainPageProduct;
