import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/router';
import styles from './ProductCard.module.scss';
import Link from 'next/link';
import {filterProducts} from '@/services/productService';
import Pagination from '@/components/common/Pagination/Pagination';
import images from '@/constants/static/images';
import Button from '@/components/common/Button/Button';
import icons from '@/constants/static/icons';
import {Tooltip} from 'react-tippy';
import 'react-tippy/dist/tippy.css';

const ProductCard = ({selectedCategories, selectedColors}) => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [sortBy, setSortBy] = useState('createdAt');
	const [sortOrder, setSortOrder] = useState('desc');
	const [limit, setLimit] = useState(8);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			try {
				const filters = {
					category: selectedCategories,
					colors: selectedColors,
					page,
					limit,
					sortBy,
					sortOrder,
				};
				const data = await filterProducts(filters);
				setProducts(data.products || []);
				setTotalPages(data.totalPages || 1);
			} catch (err) {
				setError(err.message || 'Đã có lỗi xảy ra khi lọc sản phẩm.');
			}
			setLoading(false);
		};

		fetchProducts();
	}, [selectedCategories, selectedColors, page, sortBy, sortOrder, limit]);

	const handleSortChange = (e) => {
		const value = e.target.value;
		switch (value) {
			case 'createdAt-desc':
				setSortBy('createdAt');
				setSortOrder('desc');
				break;
			case 'createdAt-asc':
				setSortBy('createdAt');
				setSortOrder('asc');
				break;
			case 'price-asc':
				setSortBy('price');
				setSortOrder('asc');
				break;
			case 'price-desc':
				setSortBy('price');
				setSortOrder('desc');
				break;
			default:
				break;
		}
	};

	const handleAddToCart = async (productId) => {
		// try {
		// 	// Gọi API thêm vào giỏ hàng
		// 	await addToCart(productId); // bạn tự định nghĩa hoặc import service
		// 	alert('Đã thêm vào giỏ hàng!');
		// } catch (err) {
		// 	console.error('Lỗi thêm vào giỏ hàng:', err);
		// 	alert('Lỗi khi thêm vào giỏ hàng.');
		// }
	};

	if (loading) return <div>Đang tải sản phẩm...</div>;
	if (error) return <div>Lỗi: {error}</div>;

	return (
		<div className={styles.wrapper}>
			<div className={styles.sortBar}>
				<label>Sắp xếp: </label>
				<select onChange={handleSortChange} value={`${sortBy}-${sortOrder}`}>
					<option value='createdAt-desc'>Mới nhất</option>
					<option value='createdAt-asc'>Cũ nhất</option>
					<option value='price-asc'>Giá tăng dần</option>
					<option value='price-desc'>Giá giảm dần</option>
				</select>
			</div>

			<div className={styles.gridContainer}>
				{products.length > 0 ? (
					products.map((product) => (
						<Link href={`/products/${product._id}`} key={product._id} className={styles.card}>
							{product.images && product.images[0] ? (
								<Image
									src={`http://localhost:3003/uploads/${product.images[0]}`}
									alt={product.name}
									className={styles.image}
									width={300}
									height={400}
									onError={() => console.error('Lỗi tải ảnh')}
								/>
							) : (
								<div className={styles.placeholderImage}>Không có ảnh</div>
							)}
							<div className={styles.info}>
								<p className={styles.productCode}>Mã: {product.code}</p>
								<h3 className={styles.productName}>{product.name}</h3>
								<p className={styles.productPrice}>
									{product.price?.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}
								</p>

								<div className={styles.cartWrapper}>
									<Tooltip title='Thêm vào giỏ hàng' position='top' trigger='mouseenter' arrow={true} duration={200}>
										<Button
											className={styles.addToCartBtn}
											onClick={(e) => {
												e.preventDefault();
												handleAddToCart(product._id);
											}}
											centerIcon={<Image src={icons.cart} alt='Icon' width={20} height={20} />}
										/>
									</Tooltip>
								</div>
							</div>
						</Link>
					))
				) : (
					<div className={styles.noProducts}>
						<Image src={images.boxEmpty} alt='Không tìm thấy sản phẩm' width={180} height={180} priority />
						<h4>DỮ LIỆU TRỐNG</h4>
						<p>Hiện tại không có sản phẩm nào phù hợp!</p>
					</div>
				)}
			</div>

			<Pagination
				className={styles.pagination}
				currentPage={page}
				totalPages={totalPages}
				onPageChange={setPage}
				totalItems={products.length}
				onLimitChange={setLimit}
				limit={limit}
			/>
		</div>
	);
};

export default ProductCard;
