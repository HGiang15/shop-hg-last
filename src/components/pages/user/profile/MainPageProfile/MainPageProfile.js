import React, {useState, useMemo, useEffect} from 'react';
import styles from './MainPageProfile.module.scss';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import images from '@/constants/static/images';
import useFormValidation from '@/hooks/useFormValidation';
import Button from '@/components/common/Button/Button';
import {getCurrentUser, updateUser} from '@/services/authService';
import {toast} from 'react-toastify';
import {uploadSingle} from '@/services/uploadService';

function MainPageProfile() {
	const validationRules = useMemo(
		() => ({
			name: {required: true},
			phone: {required: true},
			dateOfBirth: {required: true},
		}),
		[]
	);

	const {formData, handleChange, isFormValid, setFormData} = useFormValidation(
		{name: '', email: '', phone: '', dateOfBirth: ''},
		validationRules
	);

	const [userId, setUserId] = useState(null);
	const [gender, setGender] = useState('Other');
	const [avatar, setAvatar] = useState(null);
	const [avatarFile, setAvatarFile] = useState(null);

	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [dobError, setDobError] = useState('');

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const user = await getCurrentUser();
				setUserId(user.id);
				setFormData({
					name: user.name || '',
					email: user.email || '',
					phone: user.phone || '',
					dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
				});
				setGender(user.gender || 'Other');
				setAvatar(user.avatar || null);
			} catch (error) {
				console.error('Lỗi khi lấy thông tin người dùng:', error.message);
			}
		};
		fetchUserData();
	}, [setFormData]);

	const handleAvatarChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setAvatarFile(file);
			setAvatar(URL.createObjectURL(file));
		}
	};

	const handleInputChange = (e, setInputError) => {
		handleChange(e);
		if (e.target.value) setInputError('');
	};

	const handleBlur = (e, setInputError) => {
		if (!e.target.value) setInputError('Vui lòng nhập trường này');
	};

	const handleClearInput = (inputName) => {
		setFormData({...formData, [inputName]: ''});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!isFormValid) {
			if (!formData.name) setNameError('Vui lòng nhập họ và tên');
			if (!formData.email) setEmailError('Vui lòng nhập email');
			if (!formData.phone) setPhoneError('Vui lòng nhập số điện thoại');
			if (!formData.dateOfBirth) setDobError('Vui lòng nhập ngày sinh');
			return;
		}

		try {
			let avatarUrl = null;

			if (avatarFile) {
				const formUpload = new FormData();
				formUpload.append('file', avatarFile);

				const upload = await uploadSingle(formUpload);

				if (upload?.data) {
					const realUrl = upload.data;
					avatarUrl = realUrl;
					setAvatar(realUrl);
				} else {
					throw new Error('Upload ảnh thất bại');
				}
			} else {
				avatarUrl = avatar; // ảnh cũ
			}

			await updateUser(userId, {
				name: formData.name,
				email: formData.email,
				phone: formData.phone,
				dateOfBirth: formData.dateOfBirth,
				gender,
				avatar: avatarUrl,
			});

			toast.success('Cập nhật thành công');
		} catch (error) {
			console.error('Lỗi khi cập nhật:', error);
			toast.error('Cập nhật thất bại');
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Thông tin cá nhân</h2>

			<div className={styles.avatarSection}>
				<div className={styles.avatarPreview}>
					{avatar ? (
						<Image src={avatar} alt='Avatar' width={150} height={150} />
					) : (
						<div className={styles.avatarPlaceholder}>
							<Image src={images.noImg} alt='Placeholder' width={80} height={80} />
						</div>
					)}
				</div>
				<div className={styles.avatarUpload}>
					<p>Hình ảnh tải lên đạt kích thước tối thiểu 300pixel x 300pixel</p>
					<p>Định dạng hỗ trợ JPG, JPEG, PNG</p>
					<label htmlFor='avatarInput' className={styles.uploadButton}>
						<Image src={icons.download} alt='Download' width={20} height={20} className={styles.downloadIcon} />
						Chọn ảnh
					</label>
					<input type='file' id='avatarInput' accept='image/*' onChange={handleAvatarChange} style={{display: 'none'}} />
				</div>
			</div>

			<form onSubmit={handleSubmit} className={styles.formGrid} noValidate>
				<div className={styles.formGroup}>
					<label htmlFor='name'>
						Họ và tên <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='text'
						id='name'
						value={formData.name}
						onChange={(e) => handleInputChange(e, setNameError)}
						name='name'
						onBlur={(e) => handleBlur(e, setNameError)}
					/>
					{nameError && <p className={styles.error}>{nameError}</p>}
					<span className={styles.validationIcon}>
						{formData.name && (
							<>
								<Image
									src={icons.timesCircle}
									alt='Times Circle'
									width={20}
									height={20}
									onClick={() => handleClearInput('name')}
									style={{cursor: 'pointer'}}
								/>
								<Image src={icons.check} alt='Check' width={20} height={20} />
							</>
						)}
					</span>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='email'>
						Email <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='email'
						id='email'
						value={formData.email}
						onChange={(e) => handleInputChange(e, setEmailError)}
						name='email'
						onBlur={(e) => handleBlur(e, setEmailError)}
						disabled
					/>
					{emailError && <p className={styles.error}>{emailError}</p>}
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='phone'>
						Số điện thoại <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='tel'
						id='phone'
						value={formData.phone}
						onChange={(e) => handleInputChange(e, setPhoneError)}
						name='phone'
						onBlur={(e) => handleBlur(e, setPhoneError)}
					/>
					{phoneError && <p className={styles.error}>{phoneError}</p>}
					<span className={styles.validationIcon}>
						{formData.phone && (
							<>
								<Image
									src={icons.timesCircle}
									alt='Times Circle'
									width={20}
									height={20}
									onClick={() => handleClearInput('phone')}
									style={{cursor: 'pointer'}}
								/>
								<Image src={icons.check} alt='Check' width={20} height={20} />
							</>
						)}
					</span>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='dateOfBirth'>
						Ngày sinh <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='date'
						id='dateOfBirth'
						value={formData.dateOfBirth}
						onChange={handleChange}
						name='dateOfBirth'
						onBlur={(e) => handleBlur(e, setDobError)}
					/>
					{dobError && <p className={styles.error}>{dobError}</p>}
				</div>

				<div className={styles.formGroup}>
					<label>
						Giới tính <span style={{color: 'red'}}>*</span>
					</label>
					<div className={styles.radioGroup}>
						<label>
							<input type='radio' value='Male' checked={gender === 'Male'} onChange={() => setGender('Male')} />
							Nam
						</label>
						<label>
							<input type='radio' value='Female' checked={gender === 'Female'} onChange={() => setGender('Female')} />
							Nữ
						</label>
						<label>
							<input type='radio' value='Other' checked={gender === 'Other'} onChange={() => setGender('Other')} />
							Khác
						</label>
					</div>
				</div>

				<div className={styles.submitButtonContainer}>
					<Button type='submit' className={styles.submitButton} disabled={!isFormValid}>
						Cập nhật thông tin cá nhân
					</Button>
				</div>
			</form>
		</div>
	);
}

export default MainPageProfile;
