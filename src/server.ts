import express, { type Application, type Request, type Response } from "express";
import { Pool } from "pg"
const app: Application = express()
const port = 3000

const pool = new Pool({ connectionString: "postgresql://neondb_owner:npg_6LVEkWahfc1I@ep-damp-poetry-ap015fj4.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require" })
app.use(express.json());

const initDb = async () => {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        email VARCHAR(20) UNIQUE NOT NULL,
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

// post api
app.post("/api/users", async (req: Request, res: Response) => {
    // console.log(req.body)
    const { name, email, password, age } = req.body;
    try {
        const result = await pool.query(`
        INSERT INTO users(name,email,password,age)
        VALUES($1,$2,$3,$4)
        RETURNING *
        `, [name, email, password, age])

        // console.log(result)
        res.status(201).json({
            message: "user created",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
})

// all users get api
app.get("/api/users", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT * FROM users
            `);

        res.status(201).json({
            message: "users find",
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
})

//get single user
app.get("/api/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT * FROM users
            WHERE id = $1
            `, [id]);
        // console.log(result)
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found",
                data: {}
            })
        }

        res.status(201).json({
            message: "user find",
            data: result.rows[0]
        })


    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
})

// update user data using put
app.put("/api/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, password, age, is_active } = req.body;
    // console.log({ name, password, age, is_active });
    try {
        const result = await pool.query(`
        UPDATE users
        SET 
        name=COALESCE($1,name),
        age=COALESCE($2,age),
        password=COALESCE($3,password),
        is_active=COALESCE($4,is_active)
        WHERE id=$5
        RETURNING *
        `, [name, age, password, is_active, id]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found",
                data: {}
            })
        }

        res.status(200).json({
            message: "user Updated",
            data: result.rows[0]
        })
        // console.log(result)
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
})

// delete api

app.delete("/api/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            DELETE FROM users
            WHERE id=$1
            RETURNING *
            `, [id]);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User Not found!",
            });
        }
        // console.log(result)
        res.status(200).json({
            message: "user deleted",
            
        })
    } catch (error:any) {
res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})