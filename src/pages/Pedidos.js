import { useState, useEffect } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { addProductCart } from '../redux'
import '../css/pedidos.css'
import { SpacingGrid } from '../components/Cards'
import { Input, InputAdornment, Button, Modal } from '@material-ui/core'
import Search from '@material-ui/icons/Search';

const mapStateToProps = (state, ownProps) => {
    return {
        cart: state.cart.products
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addThisProduct: (product) => dispatch(addProductCart(product)),
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

const Pedidos = () => {
    const classesModal = useStylesModal();
    const [open, setOpen] = useState(false)
    const [modalStyle] = useState(getModalStyle);
    const [folio, setFolio] = useState('')

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
    }
    
    const showAllOrders = () => {
        console.log('showAllOrders: ', folio)
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
                                    style={{ backgroundColor: 'white', marginLeft: '55px', marginTop: '15px' }}
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
                        </div>
                        <SpacingGrid />
                    </div>
                </div>
            </div>
            {/* HOLA SOY PEDIDOS!
            <button type="button" onClick={() => handleOpen()}>Open Modal</button>
            <Modal
            open={open}
            onClose={() => handleClose()}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            >
                {body}
            </Modal> */}
 
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Pedidos)

