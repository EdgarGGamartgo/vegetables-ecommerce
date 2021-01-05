import React from 'react';
import ReactDOM from 'react-dom';
import { Homepage, ShopPage, ContactPage, CartPage, InventarioPage, PedidosPage } from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

ReactDOM.render(
  <Router>
       <Switch>
		      <Route exact path="/" component={Homepage}/>
				  <Route exact path="/cart" component={CartPage}/>
          <Route exact path="/shop" component={ShopPage}/>
				  <Route exact path="/contact" component={ContactPage}/>
				  <Route exact path="/inventario" component={InventarioPage}/>
				  <Route exact path="/pedidos" component={PedidosPage}/>
	    </Switch>
    </Router>
  ,
  document.getElementById('root')
);

{/* <React.StrictMode>
    <App />
  </React.StrictMode> */}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
