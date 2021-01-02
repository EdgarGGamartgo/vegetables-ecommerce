import './../css/bootstrap.min.css';
import './../css/style.css';
import './../css/responsive.css';
import './../css/custom.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { Store } from './../assets/Store'
import { makeStyles } from '@material-ui/core/styles';
import { Modal } from '@material-ui/core';
import groupBy from 'lodash/groupBy'
import { connect } from 'react-redux'
import { buyProduct, settingStore, addProductCart } from '../redux'
import axios from 'axios'
import Header from './../components/Header'
  
  function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      justify: 'center',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[1],
      padding: theme.spacing(2, 4, 3),
    },
  }));

const mapStateToProps = (state, ownProps) => {
    /*const itemState = ownProps.cake
      ? state.cake.numOfCakes
      : state.iceCream.numOfIceCreams*/

    return {
        item: state,
        cart: state
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    
    // const dispatchFunction = ownProps.product
    //   ? (number) => dispatch(buyProduct(number))
    //   : (number) => dispatch(buyProduct(number))

    return {
        //buyItem: dispatchFunction,
        setStore: (initStore) => dispatch(settingStore(initStore)),
        setProductToCart: (product) => dispatch(addProductCart(product)),
    }
}  

const Shop = (props) => {

    const [products, setProducts] = useState(props.item.store.products)
    const [buyingQuantity, setBuyingQuantity] = useState(0)
    const [currentProduct, setCurrentProduct] = useState({
        quantity: 0,
        name: ''
    })
    const [modalContent, setModalContent] = useState({
        title: 'Compra invalida',
        content: `Su compra es invalida. Solamente tenemos ${currentProduct.quantity} Kg de ${currentProduct.name}. Desea comprar los kilos disponibles?`,
    })
    const [cart, setCart] = useState([])
    const [productFilter, setProductFilter] = useState('') 
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [sortedProducts, setSortedProducts] = useState([]);
    const sortingGrid = (sortBy) => {
        console.log('sortBy: ', sortBy)
        setProductFilter(sortBy)
    }

    const goToCart = () => {
        setOpen(false)
        console.log('Cart is : ', cart)
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const authPurchase = () => {
        // currentProduct
            let quantitySet = currentProduct.existencia
            let setPro = currentProduct
            setPro.existencia = 0
            let nameSet = currentProduct.nombre_producto
            setModalContent({
                title: 'Compra invalida',
                content: `Su compra es invalida. Solamente tenemos ${quantitySet} Kg de ${nameSet}. Desea comprar los kilos disponibles?`,
                ok: true
            })
            // let updatedStore = products
            // for (var i=0; i < products.length; i++) {
            //     if (products[i].id === currentProduct.id) {
            //         updatedStore[i].quantity = 0
            //     }
            // }
        //setProducts(updatedStore)
        props.setProductToCart([{
            id_producto: currentProduct.id_producto,
            order: Number(quantitySet),
            unidad: currentProduct.unidad,
            desc: currentProduct.nombre_producto,
            price: currentProduct.costo
        }])
        setOpen(false)
        //props.buyItem(quantitySet)
        setModalContent({
            title: 'Exito',
            content: `Se ha agregado a carrito ${quantitySet} Kg de ${currentProduct.nombre_producto}.`,
            ok: false
        })
        // let newCart = cart
        // newCart.push({
        //     quantitySet: quantitySet,
        //     id: currentProduct.id
        // })
        // setCart(newCart)
        setOpen(true)
        // console.log('New Store: ', products)
        // const groupC = groupBy(cart, 'id')
        // let finalCart = []
        //         for (const property in groupC) {
        //             let inQuantity = 0
        //              for (const element of groupC[`${property}`]) {
        //                  inQuantity = inQuantity + Number(element.quantity)                    
        //             }
        //              finalCart.push({
        //                 id:  property,
        //                 quantity: inQuantity
        //              })
        //         }
        //         setCart(finalCart)
    }

    const nonAuthPurchase = () => {
        setOpen(false)
        console.log('New Store: ', products)
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
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
                    <button onClick={() => goToCart()}>OK</button>
            }
            
        </div>
    );

    useEffect(() => {
        //sortedProducts, setSortedProducts
        if (props && props.cart && props.cart.store && props.cart.store.products) {
            const products = props.cart.store.products.filter(e => e.nombre_producto.toLowerCase().includes(productFilter.toLowerCase()))
            console.log('Getting real stuff: ', products)
            setSortedProducts(products)
        }
        return () => {
            //cleanup
        }
    }, [productFilter])

    useEffect(() => {
        (async() => {
            const products = await axios.get('http://localhost:3001/products')
            console.log('products:: ', products.data)
            props.setStore(products.data)
            setProducts(products.data.products)
        })()
    }, [])

    const showCurrentStore = () => {
        console.log('Current state of store: ', props.item)
    }

    const setGrid = () => {
        console.log('setGrid ', props.item.store.products)
        setProducts(props.item.store.products)
    }

    const deleteProduct = (quantityProduct, id) => {
            // console.log('How much will you buy? ', quantityProduct)
            // let result = products.filter(product => product.id === id)
            // console.log('Which product did you choose? ', result)
            console.log('props.item: ', props.item)
            let currentProduct = props.item.store.products.filter(p => p.id_producto === id)
            console.log('currentProduct: ', currentProduct, id)
            setCurrentProduct(currentProduct[0])
            if (quantityProduct <= currentProduct[0].existencia) {
                // const newStore = result[0].quantity - quantityProduct
                // console.log('Which is the new quantity? ', newStore)
                // let updatedStore = products
                // for (var i=0; i < products.length; i++) {
                //     if (products[i].id === id) {
                //         result[0].quantity = newStore
                //         updatedStore[i] = result[0]
                //     }
                // }
                // setProducts(updatedStore)
                // console.log('Current Product is: ', currentProduct)
                //props.buyItem(quantityProduct)
                props.setProductToCart([{
                    id_producto: currentProduct[0].id_producto,
                    order: Number(quantityProduct),
                    unidad: currentProduct[0].unidad,
                    desc: currentProduct[0].nombre_producto,
                    price: currentProduct[0].costo
                }])
                setModalContent({
                    title: 'Exito',
                    content: `Se ha agregado a carrito ${quantityProduct} Kg de ${currentProduct[0].nombre_producto}.`,
                    ok: false
                })
                // let newCart = cart
                // newCart.push({
                //     quantity: quantityProduct,
                //     id 
                // })
                // setCart(newCart)
                setOpen(true);
                // const groupC = groupBy(cart, 'id')
                // let finalCart = []
                // for (const property in groupC) {
                //     let inQuantity = 0
                //      for (const element of groupC[`${property}`]) {
                //          inQuantity = inQuantity + Number(element.quantity)                    
                //     }
                //      finalCart.push({
                //         id:  property,
                //         quantity: inQuantity
                //      })
                // }
                // setCart(finalCart)
                // console.log('finalCart: ', finalCart)
            } else {
                setModalContent({
                    title: 'Compra invalida',
                    content: `Su compra es invalida. Solamente tenemos ${currentProduct[0].existencia} Kg de ${currentProduct[0].nombre_producto} ¿ Desea comprar los kilos disponibles?`,
                    ok: true
                })
                //console.log(`There's only ${result[0].quantity} Kg in store. Whould you like to buy only the remaining ${result[0].quantity} Kg?`)
                setOpen(true);
            }
    }

    const changeBuyingQuitity = (quantity, id) => {
        // Set product id and buying quantity to Redux Store tp set Cart items
        console.log('This is my current store: ', props.item)
        setBuyingQuantity(quantity)
        // const addedProduct = props.item.store.products.filter(product => {
        //     return product.id_producto === id
        // })
        // console.log('Current product: ', addedProduct)
        // props.setProductToCart(addedProduct[0])
        
    }

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
            <div className="row">
                <div className="col-xl-9 col-lg-9 col-sm-12 col-xs-12 shop-content-right">
                    <div className="right-product-box">
                         <div className="product-item-filter row">
                            <div className="col-12 col-sm-8 text-center text-sm-left">
                                <div className="toolbar-sorter-right">
                                    <span>Búsqueda por '{productFilter === '' ? 'Todos': productFilter}'</span>
                                    {/* <select id="basic" className="selectpicker show-tick form-control" data-placeholder="$ USD">
									<option data-display="Select">Nothing</option>
									<option value="1">Popularity</option>
									<option value="2">High Price → High Price</option>
									<option value="3">Low Price → High Price</option>
									<option value="4">Best Selling</option>
								</select> */}
                                </div>
                                {/* <p>Mostrando {} resultados</p> */}
                            </div>
                            {/*<div className="col-12 col-sm-4 text-center text-sm-right">
                                <ul className="nav nav-tabs ml-auto">
                                    <li>
                                        <a className="nav-link active" href="#grid-view" data-toggle="tab"> <i className="fa fa-th"></i> </a>
                                    </li>
                                    <li>
                                        <a className="nav-link" href="#list-view" data-toggle="tab"> <i className="fa fa-list-ul"></i> </a>
                                    </li>
                                </ul>
                            </div> */}
                        </div> 

                        <div className="product-categorie-box">
                            <div className="tab-content">
                                <div role="tabpanel" className="tab-pane fade show active" id="grid-view">
                                    <div className="row">

                                        {products && productFilter === '' ? products.map(product => 
                                        
                                        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4" key={product.id_producto}>
                                            <div className="products-single fix">
                                                <div className="box-img-hover">
                                                    <div className="type-lb">
                                                        <p className="sale">Venta</p>
                                                        {/* <p className="sale">{product.nombre_producto}</p> */}
                                                    </div>
                                                    <img src={product.imagen} className="img-fluid" alt={product.nombre_producto}/>
                                                    <div className="mask-icon" > 
                                                         <ul>
                                                        {/*
                                                            <li><a href="#" data-toggle="tooltip" data-placement="right" title="View"><i className="fas fa-eye"></i></a></li>
                                                            <li><a href="#" data-toggle="tooltip" data-placement="right" title="Compare"><i className="fas fa-sync-alt"></i></a></li>
                                                            <li><a href="#" data-toggle="tooltip" data-placement="right" title="Add to Wishlist"><i className="far fa-heart"></i></a></li>
                                                        */}
                                                            </ul> 
                                                        <input type="text" placeholder={product.unidad} value={buyingQuantity} onChange={(e) => changeBuyingQuitity(e.target.value, product.id_producto)} />
                                                        <button onClick={() => deleteProduct(buyingQuantity, product.id_producto)} className="cart">Agregar a carrito</button>
                                                    </div>
                                                </div>
                                                <div className="why-text">
                                                    <h4>{product.nombre_producto}</h4>
                                                    <h5> $ {product.costo} MXN/{product.unidad}</h5>
                                                </div>
                                            </div>
                                        </div>
                                            
                                        ) : null}

                                {sortedProducts && productFilter !== '' ? sortedProducts.map(product => 
                                        
                                        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4" key={product.id_producto}>
                                            <div className="products-single fix">
                                                <div className="box-img-hover">
                                                    <div className="type-lb">
                                                        <p className="sale">Venta</p>
                                                        {/* <p className="sale">{product.nombre_producto}</p> */}
                                                    </div>
                                                    <img src={product.imagen} className="img-fluid" alt={product.nombre_producto}/>
                                                    <div className="mask-icon" > 
                                                         <ul>
                                                        {/*
                                                            <li><a href="#" data-toggle="tooltip" data-placement="right" title="View"><i className="fas fa-eye"></i></a></li>
                                                            <li><a href="#" data-toggle="tooltip" data-placement="right" title="Compare"><i className="fas fa-sync-alt"></i></a></li>
                                                            <li><a href="#" data-toggle="tooltip" data-placement="right" title="Add to Wishlist"><i className="far fa-heart"></i></a></li>
                                                        */}
                                                            </ul> 
                                                        <input type="text" placeholder={product.unidad} value={buyingQuantity} onChange={(e) => changeBuyingQuitity(e.target.value, product.id_producto)} />
                                                        <button onClick={() => deleteProduct(buyingQuantity, product.id_producto)} className="cart">Agregar a carrito</button>
                                                    </div>
                                                </div>
                                                <div className="why-text">
                                                    <h4>{product.nombre_producto}</h4>
                                                    <h5> $ {product.costo} MXN/{product.unidad}</h5>
                                                </div>
                                            </div>
                                        </div>
                                            
                                        ) : null}
                                        
                                    </div>
                                </div>
                                <div role="tabpanel" className="tab-pane fade" id="list-view">
                                    <div className="list-view-box">
                                        <div className="row">
                                            <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                                                <div className="products-single fix">
                                                    <div className="box-img-hover">
                                                        <div className="type-lb">
                                                            <p className="new">New</p>
                                                        </div>
                                                        <img src="images/img-pro-01.jpg" className="img-fluid" alt="Image"/>
                                                        <div className="mask-icon">
                                                            <ul>
                                                                <li><a href="#" data-toggle="tooltip" data-placement="right" title="View"><i className="fas fa-eye"></i></a></li>
                                                                <li><a href="#" data-toggle="tooltip" data-placement="right" title="Compare"><i className="fas fa-sync-alt"></i></a></li>
                                                                <li><a href="#" data-toggle="tooltip" data-placement="right" title="Add to Wishlist"><i className="far fa-heart"></i></a></li>
                                                            </ul>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 col-md-6 col-lg-8 col-xl-8">
                                                <div className="why-text full-width">
                                                    <h4>Lorem ipsum dolor sit amet</h4>
                                                    <h5> <del>$ 60.00</del> $40.79</h5>
                                                    <p>Integer tincidunt aliquet nibh vitae dictum. In turpis sapien, imperdiet quis magna nec, iaculis ultrices ante. Integer vitae suscipit nisi. Morbi dignissim risus sit amet orci porta, eget aliquam purus
                                                        sollicitudin. Cras eu metus felis. Sed arcu arcu, sagittis in blandit eu, imperdiet sit amet eros. Donec accumsan nisi purus, quis euismod ex volutpat in. Vestibulum eleifend eros ac lobortis aliquet.
                                                        Suspendisse at ipsum vel lacus vehicula blandit et sollicitudin quam. Praesent vulputate semper libero pulvinar consequat. Etiam ut placerat lectus.</p>
                                                    <a className="btn hvr-hover" href="#">Add to Cart</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="list-view-box">
                                        <div className="row">
                                            <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                                                <div className="products-single fix">
                                                    <div className="box-img-hover">
                                                        <div className="type-lb">
                                                            <p className="sale">Sale</p>
                                                        </div>
                                                        <img src="images/img-pro-02.jpg" className="img-fluid" alt="Image"/>
                                                        <div className="mask-icon">
                                                            <ul>
                                                                <li><a href="#" data-toggle="tooltip" data-placement="right" title="View"><i className="fas fa-eye"></i></a></li>
                                                                <li><a href="#" data-toggle="tooltip" data-placement="right" title="Compare"><i className="fas fa-sync-alt"></i></a></li>
                                                                <li><a href="#" data-toggle="tooltip" data-placement="right" title="Add to Wishlist"><i className="far fa-heart"></i></a></li>
                                                            </ul>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 col-md-6 col-lg-8 col-xl-8">
                                                <div className="why-text full-width">
                                                    <h4>Lorem ipsum dolor sit amet</h4>
                                                    <h5> <del>$ 60.00</del> $40.79</h5>
                                                    <p>Integer tincidunt aliquet nibh vitae dictum. In turpis sapien, imperdiet quis magna nec, iaculis ultrices ante. Integer vitae suscipit nisi. Morbi dignissim risus sit amet orci porta, eget aliquam purus
                                                        sollicitudin. Cras eu metus felis. Sed arcu arcu, sagittis in blandit eu, imperdiet sit amet eros. Donec accumsan nisi purus, quis euismod ex volutpat in. Vestibulum eleifend eros ac lobortis aliquet.
                                                        Suspendisse at ipsum vel lacus vehicula blandit et sollicitudin quam. Praesent vulputate semper libero pulvinar consequat. Etiam ut placerat lectus.</p>
                                                    <a className="btn hvr-hover" href="#">Add to Cart</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="list-view-box">
                                        <div className="row">
                                            <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                                                <div className="products-single fix">
                                                    <div className="box-img-hover">
                                                        <div className="type-lb">
                                                            <p className="sale">Sale</p>
                                                        </div>
                                                        <img src="images/img-pro-03.jpg" className="img-fluid" alt="Image"/>
                                                        <div className="mask-icon">
                                                            <ul>
                                                                <li><a href="#" data-toggle="tooltip" data-placement="right" title="View"><i className="fas fa-eye"></i></a></li>
                                                                <li><a href="#" data-toggle="tooltip" data-placement="right" title="Compare"><i className="fas fa-sync-alt"></i></a></li>
                                                                <li><a href="#" data-toggle="tooltip" data-placement="right" title="Add to Wishlist"><i className="far fa-heart"></i></a></li>
                                                            </ul>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 col-md-6 col-lg-8 col-xl-8">
                                                <div className="why-text full-width">
                                                    <h4>Lorem ipsum dolor sit amet</h4>
                                                    <h5> <del>$ 60.00</del> $40.79</h5>
                                                    <p>Integer tincidunt aliquet nibh vitae dictum. In turpis sapien, imperdiet quis magna nec, iaculis ultrices ante. Integer vitae suscipit nisi. Morbi dignissim risus sit amet orci porta, eget aliquam purus
                                                        sollicitudin. Cras eu metus felis. Sed arcu arcu, sagittis in blandit eu, imperdiet sit amet eros. Donec accumsan nisi purus, quis euismod ex volutpat in. Vestibulum eleifend eros ac lobortis aliquet.
                                                        Suspendisse at ipsum vel lacus vehicula blandit et sollicitudin quam. Praesent vulputate semper libero pulvinar consequat. Etiam ut placerat lectus.</p>
                                                    <a className="btn hvr-hover" href="#">Add to Cart</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
				<div className="col-xl-3 col-lg-3 col-sm-12 col-xs-12 sidebar-shop-left">
                    <div className="product-categori">
                        <div className="search-product">
                            <form action="#">
                                <input className="form-control" type="text" placeholder="Jitomate, fresa, ..." value={productFilter} onChange={(e) => sortingGrid(e.target.value)} />
                                <button type="submit"> <i className="fa fa-search"></i> </button>
                            </form>
                        </div>
                        {/* <div className="filter-sidebar-left">
                            <div className="title-left">
                                <h3>Categories</h3>
                            </div>
                            <div className="list-group list-group-collapse list-group-sm list-group-tree" id="list-group-men" data-children=".sub-men">
                                <div className="list-group-collapse sub-men">
                                    <a className="list-group-item list-group-item-action" href="#sub-men1" data-toggle="collapse" aria-expanded="true" aria-controls="sub-men1">Fruits & Drinks <small className="text-muted">(100)</small>
								</a>
                                    <div className="collapse show" id="sub-men1" data-parent="#list-group-men">
                                        <div className="list-group">
                                            <a href="#" className="list-group-item list-group-item-action active">Fruits 1 <small className="text-muted">(50)</small></a>
                                            <a href="#" className="list-group-item list-group-item-action">Fruits 2 <small className="text-muted">(10)</small></a>
                                            <a href="#" className="list-group-item list-group-item-action">Fruits 3 <small className="text-muted">(10)</small></a>
                                            <a href="#" className="list-group-item list-group-item-action">Fruits 4 <small className="text-muted">(10)</small></a>
                                            <a href="#" className="list-group-item list-group-item-action">Fruits 5 <small className="text-muted">(20)</small></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-group-collapse sub-men">
                                    <a className="list-group-item list-group-item-action" href="#sub-men2" data-toggle="collapse" aria-expanded="false" aria-controls="sub-men2">Vegetables 
								<small className="text-muted">(50)</small>
								</a>
                                    <div className="collapse" id="sub-men2" data-parent="#list-group-men">
                                        <div className="list-group">
                                            <a href="#" className="list-group-item list-group-item-action">Vegetables 1 <small className="text-muted">(10)</small></a>
                                            <a href="#" className="list-group-item list-group-item-action">Vegetables 2 <small className="text-muted">(20)</small></a>
                                            <a href="#" className="list-group-item list-group-item-action">Vegetables 3 <small className="text-muted">(20)</small></a>
                                        </div>
                                    </div>
                                </div>
                                <a href="#" className="list-group-item list-group-item-action"> Grocery  <small className="text-muted">(150) </small></a>
                                <a href="#" className="list-group-item list-group-item-action"> Grocery <small className="text-muted">(11)</small></a>
                                <a href="#" className="list-group-item list-group-item-action"> Grocery <small className="text-muted">(22)</small></a>
                            </div>
                        </div> */}
                        {/* <div className="filter-price-left">
                            <div className="title-left">
                                <h3>Price</h3>
                            </div>
                            <div className="price-box-slider">
                                <div id="slider-range"></div>
                                <p>
                                    <input type="text" id="amount" readOnly />
                                    <button className="btn hvr-hover" type="submit">Filter</button>
                                </p>
                            </div>
                        </div> */}
                    </div>
                </div>
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
    {/* <!-- End copyright  --> */}
        <Modal
            open={open}
            onClose={() => handleClose()}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
                {body}
        </Modal>
    </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Shop)
