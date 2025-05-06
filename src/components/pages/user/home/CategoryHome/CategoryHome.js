import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import styles from './CategoryHome.module.scss';
import Link from 'next/link';
import {ROUTES} from '@/constants/config';
import {getAllCategories} from '@/services/categoryService';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const CategoryHome = () => {
	const [categories, setCategories] = useState([]);
	const [activeCategory, setActiveCategory] = useState(null);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const data = await getAllCategories();
				setCategories(data.categories);
				if (data.length > 0) {
					setActiveCategory(data[0]._id);
				}
			} catch (err) {
				console.error('Lỗi khi tải danh mục:', err);
			}
		};
		fetchCategories();
	}, []);

	return (
		<div className={styles.container}>
			<h2 className={styles.categoryTitle}>Danh mục sản phẩm</h2>
			<div className={styles.categoryList}>
				<Swiper
					spaceBetween={20}
					slidesPerView={4}
					modules={[Pagination]}
					pagination={{clickable: true}}
					breakpoints={{
						0: {slidesPerView: 1.5},
						480: {slidesPerView: 2.5},
						768: {slidesPerView: 3},
						1024: {slidesPerView: 4},
					}}
				>
					{categories.map((category) => (
						<SwiperSlide key={category._id}>
							<Link
								href={ROUTES.Product}
								className={`${styles.categoryItem} ${activeCategory === category._id ? styles.active : ''}`}
								onClick={() => setActiveCategory(category._id)}
							>
								<span className={styles.categoryName}>{category.name}</span>
								<Image src={category.image} alt={category.name} width={80} height={80} />
							</Link>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
};

export default CategoryHome;
