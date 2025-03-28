import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/_global.scss';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useState} from 'react';

export default function App({Component, pageProps}) {
	const [queryClient] = useState(() => new QueryClient());

	const getLayout = Component.getLayout || ((page) => page);

	return <QueryClientProvider client={queryClient}>{getLayout(<Component {...pageProps} />)}</QueryClientProvider>;
}
