import Home from './pages/Home';
import Shop from './pages/Shop';
import { Contact } from './pages/Contact';
import  Cart  from './pages/Cart'
import './css/bootstrap.min.css';
import './css/style.css';
import './css/responsive.css';
import './css/custom.css';
import { Provider } from 'react-redux'
import store from './redux/store'

// function App() {
//   return (
//     <div>
//       <Home/>
//     </div>
//   );
// }
// Some text
// export default App;

const Homepage = () => {
	return (
		<div>
        <Home/>
				{/* <Header/>
				<h1>Homepage </h1>
				<Link to='/about'>Go to Aboutpage</Link> */}
		</div>
	)
};

const ShopPage = () => {
	return (
		<Provider store={store}>
		<div>
				<Shop/>
		</div>
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
		<div>
				<Cart/>
		</div>
		</Provider>
	)
};

export {Homepage, ShopPage, ContactPage, CartPage } ;
