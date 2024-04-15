const bcrypt = require ('bcrypt')
const jwt = require ('jsonwebtoken')
const { createUser, findUserByEmail } = require ('../models/user.model')
require ('dotenv').config()

exports.createUser = async (userData) => {
  try {
    const createdUser = await createUser(userData)
    if (createdUser.success){
      return{
        success: true
      }
    }
    return {
      success: false,
      message: 'Error al registrar'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

exports.findUserByEmail = async (email) => {
  try {
    const found = await findUserByEmail(email)
    if (found.success){
      return{
        success: true,
        user: found.user
      }
    }
    return {
      success: false,
      message: 'Usuario no encontrado'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

exports.comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    const verifyPassword = await bcrypt.compare(plainPassword, hashedPassword)
    return verifyPassword
  } catch (error) {
    throw new Error('Error al comparar contraseñas')
  }
}

exports.generateToken = async (user) => {
  try {
    const token = await jwt.sign({
      email: user.email,
      userId: user.id
    }, 
    process.env.TOP_SECRET,
      {expiresIn: '1h'}
    )
  } catch (error) {
    throw new Error ('Error al generar el token')
  }
}
/*
const UserRepository = require ('./../repositories/user.repository')

class UserService {
  static async registerUser(email,password) {
    //Código para registrar usuarios
  }

  static async loginUser (email,password) {
    //Código para login
  }
}

module.exports = UserService*/