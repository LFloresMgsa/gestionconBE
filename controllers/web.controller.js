//WebController.js
/*-------------------------------------------------
Componente: Procedimientos No Transaccionales
-------------------------------------------------*/
const mysql = require("mysql");
const sc = require("../database/StringConection");
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime');
//const util = require('util');


const db = require("../database/db.js");

const ouUsuario = require("../models/sgm_usuarios.js");

//get all data api with store procedure






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

      const fileDetails = files.map(file => {
        const filePath = path.join(categoryPath, file);
        const stats = fs.statSync(filePath);

        const fechaHora = new Date(stats.mtime);
        const dia = fechaHora.getDate().toString().padStart(2, '0');
        const mes = (fechaHora.getMonth() + 1).toString().padStart(2, '0');
        const anio = fechaHora.getFullYear();
        const horas = fechaHora.getHours().toString().padStart(2, '0');
        const minutos = fechaHora.getMinutes().toString().padStart(2, '0');
        const segundos = fechaHora.getSeconds().toString().padStart(2, '0');

        return {
          id: uuidv4(),
          fileName: file,
          fileSize: bytesToSize(stats.size),
          lastModified: `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`,
        };
      });

      res.json({ files: fileDetails });
    });
  } catch (error) {
    console.error('Error reading folder:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const obtenerRutaDelArchivo = (category, document) => {
  // Lógica para obtener la ruta del archivo
  const filePath = path.join(__dirname, '..', 'assets', 'documents', category, document);

  // Enviar el archivo al cliente
  return filePath;
};

const serveFile = (req, res) => {
  const category = req.query.category;
  const document = req.query.document;

  const filePath = obtenerRutaDelArchivo(category, document);

  if (!filePath) {
    return res.status(404).json({ error: 'Archivo no encontrado.' });
  }

  // Obtener la extensión del archivo
  const fileExtension = path.extname(document).toLowerCase();

  // Configurar las cabeceras de tipo de contenido
  if (fileExtension === '.pdf' || (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png' 
  || fileExtension === '.bmp' || fileExtension === '.mp4' || fileExtension === '.wav' || fileExtension === '.mp3')) {
    // Para PDF e imágenes, abrir en el navegador
    res.setHeader('Content-Disposition', 'inline');
  } else {
    // Para otras extensiones, descargar el archivo
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(document)}"`);
  }

  // Configurar el tipo de contenido según la extensión
  if (fileExtension === '.docx') {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  } else if (fileExtension === '.xlsx') {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  } else if (fileExtension === '.pptx') {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  } else if (fileExtension === '.pdf') {
    res.setHeader('Content-Type', 'application/pdf');
  } else if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
    res.setHeader('Content-Type', 'image/jpeg');
  } else if (fileExtension === '.png') {
    res.setHeader('Content-Type', 'image/png');
  } else if (fileExtension === '.mp4') {
    res.setHeader('Content-Type', 'video/mp4');
    // Aquí deberías enviar el archivo al cliente, por ejemplo, con res.sendFile()
  } else if (fileExtension === '.wav') {
    res.setHeader('Content-Type', 'video/wav');
    // Aquí deberías enviar el archivo al cliente, por ejemplo, con res.sendFile()
  } else if (fileExtension === '.mp3') {
    res.setHeader('Content-Type', 'audio/mp3');
    // Aquí deberías enviar el archivo al cliente, por ejemplo, con res.sendFile()
}

  // Enviar el archivo al cliente
  res.sendFile(filePath);
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
  obtenerRutaDelArchivo,
  serveFile,
  getPathv2,
};