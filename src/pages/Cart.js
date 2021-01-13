import './../css/bootstrap.min.css';
import './../css/style.css';
import './../css/responsive.css';
import './../css/custom.css';
import './../css/style-coche.css'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'
import groupBy from 'lodash/groupBy'
import { Modal, FormControl, Input, InputLabel, FormHelperText, Grid } from '@material-ui/core';
import { Edit, DeleteForever } from '@material-ui/icons'
import { connect } from 'react-redux'
import { buyProduct, emptyCart, editProduct, deleteProduct, addProductCart } from '../redux'
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
import { formatDecimals } from '../utils/formatDecimals';
import FileSaver from 'file-saver';
import { formatDate } from './../utils/formatDate'

function rand() {
    return Math.round(Math.random() * 20) - 10;
  }
  
  function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

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
                     console.log('groupC[`${property}`][0]: ', groupC[`${property}`][0])
                      finalCart.push({
                         id_producto:  property,
                         order: inQuantity,
                         unidad: groupC[`${property}`][0].unidad,
                         desc: groupC[`${property}`][0].desc,
                         price: groupC[`${property}`][0].price,
                         venta_menudeo: groupC[`${property}`][0].venta_menudeo,
                         venta_mayoreo: groupC[`${property}`][0].venta_mayoreo,
                         importe_menudeo: groupC[`${property}`][0].importe_menudeo,
                         importe_mayoreo: groupC[`${property}`][0].importe_mayoreo,
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
    console.log('currentCart Deb: ', currentCart)
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
        declineCart: () => dispatch(emptyCart()),
        editThisProduct: (product) => dispatch(editProduct(product)),
        deleteThisProduct: (product) => dispatch(deleteProduct(product)),
        addThisProduct: (product) => dispatch(addProductCart(product)),
    }
}

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  const useStylesGrid = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));
  
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

  const useStylesModal = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      justify: 'center',
      left: '50%',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[1],
      padding: theme.spacing(2, 4, 3),
    },
  }));

const Cart = (props) => {
    const classesModal = useStylesModal();
    const classes = useStyles();
    const classesGrid = useStylesGrid();
    const [axiosData, setAxiosData] = useState('')
    const [today, setToday] = useState(new Date().toLocaleDateString())
    const [cart, setCart] = useState([])
    const [boughtSuccess, setBoughtSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const [openBoughtModal, setOpenBoughtModal] = useState(false);
    const [currentProductQuantity, setCurrentProductQuantity] = useState(1);
    const [folio, setFolio] = useState('')
    const [modalStyle] = useState(getModalStyle);
    const [modalContent, setModalContent] = useState({
        title: 'Modifique la cantidad a comprar',
        content: ``,
    })
    const [warningMsg, setWarningMsg] = useState(false)
    const [userData, setUserData] = useState({
        name: '',
        lastName: '',
        secondLastName: '',
        phone: '',
        email: '',
        street: '',
        town: '',
        city: '',
        state: '',
        zip: ''
    })
    const [allowBuyingButton, setAllowBuyingButton] = useState(true)
    const [currentProduct, setCurrentProduct] = useState(0)
    const [errorMsgModal, setErrorMsgModal] = useState('')
    const changeBuyingQuantity = (quantity) => {
        if(quantity.includes('.')) {
            quantity = formatDecimals(quantity)
        }
        setCurrentProductQuantity(quantity)
    }

    const calculatePrice = (product) => {
        // NUEVOS CLIENTES

        if(Number(product.order) <= Number(product.venta_menudeo)){
            console.log("MADE: ", Number(product.order) * Number(product.importe_menudeo))
            return Number(product.order) * Number(product.importe_menudeo);

        }

        if(Number(product.order) > Number(product.venta_mayoreo)){
            console.log("ASHIRA: ", Number(product.order) * Number(product.importe_menudeo))
            return Number(product.order) * Number(product.importe_mayoreo);

        }
    }

    const handleOpen = (product) => {
        setOpen(true);
    };

    const handleClose = () => {
       setOpen(false);
    };

    const buyCart = async() => {
        setAllowBuyingButton(true)
        console.log("BUY WHOLE CART: ", props.cart)
        let importe_total = 0
        let products = props.cart.map(p => {
            const {
                id_producto,
                order,
                desc,
                unidad,
                price,
             } = p
             importe_total += Number(price) * Number(order) 
            return {
                id_producto,
                order,
                folio,
                nombre_producto: desc,
                unidad,
                costo_unidad: price,
                importe_producto: Number(price) * Number(order),
            }
        })
        products = products.map(p => {
            return {
                ...p,
                importe_total
            }
        })
        try {
            
            const file = await axios.post('http://localhost:3001/api/download/invoice',
            {
                products,
                userData
            },{
                responseType: 'arraybuffer',
                headers: {
                    Accept: 'application/pdf',
                },
              });

            const response = await axios.post('http://localhost:3001/sale/create', {
                products,
                userData
            })

            if (file.data) {
                FileSaver.saveAs(
                    new Blob([file.data], { type: 'application/pdf' }),
                    `pedido_aceptado.pdf`
                );
            }
            console.log('Successfully retrieved file')
            //window.open(file.data, '_blank');
            setBoughtSuccess(true)
            declineCart()
            setAllowBuyingButton(false)
            console.log('This is a sales response: ', response.data)
            setOpenBoughtModal(true)
        } catch (e) {
            setAllowBuyingButton(false)
            console.log("ERROR POR FALTA EN INVENTARIO: ",e, e.response)
            const { msg, order, unidad, nombre_producto } = e.response.data.error
            if (msg && order && unidad && nombre_producto) {
                console.log("e.response: ", e.response)
                setErrorMsgModal(msg)
            } else {
                console.log("e.response II: ", e.response)
                setErrorMsgModal('Se ha generado un error al prcesar su orden. Intente mas tarde por favor. Gracias!')
            }
            setBoughtSuccess(false)
            setOpenBoughtModal(true)
        } 
    }

    const declineCart = () => {
        console.log("DECLINE WHOLE CART")
        console.log("USER UPDATED DATA: ", userData)
        props.declineCart()
    } 

    const changeUserForm = (event) => {
        const value = event.value;
        const name = event.name;
        setUserData({
            ...userData,
            [name]: value
        })
    }

    useEffect(() => {
        console.log('KAWAIIDESUNE!: ', currentProduct)
        let mounted = true
        if(mounted && currentProduct.order) {
            if(currentProductQuantity.toString().includes('.') && currentProduct.unidad.toLowerCase() !== 'kg') {
                setWarningMsg(true)
            } else {
                setWarningMsg(false)
            }
        }
        return () => {
            return mounted = false
        } 
    }, [currentProductQuantity])

    const editThisProduct = (product) => {
        console.log('editThisProduct: ', product, props.cart)
        setCurrentProduct(product)
        setCurrentProductQuantity(1)
        handleOpen(product)
    }

    const deleteThisProduct = (product) => {
        console.log('deleteThisProduct: ', product)
        const remainingProducts = props.cart.filter(p => p.id_producto != product.id_producto)
        props.deleteThisProduct(remainingProducts)
    }

    const bodyBought = (
        <div style={modalStyle} className={classesModal.paper}>
            {boughtSuccess ? <h2 id="simple-modal-title">Orden exitosa</h2> : <h2 id="simple-modal-title">Error</h2>}
            {boughtSuccess ? 
            <>
            <p id="simple-modal-description">
            Su orden ha sido exitosa, en breve recibira su codigo de verificacion con el cual 
            puede finalizar el proceso de compra con el repartidor. Gracias por su preferencia! 
            </p>
            <button onClick={() => setOpenBoughtModal(false)}>OK</button> 
            </>
            : 
            <>
            <p id="simple-modal-description">
                {errorMsgModal}
            </p>
            <button onClick={() => setOpenBoughtModal(false)}>OK</button> 
            </>
            }
        </div>
    )

    const body = (
        <div style={modalStyle} className={classesModal.paper}>
            <h2 id="simple-modal-title">{modalContent.title}</h2>
            <p id="simple-modal-description">
                {modalContent.content}
            </p>
            {
                modalContent.ok === true ?
                    <>
                    <button onClick={() => authPurchase()}>Si</button>
                    <button onClick={() => nonAuthPurchase()}>No</button>   
                    </>
                    :
                    <>
                    <input type="text" value={currentProductQuantity} onChange={(e) => changeBuyingQuantity(e.target.value)} />
                    <button onClick={() => goToCart()} disabled={warningMsg}>OK</button>
                    {
                        warningMsg 
                        ? <p>Este producto solo se vende por PZA</p>
                        : null
                    }
                    </>
            }
            
        </div>
    );

    const authPurchase = () => {

    } 

    const nonAuthPurchase = () => {
        
    } 

    const goToCart = () => {
        // Dispatch EDIT_PRODUCT action
        const remainingProducts = props.cart.filter(p => p.id_producto != currentProduct.id_producto)
        props.deleteThisProduct(remainingProducts)
        currentProduct.order = currentProductQuantity
        props.addThisProduct([currentProduct])
        handleClose()
    } 

    useEffect(() => {
        const matrix = Object.entries(userData)
        // const arrayObject = matrix.map(e => {
        //     return {
        //         [e[0]]: e[1]
        //     }
        // })
        if (userData.name !== '' &&
            userData.lastName !== '' &&
            userData.secondLastName !== '' &&
            userData.phone !== '' &&
            userData.town !== '' &&
            userData.street !== '') {
            setAllowBuyingButton(false)
            } else {
            setAllowBuyingButton(true)
        }
        // const falsyValues = matrix.filter(e => !e[1])
        // if (falsyValues.length > 0) {
        //     setAllowBuyingButton(true)
        // } else {
        //     setAllowBuyingButton(false)
        // }
        // for (const keyProperty in userData) {
        //     if (!keyProperty) {
        //         setAllowBuyingButton(true)
        //     }
        // }
        return () => {
            //cleanup
        }
    }, [userData])

    useEffect(() => {
        (async () => {
            console.log("Products disabled: ",props.cart)
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

    }, [props.cart])

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
                            <p>Fecha: {formatDate(today)}</p>
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
            <br/>
            <div className={classes.root}>
      <Grid container spacing={3}>
      <Grid item xs={12}>
          <Paper className={classesGrid.paper}>
          <InputLabel htmlFor="my-input">Por favor, complete los siguientes campos para poder realizar su compra.</InputLabel>
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classesGrid.paper}>
          <InputLabel htmlFor="my-input">Nombre (s)*</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text" value={userData.name} name="name" onChange={(e) => changeUserForm(e.target)}/>
                <FormHelperText id="my-helper-text"></FormHelperText>
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classesGrid.paper}>
          <InputLabel htmlFor="my-input2">Primer apellido*</InputLabel>
                <Input id="my-input2" aria-describedby="my-helper-text2" value={userData.lastName} name="lastName" onChange={(e) => changeUserForm(e.target)}/>
                <FormHelperText id="my-helper-text2"></FormHelperText>
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classesGrid.paper}>
          <InputLabel htmlFor="my-input3">Segundo apellido*</InputLabel>
                <Input id="my-input3" aria-describedby="my-helper-text3" value={userData.secondLastName} name="secondLastName" onChange={(e) => changeUserForm(e.target)}/>
                <FormHelperText id="my-helper-text3"></FormHelperText>
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classesGrid.paper}>
          <InputLabel htmlFor="my-input4">Email</InputLabel>
                <Input id="my-input4" aria-describedby="my-helper-text4" value={userData.email} name="email" onChange={(e) => changeUserForm(e.target)}/>
                <FormHelperText id="my-helper-text4"></FormHelperText>
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classesGrid.paper}>
          <InputLabel htmlFor="my-input5">Teléfono*</InputLabel>
                <Input id="my-input5" aria-describedby="my-helper-text5" value={userData.phone} name="phone" onChange={(e) => changeUserForm(e.target)}/>
                <FormHelperText id="my-helper-text5"></FormHelperText>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs>
          <Paper className={classesGrid.paper}>
          <InputLabel htmlFor="my-input6">Calle*</InputLabel>
                <Input id="my-input6" aria-describedby="my-helper-text6" value={userData.street} name="street" onChange={(e) => changeUserForm(e.target)}/>
                <FormHelperText id="my-helper-text6"></FormHelperText>
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classesGrid.paper}>
          <InputLabel htmlFor="my-input7">Colonia*</InputLabel>
                <Input id="my-input7" aria-describedby="my-helper-text7" value={userData.town} name="town" onChange={(e) => changeUserForm(e.target)}/>
                <FormHelperText id="my-helper-text7"></FormHelperText>
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classesGrid.paper}>
          <InputLabel htmlFor="my-input8">Ciudad/Municipio</InputLabel>
                <Input id="my-input8" aria-describedby="my-helper-text8" value={userData.city} name="city" onChange={(e) => changeUserForm(e.target)}/>
                <FormHelperText id="my-helper-text8"></FormHelperText>
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classesGrid.paper}>
          <InputLabel htmlFor="my-input9">C.P</InputLabel>
                <Input id="my-input9" aria-describedby="my-helper-text9" value={userData.zip} name="zip" onChange={(e) => changeUserForm(e.target)}/>
                <FormHelperText id="my-helper-text9"></FormHelperText>
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classesGrid.paper}>
          <InputLabel htmlFor="my-input10">Estado</InputLabel>
                <Input id="my-input10" aria-describedby="my-helper-text10" value={userData.state} name="state" onChange={(e) => changeUserForm(e.target)}/>
                <FormHelperText id="my-helper-text10"></FormHelperText>
          </Paper>
        </Grid>
      </Grid>
    </div> 
                    <br/>
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
              {
                  (Number(row.order) <= Number(row.venta_menudeo))
                  ? <TableCell align="right"><NumberFormat value={Number(row.order) * Number(row.importe_menudeo)} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={'$'} /> MXN</TableCell>
                  : null
              }
              {
                  (Number(row.order) >= Number(row.venta_mayoreo))
                  ? <TableCell align="right"><NumberFormat value={Number(row.order) * Number(row.importe_mayoreo)} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={'$'} /> MXN</TableCell>
                  : null
              }
              <TableCell align="right"><Edit style={{cursor:'pointer'}} onClick={() => editThisProduct(row)}/><DeleteForever style={{cursor:'pointer'}} onClick={() => deleteThisProduct(row)}/></TableCell>
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
                     <button className="btn hvr-hover" type="submit" onClick={() => buyCart()} disabled={allowBuyingButton || props.cart.length == 0}>Realizar compra</button>
                     <button className="btn hvr-hover" type="submit" onClick={() => declineCart()}>Rechazar compra</button>
                </p>
            </div>

            {boughtSuccess
            ?
            <div className="datos"> {/* <!-- Ticke Datos-> */}
                <Link to='/shop' className="nav-link dropdown-toggle arrow" data-toggle="dropdown">Gracias por su compra. Click aquí para realizar nueva compra.</Link>
            </div>
            :
            null
            }
            


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
    <Modal
            open={open}
            onClose={() => handleClose()}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
                {body}
        </Modal>
        {/* This is modal to check if buying proccess was correct or not */}
        <Modal
            open={openBoughtModal}
            onClose={() => setOpenBoughtModal(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
                {bodyBought}
        </Modal>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)
