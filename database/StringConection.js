
const connectionConfig = {
    host: '172.16.0.4',
    database: 'gescon',
    port:3306,
    user: 'evento',
    password: '1q2w3e4r5t.'
};


const dbStringConection = () => {
    return connectionConfig;
};

module.exports = {
    
    dbStringConection
}; 
