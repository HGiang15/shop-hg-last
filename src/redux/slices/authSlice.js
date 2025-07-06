import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	isLogin: false,
	token: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.isLogin = true;
			state.token = action.payload;
		},
		logout: (state) => {
			state.isLogin = false;
			state.token = null;
		},
	},
});

export const {loginSuccess, logout} = authSlice.actions;
export default authSlice.reducer;

// quản lý trạng thái đăng nhập
// Lưu isLogin, token để biết người dùng có đang đăng nhập không
