import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Paper, Modal } from '@material-ui/core';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import { Edit, DeleteForever } from '@material-ui/icons'
import NumberFormat from 'react-number-format'
import { formatDecimals } from '../utils/formatDecimals';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});
function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
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
export const ProductsTable = (props) => {
    const [modalStyle] = useState(getModalStyle);
    const classesModal = useStylesModal();
    const [dataTable, setDataTable] = useState([])
    const [originalProducts, setOriginalProducts] = useState([])
    const [modalContent, setModalContent] = useState({
        title: 'Modifique la cantidad a comprar',
        content: ``,
    })
    const [warningMsg, setWarningMsg] = useState(false)
    const [initialCost, setInitialCost] = useState(false)    
    const [open, setOpen] = useState(false);
    const [currentProductQuantity, setCurrentProductQuantity] = useState('');
    const changeBuyingQuantity = (quantity) => {
        console.log('Print quantity: ', quantity)
        if (quantity.includes('.')) {
            quantity = formatDecimals(quantity)
        }
        setCurrentProductQuantity(quantity)
    }
    const [currentProduct, setCurrentProduct] = useState(0)

    useEffect(() => {
        console.log('KAWAIIDESUNE!: ', currentProduct)
        let mounted = true
        if(mounted && currentProduct.cantidad) {
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

    const goToCart = () => {

        // currentProductQuantity
        // currentProduct
        // dataTable
        const tableRows = dataTable
        for (const row of tableRows) {
            if(row.nombre_producto === currentProduct.nombre_producto) {
                row.cantidad = currentProductQuantity
            }
        }
        setInitialCost(true)
        setDataTable(tableRows) 
        // Dispatch EDIT_PRODUCT action
        // const remainingProducts = props.cart.filter(p => p.id_producto != currentProduct.id_producto)
        // props.deleteThisProduct(remainingProducts)
        // currentProduct.order = currentProductQuantity
        // props.addThisProduct([currentProduct])
        handleClose()
    }
    const handleOpen = (product) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const body = (
        <div style={modalStyle} className={classesModal.paper}>
            <h2 id="simple-modal-title">{modalContent.title}</h2>
            <p id="simple-modal-description">
                {modalContent.content}
            </p>

            <>
                <input type="text" value={currentProductQuantity} onChange={(e) => changeBuyingQuantity(e.target.value)} />
                <button onClick={() => goToCart()} disabled={warningMsg}>OK</button>
                {
                    warningMsg
                        ? <p>Este producto solo se vende por PZA</p>
                        : null
                }
            </>


        </div>
    );

    useEffect(() => {
        if (originalProducts.length !== 0) {
            console.log('RUNS ONLY IF originalProducts.length !== 0')
            const arrangedData = props.data.map(e => {
                console.log('originalProducts PO: ', originalProducts)

                const foundProduct = originalProducts.find(f => {
                    console.log('f: ', f)
                    return f.nombre_producto === e.nombre_producto
                })

                console.log('foundProduct: ', foundProduct)
                console.log('e: ', e)

                return {
                    ...e,
                    venta_mayoreo: foundProduct.venta_mayoreo,
                    venta_menudeo: foundProduct.venta_menudeo,
                    importe_mayoreo: foundProduct.importe_mayoreo,
                    importe_menudeo: foundProduct.importe_menudeo,
                }
            })
            setDataTable(arrangedData)
        }
        // return () => {
        //     cleanup
        // }
    }, [originalProducts])

    useEffect(() => {
        (async () => setOriginalProducts(await getProductByName()))()
        console.log('Props from ProductsTable: ', props.data)
        setDataTable(props.data)
        console.log(getProductByName().then((res) => console.log('KARADESKARA: ', res)))
        // return () => {
        //     cleanup
        // }
    }, [])

    const editThisProduct = (param) => {
        console.log('editThisProduct: ', param)
        handleOpen()
        setCurrentProduct(param)
    }

    const deleteThisProduct = (param) => {
        console.log('deleteThisProduct: ', param)
    }

    const getProductByName = async () => {
        return await Promise.all(
            props.data.map(async (e) => {
                console.log('MAICHIRYU: ', e)
                const product = await axios.get(`http://localhost:3001/product/${e.nombre_producto}`)
                console.log('product: ', product)
                return product.data.product
            })
        )
    }

    const getData = () => {
        console.log('Data from ProductsTable: ', originalProducts)
    }

    return (
        <>
            <TableContainer>
                <Table>
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
                        {dataTable.map((row) => (
                            <TableRow key={row.id_venta}>
                                <TableCell component="th" scope="row">
                                    {row.cantidad}
                                </TableCell>
                                <TableCell align="right">{row.unidad}</TableCell>
                                <TableCell align="right">{row.nombre_producto}</TableCell>
                                {/* <TableCell align="right"><button onClick={() => getData()}>ASHITA</button> </TableCell> */}
                                {
                                    (Number(row.cantidad) <= Number(row.venta_menudeo))
                                        ? <TableCell align="right"><NumberFormat value={Number(row.importe_menudeo)} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={'$'} /> MXN</TableCell>
                                        : null
                                }
                                {
                                    (Number(row.cantidad) >= Number(row.venta_mayoreo))
                                        ? <TableCell align="right"><NumberFormat value={Number(row.importe_mayoreo)} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={'$'} /> MXN</TableCell>
                                        : null
                                }
                                
                                {
                                    (Number(row.cantidad) <= Number(row.venta_menudeo) && initialCost)
                                        ? <TableCell align="right"><NumberFormat value={Number(row.importe_menudeo) * Number(row.cantidad)} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={'$'} /> MXN</TableCell>
                                        : null
                                }
                                {
                                    (Number(row.cantidad) >= Number(row.venta_mayoreo) && initialCost)
                                        ? <TableCell align="right"><NumberFormat value={Number(row.importe_mayoreo) * Number(row.cantidad)} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={'$'} /> MXN</TableCell>
                                        : null
                                }
                                {
                                    !initialCost
                                    ? <TableCell align="right"><NumberFormat value={Number(row.importe_producto)} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={'$'} /> MXN</TableCell>
                                    : null
                                }
                                
                                {/* {
                                    (Number(row.order) <= Number(row.venta_menudeo))
                                        ? <TableCell align="right"><NumberFormat value={Number(row.order) * Number(row.importe_menudeo)} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={'$'} /> MXN</TableCell>
                                        : null
                                }
                                {
                                    (Number(row.order) >= Number(row.venta_mayoreo))
                                        ? <TableCell align="right"><NumberFormat value={Number(row.order) * Number(row.importe_mayoreo)} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={'$'} /> MXN</TableCell>
                                        : null
                                } */}
                                <TableCell align="right"><Edit style={{ cursor: 'pointer' }} onClick={() => editThisProduct(row)} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                open={open}
                onClose={() => handleClose()}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </>
    )
}