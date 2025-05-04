import React from 'react';
import styles from './ModalWrapper.module.scss';

const ModalWrapper = ({children, onClose}) => {
	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>
	);
};

export default ModalWrapper;
