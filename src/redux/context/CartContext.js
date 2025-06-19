import {createContext, useReducer, useEffect, useCallback} from 'react';
import {
	getAllCart,
	addToCart as addToCartService,
	updateCartItem as updateItemService,
	removeItemFromCart as removeItemService,
} from '@/services/cartService';

const CartContext = createContext();

const initialState = {
	cart: null,
	isLoading: true,
};

function cartReducer(state, action) {
	switch (action.type) {
		case 'SET_CART_START':
			return {...state, isLoading: true};
		case 'SET_CART_SUCCESS':
			return {...state, cart: action.payload, isLoading: false};
		case 'SET_CART_ERROR':
			return {...state, isLoading: false, cart: {items: []}};
			return state;
	}
}

export function CartProvider({children}) {
	const [state, dispatch] = useReducer(cartReducer, initialState);

	const fetchCart = useCallback(async () => {
		dispatch({type: 'SET_CART_START'});
		try {
			const serverCart = await getAllCart();
			dispatch({type: 'SET_CART_SUCCESS', payload: serverCart});
		} catch (error) {
			console.error('Failed to fetch cart:', error);
			dispatch({type: 'SET_CART_ERROR'});
		}
	}, []);

	// Tự động tải giỏ hàng khi component được mount lần đầu
	useEffect(() => {
		fetchCart();
	}, [fetchCart]);

	// Hàm thêm sản phẩm, gọi service và fetch lại giỏ hàng
	const addItemToCart = async (itemData) => {
		await addToCartService(itemData);
		await fetchCart();
	};

	// Hàm cập nhật sản phẩm
	const updateCartItem = async (itemId, quantity) => {
		await updateItemService(itemId, quantity);
		await fetchCart();
	};
	// Hàm xoá sản phẩm
	const removeCartItem = async (itemId) => {
		await removeItemService(itemId);
		await fetchCart();
	};

	// Xóa NHIỀU sản phẩm khỏi giỏ
	const removeItemsFromCart = async (itemIds) => {
		if (!itemIds || itemIds.length === 0) return;
		// Gọi API xóa cho từng item một cách song song
		await Promise.all(itemIds.map((id) => removeItemService(id)));
		await fetchCart();
	};

	const clearCart = () => {
		dispatch({type: 'SET_CART_SUCCESS', payload: {items: []}});
	};

	const syncCartAfterLogin = async () => {
		await fetchCart();
	};

	const value = {
		cart: state.cart,
		isLoading: state.isLoading,
		addItemToCart,
		updateCartItem,
		removeCartItem,
		removeItemsFromCart,
		syncCartAfterLogin,
		fetchCart,
		clearCart,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContext;
