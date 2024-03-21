const bcrypt = require('bcrypt')
const firebase = require ('./../config/firebase')
const IUser = require('./../interfaces/user.interface')

class User extends IUser {
  constructor (email,password){
    super()
    this.email = email
    this.password = password
  }

  static async createUser (email,password) {
    //Código para crear usuario
  }

  static async findByEmail (email) {
    //Código para buscar por correo
  }

  async verifyPassword (password) {
    //Código para verificar la contraseña
  }
}

module.exports = User
