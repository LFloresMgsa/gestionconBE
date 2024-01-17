//evento.routes.js
const express = require("express");

// servicios sin transaccion
const webController  = require("../controllers/web.controller.js");

// autorizacion con jwt
const authorization  = require("../controllers/auth.js");

// midleware de autorizacion con jwt
const checkAuth = require("../middleware/checkAuth.js");


const router = express.Router();

// servicios libres
//router.post('/sgm_usuarios/',webController.getUsuario);
router.post('/auth/',authorization.token);


router.post('/documentos', webController.getPathv2);



router.get('/archivos', webController.serveFile);

// servicios con seguridad JWT
router.post('/sgm_usuarios/auth/',checkAuth,webController.getUsuario);
//router.post('/lgm_catalogo_bs/auth/',checkAuth,webController.getCatalogo);

module.exports = router;