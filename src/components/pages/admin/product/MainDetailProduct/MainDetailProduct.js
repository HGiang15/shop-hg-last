import React, {useEffect, useState} from 'react';
import styles from './MainDetailProduct.module.scss';
import Image from 'next/image';
import {toast} from 'react-toastify';
import {useRouter} from 'next/router';
import {deleteProduct, getProductById} from '@/services/productService';
import ConfirmDeleteModal from '@/components/pages/product/ConfirmDeleteModal/ConfirmDeleteModal';
import {ROUTES} from '@/constants/config';
import Button from '@/components/common/Button/Button';

const MainDetailProduct = () => {
	const router = useRouter();
	const {_id} = router.query;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [product, setProduct] = useState(null);
	const [selectedImage, setSelectedImage] = useState(null);

	useEffect(() => {
		if (!_id) return;

		const fetchProduct = async () => {
			try {
				const data = await getProductById(_id);
				setProduct(data);
			} catch (error) {
				console.error('Lỗi khi fetch chi tiết sản phẩm:', error);
				toast.error('Không tìm thấy sản phẩm');
			}
		};

		fetchProduct();
	}, [_id]);

	const handleDelete = async () => {
		try {
			await deleteProduct(product._id);
			toast.success('Xóa sản phẩm thành công');
			setIsModalOpen(false);
			router.push(ROUTES.AdminProduct);
		} catch (error) {
			toast.error(error.message || 'Xóa sản phẩm thất bại');
		}
	};

	return (
		<div className={styles.container}>
			{product ? (
				<>
					<div className={styles.topHeader}>
						<div className={styles.backTitle}>
							<span className={styles.backIcon} onClick={() => router.back()}>
								←
							</span>
							<h2 className={styles.title}>Chi tiết sản phẩm {product.name}</h2>
						</div>

						<div className={styles.actions}>
							<Button className={styles.deleteButton} onClick={() => setIsModalOpen(true)}>
								Xóa sản phẩm
							</Button>
							<Button
								className={styles.editButton}
								onClick={() => router.push(`${ROUTES.AdminProductUpdate}?_id=${product._id}`)}
							>
								Chỉnh sửa sản phẩm
							</Button>
						</div>
					</div>

					<div className={styles.header}>
						<div className={styles.infoGroup}>
							<p className={styles.name}>
								Tên sản phẩm: <span>{product.name}</span>
							</p>
							<p className={styles.name}>
								Phân loại sản phẩm: <span>{product.category?.[0]?.name}</span>
							</p>
							<p className={styles.name}>
								Giá sản phẩm: <span>{Number(product.price).toLocaleString()} VNĐ</span>
							</p>
							<p className={styles.name}>
								Tổng số sản phẩm đã bán: <span>{product.totalSold ?? 0}</span>
							</p>
							<p className={styles.name}>
								Mô tả chính: <span>{product.description}</span>
							</p>
						</div>
						<div className={styles.infoGroup}>
							<p className={styles.name}>
								Mã sản phẩm: <span>{product.code}</span>
							</p>
							<p className={styles.name}>
								Màu sản phẩm:
								{product.colors?.map((color, idx) => (
									<span key={idx} style={{marginLeft: '5px'}}>
										<span className={styles.colorDot} style={{backgroundColor: color.name}}></span> {color.name}{' '}
									</span>
								))}
							</p>
							<p className={styles.name}>
								Trạng thái sản phẩm: <span>{product.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}</span>
							</p>
							<span className={styles.name}>Mô tả chi tiết:</span>
							<div className={styles.wrapper}>
								<div className={styles.richText} dangerouslySetInnerHTML={{__html: product.detailDescription}} />
							</div>
						</div>
					</div>
					{product.isFeatured && <span className={styles.badgeFeatured}>Sản phẩm nổi bật</span>}

					<h3 className={styles.subTitle}>Danh sách ảnh sản phẩm</h3>
					<div className={styles.imageList}>
						<div className={styles.imageList}>
							{product.images?.map((img, idx) => (
								<Image
									key={idx}
									src={img}
									alt={`Product image ${idx}`}
									width={150}
									height={150}
									onClick={() => setSelectedImage(img)}
									className={styles.thumbnail}
								/>
							))}
						</div>
					</div>

					{selectedImage && (
						<div className={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
							<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
								<button className={styles.closeButton} onClick={() => setSelectedImage(null)}>
									×
								</button>
								<Image src={selectedImage} alt='Zoomed' width={600} height={600} className={styles.fullImage} />
							</div>
						</div>
					)}

					<h3 className={styles.subTitle}>Số lượng hàng còn lại</h3>
					<table className={styles.sizeTable}>
						<thead>
							<tr>
								<th>STT</th>
								<th>Kích cỡ</th>
								<th>Số lượng sản phẩm còn lại</th>
							</tr>
						</thead>
						<tbody>
							{product.quantityBySize?.map((item, idx) => (
								<tr key={idx}>
									<td>{idx + 1}</td>
									<td>{item.name}</td>
									<td>{item.quantity}</td>
								</tr>
							))}
						</tbody>
					</table>

					<ConfirmDeleteModal
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						onConfirm={handleDelete}
						productName={product.name}
					/>
				</>
			) : (
				<p>Đang tải dữ liệu sản phẩm...</p>
			)}
		</div>
	);
};

export default MainDetailProduct;
