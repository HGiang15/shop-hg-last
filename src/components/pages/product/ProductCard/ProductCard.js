import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import styles from './ProductCard.module.scss';
import Link from 'next/link';
import {filterProducts} from '@/services/productService';
import Pagination from '@/components/common/Pagination/Pagination';
import images from '@/constants/static/images';
import Button from '@/components/common/Button/Button';
import icons from '@/constants/static/icons';
import {Tooltip} from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import AddToCartModal from '../AddToCartModal/AddToCartModal';
import useDebounce from '@/hooks/useDebounce';
import FilterAdmin from '@/components/common/FilterAdmin/FilterAdmin';

const ProductCard = ({selectedCategories, selectedColors}) => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [sortBy, setSortBy] = useState('createdAt');
	const [sortOrder, setSortOrder] = useState('desc');
	const [limit, setLimit] = useState(8);
	const [isFeatured, setIsFeatured] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortOption, setSortOption] = useState('newest');
	const [selectedProduct, setSelectedProduct] = useState(null);
	const debounce = useDebounce(searchTerm, 600);

	const openModal = (product) => {
		setSelectedProduct(product);
		setShowModal(true);
	};

	const closeModal = () => {
		setSelectedProduct(null);
		setShowModal(false);
	};

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			try {
				const filters = {
					category: selectedCategories,
					colors: selectedColors,
					page,
					limit,
					isFeatured,
					sortBy,
					sortOrder,
					keyword: debounce,
				};
				const data = await filterProducts(filters);
				setProducts(data.products || []);
				setTotalPages(data.totalPages || 1);
				setTotalItems(data.total || 0);
			} catch (err) {
				setError(err.message || 'Đã có lỗi xảy ra khi lọc sản phẩm.');
			}
			setLoading(false);
		};

		fetchProducts();
	}, [selectedCategories, selectedColors, page, sortBy, sortOrder, limit, debounce]);

	useEffect(() => {
		switch (sortOption) {
			case 'newest':
				setSortBy('createdAt');
				setSortOrder('desc');
				setIsFeatured(null);
				break;
			case 'oldest':
				setSortBy('createdAt');
				setSortOrder('asc');
				setIsFeatured(null);
				break;
			case 'price_asc':
				setSortBy('price');
				setSortOrder('asc');
				setIsFeatured(null);
				break;
			case 'price_desc':
				setSortBy('price');
				setSortOrder('desc');
				setIsFeatured(null);
				break;
			case 'featured':
				setSortBy(null);
				setSortOrder(null);
				setIsFeatured(true);
				break;
			default:
				break;
		}
	}, [sortOption]);

	if (loading) return <div>Đang tải sản phẩm...</div>;
	if (error) return <div>Lỗi: {error}</div>;

	return (
		<div className={styles.wrapper}>
			<div className={styles.sortBar}>
				<FilterAdmin
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					sortOption={sortOption}
					setSortOption={setSortOption}
					setCurrentPage={setPage}
					sortOptions={[
						{value: 'newest', label: 'Mới nhất'},
						{value: 'oldest', label: 'Cũ nhất'},
						{value: 'price_asc', label: 'Giá tăng dần'},
						{value: 'price_desc', label: 'Giá giảm dần'},
						{value: 'featured', label: 'Sản phẩm nổi bật'},
					]}
					isAdmin={false}
				/>
			</div>

			<div className={styles.gridContainer}>
				{products.length > 0 ? (
					products.map((product) => (
						<Link href={`/products/${product._id}`} key={product._id} className={styles.card}>
							{product.isFeatured && <div className={styles.featuredLabel}>Nổi bật</div>}

							{product.images && product.images[0] ? (
								<Image
									src={product.images[0]}
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

								{/* {product.price?.toLocaleString('vi-VN') + ' vnd'} */}

								<div className={styles.cartWrapper}>
									{product.status === 'active' && product.quantityBySize?.length > 0 && (
										<Tooltip title='Thêm vào giỏ hàng' position='top' trigger='mouseenter' arrow={true} duration={200}>
											<Button
												className={styles.addToCartBtn}
												onClick={(e) => {
													e.preventDefault();
													openModal(product);
												}}
												centerIcon={<Image src={icons.cart} alt='Icon' width={20} height={20} />}
											/>
										</Tooltip>
									)}
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

			{selectedProduct && <AddToCartModal product={selectedProduct} show={showModal} onClose={closeModal} />}

			<Pagination
				className={styles.pagination}
				currentPage={page}
				totalPages={totalPages}
				onPageChange={setPage}
				totalItems={totalItems}
				onLimitChange={setLimit}
				limit={limit}
			/>
		</div>
	);
};

export default ProductCard;
