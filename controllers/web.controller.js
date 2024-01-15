//WebController.js
/*-------------------------------------------------
Componente: Procedimientos No Transaccionales
-------------------------------------------------*/
const mysql = require("mysql");
const sc = require("../database/StringConection");
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

//const util = require('util');


const db = require("../database/db.js");

const ouUsuario = require("../models/sgm_usuarios.js");

//get all data api with store procedure



const getPath = async (req, res) => {
    const category = req.query.category;
  
    if (!category) {
      return res.status(400).json({ error: 'Falta el parámetro "category" en la solicitud.' });
    }
  
    try {
      const categoryPath = path.join(__dirname, '..', 'assets', 'documents', category);
  
      fs.readdir(categoryPath, (err, files) => {
        if (err) {
          return res.status(500).json({ error: 'Error al leer la carpeta.' });
        }
  
        const fileNames = files.filter(file => file.endsWith('.pdf'));
        res.json({ files: fileNames });
      });
    } catch (error) {
      console.error('Error reading folder:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } 
  };
  
  const bytesToSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + sizes[i];
  };

  const getPathv2 = async (req, res) => {
    const category = req.query.category;
  
    if (!category) {
      return res.status(400).json({ error: 'Falta el parámetro "category" en la solicitud.' });
    }
  
    try {
      const categoryPath = path.join(__dirname, '..', 'assets', 'documents', category);
  
      fs.readdir(categoryPath, (err, files) => {
        if (err) {
          return res.status(500).json({ error: 'Error al leer la carpeta.' });
        }
  
        const fileDetails = files
          .filter(file => file.endsWith('.pdf'))
          .map(file => {
            const filePath = path.join(categoryPath, file);
            const stats = fs.statSync(filePath);
  
           return {
            id: uuidv4(), // Generar un ID único para cada archivo
            fileName: file,
            fileSize: bytesToSize(stats.size), // Convertir el tamaño a KB o MB
            lastModified: stats.mtime
            
          };
          });
  
          
        res.json({ files: fileDetails });
      });
    } catch (error) {
      console.error('Error reading folder:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  const servePDF = (req, res) => {
    const { category, document } = req.query;
    if (!category || !document) {
      return res.status(400).json({ error: 'Parámetros incompletos.' });
    }
  
    const filePath = path.join(__dirname, '..', 'assets', 'documents', category, document);
  
    if (fs.existsSync(filePath) && filePath.toLowerCase().endsWith('.pdf')) {
      // Configura el encabezado para la respuesta PDF
      res.setHeader('Content-Type', 'application/pdf');
      
      // Agrega el encabezado Content-Disposition para establecer el nombre del archivo
      res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(document)}`);
      //console.log('Nombre del documento:', document);
      
      // Lee el contenido del archivo y envíalo como respuesta
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.status(404).json({ error: 'Archivo no encontrado.' });
    }
  };


const getUsuario = async (request, response) => {


    
    let connection;
    try {
        // create mysql connection
        connection = await mysql.createConnection(sc.dbStringConection());

        var params = request.body;


        ouUsuario.Accion = params.Accion;
        ouUsuario.Sgm_cUsuario = params.Sgm_cUsuario;
        ouUsuario.Sgm_cNombre = params.Sgm_cNombre;
        ouUsuario.Sgm_cContrasena = params.Sgm_cContrasena;
        ouUsuario.Sgm_cObservaciones = params.Sgm_cObservaciones;

        connection.query("CALL sp_sgm_usuarios (?,?,?,?,?) ", [
            ouUsuario.Accion, ouUsuario.Sgm_cUsuario, ouUsuario.Sgm_cNombre,
            ouUsuario.Sgm_cContrasena, ouUsuario.Sgm_cObservaciones
        ], function (error, results, fields) {

            if (error) {

                response.json({ error: error.message });

            } else {

                

                response.json(results);
            }
        });
    } catch (error) {
        response.status(500);
        response.send(error.message);
    } finally {
        if (connection) {
            connection.end();
        }
    }
};

// export functions
module.exports = {
    getUsuario, 
    getPath,
    servePDF,
    getPathv2,
};