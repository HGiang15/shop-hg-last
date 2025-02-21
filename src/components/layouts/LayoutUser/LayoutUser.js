import React, { Fragment } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function LayoutUser({ children }) {
	return (
		<Fragment>
			<header>
				<Header />
			</header>
            
            <main>{children}</main>

            <footer>
                <Footer />
            </footer>
		</Fragment>
	);
}

export default LayoutUser;
