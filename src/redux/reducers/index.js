import {combineReducers} from 'redux';
import menuReducer from './menuTabReducer';

const rootReducer = combineReducers({
	menu: menuReducer, // Đặt tên là 'menu' để truy cập state.menu.activeMenu
	// ... các reducers khác
});

export default rootReducer;
