const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function UserDAO(db) {
    let ObjectId = require("mongodb").ObjectId;

    if (false == this instanceof UserDAO) {
        console.log(
            'WARNING: UserDAO constructor called without "new" operator'
        );
        return new UserDAO(db);
    }

    const database = db.db("app_habb");
    const users = database.collection("users");

    this.post = function (user, callback) {
        users.findOne(
            { username: user.username },
            async function (err, userDB) {
                if (err) throw err;

                if (userDB) {
                    return callback("Este nombre de usuario ya existe", null);
                } else {
                    if (user.password !== "" && user.password !== null)
                        user.password = await bcrypt.hash(user.password, 10);
                    else return callback("Contraseña requerida", null);

                    users.insertOne(user, function (err, result) {
                        if (err) return callback(err, null);

                        delete result;
                        return callback(null, result);
                    });
                }
            }
        );
    };

    this.getAll = function (callback) {
        users.find({}).toArray(function (err, usuarios) {
            if (err) return callback("Error al obtener Usuarios.", null);

            for (let user of usuarios) delete user.password;

            return callback(null, usuarios);
        });
    };

    this.getById = function (id, callback) {
        users.findOne({ _id: ObjectId(id) }, function (err, usuario) {
            if (err) return callback("No se encontró ningún Usuario", null);

            delete usuario.password;
            return callback(null, usuario);
        });
    };

    this.put = async function (user, callback) {
        const foundUser = await users.findOne({ _id: ObjectId(user._id) });

        if (foundUser) {
            if (foundUser.username !== user.username) {
                const userByUsername = await users.findOne({
                    username: user.username,
                });
                if (userByUsername)
                    return callback("Este nombre de usuario ya existe", null);
            }

            const userToSet = {
                nombre: user.nombre,
                apellido: user.apellido,
                username: user.username,
                email: user.email,
                password: null,
                role: user.role,
                activo: user.activo,
            };

            if (user.password !== "" && user.password !== null)
                userToSet.password = await bcrypt.hash(user.password, 10);
            else delete userToSet.password;

            users.updateOne(
                { _id: ObjectId(user._id) },
                { $set: userToSet },
                { upsert: true },
                function (err, user) {
                    if (err) throw err;
                    callback(null, user);
                }
            );
        } else {
            return callback("No se encontró el usuario", null);
        }
    };

    this.delete = function (id, callback) {
        users.deleteOne({ _id: ObjectId(id) }, function (err, usuario) {
            if (err) {
                return res.status(400).json(err);
            }

            delete usuario.password;
            callback(null, usuario);
        });
    };

    this.validateLogin = function (username, password, callback) {
        users.findOne({ username: username }, async function (err, usuario) {
            // if (err) return callback(err, null);
            if (err) {
                return callback(
                    {
                        error: true,
                        msg: err,
                    },
                    null
                );
            } else {
                if (!usuario)
                    // Si no encuentra el usuario
                    return callback(
                        {
                            isLogged: false,
                            token: null,
                            error: "Datos incorrectos.",
                        },
                        null
                    );

                let validatePassword = await bcrypt.compareSync(
                    password,
                    usuario.password
                );

                if (!validatePassword) {
                    // return res.status(401).send({ Error: "La contraseña no coincide."});
                    return callback(
                        {
                            isLogged: false,
                            token: null,
                            error: "Contraseña incorrectos.",
                        },
                        null
                    );
                }

                const userWithOutPass = { ...usuario };
                delete userWithOutPass.password;

                let token = jwt.sign(userWithOutPass, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRATION,
                });

                return callback(null, {
                    isLogged: true,
                    token,
                    expiresIn: process.env.JWT_EXPIRATION,
                    role: userWithOutPass.role,
                    activo: userWithOutPass.activo,
                });
            }
        });
    };
}

module.exports.UserDAO = UserDAO;
