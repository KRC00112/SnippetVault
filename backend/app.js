const express=require("express");
const cors=require("cors");
const {Pool}=require("pg");
const app=express();
const port=3000
app.use(cors());
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "snippetvaultdb",
    password: "1234",
    port: 5432,

})


app.get('/', async (req, res) => {
    const results = await pool.query("SELECT * FROM snippetstable");
    res.send(results.rows);
})

app.post('/', (req, res) => {

})

app.listen(port,()=>{
    console.log("Server started on port "+port);
})