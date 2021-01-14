import { useState, useEffect } from 'react'
import { Modal } from '@material-ui/core';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { addProductCart } from '../redux'
import '../css/pedidos.css'
import { SpacingGrid } from '../components/Cards'

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

    useEffect(() => {
        return () => {
            console.log('Clean from Pedidos')
        }
    }, [])

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

