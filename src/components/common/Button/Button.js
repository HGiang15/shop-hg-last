import React from 'react';
import styles from './Button.module.scss';
import Link from 'next/link';

const Button = ({children, onClick, type = 'button', className, href, disabled = false, leftIcon, centerIcon}) => {
	const buttonClasses = `${styles.button} ${centerIcon ? styles.iconOnly : ''} ${className || ''}`;

	const renderContent = () => {
		if (centerIcon) {
			return <span className={styles.centerIcon}>{centerIcon}</span>;
		}

		return (
			<>
				{leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
				<span>{children}</span>
			</>
		);
	};

	if (href) {
		return (
			<Link href={href} className={buttonClasses} disabled={disabled}>
				{renderContent()}
			</Link>
		);
	}

	return (
		<button type={type} className={buttonClasses} onClick={onClick} disabled={disabled}>
			{renderContent()}
		</button>
	);
};

export default Button;
