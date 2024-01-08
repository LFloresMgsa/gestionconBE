const db = require("../database/db.js");
const DataTypes = require("sequelize");
const Sequelize = require("sequelize");

const sequelize = new Sequelize('mysql::memory:')

const sgm_usuarios = sequelize.define('sgm_usuarios', {
    Accion: { type: DataTypes.STRING },    
    Sgm_cUsuario: { type: DataTypes.STRING },
    Sgm_cNombre: { type: DataTypes.STRING },
    Sgm_cContrasena: { type: DataTypes.STRING },
    Sgm_cObservaciones: { type: DataTypes.STRING }
})

module.exports = sgm_usuarios;


