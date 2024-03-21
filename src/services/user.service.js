const bcrypy = require ('bcrypt')
const jwt = require ('jsonwebtoken')
const UserRepository = require ('./../repositories/user.repository')

class UserService {
  static async registerUser(email,password) {
    //Código para registrar usuarios
  }

  static async loginUser (email,password) {
    //Código para login
  }
}

module.exports = UserService