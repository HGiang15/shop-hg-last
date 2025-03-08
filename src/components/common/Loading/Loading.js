import React from 'react';
import styles from './Loading.module.scss';

const Loading = ({fullScreen = false}) => {
	return (
		<div className={fullScreen ? styles.loadingOverlay : styles.inline}>
			<div className={styles.spinner}></div>
		</div>
	);
};

export default Loading;
