// import mysql from 'mysql'
// const conn = mysql.createConnection({
//     host:'',
//     user:'',
//     password:'',
//     database:''
// })


// conn.connect(function(err){
//     if (err) {
//         console.log('Connection fails');
        
//     }
//     else {
//         console.log('Connected');
        
//     }
// })

// export default conn

import mysql from 'mysql';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

conn.connect(function(err) {
    if (err) {
        console.log('Connection failed');
    } else {
        console.log('Connected');
    }
});

export default conn;
