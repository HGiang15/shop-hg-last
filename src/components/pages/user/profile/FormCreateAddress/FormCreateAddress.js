import React, {useEffect, useMemo, useState} from 'react';
import styles from './FormCreateAddress.module.scss';
import Button from '@/components/common/Button/Button';
import icons from '@/constants/static/icons';
import Select from 'react-select';
import useFormValidation from '@/hooks/useFormValidation';

const FormCreateAddress = ({onClose}) => {
	const validationRules = useMemo(
		() => ({
			name: {required: true},
			phone: {
				required: true,
				custom: (value) => /^(0|\+84)[0-9]{9,10}$/.test(value),
				message: 'Số điện thoại không hợp lệ.',
			},
			detail: {required: true},
		}),
		[]
	);

	const {formData, handleChange, isFormValid} = useFormValidation({name: '', phone: '', detail: ''}, validationRules);

	const [nameError, setNameError] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [detailError, setDetailError] = useState('');

	const [provinces, setProvinces] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [wards, setWards] = useState([]);

	const [selectedProvince, setSelectedProvince] = useState(null);
	const [selectedDistrict, setSelectedDistrict] = useState(null);
	const [selectedWard, setSelectedWard] = useState(null);

	const [selectErrors, setSelectErrors] = useState({});

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

	const handleInputChange = (e, setError) => {
		handleChange(e);
		if (e.target.value) {
			setError('');
		}
	};

	const handleBlur = (e, setError) => {
		const {name, value} = e.target;
		if (!value) {
			setError('Vui lòng nhập trường này');
		} else if (validationRules[name]?.custom && !validationRules[name].custom(value)) {
			setError(validationRules[name].message || 'Dữ liệu không hợp lệ');
		}
	};

	const validateSelects = () => {
		const newErrors = {};
		if (!selectedProvince) newErrors.province = 'Vui lòng chọn tỉnh / thành phố.';
		if (!selectedDistrict) newErrors.district = 'Vui lòng chọn quận / huyện.';
		if (!selectedWard) newErrors.ward = 'Vui lòng chọn xã / phường.';
		setSelectErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		let valid = true;
		if (!formData.name) {
			setNameError('Vui lòng nhập tên người nhận');
			valid = false;
		}
		if (!formData.phone) {
			setPhoneError('Vui lòng nhập số điện thoại');
			valid = false;
		} else if (!validationRules.phone.custom(formData.phone)) {
			setPhoneError(validationRules.phone.message);
			valid = false;
		}
		if (!formData.detail) {
			setDetailError('Vui lòng nhập địa chỉ chi tiết');
			valid = false;
		}

		const selectsValid = validateSelects();
		if (valid && selectsValid) {
			const fullAddress = {
				...formData,
				province: selectedProvince.label,
				district: selectedDistrict.label,
				ward: selectedWard.label,
			};
			console.log('✅ Submitted:', fullAddress);
			onClose();
		}
	};

	const isSubmitDisabled = !isFormValid || !selectedProvince || !selectedDistrict || !selectedWard;

	return (
		<div className={styles.overlay} onClick={onClose}>
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
						value={formData.name}
						onChange={(e) => handleInputChange(e, setNameError)}
						onBlur={(e) => handleBlur(e, setNameError)}
						placeholder='Tên người nhận'
						className={styles.formInput}
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
						value={formData.phone}
						onChange={(e) => handleInputChange(e, setPhoneError)}
						onBlur={(e) => handleBlur(e, setPhoneError)}
						placeholder='Số điện thoại'
						className={styles.formInput}
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
						name='detail'
						value={formData.detail}
						onChange={(e) => handleInputChange(e, setDetailError)}
						onBlur={(e) => handleBlur(e, setDetailError)}
						placeholder='Nhập địa chỉ chi tiết'
						className={styles.formInput}
					/>
					{detailError && <p className={styles.error}>{detailError}</p>}
				</div>

				<div className={styles.actions}>
					<Button className={styles.cancelButton} onClick={onClose}>
						Hủy bỏ
					</Button>
					<Button
						type='submit'
						leftIcon={<img src={icons.folderOpen.src} alt='Thêm' width={20} height={20} className={styles.icon} />}
						className={styles.submitButton}
						disabled={isSubmitDisabled}
					>
						Cập nhật
					</Button>
				</div>
			</form>
		</div>
	);
};

export default FormCreateAddress;
