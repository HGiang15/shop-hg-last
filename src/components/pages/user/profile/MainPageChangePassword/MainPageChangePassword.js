import React, {useState} from 'react';
import styles from './MainPageChangePassword.module.scss';
import icons from '@/constants/static/icons';
import Image from 'next/image';

const MainPageChangePassword = () => {
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

	return (
		<div className={styles.changePasswordContainer}>
			<h2 className={styles.title}>Thay đổi mật khẩu</h2>

			<div className={styles.inputGroup}>
				<label htmlFor='oldPassword' className={styles.label}>
					Mật khẩu cũ<span style={{color: 'red'}}>*</span>
				</label>
				<div className={styles.inputWrapper}>
					<input type={showOldPassword ? 'text' : 'password'} id='oldPassword' className={styles.input} />
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
					<input type={showNewPassword ? 'text' : 'password'} id='newPassword' className={styles.input} />
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
					<input type={showConfirmNewPassword ? 'text' : 'password'} id='confirmNewPassword' className={styles.input} />
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
				<button type='submit' className={styles.submitButton}>
					Thay đổi mật khẩu
				</button>
			</div>
		</div>
	);
};

export default MainPageChangePassword;
