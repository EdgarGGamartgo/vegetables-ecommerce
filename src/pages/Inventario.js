import readXlsxFile from 'read-excel-file' 
import { useState, useEffect } from 'react'
import axios from 'axios'
import CsvDownload from 'react-json-to-csv'

const Inventario = () => {

    const [uploadedFile, setUploadedFile] = useState('')
    const [inventario, setInventario] = useState([])
    const [mockData, setMockData] = useState([])



    const convertExcelToJson = () => {
        readXlsxFile(uploadedFile).then(async (rows) => {
            console.log('rows: ', rows)
            setInventario(rows)
            await axios.post('http://localhost:3001/products/create', {
                data: rows,
              })
          })
    }

    useEffect(() => {
        (async() => {
            const inventarioJson = await axios.get('http://localhost:3001/products')
            console.log('inventarioJson: ', inventarioJson)
            setMockData(inventarioJson.data.data)
        })()
    }, [])

    const loadFile = (file) => {
        setUploadedFile(file)
    }

    return (
        <div>
            <input type="file" onChange={(e) => loadFile(e.target.files[0])}/>
            <button onClick={() => convertExcelToJson()}>Cargar inventario</button>
            <CsvDownload data={mockData} filename='Inventario.csv'>Descarga inventario</CsvDownload>
        </div>
    )
}

export default Inventario
