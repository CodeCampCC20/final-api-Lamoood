import prisma from "../config/prisma.js"
import { createError } from "../utils/createError.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerDoctor = async (req, res, next) => {
    try {
        const {username, password, confirmPassword, specialization} = req.body

        const doctor = await prisma.doctor.findFirst({
            where: {
                username: username
            }
        })

        if (doctor) {
                createError(400, "This username already exists!")
            }
            
            const hashPassword = bcrypt.hashSync(password,10)

            const result = await prisma.doctor.create({
                data:{
                    username: username,
                    password: hashPassword,
                    specialization: specialization
                }
            })

            res.json({message: `Register ${result.username} Success`})
    } catch (error) {
        next(error)
    }
}

export const loginDoctor = async (req, res, next) => {
    try {
        const {username, password } = req.body

        const doctor = await prisma.doctor.findFirst({
            where: {
                username: username
            }
        })

        if (!doctor) {
                createError(400, "This Username is invalid!")
            }
            
            const checkPassword = bcrypt.compareSync(password, doctor.password)

            if (!checkPassword) {
                createError(400, "Password is invalid!")
            }

            const payload = {
                id: doctor.id
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d"})
            res.json({
                message: `Welcome Back, ${doctor.username}`,
                payload: payload,
                token: token})
    } catch (error) {
        next(error)
    }
}

export const listDoctors = async (req, res, next) => {
  try {
    const doctor = await prisma.doctor.findMany({
      omit: {
        password: true,
      },
    });

    res.json({ message: "This is List All Doctors", result: doctor });
  } catch (error) {
    next(error);
  }
};