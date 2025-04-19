import {SET_ACTIVE_MENU} from '@/constants/config';

export const setActiveMenu = (menuPath) => ({
	type: SET_ACTIVE_MENU,
	payload: menuPath,
});
