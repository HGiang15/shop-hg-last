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
import {getAllProducts, deleteProduct} from '@/services/productService';
import images from '@/constants/static/images';
import {toast} from 'react-toastify';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';

const MainPageProduct = ({setActiveMenu}) => {
	const router = useRouter();
	const [products, setProducts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false); // Delete
	const [selectedProductId, setSelectedProductId] = useState(null); // Delete

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const data = await getAllProducts();
				setProducts(data);
			} catch (error) {
				console.error('Lỗi khi gọi API:', error);
			}
		};

		fetchProducts();
	}, []);

	const productsPerPage = 5;
	const totalPages = products.length > 0 ? Math.ceil(products.length / productsPerPage) : 0;
	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = products.length > 0 ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handleFormCreateProductClick = () => {
		setActiveMenu(ROUTES.AdminProduct);
		router.push(ROUTES.AdminProductCreate);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div></div>
				<Button className={styles.addButton} onClick={handleFormCreateProductClick}>
					Thêm mới sản phẩm
				</Button>
			</div>

			{products.length === 0 ? (
				<div className={styles.noProducts}>
					<Image src={images.boxEmpty} alt='Không có sản phẩm' width={180} height={180} priority />
					<h4>DỮ LIỆU TRỐNG</h4>
					<p>Hiện tại không có sản phẩm nào!</p>
					<Button className={styles.btnNoProduct} onClick={handleFormCreateProductClick}>
						Thêm mới sản phẩm
					</Button>
				</div>
			) : (
				<>
					<div className={styles.tableWrapper}>
						<Table
							users={currentProducts.map((product, index) => {
								const quantity = product.quantityBySize
									? Object.values(product.quantityBySize).reduce((a, b) => a + b, 0)
									: 0;
								return {
									index: indexOfFirstProduct + index + 1,
									_id: product._id,
									name: product.name,
									type: product.category,
									color: product.colors.join(', '),
									price: product.price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'}),
									quantity: quantity,
									product,
								};
							})}
							headers={[
								{key: 'index', label: 'STT'},
								{key: '_id', label: 'Mã sản phẩm'},
								{key: 'name', label: 'Tên sản phẩm'},
								{key: 'type', label: 'Loại sản phẩm'},
								{key: 'color', label: 'Màu sản phẩm'},
								{key: 'price', label: 'Giá (VNĐ)'},
								{key: 'quantity', label: 'Số lượng'},
							]}
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
										icon={<Image src={icons.eye} alt='Edit' width={20} height={20} />}
										iconFilter='brightness(0) '
										backgroundColor='#FFF200'
										tooltip='Chi tiết sản phẩm'
										href={`${ROUTES.AdminProduct}/${product?._id}`}
									/>
									<IconCustom
										icon={<Image src={icons.trash} alt='Xóa sản phẩm' width={20} height={20} />}
										iconFilter='invert(17%) sepia(100%) saturate(7480%) hue-rotate(1deg) brightness(90%) contrast(105%)'
										backgroundColor='#FFD6D6'
										tooltip='Xóa sản phẩm'
										onClick={() => {
											setIsModalOpen(true);
											setSelectedProductId(product._id);
										}}
									/>
								</>
							)}
						/>
					</div>

					{products.length > 0 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
							totalItems={products.length}
							itemsPerPage={productsPerPage}
						/>
					)}
				</>
			)}

			<ConfirmDeleteModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={async () => {
					try {
						await deleteProduct(selectedProductId);
						setIsModalOpen(false);
						const updatedProducts = await getAllProducts();
						setProducts(updatedProducts);
						toast.success('Xóa sản phẩm thành công');
					} catch (error) {
						console.error('Lỗi khi xóa sản phẩm:', error.message);
						toast.error(error.message || 'Xóa sản phẩm thất bại');
					}
				}}
				productName={currentProducts.find((product) => product._id === selectedProductId)?.name}
			/>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	setActiveMenu: (menuPath) => dispatch(setActiveMenu(menuPath)),
});

export default connect(null, mapDispatchToProps)(MainPageProduct);
