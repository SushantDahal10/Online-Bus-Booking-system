const sql = require('mysql2');
const connection = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: '+00:00'
});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error);
        return;
    }
    console.log('Connected to the MySQL database.');
});

module.exports = connection;
