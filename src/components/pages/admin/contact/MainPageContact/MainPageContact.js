import React, {useState, useEffect} from 'react';
import styles from './MainPageContact.module.scss';
import {toast} from 'react-toastify';
import {Upload, X} from 'react-feather';
import moment from 'moment';
import 'moment/locale/vi';
import {getAllMessages, updateMessageStatus, deleteMessage, replyToMessage} from '@/services/contactService';
import {uploadMultiple} from '@/services/uploadService';
import Table from '@/components/common/Table/Table';
import ModalWrapper from '@/components/common/ModalWrapper/ModalWrapper';
import Pagination from '@/components/common/Pagination/Pagination';
import useDebounce from '@/hooks/useDebounce';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import FilterAdmin from '@/components/common/FilterAdmin/FilterAdmin';
import Image from 'next/image';
import images from '@/constants/static/images';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import icons from '@/constants/static/icons';
import Button from '@/components/common/Button/Button';
import {setActiveMenu} from '@/redux/actions/menuTabActions';
import {ROUTES} from '@/constants/config';
import {connect} from 'react-redux';

const MainPageContact = ({setActiveMenu}) => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);

	const [searchTerm, setSearchTerm] = useState('');
	const [sortOption, setSortOption] = useState('newest');
	const [statusFilter, setStatusFilter] = useState('');
	const debounceSearch = useDebounce(searchTerm, 600);

	const [selectedMessage, setSelectedMessage] = useState(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [replyContent, setReplyContent] = useState('');
	const [isReplying, setIsReplying] = useState(false);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	const [replyFiles, setReplyFiles] = useState([]);
	const [replyPreviews, setReplyPreviews] = useState([]);

	useEffect(() => {
		setActiveMenu(ROUTES.AdminContact);
	}, []);

	const fetchMessages = async () => {
		setLoading(true);
		try {
			const data = await getAllMessages(page, limit, debounceSearch, sortOption, statusFilter);
			setMessages(data.messages);
			setTotalPages(data.totalPages);
			setPage(data.currentPage);
			setTotalItems(data.totalMessages);
		} catch (error) {
			toast.error(error.message || 'Lỗi lấy danh sách liên hệ');
		} finally {
			setLoading(false);
		}
	};

	// call lại API khi thay đổi
	useEffect(() => {
		fetchMessages();
	}, [page, limit, debounceSearch, sortOption, statusFilter]);

	// Update status
	const handleUpdateStatus = async (id, status, showToast = true) => {
		try {
			await updateMessageStatus(id, status);
			if (showToast) toast.success(`Đã cập nhật trạng thái thành "${status}"`);
			setMessages(messages.map((msg) => (msg._id === id ? {...msg, status} : msg)));
		} catch (error) {
			toast.error(error.message);
		}
	};

	// update status new --> read
	const handleViewDetails = (message) => {
		setSelectedMessage(message);
		setReplyContent('');
		setReplyFiles([]);
		setReplyPreviews([]);
		setIsDetailModalOpen(true);
		if (message.status === 'new') {
			handleUpdateStatus(message._id, 'read', false);
		}
	};

	const handleReplyFileChange = (e) => {
		const selectedFiles = Array.from(e.target.files);
		if (replyFiles.length + selectedFiles.length > 6) {
			toast.warn('Bạn chỉ được upload tối đa 6 ảnh.');
			return;
		}
		setReplyFiles((prev) => [...prev, ...selectedFiles]);
		const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
		setReplyPreviews((prev) => [...prev, ...newPreviews]);
		e.target.value = null;
	};

	const removeReplyFile = (indexToRemove) => {
		URL.revokeObjectURL(replyPreviews[indexToRemove]);
		setReplyFiles(replyFiles.filter((_, index) => index !== indexToRemove));
		setReplyPreviews(replyPreviews.filter((_, index) => index !== indexToRemove));
	};

	const handleDeleteClick = (id) => {
		setDeleteId(id);
		setIsConfirmModalOpen(true);
	};

	// Delete msg
	const confirmDelete = async () => {
		try {
			await deleteMessage(deleteId);
			toast.success('Xóa tin nhắn thành công');
			fetchMessages();
		} catch (error) {
			toast.error(error.message || 'Xóa thất bại');
		} finally {
			setIsConfirmModalOpen(false);
			setDeleteId(null);
		}
	};

	// replyToMessage
	const handleSendReply = async (e) => {
		e.preventDefault();
		if (!replyContent.trim()) {
			toast.warn('Vui lòng nhập nội dung trả lời.');
			return;
		}
		setIsReplying(true);
		try {
			let replyImageUrls = [];
			if (replyFiles.length > 0) {
				const uploadFormData = new FormData();
				replyFiles.forEach((file) => uploadFormData.append('files', file));
				const uploadResponse = await uploadMultiple(uploadFormData);
				replyImageUrls = uploadResponse.data;
			}

			await replyToMessage(selectedMessage._id, {
				replyMessage: replyContent,
				attachments: replyImageUrls,
			});

			toast.success('Gửi trả lời thành công!');
			setMessages(messages.map((msg) => (msg._id === selectedMessage._id ? {...msg, status: 'replied'} : msg)));
			setIsDetailModalOpen(false);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsReplying(false);
		}
	};

	const statusStyles = {
		new: styles.statusNew,
		read: styles.statusRead,
		replied: styles.statusReplied,
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<FilterAdmin
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					sortOption={sortOption}
					setSortOption={setSortOption}
					sortOptions={[
						{value: 'newest', label: 'Mới nhất'},
						{value: 'oldest', label: 'Cũ nhất'},
					]}
					filters={[
						{
							name: 'status',
							value: statusFilter,
							onChange: setStatusFilter,
							options: [
								{value: '', label: 'Tất cả tin nhắn liên hệ'},
								{value: 'new', label: 'Mới'},
								{value: 'read', label: 'Đã đọc'},
								{value: 'replied', label: 'Đã trả lời'},
							],
						},
					]}
					setCurrentPage={setPage}
					placeholder='Tìm theo tên người gửi...'
				/>
			</div>
			{loading ? (
				<p>Đang tải...</p>
			) : messages.length === 0 ? (
				<div className={styles.noProducts}>
					<Image src={images.boxEmpty} alt='Không có tin nhắn' width={180} height={180} priority />
					<h4>CHƯA CÓ TIN NHẮN NÀO</h4>
					<p>Hiện tại không có tin nhắn liên hệ nào trong hệ thống.</p>
				</div>
			) : (
				<>
					<Table
						users={messages.map((msg, index) => ({...msg, stt: (page - 1) * limit + index + 1}))}
						headers={[
							{key: 'stt', label: 'STT'},
							{key: 'name', label: 'Người gửi'},
							{key: 'subject', label: 'Chủ đề'},
							{
								key: 'createdAt',
								label: 'Ngày gửi',
								render: (msg) => moment(msg.createdAt).locale('vi').format('HH:mm DD/MM/YYYY'),
							},
							{
								key: 'status',
								label: 'Trạng thái',
								render: (msg) => (
									<span className={`${styles.statusBadge} ${statusStyles[msg.status]}`}>
										{msg.status === 'new' ? 'Mới' : msg.status === 'read' ? 'Đã đọc' : 'Đã trả lời'}
									</span>
								),
							},
						]}
						renderActions={(message) => (
							<>
								<IconCustom
									icon={<Image src={icons.trash} alt='Xoá sản phẩm' width={20} height={20} />}
									iconFilter='invert(17%) sepia(100%) saturate(7480%) hue-rotate(1deg) brightness(90%) contrast(105%)'
									backgroundColor='#FFD6D6'
									tooltip='Xóa tin nhắn'
									onClick={() => handleDeleteClick(message._id)}
								/>
								<IconCustom
									icon={<Image src={icons.eye} alt='Chi tiết' width={20} height={20} />}
									iconFilter='brightness(0)'
									backgroundColor='#FFF200'
									tooltip='Xem'
									onClick={() => handleViewDetails(message)}
								/>
							</>
						)}
					/>
					<Pagination
						currentPage={page}
						totalPages={totalPages}
						totalItems={totalItems}
						limit={limit}
						onPageChange={(newPage) => setPage(newPage)}
						onLimitChange={(newLimit) => {
							setLimit(newLimit);
							setPage(1);
						}}
					/>
				</>
			)}

			{isDetailModalOpen && selectedMessage && (
				<ModalWrapper onClose={() => setIsDetailModalOpen(false)}>
					<h2>Chi tiết liên hệ</h2>
					<p>
						<strong>Từ:</strong> {selectedMessage.name} ({selectedMessage.email})
					</p>
					<p>
						<strong>Số điện thoại:</strong> {selectedMessage.phone || 'Không cung cấp'}
					</p>
					<p>
						<strong>Ngày gửi:</strong> {new Date(selectedMessage.createdAt).toLocaleString('vi-VN')}
					</p>
					<p>
						<strong>Chủ đề:</strong> {selectedMessage.subject}
					</p>
					<hr />
					<div className={styles.messageContent}>{selectedMessage.message}</div>

					{selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
						<div className={styles.attachmentsSection}>
							<strong>Tệp đính kèm của khách hàng:</strong>
							<div className={styles.previewContainer}>
								{selectedMessage.attachments.map((url, index) => (
									<a key={index} href={url} target='_blank' rel='noopener noreferrer' className={styles.previewItem}>
										<Image src={url} alt={`Attachment ${index}`} />
									</a>
								))}
							</div>
						</div>
					)}

					<form onSubmit={handleSendReply} className={styles.replyForm}>
						<h3>Trả lời qua Email</h3>
						<textarea
							className={styles.replyTextarea}
							rows='5'
							placeholder={`Nhập nội dung trả lời tới ${selectedMessage.name}...`}
							value={replyContent}
							onChange={(e) => setReplyContent(e.target.value)}
						/>
						<div className={styles.formGroup}>
							<label>Đính kèm ảnh trả lời (tối đa 6 ảnh)</label>
							<div className={styles.uploadContainer}>
								<input
									type='file'
									id='replyFileUpload'
									multiple
									accept='image/*'
									onChange={handleReplyFileChange}
									style={{display: 'none'}}
								/>
								<label htmlFor='replyFileUpload' className={styles.uploadButton}>
									<Upload size={18} /> Chọn ảnh
								</label>
							</div>
							<div className={styles.previewContainer}>
								{replyPreviews.map((preview, index) => (
									<div key={index} className={styles.previewItem}>
										<Image src={preview} alt={`Reply Preview ${index}`} />
										<button type='button' onClick={() => removeReplyFile(index)} className={styles.removeButton}>
											<X size={14} />
										</button>
									</div>
								))}
							</div>
						</div>

						<div className={styles.modalActions}>
							<Button type='button' onClick={() => setIsDetailModalOpen(false)} className={styles.closeModalBtn}>
								Hủy
							</Button>
							<Button type='submit' className={styles.sendReplyBtn} disabled={isReplying}>
								{isReplying ? 'Đang gửi...' : 'Gửi trả lời'}
							</Button>
						</div>
					</form>
				</ModalWrapper>
			)}

			<ConfirmDeleteModal
				isOpen={isConfirmModalOpen}
				onClose={() => setIsConfirmModalOpen(false)}
				onConfirm={confirmDelete}
				itemName='tin nhắn liên hệ này'
			/>
		</div>
	);
};

// export default MainPageContact;

const mapDispatchToProps = (dispatch) => ({
	setActiveMenu: (menuPath) => dispatch(setActiveMenu(menuPath)),
});

export default connect(null, mapDispatchToProps)(MainPageContact);
