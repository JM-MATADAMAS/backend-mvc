const firebase = require ('../config/firebase');
const { all } = require('../routes/authRoutes');
const usersCollection = firebase.firestore().collection('users');

exports.createUser = async (userData) =>{
  try {
    await usersCollection.doc(userData.id).set(userData)
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

exports.findUserById = async (userId) =>{
  try {
    const userFound = await usersCollection.doc(userId).get()
    if (userFound.exists){
      return {
        success: true,
        user: user.data()
      }
    } else {
      return {
        success: false,
        error: 'Usuario no encontrado'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

exports.findUserByEmail = async (email) =>{
  try {
    const userEmail = await usersCollection.where('email', '==', email).get()
    if (!userEmail.empty) {
      const userFound = userEmail.docs[0]
      return {
        success: true,
        user: userFound.data()
      }
    } else {
      return {
        success : false,
        error: 'Usuario no encontrado'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

exports.getAllUsers = async() => {
  try {
    const allUsers = await usersCollection.get()
    const users = [] 
      allUsers.forEach((doc) =>{
        users.push(doc.data)
      })
  } catch (error) {
    throw new error('Error Getting Users' + error.message)
  }
}

exports.deleteUser = async(userId) => {
  try {
    await usersCollection.doc(userId).delete()
  } catch (error) {
    throw  new Error('Error Deleting User' + error.message)
  }
}

exports.updateUser = async(userId, userData) => {
  try {
    await usersCollection.doc(userId).update(userData)
  } catch (error) {
    throw  new Error('Error Updating User' + error.message)
  }
}