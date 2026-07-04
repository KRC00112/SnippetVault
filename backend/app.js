const express=require("express");
const cors=require("cors");
const {Pool}=require("pg");
const app=express();
const port=3000
app.use(cors());
app.use(express.json());
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

app.post('/', async(req, res) => {
    const results=await pool.query("INSERT INTO snippetstable(title, language,code) VALUES($1, $2, $3) RETURNING *",[req.body.title, req.body.language,req.body.code]);
    res.json(results.rows[0]);
})
app.delete('/:id', async (req, res) => {
    const results=await pool.query("DELETE FROM snippetstable WHERE id=$1",[req.params.id]);
    res.send(results.rows[0]);
})

app.listen(port,()=>{
    console.log("Server started on port "+port);
})