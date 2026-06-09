import { pool } from "../../db"

const createUserIntoDb = async (payload:any) =>{
    console.log(payload)
    const {name, email, password, age} = payload;
    const result = await pool.query(`
        INSERT INTO users(name,email,password,age)
        VALUES($1,$2,$3,$4)
        RETURNING *
        `, [name, email, password, age]);
        return result;

}

export const userService = {
    createUserIntoDb,
}