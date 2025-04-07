import React, {useState} from 'react';
import styles from './MainPageProfile.module.scss';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import images from '@/constants/static/images';
import useFormValidation from '@/hooks/useFormValidation';
import Button from '@/components/common/Button/Button';

const MainPageProfile = () => {
	const validationRules = {
		name: {required: true},
		email: {required: true},
		phone: {required: true},
		dob: {required: true},
	};

	const {formData, handleChange, isFormValid, setFormData} = useFormValidation(
		{name: '', email: '', phone: '', dob: ''},
		validationRules
	);

	const [gender, setGender] = useState('Nam');
	const [avatar, setAvatar] = useState(null);

	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [dobError, setDobError] = useState('');

	const handleAvatarChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setAvatar(URL.createObjectURL(e.target.files[0]));
		}
	};

	const handleInputChange = (e, setInputError) => {
		handleChange(e);
		if (e.target.value) {
			setInputError('');
		}
	};

	const handleBlur = (e, setInputError) => {
		if (!e.target.value) {
			setInputError('Vui lòng nhập trường này');
		}
	};

	const handleClearInput = (inputName) => {
		setFormData({...formData, [inputName]: ''});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isFormValid) {
			console.log({...formData, gender, avatar});
			// Gọi API cập nhật thông tin cá nhân ở đây
		} else {
			console.log('Form không hợp lệ');
			if (!formData.name) setNameError('Vui lòng nhập họ và tên');
			if (!formData.email) setEmailError('Vui lòng nhập email');
			if (!formData.phone) setPhoneError('Vui lòng nhập số điện thoại');
			if (!formData.dob) setDobError('Vui lòng nhập ngày sinh');
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

			<form onSubmit={handleSubmit} className={styles.formGrid}>
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
					/>
					{emailError && <p className={styles.error}>{emailError}</p>}
					<span className={styles.validationIcon}>
						{formData.email && (
							<>
								<Image
									src={icons.timesCircle}
									alt='Times Circle'
									width={20}
									height={20}
									onClick={() => handleClearInput('email')}
								/>
								<Image src={icons.check} alt='Check' width={20} height={20} />
							</>
						)}
					</span>
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
								/>
								<Image src={icons.check} alt='Check' width={20} height={20} />
							</>
						)}
					</span>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='dob'>
						Ngày sinh <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='date'
						id='dob'
						value={formData.dob}
						onChange={handleChange}
						name='dob'
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
							<input type='radio' value='Nam' checked={gender === 'Nam'} onChange={() => setGender('Nam')} />
							Nam
						</label>
						<label>
							<input type='radio' value='Nữ' checked={gender === 'Nữ'} onChange={() => setGender('Nữ')} />
							Nữ
						</label>
						<label>
							<input type='radio' value='Khác' checked={gender === 'Khác'} onChange={() => setGender('Khác')} />
							Khác
						</label>
					</div>
				</div>

				<div className={styles.submitButtonContainer}>
					<Button type='submit' className={styles.submitButton} onClick={handleSubmit} disabled={!isFormValid}>
						Cập nhật thông tin cá nhân
					</Button>
				</div>
			</form>
		</div>
	);
};

export default MainPageProfile;
