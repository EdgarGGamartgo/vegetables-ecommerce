import './../css/bootstrap.min.css';
import './../css/style.css';
import './../css/responsive.css';
import './../css/custom.css';
import './../css/style-coche.css'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { Store } from './../assets/Store'
import { makeStyles } from '@material-ui/core/styles';
import { Modal } from '@material-ui/core';
import { connect } from 'react-redux'
import { buyProduct } from '../redux'
import axios from 'axios'

const mapStateToProps = (state, ownProps) => {
    const itemState = ownProps.product
      ? state.product.productKg
      : state.product.productKg

    return {
        item: itemState
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    
    const dispatchFunction = ownProps.product
      ? () => dispatch(buyProduct())
      : () => dispatch(buyProduct())

    return {
        buyItem: dispatchFunction
    }
}

const Cart = (props) => {

    const [axiosData, setAxiosData] = useState('')

    useEffect(() => {
        (async () => {
            const placeHolder = await axios.get('http://ec2-100-26-193-244.compute-1.amazonaws.com:3001/status')
            //const placeHolder = await axios.get('http://52.7.127.131:3001/status')
            //const placeHolder = await axios.get('http://localhost:3001/status')
            setAxiosData(placeHolder.data.status)
            console.log('placeHolder: ', placeHolder)
        })()

    }, [])

    return (
        <div>
            {/* Start Main Top  */}
    <div className="main-top">
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
					<div className="custom-select-box">
                        <select id="basic" className="selectpicker show-tick form-control" data-placeholder="$ USD">
							<option>¥ JPY</option>
							<option>$ USD</option>
							<option>€ EUR</option>
						</select>
                    </div>
                    <div className="right-phone-box">
                        <p>Call US :- <a href="#"> +11 900 800 100</a></p>
                    </div>
                    <div className="our-link">
                        <ul>
                            <li><a href="#"><i className="fa fa-user s_color"></i> My Account</a></li>
                            <li><a href="#"><i className="fas fa-location-arrow"></i> Our location</a></li>
                            <li><a href="#"><i className="fas fa-headset"></i> Contact Us</a></li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
					<div className="login-box">
						<select id="basic" className="selectpicker show-tick form-control" data-placeholder="Sign In">
							<option>Register Here</option>
							<option>Sign In</option>
						</select>
					</div>
                    <div className="text-slid-box">
                        <div id="offer-box" className="carouselTicker">
                            <ul className="offer-box">
                                <li>
                                    <i className="fab fa-opencart"></i> 20% off Entire Purchase Promo code: offT80
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
     {/* End Main Top */}

{/* <!-- Start Main Top --> */}
<header className="main-header">
        {/* <!-- Start Navigation --> */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-default bootsnav">
            <div className="container">
                {/* <!-- Start Header Navigation --> */}
                <div className="navbar-header">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-menu" aria-controls="navbars-rs-food" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="fa fa-bars"></i>
                </button>
                    <a className="navbar-brand" href="index.html"><img src="images/logo.png" className="logo" alt=""/></a>
                </div>
                {/* <!-- End Header Navigation --> */}

                {/* <!-- Collect the nav links, forms, and other content for toggling --> */}
                <div className="collapse navbar-collapse" id="navbar-menu">
                    <ul className="nav navbar-nav ml-auto" data-in="fadeInDown" data-out="fadeOutUp">
                         <li className="nav-item active"><Link to='/' className="nav-link" data-toggle="dropdown">HOME</Link></li>

                        <li className="nav-item"><a className="nav-link" href="about.html">About Us</a></li>
                        <li className="dropdown">
                            <Link to='/shop' className="nav-link dropdown-toggle arrow" data-toggle="dropdown">SHOP</Link>
                            <ul className="dropdown-menu">
								<li><a href="shop.html">Sidebar Shop</a></li>
								<li><a href="shop-detail.html">Shop Detail</a></li>
                                <li><a href="cart.html">Cart (THIS IS A AWS TEST COMMIT) </a></li>
                                <li><a href="checkout.html">Checkout</a></li>
                                <li><a href="my-account.html">My Account</a></li>
                                <li><a href="wishlist.html">Wishlist</a></li>
                            </ul>
                        </li>
                        <li className="dropdown">
                            <a className="nav-link dropdown-toggle arrow" data-toggle="dropdown" href="/coche">Gallery</a>
                        </li>
                        {/* <!-- <li className="nav-item"><a className="nav-link" href="gallery.html">Gallery</a></li> --> */}
                        <li className="nav-item"><a className="nav-link" href="contact-us.html">Contact Us</a></li>
                    </ul>
                </div>
                {/* <!-- /.navbar-collapse --> */}

                {/* <!-- Start Atribute Navigation --> */}
                <div className="attr-nav">
                    <ul>
                        <li className="search"><a href="#"><i className="fa fa-search"></i></a></li>
                        <li className="side-menu">
								<i className="fa fa-shopping-bag"></i>
								<span className="badge">3</span>
								<p><Link to='/cart' className="nav-link" data-toggle="dropdown">My Cart</Link></p>
						</li>
                    </ul>
                </div>
                {/* <!-- End Atribute Navigation --> */}
            </div>
            {/* <!-- Start Side Menu --> */}
            <div className="side">
                <a href="#" className="close-side"><i className="fa fa-times"></i></a>
                <li className="cart-box">
                    <ul className="cart-list">
                        <li>
                            <a href="#" className="photo"><img src="images/img-pro-01.jpg" className="cart-thumb" alt="" /></a>
                            <h6><a href="#">Delica omtantur </a></h6>
                            <p>1x - <span className="price">$80.00</span></p>
                        </li>
                        <li>
                            <a href="#" className="photo"><img src="images/img-pro-02.jpg" className="cart-thumb" alt="" /></a>
                            <h6><a href="#">Omnes ocurreret</a></h6>
                            <p>1x - <span className="price">$60.00</span></p>
                        </li>
                        <li>
                            <a href="#" className="photo"><img src="images/img-pro-03.jpg" className="cart-thumb" alt="" /></a>
                            <h6><a href="#">Agam facilisis</a></h6>
                            <p>1x - <span className="price">$40.00</span></p>
                        </li>
                        <li className="total">
                            <a href="#" className="btn btn-default hvr-hover btn-cart">VIEW CART</a>
                            <span className="float-right"><strong>Total</strong>: $180.00</span>
                        </li>
                    </ul>
                </li>
            </div>
            {/* <!-- End Side Menu --> */}
        </nav>
        {/* <!-- End Navigation --> */}
    </header>
    {/* <!-- End Main Top --> */}


    {/* <!-- Start Top Search --> */}
    <div className="top-search">
        <div className="container">
            <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-search"></i></span>
                <input type="text" className="form-control" />
                <span className="input-group-addon close-search"><i className="fa fa-times"></i></span>
            </div>
        </div>
    </div>
    {/* <!-- End Top Search --> */}

    {/* <!-- Start All Title Box HERE STARTS NEW COMPONENTS --> */}
    <div className="all-title-box">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <h2>Shop</h2>
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item active">Shop</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- End All Title Box --> */}


    {/* <!-- Start Shop Page  --> */}
    <div className="shop-box-inner">
        <div className="container">

             <div className="title-left">
                 <h3>Shopping List {props.item} {axiosData}</h3>
            </div>
            
            <div className="datos"> {/* <!-- Ticke Datos-> */}
                    <p>DISTRIBUIDORA DE FUTAS Y VERDURAS</p>
                    <p>SAN MARTIN</p>
                    <p>R.F.C. PIEMJSKK6465C</p>
                    <p>Direccion: Calle 49 Num.256</p>
                    <p>Telefono: 111149456115</p>
                    <div>
                        <div className="right">
                               <p>Folio No 00001. </p>                  
                        </div>

                        <div className="left">              
                            <p>Fecha: 23-12-2020</p>
                        </div>            
                    </div>                
            </div>

            <div className="datos-cliente"> {/* <!-- Cliente-> */}   

                <div className="datos-container left datos-content">
                    <p>Nombre: Juana Inss de Asbaje y Ramirez de Santillana</p>
                </div>

                <div className="datos-container right datos-content">
                    <p>Direccion : calle 48 no 258 entre moctezuma y valle </p> 
                </div>

                <div className="datos-container left datos-content">
                    <p>Telefono:879 000 14 58 </p>
                </div>

                <div className="datos-container left datos-content">
                    <p>R.F.C: LIEM952566gjkdtr58</p>
                </div>
                                                         
            </div>
            <div className="row " >
                
                <div className="Shoppinglist-list">{/* <!-- Ticke-Nota --> */}
                        {/* <!-- titles--> */}
                    <div className="Shoppinglist-title"> 
                        <div className="Shoppinglist-descrip">
                             <span>Cantidad </span>
                        </div>

                        <div className="Shoppinglist-descrip">
                            <span>U.M </span>
                        </div>
                                
                        <div className="Shoppinglist-descrip">
                            <span>Descripcion </span>
                        </div>
                                
                        <div className="Shoppinglist-descrip">
                            <span>P.U.</span>
                        </div>

                        <div className="Shoppinglist-descrip">
                            <span>Importe</span>
                        </div>
                                
                        </div>
                        {/* <!-- End titles --> */}


                        <div className="Shoppinglist-container">

                            <div className="Shoppinglist-container-content">
                                Datos de la nota
                            </div>
                            
                    </div>                                
                </div>
            </div>    

            <div className="title-left"> {/* <!-- Line end--> */}
                <h3></h3>
            </div>

            {/* <!-- Boton de compra--> */}
            <div className="price-box-slider">
                                
                <p>
                     <input type="text" id="amount" readOnly />
                     <button className="btn hvr-hover" type="submit">Realizar compra</button>
                </p>
            </div>


            <div className="datos"> {/* <!-- Ticke Datos-> */}
                Gracias por su compra
            </div>


        </div>
    </div>
    {/* <!-- End Shop Page --> */}

        {/* <!-- Start Footer  --> */}
        <footer>
        <div className="footer-main">
            <div className="container">
				<div className="row">
					<div className="col-lg-4 col-md-12 col-sm-12">
						<div className="footer-top-box">
							<h3>Business Time</h3>
							<ul className="list-time">
								<li>Monday - Friday: 08.00am to 05.00pm</li> <li>Saturday: 10.00am to 08.00pm</li> <li>Sunday: <span>Closed</span></li>
							</ul>
						</div>
					</div>
					<div className="col-lg-4 col-md-12 col-sm-12">
						<div className="footer-top-box">
							<h3>Newsletter</h3>
							<form className="newsletter-box">
								<div className="form-group">
									<input className="" type="email" name="Email"  />
									<i className="fa fa-envelope"></i>
								</div>
								<button className="btn hvr-hover" type="submit">Submit</button>
							</form>
						</div>
					</div>
					<div className="col-lg-4 col-md-12 col-sm-12">
						<div className="footer-top-box">
							<h3>Social Media</h3>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
							<ul>
                                <li><a href="#"><i className="fab fa-facebook" aria-hidden="true"></i></a></li>
                                <li><a href="#"><i className="fab fa-twitter" aria-hidden="true"></i></a></li>
                                <li><a href="#"><i className="fab fa-linkedin" aria-hidden="true"></i></a></li>
                                <li><a href="#"><i className="fab fa-google-plus" aria-hidden="true"></i></a></li>
                                <li><a href="#"><i className="fa fa-rss" aria-hidden="true"></i></a></li>
                                <li><a href="#"><i className="fab fa-pinterest-p" aria-hidden="true"></i></a></li>
                                <li><a href="#"><i className="fab fa-whatsapp" aria-hidden="true"></i></a></li>
                            </ul>
						</div>
					</div>
				</div>
				<hr/>
                <div className="row">
                    <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="footer-widget">
                            <h4>About Freshshop</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> 
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p> 							
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="footer-link">
                            <h4>Information</h4>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Customer Service</a></li>
                                <li><a href="#">Our Sitemap</a></li>
                                <li><a href="#">Terms &amp; Conditions</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Delivery Information</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="footer-link-contact">
                            <h4>Contact Us</h4>
                            <ul>
                                <li>
                                    <p><i className="fas fa-map-marker-alt"></i>Address: Michael I. Days 3756 <br/>Preston Street Wichita,<br/> KS 67213 </p>
                                </li>
                                <li>
                                    <p><i className="fas fa-phone-square"></i>Phone: <a href="tel:+1-888705770">+1-888 705 770</a></p>
                                </li>
                                <li>
                                    <p><i className="fas fa-envelope"></i>Email: <a href="mailto:contactinfo@gmail.com">contactinfo@gmail.com</a></p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    {/* <!-- End Footer  --> */}

    {/* <!-- Start copyright  --> */}
    <div className="footer-copyright">
        <p className="footer-company">All Rights Reserved. &copy; 2018 <a href="#">ThewayShop</a> Developed By :
            <a href="https://github.com/EdgarGGamartgo/">Edgar Martinez</a></p>
    </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)
