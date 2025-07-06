import React, {useEffect, useState} from 'react';
import styles from './FormCreateAddress.module.scss';
import Button from '@/components/common/Button/Button';
import icons from '@/constants/static/icons';
import Select from 'react-select';
import Image from 'next/image';
import {createAddress} from '@/services/userAddressService';
import {getProvinces, getDistricts, getWards} from '@/services/locationService';
import {jwtDecode} from 'jwt-decode';
import {toast} from 'react-toastify';

const FormCreateAddress = ({onClose, onAddressCreated}) => {
	const [userId, setUserId] = useState(null);
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');

	const [nameError, setNameError] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [addressError, setAddressError] = useState('');

	const [provinces, setProvinces] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [wards, setWards] = useState([]);

	const [selectedProvince, setSelectedProvince] = useState(null);
	const [selectedDistrict, setSelectedDistrict] = useState(null);
	const [selectedWard, setSelectedWard] = useState(null);

	const [selectErrors, setSelectErrors] = useState({});

	useEffect(() => {
		try {
			const token = localStorage.getItem('token');

			if (token) {
				const decoded = jwtDecode(token);
				if (decoded?.id) {
					setUserId(decoded.id);
				} else {
					console.warn('Không tìm thấy userId trong token');
				}
			}
		} catch (error) {
			console.log('Lỗi decode token:', error);
		}
	}, []);

	// Province
	useEffect(() => {
		const fetchProvinces = async () => {
			try {
				const data = await getProvinces();
				setProvinces(data.map((item) => ({value: item._id, label: item.name})));
			} catch (error) {
				alert(error.message || 'Không thể tải danh sách tỉnh/thành');
			}
		};
		fetchProvinces();
	}, []);

	// Districts
	useEffect(() => {
		const fetchDistricts = async () => {
			if (selectedProvince) {
				try {
					const data = await getDistricts(selectedProvince.value);
					setDistricts(data.map((item) => ({value: item._id, label: item.name})));
					setSelectedDistrict(null);
					setSelectedWard(null);
					setWards([]);
				} catch (error) {
					alert(error.message || 'Không thể tải danh sách quận/huyện');
				}
			} else {
				setDistricts([]);
				setSelectedDistrict(null);
				setWards([]);
				setSelectedWard(null);
			}
		};
		fetchDistricts();
	}, [selectedProvince]);

	// Ward
	useEffect(() => {
		const fetchWards = async () => {
			if (selectedDistrict) {
				try {
					const data = await getWards(selectedDistrict.value);
					setWards(data.map((item) => ({value: item._id, label: item.name})));
					setSelectedWard(null);
				} catch (error) {
					alert(error.message || 'Không thể tải danh sách phường/xã');
				}
			} else {
				setWards([]);
				setSelectedWard(null);
			}
		};
		fetchWards();
	}, [selectedDistrict]);

	const validatePhone = (phone) => /^(0|\+84)[0-9]{9,10}$/.test(phone);

	const validateSelects = () => {
		const newErrors = {};
		if (!selectedProvince) newErrors.province = 'Vui lòng chọn tỉnh / thành phố.';
		if (!selectedDistrict) newErrors.district = 'Vui lòng chọn quận / huyện.';
		if (!selectedWard) newErrors.ward = 'Vui lòng chọn xã / phường.';
		setSelectErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Create address
	const handleSubmit = async (e) => {
		e.preventDefault();

		let valid = true;

		if (!name.trim()) {
			setNameError('Vui lòng nhập tên người nhận');
			valid = false;
		} else {
			setNameError('');
		}

		if (!phone.trim()) {
			setPhoneError('Vui lòng nhập số điện thoại');
			valid = false;
		} else if (!validatePhone(phone.trim())) {
			setPhoneError('Số điện thoại không hợp lệ.');
			valid = false;
		} else {
			setPhoneError('');
		}

		if (!address.trim()) {
			setAddressError('Vui lòng nhập địa chỉ chi tiết');
			valid = false;
		} else {
			setAddressError('');
		}

		const selectsValid = validateSelects();

		if (valid && selectsValid) {
			const fullAddress = {
				name: name.trim(),
				phone: phone.trim(),
				address: address.trim(),
				province: {
					provinceId: selectedProvince.value,
					name: selectedProvince.label,
				},
				district: {
					districtId: selectedDistrict.value,
					name: selectedDistrict.label,
				},
				ward: {
					wardId: selectedWard.value,
					name: selectedWard.label,
				},
				userId,
			};

			try {
				await createAddress(fullAddress);
				toast.success('Thêm địa chỉ mới thành công!');
				onAddressCreated?.();
				onClose();
			} catch (error) {
				toast.error(error.message || 'Tạo địa chỉ thất bại!');
			}
		}
	};

	const isSubmitDisabled =
		!name.trim() ||
		!phone.trim() ||
		!address.trim() ||
		!validatePhone(phone) ||
		!selectedProvince ||
		!selectedDistrict ||
		!selectedWard;

	return (
		<div className={styles.overlay}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<h2 className={styles.title}>Thêm mới địa chỉ</h2>
					<button type='button' className={styles.closeButton} onClick={onClose}>
						&times;
					</button>
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>
						Tên người nhận <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='text'
						name='name'
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='Tên người nhận'
						className={styles.formInput}
						onBlur={() => {
							if (!name.trim()) setNameError('Vui lòng nhập tên người nhận');
							else setNameError('');
						}}
					/>
					{nameError && <p className={styles.error}>{nameError}</p>}
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>
						Số điện thoại <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='text'
						name='phone'
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						placeholder='Số điện thoại'
						className={styles.formInput}
						onBlur={() => {
							if (!phone.trim()) setPhoneError('Vui lòng nhập số điện thoại');
							else if (!validatePhone(phone.trim())) setPhoneError('Số điện thoại không hợp lệ.');
							else setPhoneError('');
						}}
					/>
					{phoneError && <p className={styles.error}>{phoneError}</p>}
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>
						Tỉnh / Thành phố <span style={{color: 'red'}}>*</span>
					</label>
					<Select
						className={styles.formSelect}
						options={provinces}
						value={selectedProvince}
						onChange={setSelectedProvince}
						placeholder='Tìm tỉnh / thành...'
					/>
					{selectErrors.province && <p className={styles.error}>{selectErrors.province}</p>}
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>
						Quận / Huyện <span style={{color: 'red'}}>*</span>
					</label>
					<Select
						className={styles.formSelect}
						options={districts}
						value={selectedDistrict}
						onChange={setSelectedDistrict}
						placeholder='Tìm quận / huyện...'
						isDisabled={!selectedProvince}
					/>
					{selectErrors.district && <p className={styles.error}>{selectErrors.district}</p>}
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>
						Xã / Phường <span style={{color: 'red'}}>*</span>
					</label>
					<Select
						className={styles.formSelect}
						options={wards}
						value={selectedWard}
						onChange={setSelectedWard}
						placeholder='Tìm xã / phường...'
						isDisabled={!selectedDistrict}
					/>
					{selectErrors.ward && <p className={styles.error}>{selectErrors.ward}</p>}
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>
						Địa chỉ chi tiết <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='text'
						name='address'
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						placeholder='Nhập địa chỉ chi tiết'
						className={styles.formInput}
						onBlur={() => {
							if (!address.trim()) setAddressError('Vui lòng nhập địa chỉ chi tiết');
							else setAddressError('');
						}}
					/>
					{addressError && <p className={styles.error}>{addressError}</p>}
				</div>

				<div className={styles.actions}>
					<Button className={styles.cancelButton} onClick={onClose}>
						Hủy bỏ
					</Button>
					<Button
						type='submit'
						leftIcon={<Image src={icons.folderOpen.src} alt='Thêm' width={20} height={20} className={styles.icon} />}
						className={styles.submitButton}
						disabled={isSubmitDisabled}
					>
						Lưu lại
					</Button>
				</div>
			</form>
		</div>
	);
};

export default FormCreateAddress;
