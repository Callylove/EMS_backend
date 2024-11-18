import mysql from 'mysql'
const conn = mysql.createConnection({
    host:'sql12.freemysqlhosting.net',
    user:'sql12745497',
    password:'3wrjh1eAg6',
    database:'sql12745497'
})

conn.connect(function(err){
    if (err) {
        console.log('Connection fails');
        
    }
    else {
        console.log('Connected');
        
    }
})

export default conn