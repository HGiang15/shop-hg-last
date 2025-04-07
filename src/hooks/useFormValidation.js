import {useState, useEffect} from 'react';

const useFormValidation = (initialState, validationRules) => {
	const [formData, setFormData] = useState(initialState);
	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		const isValid = Object.keys(validationRules).every((key) => {
			const value = formData[key];
			const rules = validationRules[key];

			if (rules.required && !value.trim()) {
				return false;
			}

			if (rules.minLength && value.length < rules.minLength) {
				return false;
			}

			if (rules.isEqual && value !== formData[rules.isEqual]) {
				return false;
			}

			// Thêm các rule khác

			return true;
		});

		setIsFormValid(isValid);
	}, [formData, validationRules]);

	const handleChange = (e) => {
		const {name, value} = e.target;
		setFormData({...formData, [name]: value});
	};

	return {formData, handleChange, isFormValid};
};

export default useFormValidation;
