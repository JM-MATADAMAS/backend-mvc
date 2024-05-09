const bcrypt = require ('bcrypt')
const jsonwebtoken = require ('jsonwebtoken')
const { createUser, findUserByEmail, getAllUsers, deleteUser, updateUser } = require('../services/user.service')

exports.signup = async (req,res) => {
  try{
    //Código para registrarse
    const {nombre, apaterno, amaterno, direccion, telefono, estado, email, password, id} = req.body
    const existingUser = await findUserByEmail(email)
    if (existingUser.success) {
      return res.status(400).json({
        message: 'El usuario ya está registrado'
      })
    }
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password,saltRounds)

    const newUser = {
      nombre: nombre,
      apaterno: apaterno,
      amaterno: amaterno,
      direccion: direccion,
      telefono: telefono,
      estado: estado,
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
      expiresIn: '1d'
    })
    console.log('@@ res login =>', user.email, ' ', user.id)
    return res.status (200).json({
      token: token
    })
  }
  catch (error){
    return {
      message: error.message,
    }
  }
}

exports.getAllUsers = async(req, res) => {
  try {
    const users = await getAllUsers()
    res.status(200).json({
      message: 'Success',
      users
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error Getting all Users',
      error: error.message
    })
  }
}

exports.updateUser = async(req,res) => {
  try {
    const userId = req.params.id
    const userData = req.body
    await updateUser(userId, userData)
    res.status(200).json({
      message: 'User Updated Successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error Updating Users',
      error: error.message
    })
  }
}

exports.deleteUser = async(req,res) => {
  try {
    const userId = req.params.id
    await deleteUser(userId)
    res.status(200).json({
      message: 'User Deleted Successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error Deleting Users',
      error: error.message
    })
  }
}