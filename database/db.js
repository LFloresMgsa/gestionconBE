
const connectionConfig = require("../database/StringConection");
const mysql = require("mysql");

const connection = mysql.createConnection(connectionConfig.dbStringConection());


const getConnection = () => {
    return connection;
};

const getCadena = () => {
    return connectionConfig;
};

module.exports = {
    getConnection,
    getCadena
}; 
