const sql=require('mysql2')
const connection=sql.createConnection({
    host:'localhost',
    user:'root',
    password:'12345',
    database:'busproject',
    timezone: '+00:00'
})
connection.connect((error) => {
    if (error) {
      console.error('Error connecting to the database:', error);
      return;
    }
    console.log('Connected to the MySQL database.');
  });

module.exports=connection;