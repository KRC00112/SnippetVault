const express = require("express");
const cors =require("cors");
const app = express();
const port=5000
const {Pool}=require("pg")
app.use(express.json());
app.use(cors())
const pool=new Pool({
    user: "postgres",
    host: "localhost",
    database: "snippetvaultdb",
    password: "1234",
    port: 5432,
})


app.get('/', async(req, res) => {
    const results=await pool.query("SELECT * FROM authtable");
    res.send(results.rows);
})

app.post('/', async(req, res) => {
    const results=await pool.query("INSERT INTO authtable(username, email, password) VALUES($1, $2, $3) RETURNING *",[req.body.username, req.body.email, req.body.password]);
    res.json(results.rows[0]);
})

app.listen(port,()=>{
    console.log(`Listening on: ${port}`);
})