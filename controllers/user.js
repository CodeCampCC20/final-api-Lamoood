import prisma from "../config/prisma.js"
import { createError } from "../utils/createError.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res, next) => {
    try {
        const {username, password, confirmPassword} = req.body

        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        if (user) {
                createError(400, "This username already exists!")
            }
            
            const hashPassword = bcrypt.hashSync(password,10)

            const result = await prisma.user.create({
                data:{
                    username: username,
                    password: hashPassword
                }
            })

            res.json({message: `Register user Successfully`})
    } catch (error) {
        next(error)
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const {username, password } = req.body

        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        if (!user) {
                createError(400, "This Username is invalid!")
            }
            
            const checkPassword = bcrypt.compareSync(password, user.password)

            if (!checkPassword) {
                createError(400, "Password is invalid!")
            }

            const payload = {
                id: user.id
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d"})
            res.json({
                message: `Welcome Back, ${user.username}`,
                payload: payload,
                token: token})
    } catch (error) {
        next(error)
    }
}

// // export const listDoctors = async (req, res, next) => {
// //   try {
// //     const doctor = await prisma.doctor.findMany({
// //       omit: {
// //         password: true,
// //       },
// //     });

// //     res.json({ message: "This is List All Doctors", result: doctor });
// //   } catch (error) {
// //     next(error);
// //   }
// // };