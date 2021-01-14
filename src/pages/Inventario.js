import readXlsxFile from 'read-excel-file' 
import { useState, useEffect } from 'react'
import axios from 'axios'
import CsvDownload from 'react-json-to-csv'
import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FileSaver from 'file-saver';

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

const Inventario = () => {
    const classesModal = useStylesModal();
    const [uploadedFile, setUploadedFile] = useState('')
    const [inventario, setInventario] = useState([])
    const [mockData, setMockData] = useState([])
    const [modal, handleModal] = useState(false)
    const [modalStyle] = useState(getModalStyle);
    const [modalContent, setModalContent] = useState({
        title: 'Contraseña',
        content: 'Por favor ingrese contraseña',
        ok: true
    })
    const [password, setPassword] = useState('')
    const [mockMinData, setMockMinData] = useState([])

    const openModal = () => {
        handleModal(true)
    }

    const closeModal = () => {
        handleModal(false)
    }

    const settingPassword = (pass) => {
        setPassword(pass)
    }

    const body = (
        <div style={modalStyle} className={classesModal.paper}>
            <h2 id="simple-modal-title">{modalContent.title}</h2>
            <p id="simple-modal-description">
                {modalContent.content}
            </p>
            {
                modalContent.ok === true ?
                    <>
                    {
                        modalContent.title === 'ÉXITO' ?
                        <button onClick={() => closeModal()}>OK</button>   
                        :
                        <>
                        <input type="password" value={password} onChange={(e) => settingPassword(e.target.value)} /> 
                        <button onClick={() => convertExcelToJson()}>Enviar</button>
                        </>
                    }   
                    </>
                    :
                    <>
                    <button onClick={() => closeModal()}>OK</button>
                    </>
            }
            
        </div>
    );

    const convertExcelToJson = () => {
        readXlsxFile(uploadedFile).then(async (rows) => {
            console.log('rows: ', rows)
            setInventario(rows)
            try {
                await axios.post('http://localhost:3001/products/create', {
                    data: rows,
                    password
                })
                // Abrir modal de exito
                const inventarioJson = await axios.get('http://localhost:3001/products')
                console.log('inventarioJson: ', inventarioJson.data)
                setMockData(inventarioJson.data.products)
                setModalContent({
                    title: 'éxito'.toUpperCase(),
                    content: '',
                    ok: true
                })
            } catch (e) {
                console.log('DEBUG #1: ', e, e.response)
                if (e.response.data.msg === 'Contraseña incorrecta') {
                    // Abrir modal de error
                    setModalContent({
                        title: 'Contraseña incorrecta'.toUpperCase(),
                        content: 'Por favor verifique su contraseña',
                        ok: false
                    })
                }
            }
          })
    }
    
    useEffect(() => {
        (async() => {
            const inventarioJson = await axios.get('http://localhost:3001/products')
            console.log('inventarioJson: ', inventarioJson.data)
            setMockData(inventarioJson.data.products)
            const inventarioMinJson = await axios.get('http://localhost:3001/minimums/products')
            console.log('inventarioMinJson: ', inventarioMinJson.data)
            setMockMinData(inventarioMinJson.data)
        })()
    }, [])

    const loadFile = (file) => {
        setUploadedFile(file)
    }

    const initModal = () => {
        setPassword('')
        setModalContent({
            title: 'Contraseña',
            content: 'Por favor ingrese contraseña',
            ok: true
        })
        openModal()
    }

    const downloadInvoice = async() => {
        try {
            const file = await axios.get('http://localhost:3001/api/download/invoice', {
                responseType: 'arraybuffer',
                headers: {
                    Accept: 'application/pdf',
                },
              });

            if (file.data) {
                FileSaver.saveAs(
                    new Blob([file.data], { type: 'application/pdf' }),
                    `sample.pdf`
                );
            }
            console.log('Successfully retrieved file')
            //window.open(file.data, '_blank');

        } catch(e) {
            console.log('Error retrieving invoice pdf')
        }
    }

    return (
        <div>
            <input type="file" onChange={(e) => loadFile(e.target.files[0])}/>
            <button onClick={() => initModal()}>Cargar inventario</button>
            <CsvDownload data={mockData} filename='Inventario.csv'>Descarga inventario</CsvDownload>
            <CsvDownload data={mockMinData} filename='InventarioMinimo.csv'>Descarga inventario mínimo</CsvDownload>
            {/* <button onClick={() => downloadInvoice()}>Descargar invoice</button> */}
            <Modal
            open={modal}
            onClose={() => handleModal()}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>
    )
}

export default Inventario
