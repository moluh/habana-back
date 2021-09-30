function UserDAO(db) {

  let ObjectId = require('mongodb').ObjectID;

  if (false == (this instanceof UserDAO)) {
    console.log('WARNING: UserDAO constructor called without "new" operator');
    return new UserDAO(db);
  }

  var database = db.db('app_habb');
  var users = database.collection('users')

  this.post = function (user, callback) {
    users.findOne({ 'username': user.username }, function (err, userDB) {
      if (err) throw err;

      if (userDB) {
        let existe = new Error('Este nombre de usuario ya existe');
        return callback(existe, null);

      } else {
        users.insertOne(user, function (err, result) {
          if (err) { return res.status(400).json(err) }
          console.log('Nuevo usuario creado');
          return callback(null, result);
        });
      }
    });
  }

  this.getAll = function (callback) {
    users.find({}).toArray(function (err, usuarios) {
      if (err) {
        let msgError = "Error al obtener Usuarios."
        return callback(msgError, null)
      }
      return callback(null, usuarios);
    });
  }

  this.getById = function (id, callback) {
    users.findOne({ '_id': ObjectId(id) }, function (err, usuario) {
      if (err) {
        let msgError = "No se encontró ningún Usuario"
        return callback(msgError, null)
      }
      return callback(null, usuario);
    });
  }

  this.put = function (user, callback) {
    users.updateOne(
      { "_id": ObjectId(user._id) },
      {
        $set: {
          "nombre": user.nombre,
          "apellido": user.apellido,
          "username": user.username,
          "email": user.email,
          "password": user.password,
          "role": user.role,
          "activo": user.activo,
        }
      },
      { upsert: true }, function (err, user) {
        if (err) throw err;
        callback(null, user)
      });
  }


  this.delete = function (id, callback) {
    users.deleteOne({ "_id": ObjectId(id) },
      function (err, usuario) {
        if (err) { return res.status(400).json(err) };
        callback(null, usuario)
      }
    );
  }

  this.validateLogin = function (username, password, callback) {
    users.findOne({
      'username': username,
      'password': password
    }, function (err, user) {
      if (err) return callback(err, null);

      if (user) {
        callback(null, user);
      } else {
        let msgError = "No se encontró ningún Usuario"
        return callback(msgError, null)
      }
    });
  }

}

module.exports.UserDAO = UserDAO;