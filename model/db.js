const mysql = require('mysql')
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "forum"
})

db.connect(function(error){
    if(error) throw error
    console.log('Connected to temara')
})

module.exports = db