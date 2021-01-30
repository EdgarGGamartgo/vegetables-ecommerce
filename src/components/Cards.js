import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import { Modal, Button} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import DeleteIcon from '@material-ui/icons/Delete';
import { lightGreen } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import axios from 'axios'
import './../css/styles-card.css';
import _ from 'lodash'
import ProductsTable from './ProductsTable'
import { DropDownMenu } from './DropdownMenu'
import { connect } from 'react-redux'
import { updateCardProducts } from '../redux'

const mapStateToProps = (state, ownProps) => {
  console.log('REDUX FROM CARDS COMPONENT: ')
  return {
      item: 0, //itemState
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      updateCardProducts: (products) => dispatch(updateCardProducts(products)),
  }
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

const Green = withStyles({
    switchBase: {
      color: lightGreen[50],
      '&$checked': {
        color: lightGreen[500],
      },
      '&$checked + $track': {
        backgroundColor: lightGreen[500],
      },
    },
    checked: {},
    track: {},
  })(Switch);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  paper: {
    height: 250,
    width: 250,
    border:2,
  },
  control: {
    padding: theme.spacing(2),
  },
  button:{
    fontSize:10,
    border:5,
    paddingLeft:10,
    paddingRight:10,
    
  }
}));

const useStylesModal = makeStyles((theme) => ({
  paper: {
      position: 'absolute',
      justify: 'center',
      left: '50%',
      width: 1000,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[1],
      padding: theme.spacing(2, 4, 3),
  },
}));



const SpacingGrid = (props) => {



  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const classesModal = useStylesModal();
  
  const [valueSW, setValueSW] = useState(false); 
  const [open, setOpen] = useState(false); 
  const [componentNotes, setComponentNotes] = useState([])
  const [currentCard, setCurrentCard] = useState({})
  const [allProducts, setAllProducts] = useState([])

  const buttonStyle = {
    alignSelf: 'center'
  }

  const handleAdd = () => {
    console.log('currentCard.articulos: ') //, currentCard.articulos
    handleClose()
    setTimeout(() => {
      handleOpen(currentCard)
    }, 1)
  }
  
  const handleChildrenProduct = (childProduct) => {
    if (childProduct) {
      let currentProductsCard = currentCard
      console.log('allProducts[0].usuario.id_usuario" ', currentProductsCard)
      currentProductsCard.articulos.push({
        usuario: {
          id_usuario: currentProductsCard.articulos[0].usuario.id_usuario
        },
        cantidad: 1,
        folio: currentProductsCard.articulos[0].folio,
        importe_producto: childProduct.importe_menudeo,
        importe_total: 0,
        isVisible: true,
        nombre_producto: childProduct.nombre_producto,
        unidad: childProduct.unidad,
      })
      currentProductsCard.nande = '1'
      setCurrentCard(currentProductsCard)
      console.log('OMOIDAKEDO: ', childProduct, currentCard)
    }
  }

  const body = (
    <div style={modalStyle} className={classesModal.paper}>
        <h2 id="simple-modal-title">DETALLE DE PEDIDO</h2><br/>
          <ProductsTable data={currentCard.articulos}  /><br/> 
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Button variant="outlined" onClick={() => confirmChanges()}>CONFIRMAR CAMBIOS</Button>
          <Button variant="outlined" onClick={() => handleClose()}>CANCELAR</Button>
          <Button variant="outlined" onClick={() => handleAdd()}>AGREGAR</Button>
          <DropDownMenu style={buttonStyle} data={allProducts} childrenProduct={handleChildrenProduct}/>
        </div>
    </div>
  );

  const confirmChanges = () => {
    console.log('confirmChanges: ', currentCard)
    props.updateCardProducts(1)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = (nota) => {
    console.log('nota: ', nota)
    setCurrentCard(nota)
    setOpen(true)
  }

  const handleSwitch = (check, folio) => {
    console.log('folio: ', folio)
    console.log('componentNotes before: ', componentNotes)
    const notes = componentNotes.map(note => {
      if (note.folio === folio) {
        return {
          ...note,
          isChecked: check
        }
      }
      return {
        ...note
      }
    })
    setComponentNotes(notes)
    console.log('componentNotes after: ', componentNotes)

  }

  const showNote = async (visible, folio) => {
    console.log('folio: ', folio)
    console.log('visible before: ', componentNotes)
    const notes = componentNotes.map(note => {
      if (note.folio === folio) {
        return {
          ...note,
          isVisible: visible
        }
      }
      return {
        ...note
      }
    })
    try {
      await axios.put('http://localhost:3001/update/sale', {
        folio,
        visible
      })
    } catch (e) {
      console.log('Error when retrieving updated sales!')
    }
    setComponentNotes(notes)
    console.log('visible after: ', componentNotes)


  }

  const deleteNote = (note) => {
    let notesToUpdate = componentNotes
    const indexNote = notesToUpdate.indexOf(note)
    const updatedNotes = notesToUpdate.splice(indexNote, 1)
    console.log('indexNote: ', indexNote)
    console.log('notesToUpdate: ', notesToUpdate)
    console.log('updatedNotes: ', updatedNotes)
    setComponentNotes(notesToUpdate)
    console.log('MONDAI: ', componentNotes)
  }

  useEffect(() => {
    console.log('currentCardS: ', currentCard)
  }, [currentCard])

  useEffect(() => {
    console.log('componentNotes to update: ', componentNotes)
  }, [componentNotes])

  useEffect(() => {
    (async () => {
      try {
          const sales = await axios.get('http://localhost:3001/sales/user')
          const allProduits = await axios.get('http://localhost:3001/products')
          setAllProducts(allProduits.data)
          console.log('Retrieving SalesByUser: ', sales.data)
          const rawSales = _.chain(sales.data)
          // Group the elements of Array based on `color` property
          .groupBy("folio")
          // `key` is group's name (color), `value` is the array of objects
          .map((value, key) => ({ folio: key, sales: value }))
          .value()

          const salesUser = rawSales.map(e => {
            return {
              "folio": e.folio,
              "cliente": `${e.sales[0].usuario.nombre} ${e.sales[0].usuario.apellido_paterno} ${e.sales[0].usuario.apellido_materno}`,
              "direccion": `${e.sales[0].usuario.calle}, ${e.sales[0].usuario.colonia}`,
              "articulos": e.sales,
              "descripcion" : "",
              "prioridad": "",
              "isChecked": false,
              isVisible: e.sales[0].isVisible
            }
          })
          console.log('.groupBy("Folio"): ',
            _.chain(salesUser)
              // Group the elements of Array based on `color` property
              .groupBy("folio")
              // `key` is group's name (color), `value` is the array of objects
              .map((value, key) => ({ folio: key, sales: value }))
              .value()
          );
          /*
        {
            "folio": "001",
            "cliente": "Conchita",
            "direccion": "Villamar 1 calle laguna azul",
            "articulos": " 10.00 kg Jitomate $25.00 $250.00",
            "descripcion" : "Lorem impsum ",
            "prioridad": "bajo",
            "isChecked": false,
            isVisible: true
        },
          */
         console.log('DEBUG :',salesUser)
          setComponentNotes(salesUser) //notas  
      } catch(e) {
          console.log('Error when retrieving SalesByUser')
      }
  })()
  }, [])

  const handleOrderModal = (nota) => {

  }

  const renderedNotes = (notes) => {
    return (
      <>
        {
          notes.map(nota => {
            if (nota.isVisible) {
              return (
                <Grid key={nota.folio} item>
                  <Paper className={classes.paper}>
                    <div  key={nota.folio}>         
                      <div className="header0">
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                          Folio: {nota.folio}
                        </Typography>
                      </div>
                      <div className="Card-header">
                        <Typography variant="h5" component="h2">
                          Cliente:  {nota.cliente}
                        </Typography>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                           Direccion: {nota.direccion}
                        </Typography>
                      </div>
                      <div className="Card-conten" >
                        <div className="tambuttom">
                                <Button
                                  onClick={() => handleOpen(nota)}
                                  variant="contained"
                                  color="primary"
                                  className={classes.button}
                                  startIcon={<RemoveRedEyeIcon />}
                                  size="small"
                                  >Ver pedido
                                </Button>
                        </div>
                        <div className="tambuttom">
                        <Button   
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<DeleteIcon />}
                        size="small"
                        disabled={!nota.isChecked}
                        onClick={() => showNote(!nota.isVisible, nota.folio)}
                        >Eliminar
                        </Button>
                        </div>
                      </div>
                      <div className="Card-pie">
                        <FormControlLabel
                          control={<Green/>}
                          checked={nota.isChecked} 
                          onChange={(e) => handleSwitch(!nota.isChecked, nota.folio)} 
                        />
                        {nota.isChecked ? <span> Pedido surtido </span> : <span>Pedido no surtido</span>}
                      </div>
                    </div>    
                  </Paper>
                </Grid>
              )
            } else {
              return null
            }
          })
        }
      </>
    )
  }
  
  return (
    <Grid container >
      <Grid container item xs={12} spacing={3}>
        <Grid container justify="center" spacing={6}>
          {
            componentNotes.length !== 0 
            ? renderedNotes(componentNotes)
            : null
          }
        </Grid>
      </Grid>
      <Modal
            open={open}
            onClose={() => handleClose()}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            >
                {body}
            </Modal> 
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SpacingGrid)