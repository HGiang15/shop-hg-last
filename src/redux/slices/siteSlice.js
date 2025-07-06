import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	loading: false,
};

const siteSlice = createSlice({
	name: 'site',
	initialState,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
	},
});

export const {setLoading} = siteSlice.actions;
export default siteSlice.reducer;

// Quản lý trạng thái toàn cục giao diện, vd như trạng thái loading khi gửi form, fetch dữ liệu
