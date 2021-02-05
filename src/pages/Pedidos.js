import { useState, useEffect } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { addProductCart, filterCards } from '../redux'
import '../css/pedidos.css'
import SpacingGrid from '../components/Cards'
import { Input, InputAdornment, Button, Modal } from '@material-ui/core'
import Search from '@material-ui/icons/Search';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const mapStateToProps = (state, ownProps) => {
    return {
        cart: state.cart.products
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addThisProduct: (product) => dispatch(addProductCart(product)),
        filterCards: (folio) => dispatch(filterCards(folio)),
    }
}

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
function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

const Pedidos = (props) => {
    const classes = useStyles();
    const classesModal = useStylesModal();
    const [open, setOpen] = useState(false)
    const [modalStyle] = useState(getModalStyle);
    const [folio, setFolio] = useState('')
    const [isSales, setIsSales] = useState(false)

    useEffect(() => {
        console.log('folio: ', folio)
        return () => {
            console.log('Clean from Pedidos')
        }
    }, [folio])

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const body = (
        <div style={modalStyle} className={classesModal.paper}>
            <h2 id="simple-modal-title">TITLE</h2>
            <p id="simple-modal-description">
                HOLA SOY UNA MODAL
            </p>
            <button type="button" onClick={() => handleClose()}>OK</button>
        </div>
    );

    const handleOrder = (folio) => {
        setFolio(folio)
    }

    const showOrder = () => {
        console.log('showOrder folio: ', folio)
        if(folio !== '') {
            props.filterCards(folio)
        }
    }
    
    const showAllOrders = () => {
        console.log('showAllOrders: ', folio)
    }

    const showAllSales = () => {
        console.log('showAllSales: ', isSales)
        setIsSales(!isSales)
    }
    
    return (
        <div>
            <div >
                <header className="App-header">
                    <p>
                        Lista de pedidos a surtir
                    </p>
                </header>

                <div className="imagfond">
                    <div className="dark-overlay">
                        <div className="mibordwhite">
                            <Input
                                    value={folio}
                                    onChange={(e) => handleOrder(e.target.value)}
                                    placeholder="Folio del pedido"
                                    style={{ backgroundColor: 'white', marginLeft: '90px', marginTop: '15px' }}
                                    id="input-with-icon-adornment"
                                    startAdornment={
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                    }
                            />
                            <Button style=
                            {{ backgroundColor: 'white', marginLeft: '5px', marginBottom: '16px', height: '30px'}}
                            onClick={() => showOrder()}
                            >Buscar pedido</Button>
                            <Button style=
                            {{ backgroundColor: 'white', marginLeft: '5px', marginBottom: '16px', height: '30px'}}
                            onClick={() => showAllOrders()}
                            >Mostrar todos los pedidos eliminados</Button>
                            <Button style=
                            {{ backgroundColor: 'white', marginLeft: '5px', marginBottom: '16px', height: '30px'}}
                            onClick={() => showAllSales()}
                            >{ isSales ? 'Mostrar tarjetas de pedidos' : 'Mostrar tabla de ventas' }</Button>
                        </div>
                        {
                           isSales ? 
                           <div className="shop-box-inner">
                                <div className="container">
                                <>
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
                                        {/* Here Goes Some Content */}
                                        </TableBody>
                                    </Table>
                                    </TableContainer><br/>
                                    <Button style=
                                                {{ backgroundColor: 'white' }}
                                                onClick={() => showAllSales()}
                                    >Regresar</Button>
                                    </>                 
                            </div>
                            </div>

                        : <SpacingGrid />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Pedidos)

