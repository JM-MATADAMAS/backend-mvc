const bcrypt = require ('bcrypt')
const jsonwebtoken = require ('jsonwebtoken')
const { createUser, findUserByEmail } = require('../services/user.service')

exports.signup = async (req,res) => {
  try{
    //Código para registrarse
    const {email, password, id} = req.body
    const existingUser = await findUserByEmail(email)
    if (existingUser.success) {
      return res.status(400).json({
        message: 'El usuario ya está registrado'
      })
    }
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password,saltRounds)
   
    const newUser = {
      email: email,
      password: hashedPassword,
      id: id
      //Agregar otros campos
    }
    console.log('@@@ AuthController =>', newUser.email, '  ', newUser.password)
    const userResult = await createUser(newUser)
    if (userResult.success) {
      res.status (201).json({
        message: 'Usuario registrado satisfactoriamente'
      })
    } else {
      res.status (500).json({
        message: 'Error al registrar el usuario'
      })
    }
  }
  catch (error){
    res.status(500).json({
      message: error.message
    })
  }
}

exports.login = async (req,res) => {
  try{
    //Código para logearse
    const {email, password} = req.body
    const findEmail = await findUserByEmail(email)
    if (!findEmail.success){
      res.status (401).json({
        message: 'Usuario no encontrado'
      })
    }
    const user = findEmail.user
    const findPassword = await bcrypt.compare(password, user.password)
    if (!findPassword){
      res.status (401).json({
        message: 'Contraseña incorrecta'
      })
    }

    const token = jsonwebtoken.sign({
      email: user.email,
      userId: user.id
    }, process.env.TOP_SECRET, {
      expiresIn: '1h'
    })

   return res.status (200).json({
      token: token
    })
  }
  catch (error){
   return {
      message: error.message
    }
  }
}