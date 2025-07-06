import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	infoUser: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserInfo: (state, action) => {
			state.infoUser = action.payload;
		},
		clearUserInfo: (state) => {
			state.infoUser = null;
		},
	},
});

export const {setUserInfo, clearUserInfo} = userSlice.actions;
export default userSlice.reducer;

// Lưu thông tin chi tiết của người dùng sau khi đăng nhập
