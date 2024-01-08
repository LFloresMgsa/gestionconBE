//index.js
const https = require('https')
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const JWT = require("jsonwebtoken")
const fs = require('fs')

const catalogsubastaRoutes = require("./routes/evento.routes.js");
const cors=require("cors");

// settings
const app = express();
const PORT = 5000;
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

app.set("port", PORT);


//const documentRoot = 'D:\\pdfs';


// Middlewares
//app.use('/pdfs', express.static(documentRoot));

app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(bodyParser.json());

// Routes

app.use("/api/gescon", catalogsubastaRoutes );


// pagina inicial

app.get("/", function (require, response) {
    response.send("<h3>Modulo - Gestion de Contenidos</h3>");
});

// pagina secundarias

app.get("/about", function (require, response) {
    response.sendFile("about.html",{
        root: path.join(__dirname, "./views")
    });
});

app.get("/contact", function (require, response) {
    response.sendFile("contact.html",{
        root: path.join(__dirname, "./views")
    });
});

//   app.get("/.well-known/pki-validation/7AB190C07F9C6C5FB995E77E1B6B50FB.txt",function(require,response) {
//     response.sendFile("7AB190C07F9C6C5FB995E77E1B6B50FB.txt",{
//         root: path.join(__dirname, "./.well-known/pki-validation")
//     });
//   });

// init server
// https.createServer({
//     //key: fs.readFileSync('./domain.key'),
//     //cert: fs.readFileSync('./certs/galponlegado_com.crt'),
// }, app).listen(PORT, function () {
//     console.log("server running port 443");
// });

app.listen(PORT, function () {
    console.log("server runing at 5000 port");
})