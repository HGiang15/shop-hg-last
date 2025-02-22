import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '../styles/_global.scss'

export default function App({ Component, pageProps }) {
  // Nếu component có getLayout thì dùng nó, nếu không thì render bình thường
	const getLayout = Component.getLayout || ((page) => page);
	return getLayout(<Component {...pageProps} />);
}
