import {ROUTES, SET_ACTIVE_MENU} from '@/constants/config';

const initialState = {
	activeMenu: ROUTES.AdminProduct, // Giá trị mặc định khi ứng dụng khởi chạy
};

const menuReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_ACTIVE_MENU:
			return {
				...state,
				activeMenu: action.payload,
			};
		default:
			return state;
	}
};

export default menuReducer;
