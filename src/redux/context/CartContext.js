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
	// cart được lưu tạm vào state trong React Context (memory – mất khi reload trang nếu không refetch).
	const [state, dispatch] = useReducer(cartReducer, initialState);

	const fetchCart = useCallback(async () => {
		dispatch({type: 'SET_CART_START'});
		try {
			const serverCart = await getAllCart();
			dispatch({type: 'SET_CART_SUCCESS', payload: serverCart}); //  Gửi dữ liệu vào reducer
		} catch (error) {
			console.error('Failed to fetch cart:', error);
			dispatch({type: 'SET_CART_ERROR'});
		}
	}, []);

	useEffect(() => {
		const token = localStorage.getItem('token'); // nếu có đăng nhập
		// Gọi fetchCart vì cookie (cartToken) sẽ tự được gửi kèm theo request
		if (token) {
			fetchCart();
		} else {
			fetchCart();
		}
	}, [fetchCart]);

	// addToCart
	const addItemToCart = async (itemData) => {
		await addToCartService(itemData);
		await fetchCart();
	};

	// updateCartItem
	const updateCartItem = async (itemId, quantity) => {
		await updateItemService(itemId, quantity);
		await fetchCart();
	};
	// removeItemFromCart
	const removeCartItem = async (itemId) => {
		await removeItemService(itemId);
		await fetchCart();
	};

	// Xóa nhiều
	const removeItemsFromCart = async (itemIds) => {
		if (!itemIds || itemIds.length === 0) return;
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
		cart: state.cart, // Dữ liệu giỏ hàng hiện tại
		isLoading: state.isLoading,
		addItemToCart,
		updateCartItem,
		removeCartItem,
		removeItemsFromCart,
		syncCartAfterLogin, // 	Đồng bộ giỏ hàng sau khi người dùng login (merge giỏ khách + giỏ user).
		fetchCart, // 	Lấy lại toàn bộ giỏ hàng từ server
		clearCart, // Xóa sạch giỏ hàng (dùng khi đặt hàng xong)
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContext;
