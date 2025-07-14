import React, {useState, useMemo, useEffect} from 'react';
import styles from './MainPageProfileAdmin.module.scss';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import images from '@/constants/static/images';
import useFormValidation from '@/hooks/useFormValidation';
import Button from '@/components/common/Button/Button';
import {getCurrentUser, updateUser} from '@/services/authService';
import {toast} from 'react-toastify';
import {uploadSingle} from '@/services/uploadService';
import {setActiveMenu} from '@/redux/actions/menuTabActions';
import {ROUTES} from '@/constants/config';
import {connect} from 'react-redux';

const MainPageProfileAdmin = ({setActiveMenu}) => {
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
		setActiveMenu(ROUTES.AdminProfile);
	}, []);

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
			let avatarUrl = avatar;

			if (avatarFile) {
				const formUpload = new FormData();
				formUpload.append('file', avatarFile);

				const upload = await uploadSingle(formUpload);
				if (upload?.data) {
					avatarUrl = upload.data;
					setAvatar(upload.data);
				} else {
					throw new Error('Upload ảnh thất bại');
				}
			}

			await updateUser(userId, {
				...formData,
				gender,
				avatar: avatarUrl,
			});

			toast.success('Cập nhật thông tin thành công');
		} catch (error) {
			console.error('Lỗi khi cập nhật:', error);
			toast.error('Cập nhật thất bại');
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Thông tin quản trị viên</h2>

			<div className={styles.avatarSection}>
				<div className={styles.avatarPreview}>
					{avatar ? (
						<Image src={avatar} alt='Avatar' width={150} height={150} />
					) : (
						<div className={styles.avatarPlaceholder}>
							<Image src={images.noImg} alt='No Avatar' width={80} height={80} />
						</div>
					)}
				</div>
				<div className={styles.avatarUpload}>
					<p>Kích thước tối thiểu: 300x300px. Hỗ trợ JPG, JPEG, PNG.</p>
					<label htmlFor='avatarInput' className={styles.uploadButton}>
						<Image src={icons.download} alt='Upload' width={20} height={20} />
						Chọn ảnh
					</label>
					<input type='file' id='avatarInput' accept='image/*' onChange={handleAvatarChange} style={{display: 'none'}} />
				</div>
			</div>

			<form onSubmit={handleSubmit} className={styles.formGrid} noValidate>
				{/* Tên */}
				<div className={styles.formGroup}>
					<label>
						Họ và tên <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='text'
						name='name'
						value={formData.name}
						onChange={(e) => handleInputChange(e, setNameError)}
						onBlur={(e) => handleBlur(e, setNameError)}
					/>
					{nameError && <p className={styles.error}>{nameError}</p>}
				</div>

				{/* Email */}
				<div className={styles.formGroup}>
					<label>
						Email <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='email'
						name='email'
						value={formData.email}
						onChange={(e) => handleInputChange(e, setEmailError)}
						onBlur={(e) => handleBlur(e, setEmailError)}
						disabled
					/>
					{emailError && <p className={styles.error}>{emailError}</p>}
				</div>

				{/* Điện thoại */}
				<div className={styles.formGroup}>
					<label>
						Số điện thoại <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='tel'
						name='phone'
						value={formData.phone}
						onChange={(e) => handleInputChange(e, setPhoneError)}
						onBlur={(e) => handleBlur(e, setPhoneError)}
					/>
					{phoneError && <p className={styles.error}>{phoneError}</p>}
				</div>

				{/* Ngày sinh */}
				<div className={styles.formGroup}>
					<label>
						Ngày sinh <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='date'
						name='dateOfBirth'
						value={formData.dateOfBirth}
						onChange={handleChange}
						onBlur={(e) => handleBlur(e, setDobError)}
					/>
					{dobError && <p className={styles.error}>{dobError}</p>}
				</div>

				{/* Giới tính */}
				<div className={styles.formGroup}>
					<label>
						Giới tính <span style={{color: 'red'}}>*</span>
					</label>
					<div className={styles.radioGroup}>
						<label>
							<input type='radio' value='Male' checked={gender === 'Male'} onChange={() => setGender('Male')} /> Nam
						</label>
						<label>
							<input type='radio' value='Female' checked={gender === 'Female'} onChange={() => setGender('Female')} /> Nữ
						</label>
						<label>
							<input type='radio' value='Other' checked={gender === 'Other'} onChange={() => setGender('Other')} /> Khác
						</label>
					</div>
				</div>

				<div className={styles.submitButtonContainer}>
					<Button type='submit' className={styles.submitButton} disabled={!isFormValid}>
						Cập nhật thông tin
					</Button>
				</div>
			</form>
		</div>
	);
};

// export default MainPageProfileAdmin;

const mapDispatchToProps = (dispatch) => ({
	setActiveMenu: (menuPath) => dispatch(setActiveMenu(menuPath)),
});

export default connect(null, mapDispatchToProps)(MainPageProfileAdmin);
