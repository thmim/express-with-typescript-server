import express, { type Application, type Request, type Response } from "express";
import config from "./config";
import { pool } from "./db";
import { userRoute } from "./modules/users/users.route";
const app: Application = express()
const port = config.port;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    //   res.send('Hello World!')
    res.status(200).json({
        message: "choltece",
        author: "ami"
    })
})


// post api

app.use("/api/users",userRoute);

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
// here COALESCE use kora hoice cause jeno jkono akta jinish update korle baki gulo null na hoye jai age ja cilo jeno tai e thake
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

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })

export default app;