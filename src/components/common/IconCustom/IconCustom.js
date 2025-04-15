import React, {useEffect, useRef} from 'react';
import styles from './IconCustom.module.scss';
import clsx from 'clsx';
import Link from 'next/link';
import tippy from 'tippy.js';

function IconCustom({icon, onClick, href, disabled = false, iconFilter, backgroundColor, tooltip}) {
	const containerRef = useRef(null);

	const containerStyle = {
		background: backgroundColor,
	};

	const iconStyle = {
		filter: iconFilter,
	};

	useEffect(() => {
		if (containerRef.current && tooltip) {
			tippy(containerRef.current, {
				content: tooltip,
				placement: 'top',
				interactive: true,
			});
		}
	}, [tooltip]);

	return href ? (
		<Link href={href} style={containerStyle} className={clsx(styles.container, {[styles.disabled]: disabled})} ref={containerRef}>
			<div className={styles.icon} style={iconStyle}>
				{icon}
			</div>
		</Link>
	) : (
		<div style={containerStyle} className={clsx(styles.container, {[styles.disabled]: disabled})} onClick={onClick} ref={containerRef}>
			<div className={styles.icon} style={iconStyle}>
				{icon}
			</div>
		</div>
	);
}

export default IconCustom;
