import Home from './pages/Home';
import Shop from './pages/Shop';
import { Contact } from './pages/Contact';
import './css/bootstrap.min.css';
import './css/style.css';
import './css/responsive.css';
import './css/custom.css';

// function App() {
//   return (
//     <div>
//       <Home/>
//     </div>
//   );
// }

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
		<div>
				<Shop/>
		</div>
	)
};

const ContactPage = () => {
	return (
		<div>
				<Contact/>
		</div>
	)
};

export {Homepage, ShopPage, ContactPage } ;
