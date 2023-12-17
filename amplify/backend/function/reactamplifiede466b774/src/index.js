

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const mysql = require('mysql');

// Môi trường này nên được thiết lập trong AWS Lambda's environment variables
const config = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'whey-store'
};

const pool = mysql.createPool(config);


exports.handler = async (event) => {
    // Promise wrapper to handle the async nature of the handler
    const promise = new Promise(function(resolve, reject) {
      // Use the pool to handle your database connection
      pool.query('SELECT * FROM YourTableName', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  
    return promise;
  };
