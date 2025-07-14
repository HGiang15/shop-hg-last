import React, {useState, useEffect} from 'react';
import styles from './MainPageProduct.module.scss';
import Image from 'next/image';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import Table from '@/components/common/Table/Table';
import icons from '@/constants/static/icons';
import Pagination from '@/components/common/Pagination/Pagination';
import Button from '@/components/common/Button/Button';
import {ROUTES} from '@/constants/config';
import {useRouter} from 'next/router';
import {connect} from 'react-redux';
import {setActiveMenu} from '@/redux/actions/menuTabActions';
import {getAllProducts, deleteProduct, deleteMultipleProducts} from '@/services/productService';
import images from '@/constants/static/images';
import {toast} from 'react-toastify';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import useDebounce from '@/hooks/useDebounce';
import FilterAdmin from '@/components/common/FilterAdmin/FilterAdmin';
import moment from 'moment';
import 'moment/locale/vi';

const MainPageProduct = ({setActiveMenu}) => {
	const router = useRouter();
	const [products, setProducts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [productsPerPage, setProductsPerPage] = useState(5);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProductId, setSelectedProductId] = useState(null);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [deleteMode, setDeleteMode] = useState('single'); // 'single' | 'multiple'

	const [searchTerm, setSearchTerm] = useState('');
	const [sortOption, setSortOption] = useState('newest');
	const debounce = useDebounce(searchTerm, 600);

	useEffect(() => {
		setActiveMenu(ROUTES.AdminProduct);
	}, []);

	const fetchProducts = async () => {
		try {
			const data = await getAllProducts(currentPage, productsPerPage, sortOption, debounce);
			setProducts(data.products);
			setTotalItems(data.totalItems);
			setTotalPages(data.totalPages);
			setSelectedProducts([]);
		} catch (error) {
			console.error('Lỗi khi gọi API:', error);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, [currentPage, productsPerPage, sortOption, debounce]);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handleLimitChange = (newLimit) => {
		setProductsPerPage(newLimit);
		setCurrentPage(1);
	};

	const handleFormCreateProduct = () => {
		setActiveMenu(ROUTES.AdminProduct);
		router.push(ROUTES.AdminProductCreate);
	};

	const handleConfirmDeleteMany = () => {
		if (!selectedProducts || selectedProducts.length === 0) {
			toast.warn('Vui lòng chọn ít nhất một sản phẩm để xoá!');
			return;
		}
		setDeleteMode('multiple');
		setSelectedProductId(null);
		setIsModalOpen(true);
	};

	const isAllSelected = selectedProducts.length === products.length && products.length > 0;

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<FilterAdmin
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					sortOption={sortOption}
					setSortOption={setSortOption}
					setCurrentPage={setCurrentPage}
					sortOptions={[
						{value: 'newest', label: 'Mới nhất'},
						{value: 'oldest', label: 'Cũ nhất'},
						{value: 'name_asc', label: 'Tên A-Z'},
						{value: 'name_desc', label: 'Tên Z-A'},
						{value: 'price_asc', label: 'Giá thấp đến cao'},
						{value: 'price_desc', label: 'Giá cao đến thấp'},
					]}
					selectedProducts={selectedProducts}
					onDeleteMany={handleConfirmDeleteMany}
					isAdmin={true}
				/>

				<Button className={styles.addButton} onClick={handleFormCreateProduct}>
					Thêm mới sản phẩm
				</Button>
			</div>

			{products.length === 0 ? (
				<div className={styles.noProducts}>
					<Image src={images.boxEmpty} alt='Không có sản phẩm' width={180} height={180} priority />
					<h4>DỮ LIỆU TRỐNG</h4>
					<p>Hiện tại không có sản phẩm nào!</p>
					<Button className={styles.btnNoProduct} onClick={handleFormCreateProduct}>
						Thêm mới sản phẩm
					</Button>
				</div>
			) : (
				<>
					<div className={styles.tableWrapper}>
						<Table
							users={products.map((product, index) => {
								const quantity = product.quantityBySize
									? product.quantityBySize.reduce((total, size) => total + size.quantity, 0)
									: 0;

								return {
									index: (currentPage - 1) * productsPerPage + index + 1,
									_id: product._id,
									name: product.name,
									type: product.category?.[0]?.name,
									color: product.colors.map((color) => color.name).join(', '),
									price: product.price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'}),
									quantity,
									createdAt: moment(product.createdAt).locale('vi').format('HH:mm:ss - DD/MM/YYYY'),
									product,
								};
							})}
							headers={[
								{
									key: 'checkbox',
									label: (
										<input
											type='checkbox'
											checked={isAllSelected}
											onChange={(e) => {
												if (e.target.checked) {
													setSelectedProducts(products.map((product) => product._id));
												} else {
													setSelectedProducts([]);
												}
											}}
										/>
									),
								},
								{key: 'index', label: 'STT'},
								{key: '_id', label: 'Mã sản phẩm'},
								{key: 'name', label: 'Tên sản phẩm'},
								{key: 'type', label: 'Loại sản phẩm'},
								{key: 'color', label: 'Màu sản phẩm'},
								{key: 'price', label: 'Giá (VNĐ)'},
								{key: 'quantity', label: 'Số lượng'},
								{key: 'createdAt', label: 'Thời gian tạo'},
							]}
							renderCheckbox={(product) => (
								<input
									type='checkbox'
									checked={selectedProducts.includes(product._id)}
									onChange={(e) => {
										if (e.target.checked) {
											setSelectedProducts((prev) => [...prev, product._id]);
										} else {
											setSelectedProducts((prev) => prev.filter((id) => id !== product._id));
										}
									}}
								/>
							)}
							renderActions={(product) => (
								<>
									<IconCustom
										icon={<Image src={icons.edit} alt='Edit' width={20} height={20} />}
										iconFilter='invert(38%) sepia(93%) saturate(1382%) hue-rotate(189deg) brightness(89%) contrast(105%)'
										backgroundColor='#dce7ff'
										tooltip='Chỉnh sửa sản phẩm'
										href={`${ROUTES.AdminProductUpdate}?_id=${product?._id}`}
									/>
									<IconCustom
										icon={<Image src={icons.eye} alt='Chi tiết' width={20} height={20} />}
										iconFilter='brightness(0)'
										backgroundColor='#FFF200'
										tooltip='Chi tiết sản phẩm'
										href={`${ROUTES.AdminProduct}/${product?._id}`}
									/>
									<IconCustom
										icon={<Image src={icons.trash} alt='Xoá sản phẩm' width={20} height={20} />}
										iconFilter='invert(17%) sepia(100%) saturate(7480%) hue-rotate(1deg) brightness(90%) contrast(105%)'
										backgroundColor='#FFD6D6'
										tooltip='Xóa sản phẩm'
										onClick={() => {
											setDeleteMode('single');
											setIsModalOpen(true);
											setSelectedProductId(product._id);
										}}
									/>
								</>
							)}
						/>
					</div>

					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						totalItems={totalItems}
						onPageChange={handlePageChange}
						limit={productsPerPage}
						onLimitChange={handleLimitChange}
					/>
				</>
			)}

			<ConfirmDeleteModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={async () => {
					try {
						if (deleteMode === 'single' && selectedProductId) {
							await deleteProduct(selectedProductId);
							toast.success('Xóa sản phẩm thành công');
						} else if (deleteMode === 'multiple') {
							await deleteMultipleProducts(selectedProducts);
							toast.success('Xóa nhiều sản phẩm thành công');
						}
						setIsModalOpen(false);
						fetchProducts();
					} catch (error) {
						toast.error(error.message || 'Xóa sản phẩm thất bại');
					}
				}}
				productName={products.find((p) => p._id === selectedProductId)?.name}
			/>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	setActiveMenu: (menuPath) => dispatch(setActiveMenu(menuPath)),
});

export default connect(null, mapDispatchToProps)(MainPageProduct);
