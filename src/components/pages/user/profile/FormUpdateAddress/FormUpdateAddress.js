import React, {useEffect, useMemo, useState} from 'react';
import styles from './FormUpdateAddress.module.scss';
import Button from '@/components/common/Button/Button';
import icons from '@/constants/static/icons';
import useFormValidation from '@/hooks/useFormValidation';
import Select from 'react-select';
import Image from 'next/image';
import {getProvinces, getDistricts, getWards} from '@/services/locationService';
import {toast} from 'react-toastify';
import {updateAddress} from '@/services/userAddressService';

const FormUpdateAddress = ({onClose, existingData, onAddressUpdated}) => {
	const validationRules = useMemo(
		() => ({
			name: {required: true},
			phone: {
				required: true,
				custom: (value) => /^(0|\+84)[0-9]{9,10}$/.test(value),
				message: 'Số điện thoại không hợp lệ.',
			},
			address: {required: true},
		}),
		[]
	);

	const {formData, handleChange, isFormValid} = useFormValidation({name: '', phone: '', address: ''}, validationRules);
	const [loading, setLoading] = useState(false);

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

	// Lấy danh sách tỉnh
	useEffect(() => {
		const fetchProvinces = async () => {
			try {
				const data = await getProvinces();
				const options = data.map((item) => ({value: item._id, label: item.name}));
				setProvinces(options);

				if (existingData) {
					const provinceOption = options.find((p) => p.label === existingData.province.name);
					if (provinceOption) setSelectedProvince(provinceOption);
				}
			} catch (error) {
				toast.error('Không thể tải danh sách tỉnh/thành');
			}
		};
		fetchProvinces();
	}, [existingData]);

	// Lấy quận huyện khi chọn tỉnh
	useEffect(() => {
		const fetchDistricts = async () => {
			if (selectedProvince) {
				try {
					const data = await getDistricts(selectedProvince.value);
					const options = data.map((item) => ({value: item._id, label: item.name}));
					setDistricts(options);

					if (existingData && existingData.district) {
						const districtOption = options.find((d) => d.label === existingData.district.name);
						if (districtOption) setSelectedDistrict(districtOption);
					} else {
						setSelectedDistrict(null);
					}
					setWards([]);
					setSelectedWard(null);
				} catch (error) {
					toast.error('Không thể tải danh sách quận/huyện');
				}
			}
		};
		fetchDistricts();
	}, [selectedProvince]);

	// Lấy phường xã khi chọn quận
	useEffect(() => {
		const fetchWards = async () => {
			if (selectedDistrict) {
				try {
					const data = await getWards(selectedDistrict.value);
					const options = data.map((item) => ({value: item._id, label: item.name}));
					setWards(options);

					if (existingData && existingData.ward) {
						const wardOption = options.find((w) => w.label === existingData.ward.name);
						if (wardOption) setSelectedWard(wardOption);
					} else {
						setSelectedWard(null);
					}
				} catch (error) {
					toast.error('Không thể tải danh sách phường/xã');
				}
			}
		};
		fetchWards();
	}, [selectedDistrict]);

	// Set form dữ liệu ban đầu
	useEffect(() => {
		if (existingData) {
			handleChange({target: {name: 'name', value: existingData.name}});
			handleChange({target: {name: 'phone', value: existingData.phone}});
			handleChange({target: {name: 'address', value: existingData.address}});
		}
	}, [existingData]);

	const handleInputChange = (e, setError) => {
		handleChange(e);
		if (e.target.value) setError('');
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

	const handleSubmit = async (e) => {
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
		if (!formData.address) {
			setDetailError('Vui lòng nhập địa chỉ chi tiết');
			valid = false;
		}

		const selectsValid = validateSelects();

		if (!(valid && selectsValid)) return;

		setLoading(true);

		const fullAddress = {
			...formData,
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
		};

		try {
			const updatedAddress = await updateAddress(existingData._id, fullAddress);
			toast.success('Cập nhật địa chỉ thành công!');
			onAddressUpdated?.(updatedAddress);
			onClose();
		} catch (error) {
			toast.error(error.message || 'Cập nhật địa chỉ thất bại!');
		} finally {
			setLoading(false);
		}
	};

	const isSubmitDisabled = !isFormValid || !selectedProvince || !selectedDistrict || !selectedWard;

	return (
		<div className={styles.overlay}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<h2 className={styles.title}>Cập nhật địa chỉ</h2>
					<button type='button' className={styles.closeButton} onClick={onClose}>
						&times;
					</button>
				</div>

				{/* Tên */}
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

				{/* SĐT */}
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

				{/* Chọn tỉnh */}
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

				{/* Chọn quận */}
				<div className={styles.formGroup}>
					<label className={styles.label}>
						Quận / Huyện <span style={{color: 'red'}}>*</span>
					</label>
					<Select
						className={styles.formSelect}
						options={districts}
						value={selectedDistrict}
						onChange={setSelectedDistrict}
						isDisabled={!selectedProvince}
						placeholder='Tìm quận / huyện...'
					/>
					{selectErrors.district && <p className={styles.error}>{selectErrors.district}</p>}
				</div>

				{/* Chọn xã */}
				<div className={styles.formGroup}>
					<label className={styles.label}>
						Xã / Phường <span style={{color: 'red'}}>*</span>
					</label>
					<Select
						className={styles.formSelect}
						options={wards}
						value={selectedWard}
						onChange={setSelectedWard}
						isDisabled={!selectedDistrict}
						placeholder='Tìm xã / phường...'
					/>
					{selectErrors.ward && <p className={styles.error}>{selectErrors.ward}</p>}
				</div>

				{/* Địa chỉ chi tiết */}
				<div className={styles.formGroup}>
					<label className={styles.label}>
						Địa chỉ chi tiết <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='text'
						name='address'
						value={formData.address}
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
						leftIcon={<Image src={icons.folderOpen.src} alt='Cập nhật' width={20} height={20} className={styles.icon} />}
						className={styles.submitButton}
						disabled={isSubmitDisabled || loading}
					>
						Cập nhật
					</Button>
				</div>
			</form>
		</div>
	);
};

export default FormUpdateAddress;
