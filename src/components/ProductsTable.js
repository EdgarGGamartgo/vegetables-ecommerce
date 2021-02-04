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
import { connect } from 'react-redux'
import FileSaver from 'file-saver';


const mapStateToProps = (state, ownProps) => {
    console.log('Listening to Card events: ', state.card.products)
    return {
        card: state.card.products,
        downloads: state.card.downloads,
    }
}
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
const ProductsTable = (props) => {
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
        (async () => {
            try {
                console.log('downloads: ', props.downloads, dataTable, props.user)
                const products = dataTable.map(e => {
                    let costo_unidad = 1
                    if (Number(e.cantidad) <= Number(e.venta_menudeo)) {
                        costo_unidad = Number(e.importe_menudeo).toFixed(2)
                    }

                    if (Number(e.cantidad) >= Number(e.venta_mayoreo)) {
                        costo_unidad = Number(e.importe_mayoreo).toFixed(2)
                    }
                    return {
                        costo_unidad,
                        folio: e.folio,
                        importe_producto: e.importe_producto,
                        importe_total: e.importe_total,
                        nombre_producto: e.nombre_producto,
                        order: e.cantidad,
                        unidad: e.unidad,
                    }
                })
                const userData = {
                    city: "",
                    email: "",
                    lastName: "",
                    name: props.user.cliente,
                    phone: "",
                    secondLastName: "",
                    state: "",
                    street: props.user.direccion,
                    town: "",
                    zip: "",
                }
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
                // const response = await axios.post('http://localhost:3001/sale/create', {
                //     products,
                //     userData
                // })
                if (file.data) {
                    FileSaver.saveAs(
                        new Blob([file.data], { type: 'application/pdf' }),
                        `pedido_aceptado.pdf`
                    );
                }
                props.reEnable(!props.enableDownload)
            } catch (e) {
                console.log("ERROR WHEN DOWNLOADING PDF: ",e, e.response)
            }
        })()
    }, [props.downloads])

    useEffect(() => {
        if (props.card > 0 && dataTable.length > 0) {
            (async () => {
                console.log('Listener Products Table Updated Card: ', props.card)
                console.log('New Table Updated Card: ', dataTable)
                const userId = dataTable[0].usuario.id_usuario
                let importe_total = 0
                const sanitizedDataTable = dataTable.map(product => {
                    let importe_producto = 0
                    if (Number(product.cantidad) <= Number(product.venta_menudeo)) {
                        importe_producto = Number((Number(product.importe_menudeo) * Number(product.cantidad)).toFixed(2))
                    }

                    if (Number(product.cantidad) >= Number(product.venta_mayoreo)) {
                        importe_producto = Number((Number(product.importe_mayoreo) * Number(product.cantidad)).toFixed(2))
                    }
                    importe_total += importe_producto
                    return {
                            folio: dataTable[0].folio,
                            codigo_compra: dataTable[0].folio,
                            nombre_producto: product.nombre_producto,
                            cantidad: product.cantidad,
                            unidad: product.unidad,
                            costo_unidad: null,
                            importe_producto,
                            importe_total: 0,
                            estatus: 'PENDIENTE', // VALIDADA, RECHAZADA, PENDIENTE
                            isVisible: true,
                            usuarioIdUsuario: userId
                    }
                })
                for (const product of sanitizedDataTable) {
                    product.importe_total = Number(importe_total.toFixed(2))
                }
                
                try {
                    await axios.put(`http://localhost:3001/update/sale/${dataTable[0].folio}`, { products: sanitizedDataTable })
                } catch (e) {
                    console.log('Error when updatin Card Products: ', e)
                }
            })()
        }
    }, [props.products])

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

    useEffect(() => {
        console.log('Change props from Products Tabvle: ', props)
    }, [props.data])

    const editThisProduct = (param) => {
        console.log('editThisProduct: ', param)
        handleOpen()
        setCurrentProduct(param)
    }

    const deleteThisProduct = (param) => {
        console.log('deleteThisProduct: ', param)
        const newProducts = dataTable.filter(e => e.nombre_producto !== param.nombre_producto)
        setDataTable(newProducts)
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
                                
                                {/* {lse }).then(result => {
    app.listen(port, () =>
                                }
                                {
                                    (Number(row.order) >= Number(row.venta_mayoreo))
                                        ? <TableCell align="right"><NumberFormat value={Number(row.order) * Number(row.importe_mayoreo)} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={'$'} /> MXN</TableCell>
                                        : null
                                } */}
                                <TableCell align="right"><Edit style={{ cursor: 'pointer' }} onClick={() => editThisProduct(row)} /><DeleteForever style={{cursor:'pointer'}} onClick={() => deleteThisProduct(row)}/></TableCell>
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

export default connect(mapStateToProps)(ProductsTable)
