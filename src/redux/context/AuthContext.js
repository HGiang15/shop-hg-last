import {createContext, useContext} from 'react';
import {useSelector} from 'react-redux';

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
	const {isLogin} = useSelector((state) => state.auth); // lấy isLogin từ Redux slice auth
	const {infoUser} = useSelector((state) => state.user); // lấy infoUser từ Redux slice user
	const {loading} = useSelector((state) => state.site);

	const value = {
		isLogin,
		infoUser,
		loading,
		isAdmin: infoUser?.role === 0,
		isUser: infoUser?.role === 1,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
