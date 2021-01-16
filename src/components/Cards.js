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

import './../css/styles-card.css';
import { notas } from './../assets/notas.js'; 

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
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[1],
      padding: theme.spacing(2, 4, 3),
  },
}));

export const SpacingGrid = () => {



  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const classesModal = useStylesModal();
  
  const [valueSW, setValueSW] = useState(false); 
  const [open, setOpen] = useState(false); 
  const [currentCard, setCurrentCard] = useState('')
  const [componentNotes, setComponentNotes] = useState([])

  const body = (
    <div style={modalStyle} className={classesModal.paper}>
        <h2 id="simple-modal-title">DETALLE DE PEDIDO</h2>
        <p id="simple-modal-description">
            HOLA SOY UNA MODAL
        </p>
        <button type="button" onClick={() => handleClose()}>OK</button>
    </div>
  );

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = (nota) => {
    console.log('nota: ', nota)
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

    // setCurrentCard(folio)
    // setValueSW(event);
  }

  const showNote = (visible, folio) => {
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
    setComponentNotes(notes)
    console.log('visible after: ', componentNotes)

    // setCurrentCard(folio)
    // setValueSW(event);
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
    console.log('componentNotes to update: ', componentNotes)
  }, [componentNotes])

  useEffect(() => {
    setComponentNotes(notas)  
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

