import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import styles from './FormCreateAddress.module.scss';
import Button from '@/components/common/Button/Button';
import icons from '@/constants/static/icons';
import Select from 'react-select';

const FormCreateAddress = ({onClose}) => {
	const [formData, setFormData] = useState({
		fullName: '',
		phone: '',
		detail: '',
	});

	const [provinces, setProvinces] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [wards, setWards] = useState([]);

	const [selectedProvince, setSelectedProvince] = useState(null);
	const [selectedDistrict, setSelectedDistrict] = useState(null);
	const [selectedWard, setSelectedWard] = useState(null);

	const [errors, setErrors] = useState({});

	useEffect(() => {
		fetch('https://provinces.open-api.vn/api/?depth=1')
			.then((res) => res.json())
			.then((data) => setProvinces(data.map((item) => ({value: item.code, label: item.name}))));
	}, []);

	useEffect(() => {
		if (selectedProvince) {
			fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.value}?depth=2`)
				.then((res) => res.json())
				.then((data) => setDistricts(data.districts.map((d) => ({value: d.code, label: d.name}))));
			setSelectedDistrict(null);
			setSelectedWard(null);
			setWards([]);
		}
	}, [selectedProvince]);

	useEffect(() => {
		if (selectedDistrict) {
			fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.value}?depth=2`)
				.then((res) => res.json())
				.then((data) => setWards(data.wards.map((w) => ({value: w.code, label: w.name}))));
			setSelectedWard(null);
		}
	}, [selectedDistrict]);

	const handleInputChange = (e) => {
		const {name, value} = e.target;
		setFormData({...formData, [name]: value});
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập tên người nhận.';
		if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại.';
		else if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ.';
		if (!selectedProvince) newErrors.province = 'Vui lòng chọn tỉnh / thành phố.';
		if (!selectedDistrict) newErrors.district = 'Vui lòng chọn quận / huyện.';
		if (!selectedWard) newErrors.ward = 'Vui lòng chọn xã / phường.';
		if (!formData.detail.trim()) newErrors.detail = 'Vui lòng nhập địa chỉ chi tiết.';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			const fullAddress = {
				...formData,
				province: selectedProvince.label,
				district: selectedDistrict.label,
				ward: selectedWard.label,
			};
			console.log('✅ Submitted:', fullAddress);
			// Gửi API tại đây nếu cần

			onClose();
		}
	};

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
						className={styles.formInput}
						type='text'
						name='fullName'
						value={formData.fullName}
						onChange={handleInputChange}
						placeholder='Tên người nhận'
					/>
					{errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>
						Số điện thoại <span style={{color: 'red'}}>*</span>
					</label>
					<input
						className={styles.formInput}
						type='text'
						name='phone'
						value={formData.phone}
						onChange={handleInputChange}
						placeholder='Số điện thoại'
					/>
					{errors.phone && <span className={styles.error}>{errors.phone}</span>}
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
					{errors.province && <span className={styles.error}>{errors.province}</span>}
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
					{errors.district && <span className={styles.error}>{errors.district}</span>}
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
					{errors.ward && <span className={styles.error}>{errors.ward}</span>}
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>
						Địa chỉ chi tiết <span style={{color: 'red'}}>*</span>
					</label>
					<input
						className={styles.formInput}
						type='text'
						name='detail'
						value={formData.detail}
						onChange={handleInputChange}
						placeholder='Nhập địa chỉ chi tiết'
					/>
					{errors.detail && <span className={styles.error}>{errors.detail}</span>}
				</div>

				<div className={styles.actions}>
					<Button className={styles.cancelButton} onClick={onClose}>
						Hủy bỏ
					</Button>
					<Button
						type='submit'
						leftIcon={<img src={icons.folderOpen.src} alt='Thêm' width={20} height={20} className={styles.icon} />}
						className={styles.submitButton}
					>
						Cập nhật
					</Button>
				</div>
			</form>
		</div>
	);
};

export default FormCreateAddress;
