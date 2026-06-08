import express, { type Application, type Request, type Response } from "express";
import {Pool} from "pg"
const app: Application = express()
const port = 3000

const pool = new Pool({connectionString:"postgresql://neondb_owner:npg_6LVEkWahfc1I@ep-damp-poetry-ap015fj4.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"})
app.use(express.json());

const initDb = async()=>{
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        email VARCHAR(20) NOT NULL,
        password VARCHAR(20) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        age INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `)
        console.log("connected sucessfully");
    } catch (error) {
        console.log(error);
    }
}
app.get('/', (req: Request, res: Response) => {
    //   res.send('Hello World!')
    res.status(200).json({
        message: "choltece",
        author: "ami"
    })
})
initDb()
app.post("/", async (req: Request, res: Response) => {
    // console.log(req.body)
    const {name,email,password} = req.body;
    res.status(201).json({
        message: "stored",
        data: {
            name,
            email
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})