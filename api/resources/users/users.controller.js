const userModel = require('./users.model')

function getUsers() { 
    return userModel.getAll()
}

function userCreate(user, hashedPassword) {
    return userModel.create({...user, password: hashedPassword})
}

function userExist(username, id) {
    return new Promise( async(resolve,reject) => {
        try {
            const users = await userModel.find(username, id);
            resolve(users.length > 0)
        } catch (err) {
            reject(errr)
        }
    })
}

function getUser({username:username, id:id}) {
    if(username) return userModel.findByUsername(username)
    if(id) return userModel.findByID(id)
    throw new Error("Funcion obtener usuario del controller fue llamada sin especificar username o id.")
}

module.exports = {
    userCreate,
    userExist, 
    getUsers, 
    getUser
}