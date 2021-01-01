import Home from './pages/Home';
import Shop from './pages/Shop';
import Inventario from './pages/Inventario'
import { Contact } from './pages/Contact';
import  Cart  from './pages/Cart'
import './css/bootstrap.min.css';
import './css/style.css';
import './css/responsive.css';
import './css/custom.css';
import { Provider } from 'react-redux'
import store from './redux/store'

import { persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'

// function App() {
//   return (
//     <div>
//       <Home/>
//     </div>
//   );
// }
// Some
// export default App;

const Homepage = () => {
	return (
		<Provider store={store}>
		<div>
        <Home/>
				{/* <Header/>
				<h1>Homepage </h1>
				<Link to='/about'>Go to Aboutpage</Link> */}
		</div>
		</Provider>
	)
};

const ShopPage = () => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
		<div>
				<Shop/>
		</div>
			</PersistGate>
		</Provider>
	)
};

const ContactPage = () => {
	return (
		<div>
				<Contact/>
		</div>
	)
};

const CartPage = () => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
		<div>
				<Cart/>
		</div>
			</PersistGate>
		</Provider>
	)
};

const InventarioPage = () => {
	return (
		<div>
				<Inventario/>
		</div>
	)
};

export {Homepage, ShopPage, ContactPage, CartPage, InventarioPage } ;
