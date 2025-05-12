import {useContext} from 'react';
import CartContext from '@/redux/context/CartContext';

export default function useCart() {
	const context = useContext(CartContext);
	if (!context) throw new Error('useCart must be used within a CartProvider');
	return context;
}
