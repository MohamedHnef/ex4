const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
};

let db;

function handleDisconnect() {
  db = mysql.createPool(dbConfig);

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      setTimeout(handleDisconnect, 2000); // Reconnect after 2 seconds
    } else {
      console.log('Database connection established');
      connection.release();
    }
  });

  db.on('error', (err) => {
    console.error('Database error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
      handleDisconnect(); 
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = db;
