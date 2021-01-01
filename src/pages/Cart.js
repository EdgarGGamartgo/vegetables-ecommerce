import './../css/bootstrap.min.css';
import './../css/style.css';
import './../css/responsive.css';
import './../css/custom.css';
import './../css/style-coche.css'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'
import groupBy from 'lodash/groupBy'
import { Modal } from '@material-ui/core';
import { Edit, DeleteForever } from '@material-ui/icons'
import { connect } from 'react-redux'
import { buyProduct, emptyCart } from '../redux'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import NumberFormat from 'react-number-format'
import Header from './../components/Header'

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
    // const itemState = ownProps.product
    //   ? state.product.productKg
    //   : state.product.productKg

    const currentCart = groupingData(state.cart.products)    

    return {
        item: 0, //itemState
        cart: currentCart
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    
    const dispatchFunction = ownProps.product
      ? () => dispatch(buyProduct())
      : () => dispatch(buyProduct())

    return {
        buyItem: dispatchFunction,
        declineCart: () => dispatch(emptyCart())
    }
}

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

const Cart = (props) => {
    const classes = useStyles();
    const [axiosData, setAxiosData] = useState('')
    const [today, setToday] = useState(new Date().toLocaleDateString())
    const [cart, setCart] = useState([])
    const [folio, setFolio] = useState('')
// Use this https://www.npmjs.com/package/invoice-number  INVOICE NUMBER

    const buyCart = () => {
        console.log("BUY WHOLE CART")
    }

    const declineCart = () => {
        console.log("DECLINE WHOLE CART")
        props.declineCart()
    } 

    useEffect(() => {
        (async () => {
            //const placeHolder = await axios.get('http://ec2-100-26-193-244.compute-1.amazonaws.com:3001/status')
            //const placeHolder = await axios.get('http://52.7.127.131:3001/status')
            //const placeHolder = await axios.get('http://localhost:3001/status')
            //const placeHolder = await axios.get('http://ec2-3-84-38-249.compute-1.amazonaws.com:3001/status')
            const placeHolder = await axios.get('https://cors-everywhere-me.herokuapp.com/http://ec2-3-84-38-249.compute-1.amazonaws.com:3001/status')
            const invoice = await axios.get('http://localhost:3001/invoice')
            const guard = invoice && invoice.data && invoice.data.invoice
            if (guard) {
                setFolio(invoice.data.invoice)
            }
            /*
            You can use cors everywhere proxy. It is hosted as https and is a proxy so you just need to add it before your api end point url.
            This will do the trick. I'm personally using this for the same setup you mentioned.
            And if don't like to use their proxy, you can create your own proxy.
            */
            setAxiosData(placeHolder.data.status)
            setCart(props.cart)
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
      <Header/>
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
                    {/* <ul className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item active">Shop</li>
                    </ul> */}
                </div>
            </div>
        </div>
    </div>
    {/* <!-- End All Title Box --> */}


    {/* <!-- Start Shop Page  --> */}
    <div className="shop-box-inner">
        <div className="container">

             <div className="title-left">
                 <h3>Lista de compras</h3>
            </div>
            
            <div className="datos"> {/* <!-- Ticke Datos-> */}
                    <p>DISTRIBUIDORA DE FUTAS Y VERDURAS</p>
                    <p>SAN MARTIN</p>
                    <p>R.F.C. PIEMJSKK6465C</p>
                    <p>Direccion: Calle 49 Num.256</p>
                    <p>Telefono: 111149456115</p>
                    <div>
                        <div className="right">
                               <p>Folio No: {folio}. </p>                  
                        </div>

                        <div className="left">              
                            <p>Fecha: {today}</p>
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

            <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Cantidad</TableCell>
            <TableCell align="right">U.M</TableCell>
            <TableCell align="right">Descripcion</TableCell>
            <TableCell align="right">P.U.</TableCell>
            <TableCell align="right">Importe</TableCell>
            <TableCell align="right">Opciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.cart.map((row) => (
            <TableRow key={row.id_producto}>
              <TableCell component="th" scope="row">
                {row.order}
                {/* <input type="text" style={{width: "50px"}} value={row.order} onChange={(e) => editQuantity(e.target.value, row.id_producto)}/> */}
              </TableCell>
              <TableCell align="right">{row.unidad}</TableCell>
              <TableCell align="right">{row.desc}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right"><NumberFormat value={Number(row.price) * Number(row.order)} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={'$'} /> MXN</TableCell>
              <TableCell align="right"><Edit style={{cursor:'pointer'}} onClick={() => console.log('Click on Edit')}/><DeleteForever style={{cursor:'pointer'}} onClick={() => console.log('Click on Delete')}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
            <div className="title-left"> {/* <!-- Line end--> */}
                <h3></h3>
            </div>

            {/* <!-- Boton de compra--> */}
            <div className="price-box-slider">
                                
                <p>
                     {/* <input type="text" id="amount" readOnly /> */}
                     <button className="btn hvr-hover" type="submit" onClick={() => buyCart()}>Realizar compra</button>
                     <button className="btn hvr-hover" type="submit" onClick={() => declineCart()}>Rechazar compra</button>
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
