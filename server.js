import express from "express"
import cors from 'cors'
import morgan from 'morgan'
import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import { notfound } from "./utils/notfound.js"
import error from "./utils/error.js"

const app = express()
const PORT = 1997

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use("/auth", authRouter)
app.use("/auth", userRouter)


app.use(error)
app.use(notfound)



app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))