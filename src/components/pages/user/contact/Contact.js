import React, {useState, useEffect} from 'react';
import styles from './Contact.module.scss';
import {MapPin, Phone, Mail, Facebook, Clock, Upload, X} from 'react-feather';
import {createContactMessage} from '@/services/contactService';
import {uploadMultiple} from '@/services/uploadService';
import {toast} from 'react-toastify';
import {useAuth} from '@/redux/context/AuthContext';
import Button from '@/components/common/Button/Button';

const Contact = () => {
	const {infoUser: user} = useAuth();

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		subject: 'Hỗ trợ đơn hàng',
		message: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [files, setFiles] = useState([]);
	const [previews, setPreviews] = useState([]);

	useEffect(() => {
		if (user) {
			setFormData((prev) => ({...prev, name: user.name || '', email: user.email || '', phone: user.phone || ''}));
		}
	}, [user]);

	const handleChange = (e) => {
		const {name, value} = e.target;
		setFormData((prev) => ({...prev, [name]: value}));
	};

	const handleFileChange = (e) => {
		const selectedFiles = Array.from(e.target.files);
		if (files.length + selectedFiles.length > 6) {
			toast.warn('Bạn chỉ được upload tối đa 6 ảnh.');
			return;
		}

		setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

		const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
		setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
		e.target.value = null;
	};

	const removeFile = (indexToRemove) => {
		URL.revokeObjectURL(previews[indexToRemove]);
		setFiles(files.filter((_, index) => index !== indexToRemove));
		setPreviews(previews.filter((_, index) => index !== indexToRemove));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			let imageUrls = [];
			if (files.length > 0) {
				const uploadFormData = new FormData();
				files.forEach((file) => {
					uploadFormData.append('files', file);
				});
				const uploadResponse = await uploadMultiple(uploadFormData);
				imageUrls = uploadResponse.data;
			}

			const finalFormData = {...formData, attachments: imageUrls};
			const response = await createContactMessage(finalFormData);

			toast.success(response.message || 'Gửi tin nhắn thành công!');
			setFormData({
				name: user ? user.name : '',
				email: user ? user.email : '',
				phone: user ? user.phone : '',
				subject: 'Hỗ trợ đơn hàng',
				message: '',
			});
			setFiles([]);
			setPreviews([]);
		} catch (error) {
			toast.error(error.message || 'Gửi tin nhắn thất bại.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.contactPage}>
			<div className={styles.header}>
				<h1>Liên hệ với TCSPorts</h1>
				<p>Chúng tôi luôn sẵn lòng lắng nghe bạn. Vui lòng chọn một trong các phương thức dưới đây để kết nối với chúng tôi.</p>
			</div>

			<div className={styles.mainContent}>
				<div className={styles.contactInfo}>
					<div className={styles.infoItem}>
						<MapPin className={styles.icon} size={20} />
						<div>
							<strong>Địa chỉ:</strong>
							<p>167 Tây Sơn, Trung Liệt, Đống Đa, Hà Nội</p>
						</div>
					</div>
					<div className={styles.infoItem}>
						<Phone className={styles.icon} size={20} />
						<div>
							<strong>Hotline:</strong>
							<a href='tel:0398162589' className={styles.link}>
								0398162589
							</a>
						</div>
					</div>
					<div className={styles.infoItem}>
						<Mail className={styles.icon} size={20} />
						<div>
							<strong>Email:</strong>
							<a href='mailto:gianghoang150503@gmail.com' className={styles.link}>
								gianghoang150503@gmail.com
							</a>
						</div>
					</div>
					<div className={styles.infoItem}>
						<Facebook className={styles.icon} size={20} />
						<div>
							<strong>Fanpage:</strong>
							<a
								href='https://www.facebook.com/profile.php?id=61567661477939&locale=vi_VN'
								className={styles.link}
								target='_blank'
								rel='noopener noreferrer'
							>
								TCSPorts - Thời trang thể thao
							</a>
						</div>
					</div>
					<div className={styles.infoItem}>
						<Clock className={styles.icon} size={20} />
						<div>
							<strong>Giờ làm việc:</strong>
							<p>Thứ 2 - Thứ 7: 08:00 - 21:00</p>
						</div>
					</div>
				</div>

				<div className={styles.contactForm}>
					<h2>Gửi tin nhắn cho chúng tôi</h2>
					<p>Điền vào form dưới đây và chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.</p>
					<form onSubmit={handleSubmit}>
						<div className={styles.formGroup}>
							<label htmlFor='name'>Họ và tên *</label>
							<input
								type='text'
								id='name'
								name='name'
								value={formData.name}
								onChange={handleChange}
								readOnly={!!user}
								className={user ? styles.readOnlyInput : ''}
							/>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor='email'>Email *</label>
							<input
								type='email'
								id='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								readOnly={!!user}
								className={user ? styles.readOnlyInput : ''}
							/>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor='phone'>Số điện thoại</label>
							<input
								type='tel'
								id='phone'
								name='phone'
								value={formData.phone}
								onChange={handleChange}
								readOnly={!!(user && user.phone)}
								className={user && user.phone ? styles.readOnlyInput : ''}
							/>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor='subject'>Chủ đề *</label>
							<select id='subject' name='subject' value={formData.subject} onChange={handleChange} required>
								<option>Hỗ trợ đơn hàng</option>
								<option>Tư vấn sản phẩm</option>
								<option>Góp ý & Khiếu nại</option>
								<option>Khác</option>
							</select>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor='message'>Nội dung tin nhắn *</label>
							<textarea id='message' name='message' rows='6' value={formData.message} onChange={handleChange}></textarea>
						</div>

						{/* Upload */}
						<div className={styles.formGroup}>
							<label>Đính kèm ảnh (tối đa 6 ảnh)</label>
							<div className={styles.uploadContainer}>
								<input
									type='file'
									id='fileUpload'
									multiple
									accept='image/*'
									onChange={handleFileChange}
									style={{display: 'none'}}
								/>
								<label htmlFor='fileUpload' className={styles.uploadButton}>
									<Upload size={18} /> Chọn ảnh
								</label>
							</div>
							<div className={styles.previewContainer}>
								{previews.map((preview, index) => (
									<div key={index} className={styles.previewItem}>
										<img src={preview} alt={`Preview ${index}`} />
										<button type='button' onClick={() => removeFile(index)} className={styles.removeButton}>
											<X size={14} />
										</button>
									</div>
								))}
							</div>
						</div>
						<Button type='submit' className={styles.submitButton} disabled={isLoading}>
							{isLoading ? 'Đang gửi...' : 'Gửi tin nhắn'}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Contact;
