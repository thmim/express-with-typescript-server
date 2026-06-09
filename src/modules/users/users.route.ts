import { Router } from "express";
import { userController } from "./users.controller";


const router = Router();

// post api
router.post("/",userController.createUser)

export const userRoute = router;