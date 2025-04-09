import {useState, useEffect} from 'react';

const useFormValidation = (initialState, validationRules) => {
	const [formData, setFormData] = useState(initialState);
	const [formErrors, setFormErrors] = useState({});
	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		const errors = {};

		Object.keys(validationRules).forEach((key) => {
			const value = formData[key] || '';
			const rules = validationRules[key];

			if (rules.required && !value.trim()) {
				errors[key] = 'Trường này là bắt buộc.';
			} else if (rules.minLength && value.length < rules.minLength) {
				errors[key] = `Phải có ít nhất ${rules.minLength} ký tự.`;
			} else if (rules.isEqual && value !== formData[rules.isEqual]) {
				errors[key] = 'Giá trị không khớp.';
			} else if (rules.custom && typeof rules.custom === 'function') {
				if (!rules.custom(value)) {
					errors[key] = rules.message || 'Giá trị không hợp lệ.';
				}
			}
		});

		setFormErrors(errors);
		setIsFormValid(Object.keys(errors).length === 0);
	}, [formData, validationRules]);

	const handleChange = (e) => {
		const {name, value} = e.target;
		setFormData((prev) => ({...prev, [name]: value}));
	};

	return {
		formData,
		handleChange,
		isFormValid,
		formErrors,
		setFormData,
		setFormErrors,
	};
};

export default useFormValidation;
