import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'tippy.js/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import '../styles/_global.scss';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useState} from 'react';
import {Provider} from 'react-redux';
import store, {persistor} from '@/redux/store';
import {PersistGate} from 'redux-persist/integration/react';

import LoadingBar from '@/components/common/LoadingBar/LoadingBar';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {CartProvider} from '@/redux/context/CartContext';
import {AuthProvider} from '@/redux/context/AuthContext';

export default function App({Component, pageProps}) {
	const [queryClient] = useState(() => new QueryClient());
	const getLayout = Component.getLayout || ((page) => page);

	return (
		<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<QueryClientProvider client={queryClient}>
						<AuthProvider>
							<CartProvider>
								<LoadingBar />
								{getLayout(<Component {...pageProps} />)}
								<ToastContainer />
							</CartProvider>
						</AuthProvider>
					</QueryClientProvider>
				</PersistGate>
			</Provider>
		</GoogleOAuthProvider>
	);
}
