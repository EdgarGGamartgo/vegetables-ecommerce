import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import { Edit, DeleteForever } from '@material-ui/icons'

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export const ProductsTable = (props) => {

    const classes = useStyles();
    const [dataTable, setDataTable] = useState([])

    useEffect(() => {
        console.log('Props from ProductsTable: ', props.data)
        setDataTable(props.data)
        // return () => {
        //     cleanup
        // }
    }, [])

    const editThisProduct = (param) => {
        console.log('editThisProduct: ', param)
    }

    const deleteThisProduct = (param) => {
        console.log('deleteThisProduct: ', param)
    }

    return (
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
                    {/* {dataTable.map((row) => (
                            <TableRow key={row.id_venta}>
                                <TableCell component="th" scope="row">
                                    {row.order}
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
                                <TableCell align="right"><Edit style={{ cursor: 'pointer' }} onClick={() => editThisProduct(row)} /><DeleteForever style={{ cursor: 'pointer' }} onClick={() => deleteThisProduct(row)} /></TableCell>
                            </TableRow>
                        ))} */}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}