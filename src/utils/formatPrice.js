export const formatPrice = (value) => {
	const numberValue = Number(value.replace(/\./g, ''));
	if (isNaN(numberValue)) {
		return '';
	}
	return numberValue.toLocaleString('vi-VN');
};
