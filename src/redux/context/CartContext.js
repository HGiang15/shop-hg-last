import {createContext, useReducer, useEffect, useRef} from 'react';

const CartContext = createContext();

const initialState = {
	cartItems: [],
	isLoading: true,
};

function cartReducer(state, action) {
	switch (action.type) {
		case 'SET_CART':
			return {...state, cartItems: action.payload, isLoading: false};
		case 'ADD_ITEM': {
			// Kiểm tra sự tồn tại của action.payload.productId
			const {productId, sizeId, colorId, quantity} = action.payload;

			if (!productId || !productId._id || !sizeId || !colorId) {
				console.error('Invalid product data:', action.payload);
				return state; // Trả về state hiện tại nếu dữ liệu không hợp lệ
			}

			const existingIndex = state.cartItems.findIndex(
				(item) =>
					item.productId._id === productId._id &&
					item.sizeId._id === sizeId._id &&
					item.colorId &&
					item.colorId._id === colorId._id
				// Kiểm tra trong mảng màu
			);

			let updatedItems = [...state.cartItems];

			if (existingIndex !== -1) {
				// Tăng số lượng nếu đã có
				updatedItems[existingIndex].quantity += quantity;
			} else {
				updatedItems.push(action.payload);
			}

			return {...state, cartItems: updatedItems};
		}

		case 'REMOVE_ITEM':
			return {
				...state,
				cartItems: state.cartItems.filter((item) => item.id !== action.payload),
			};
		case 'CLEAR_CART':
			return {...state, cartItems: []};
		default:
			return state;
	}
}

export function CartProvider({children}) {
	const [state, dispatch] = useReducer(cartReducer, initialState);
	const isMerged = useRef(false);

	// Lần đầu mount -> load từ localStorage nếu chưa merge
	useEffect(() => {
		if (!isMerged.current) {
			const storedCart = localStorage.getItem('cart');
			if (storedCart) {
				dispatch({type: 'SET_CART', payload: JSON.parse(storedCart)});
			}
		}
	}, []);

	// Luôn sync cartItems lên localStorage
	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(state.cartItems));
	}, [state.cartItems]);

	// Hàm gọi khi login xong và đã merge cart từ server
	const setCartFromServer = (items) => {
		isMerged.current = true;
		dispatch({type: 'SET_CART', payload: items});
	};

	return <CartContext.Provider value={{state, dispatch, setCartFromServer}}>{children}</CartContext.Provider>;
}

export default CartContext;
