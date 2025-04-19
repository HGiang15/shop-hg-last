import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
	reducer: rootReducer,
	devTools: process.env.NODE_ENV !== 'production', // Bật Redux DevTools chỉ trong môi trường development
});

export default store;
