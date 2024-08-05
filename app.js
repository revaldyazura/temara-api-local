const express = require('express')
const app = express()
// const setupRoutes = require('./routes/routes')
const port = process.env.PORT || 8080
const bodyParser = require('body-parser')
const db = require('./model/db')
const response = require('./controller/postData')
const { NULL } = require('mysql/lib/protocol/constants/types')
// const date = new Date()

app.use(bodyParser.json())

app.get('/', (req, res) => {
    //console.log(date)
    response(200, "API Forum ready", "SUCCESS", res)
})

app.get('/api/forum', (req, res) => {
    const sql = "SELECT * FROM posting"
    db.query(sql, (err, fields) => {
        if (err) throw err
        response(200, fields, "data post", res)
    })
})

app.get('/api/forum/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM posting WHERE id = ${id}`
    db.query(sql, (err, fields) => {
        if (err) throw err
        response(200, fields, `all detail post from ${id}`, res)
    })
})

app.get('/api/forum/user/:user_id', (req, res) => {
    const user_id = req.params.user_id
    const sql = `SELECT * FROM posting WHERE user_id = ${user_id}`
    db.query(sql, (err, fields) => {
        if (err) throw err
        response(200, fields, `all detail post from ${user_id}`, res)
    })
})

app.post('/api/forum', (req, res) => {
    const { user_id, text, images = NULL } = req.body
    const sql = `INSERT INTO posting (user_id, text, images) VALUES (${user_id}, '${text}', '${images}')`

    db.query(sql, (err, fields) => {
        if (err) response(500, "invalid", "error", res)
        if (fields?.affectedRows) {
            const data = {
                isSuccess: fields.affectedRows,
                id: fields.insertId
            }
            response(200, data, "posting forum", res)
        }
    })

})
// const datetime = new Date();

app.put('/api/forum', (req, res) => {
    const { user_id, text, images = null } = req.body
    const sql = `UPDATE posting SET text = '${text}', images = '${images}', updated_at = current_timestamp() WHERE user_id = ${user_id}`

    db.query(sql, (err, fields) => {
        if (err) response(500, "invalid", "error", res)
        if (fields?.affectedRows) {
            const data = {
                isSuccess: fields.affectedRows,
                message: fields.message,
            }
            response(200, data, "update post successfully", res)
        } else {
            response(500, "user not found", "error", res)
        }
    })
})

app.delete('/api/forum', (req, res) => {
    const { user_id } = req.body
    const sql = `DELETE FROM posting WHERE user_id = ${user_id}`
    db.query(sql, (err, fields) => {
        if (err) response(500, "invalid", "error", res)
        if (fields?.affectedRows) {
            const data = {
                isDeleted: fields.affectedRows,
            }
            response(200, data, "deleting post successfully", res)
        } else {
            response(500, "user not found", "error", res)
        }
    })

})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})