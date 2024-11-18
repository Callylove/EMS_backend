import mysql from 'mysql'
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'employeems'
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