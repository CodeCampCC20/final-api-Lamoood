import express from 'express'
import { registerDoctor, loginDoctor, listDoctors } from '../controllers/auth.js'

const router = express.Router()

router.post("/register/doctor", registerDoctor)
router.post("/login/doctor", loginDoctor)
router.get("/doctors", listDoctors)

// router.post("/register")


export default router