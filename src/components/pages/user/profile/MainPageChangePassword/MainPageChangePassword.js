import React, {useEffect, useMemo, useState} from 'react';
import styles from './MainPageChangePassword.module.scss';
import icons from '@/constants/static/icons';
import Image from 'next/image';
import Button from '@/components/common/Button/Button';
import useFormValidation from '@/hooks/useFormValidation';
import {changePassword} from '@/services/authService';
import {toast} from 'react-toastify';
import {ROUTES} from '@/constants/config';
import {useRouter} from 'next/router';

const MainPageChangePassword = () => {
	const router = useRouter();

	const validationRules = useMemo(
		() => ({
			oldPassword: {required: true},
			newPassword: {required: true, minLength: 1},
			confirmNewPassword: {required: true, isEqual: 'newPassword'},
		}),
		[]
	);

	const {formData, handleChange, isFormValid} = useFormValidation(
		{oldPassword: '', newPassword: '', confirmNewPassword: ''},
		validationRules
	);

	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!isFormValid) {
			console.log('Form is invalid');
			return;
		}

		try {
			const res = await changePassword(formData.oldPassword, formData.newPassword);
			router.push(ROUTES.Profile);
			toast.success(res.message || 'Đổi mật khẩu thành công!');
		} catch (error) {
			toast.error(error.message || 'Đổi mật khẩu thất bại!');
		}
	};

	return (
		<form className={styles.formGroup} onSubmit={handleSubmit}>
			<h2 className={styles.title}>Thay đổi mật khẩu</h2>

			<div className={styles.inputGroup}>
				<label htmlFor='oldPassword' className={styles.label}>
					Mật khẩu cũ<span style={{color: 'red'}}>*</span>
				</label>
				<div className={styles.inputWrapper}>
					<input
						name='oldPassword'
						type={showOldPassword ? 'text' : 'password'}
						id='oldPassword'
						className={styles.input}
						value={formData.oldPassword}
						onChange={handleChange}
					/>
					<button type='button' className={styles.togglePassword} onClick={() => setShowOldPassword(!showOldPassword)}>
						<Image
							src={showOldPassword ? icons.eyeOpen : icons.eyeClose}
							alt={showOldPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
							width={20}
							height={20}
							className={styles.eyeIcon}
						/>
					</button>
				</div>
			</div>

			<div className={styles.inputGroup}>
				<label htmlFor='newPassword' className={styles.label}>
					Mật khẩu mới<span style={{color: 'red'}}>*</span>
				</label>
				<div className={styles.inputWrapper}>
					<input
						name='newPassword'
						type={showNewPassword ? 'text' : 'password'}
						id='newPassword'
						className={styles.input}
						value={formData.newPassword}
						onChange={handleChange}
					/>
					<button type='button' className={styles.togglePassword} onClick={() => setShowNewPassword(!showNewPassword)}>
						<Image
							src={showNewPassword ? icons.eyeOpen : icons.eyeClose}
							alt={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
							width={20}
							height={20}
							className={styles.eyeIcon}
						/>
					</button>
				</div>
			</div>

			<div className={styles.inputGroup}>
				<label htmlFor='confirmNewPassword' className={styles.label}>
					Xác nhận mật khẩu mới<span style={{color: 'red'}}>*</span>
				</label>
				<div className={styles.inputWrapper}>
					<input
						name='confirmNewPassword'
						type={showConfirmNewPassword ? 'text' : 'password'}
						id='confirmNewPassword'
						className={styles.input}
						value={formData.confirmNewPassword}
						onChange={handleChange}
					/>
					<button
						type='button'
						className={styles.togglePassword}
						onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
					>
						<Image
							src={showConfirmNewPassword ? icons.eyeOpen : icons.eyeClose}
							alt={showConfirmNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
							width={20}
							height={20}
							className={styles.eyeIcon}
						/>
					</button>
				</div>
			</div>

			<div className={styles.groupBtn}>
				<Button type='submit' className={styles.submitButton} onClick={handleSubmit} disabled={!isFormValid}>
					Thay đổi mật khẩu
				</Button>
			</div>
		</form>
	);
};

export default MainPageChangePassword;
