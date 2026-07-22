const express = require("express");
const cors =require("cors");
const app = express();
const bcrypt = require("bcrypt");
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

app.get('/:email', async(req, res) => {
    const results=await pool.query("SELECT * FROM authtable WHERE email=$1",[req.params.email]);
    res.send(results.rows);
})

app.post('/', async(req, res) => {
   try {
       const {username, email, password} = req.body;

       const hashedPassword = await bcrypt.hash(password, 12);

       const results = await pool.query("INSERT INTO authtable(username, email, password) VALUES($1, $2, $3) RETURNING *", [username, email, hashedPassword]);
       res.json(results.rows[0]);
   }catch(error){
       console.log(error);
       if(error.code==='23505'){
           res.json(error.code)
       }
       return res.status(500).json({
           message: error.message,
           code: error.code
       });
   }
})

app.listen(port,()=>{
    console.log(`Listening on: ${port}`);
})