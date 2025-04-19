import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'tippy.js/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/_global.scss';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useState} from 'react';
import LoadingBar from '@/components/common/LoadingBar/LoadingBar';
import {Provider} from 'react-redux';
import store from '@/redux/store';

export default function App({Component, pageProps}) {
	const [queryClient] = useState(() => new QueryClient());

	const getLayout = Component.getLayout || ((page) => page);

	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<LoadingBar />
				{getLayout(<Component {...pageProps} />)}
			</QueryClientProvider>
		</Provider>
	);
}
