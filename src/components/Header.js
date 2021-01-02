import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import groupBy from 'lodash/groupBy'

const groupingData = (cart) => {
    console.log('Initial cart: ', cart)
    const groupC = groupBy(cart, 'id_producto')
    console.log('groupC: ', groupC)

    let finalCart = []
            for (const property in groupC) {
                let inQuantity = 0
                 for (const element of groupC[`${property}`]) {
                     inQuantity = inQuantity + Number(element.order)                    
                }
                 finalCart.push({
                    id_producto:  property,
                    order: inQuantity,
                    unidad: groupC[`${property}`][0].unidad,
                    desc: groupC[`${property}`][0].desc,
                    price: groupC[`${property}`][0].price
                 })
            }
    console.log('Grouped cart: ', finalCart)
    return finalCart
}

const mapStateToProps = (state, ownProps) => {

    const currentCart = groupingData(state.cart.products)    

    return {
        cart: currentCart
    }
}

const Header = (props) => {

    const [cartItems, setCartItems] = useState(0)

    useEffect(() => {
        setCartItems(props.cart.length)
        return () => {
            console.log('Unmounting code for header component. Unmounting can be event handlers, timers or subscriptions')
        }
    }, [props.cart])

    return (
        <>
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
                        {/* <li className="nav-item"><a className="nav-link" href="about.html">About Us</a></li> */}
                        <li className="dropdown">
                            <Link to='/shop' className="nav-link dropdown-toggle arrow" data-toggle="dropdown">COMPRAR</Link>
                            <ul className="dropdown-menu">
								<li><a href="shop.html">Sidebar Shop</a></li>
								<li><a href="shop-detail.html">Shop Detail</a></li>
                                <li><a href="cart.html">Cart</a></li>
                                <li><a href="checkout.html">Checkout</a></li>
                                <li><a href="my-account.html">My Account</a></li>
                                <li><a href="wishlist.html">Wishlist</a></li>
                            </ul>
                        </li>
                        {/* <li className="nav-item"><a className="nav-link" href="gallery.html">Gallery</a></li>
                        <li className="nav-item"><a className="nav-link" href="contact-us.html">Contact Us</a></li> */}
                    </ul>
                </div>
                {/* <!-- /.navbar-collapse --> */}

                {/* <!-- Start Atribute Navigation --> */}
                <div className="attr-nav">
                    <ul>
                        {/* <li className="search"><a href="#"><i className="fa fa-search"></i></a></li> */}
                        <li className="side-menu">
								<i className="fa fa-shopping-bag"></i>
								<span className="badge">{cartItems}</span>
								<p><Link to='/cart' className="nav-link" data-toggle="dropdown">Mi carrito</Link></p>
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
        </>
    )
}

export default connect(mapStateToProps)(Header)