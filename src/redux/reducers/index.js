// redux/reducers/index.js
import {combineReducers} from 'redux';
import menuReducer from './menuTabReducer';
import authReducer from '../slices/authSlice';
import userReducer from '../slices/userSlice';
import siteReducer from '../slices/siteSlice';

const rootReducer = combineReducers({
	menu: menuReducer,
	auth: authReducer,
	user: userReducer,
	site: siteReducer,
});

export default rootReducer;
