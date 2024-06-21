const mysql = require('mysql');

var connection;

function handleDisconnect() {
  connection = mysql.createConnection({
    host: '13.232.203.27	',
    database: 'products',
    port: '3306',
    user: 'admin',
    password: 'renewretech',
  });

  connection.connect(function (error) {
    if (error) {
      console.log('Error');
      console.error(error);
      setTimeout(handleDisconnect, 2000); // Reconnect after a delay
    } else {
      console.log('MySQL Database is connected Successfully');
    }
  });

  connection.on('error', function (err) {
    console.log('MySQL connection error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      // Connection lost, attempt reconnection
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connection;
