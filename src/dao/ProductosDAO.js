function ProductosDAO(db) {
    let ObjectId = require("mongodb").ObjectId;

    if (false == this instanceof ProductosDAO) {
        console.log(
            'WARNING: UserDAO constructor called without "new" operator'
        );
        return new ProductosDAO(db);
    }

    let database = db.db("app_habb");
    let productos = database.collection("productos");

    this.post = function (producto, callback) {
        productos.findOne({ nombre: producto.nombre }, function (err, prod) {
            if (err) return new Error(err);

            if (prod) {
                let msgError = "Esta nombre de Producto ya existe";
                return callback(msgError, null);
            } else {
                productos.insertOne(producto, function (err, result) {
                    if (err) return callback(err, null);

                    console.log("Nueva producto creado");
                    return callback(null, result[0]);
                });
            }
        });
    };

    this.getAll = function (callback) {
        productos
            .find({})
            .sort({ hora: 1 })
            .toArray(function (err, productos) {
                if (err) {
                    let msgError = new Error("No hay productos aún");
                    return callback(msgError, null);
                }
                return callback(null, productos);
            });
    };

    this.getByNombre = function (nombre, callback) {
        productos
            .find({
                nombre: { $regex: nombre, $options: "i" },
            })
            .sort({ hora: 1 })
            .toArray(function (err, productos) {
                if (err) {
                    let msgError = new Error("No hay productos aún");
                    return callback(msgError, null);
                }
                return callback(null, productos);
            });
    };

    this.getById = function (id, callback) {
        productos.findOne({ _id: ObjectId(id) }, function (err, producto) {
            if (err) {
                let msgError = "No se encontró ningún Producto";
                return callback(msgError, null);
            }
            return callback(null, producto);
        });
    };

    this.put = function (prod, callback) {
        productos.updateOne(
            { _id: ObjectId(prod._id) },
            {
                $set: {
                    codigo: prod.codigo,
                    nombre: prod.nombre,
                    precio: prod.precio,
                    disponible: prod.disponible,
                    tipo: prod.tipo,
                },
            },
            { upsert: true },
            function (err, prod) {
                if (err) throw err;
                callback(null, prod);
            }
        );
    };

    this.delete = function (id, callback) {
        productos.deleteOne({ _id: ObjectId(id) }, function (err, prod) {
            if (err) throw err;
            callback(null, prod);
        });
    };
}

module.exports.ProductosDAO = ProductosDAO;
