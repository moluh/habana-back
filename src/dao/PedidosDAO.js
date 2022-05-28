function PedidosDAO(db) {
    let ObjectId = require("mongodb").ObjectId;

    if (false == this instanceof PedidosDAO) {
        console.log(
            'WARNING: PedidosDAO constructor called without "new" operator'
        );
        return new PedidosDAO(db);
    }

    let database = db.db("app_habb");
    let pedidos = database.collection("pedidos");

    const updateCounterAndCreateOrder = (pedido, callback) => {
        pedidos.findOneAndUpdate(
            { nro_pedido: "numeroPed" },
            { $inc: { sequence_value: 1 } },
            { new: true },
            function (err, seq_val) {
                if (err) return callback(err, null);
                //Asignamos el ultimo numero de pedido al Nuevo pedido
                pedido.nro_pedido = seq_val.value.sequence_value;

                pedidos.insertOne(pedido, function (err, result) {
                    if (err) return callback(err, null);
                    return callback(null, result);
                });
            }
        );
    };

    const createCounterAndCreateOrder = (pedido, callback) => {
        pedidos.insertOne(
            {
                nro_pedido: "numeroPed",
                sequence_value: 2,
            },
            function (err, result) {
                if (err) return callback(err, null);
                //Asignamos el ultimo numero de pedido al Nuevo pedido
                pedido.nro_pedido = 1;

                pedidos.insertOne(pedido, function (err, result) {
                    if (err) return callback(err, null);
                    return callback(null, result);
                });
            }
        );
    };

    this.post = function (pedido, callback) {
        // Primer documento que debe haber en la BD para hacer el increment de nro_pedido:
        // { "nro_pedido": "numeroPed", "sequence_value": 0 }

        // Buscamos el contador de pedido
        pedidos.findOne(
            {
                nro_pedido: "numeroPed",
            },
            function (err, ped) {
                if (err) throw err;

                if (!ped) {
                    // Si no se encuentra, lo creamos
                    createCounterAndCreateOrder(pedido, callback);
                } else {
                    // Si se encuentra el contador, hacemos update + post del pedido
                    updateCounterAndCreateOrder(pedido, callback);
                }
            }
        );
    };

    this.getAll = function (callback) {
        pedidos
            .find({
                nro_pedido: {
                    $ne: "numeroPed",
                },
            })
            .sort({
                fecha: -1,
                hora: -1,
            })
            .toArray(function (err, pedidos) {
                if (err) return callback("No hay pedidos aún", null);

                return callback(null, pedidos);
            });
    };

    this.getById = function (id, callback) {
        pedidos.findOne({ _id: ObjectId(id) }, function (err, pedido) {
            if (err) {
                let msgError = "No se encontró ningún Pedido";
                return callback(msgError, null);
            }
            return callback(null, pedido);
        });
    };

    this.getPendAndEnt = function (callback) {
        pedidos
            .find({
                estado: { $ne: "Listo" },
                nro_pedido: { $ne: "numeroPed" },
            })
            .sort({
                fecha: 1,
                hora: 1,
            })
            .toArray(function (err, pedidos) {
                if (err) return callback("No se encontró ningún Pedido", null);

                return callback(null, pedidos);
            });
    };

    this.getPendientes = function (callback) {
        pedidos
            .find({
                estado: { $eq: "Pendiente" },
                nro_pedido: { $ne: "numeroPed" },
            })
            .sort({
                fecha: -1,
                hora: -1,
            })
            .toArray(function (err, pedidos) {
                if (err) {
                    let msgError = "No se encontró ningún Pedido";
                    return callback(msgError, null);
                }
                return callback(null, pedidos);
            });
    };

    this.getEntregados = function (callback) {
        pedidos
            .find({
                estado: { $eq: "Entregado" },
                nro_pedido: { $ne: "numeroPed" },
            })
            .sort({
                fecha: -1,
                hora: -1,
            })
            .limit(50)
            .toArray(function (err, pedidos) {
                if (err) {
                    let msgError = "No se encontró ningún Pedido";
                    return callback(msgError, null);
                }
                return callback(null, pedidos);
            });
    };

    this.getListos = function (callback) {
        pedidos
            .find({
                estado: { $eq: "Listo" },
                nro_pedido: { $ne: "numeroPed" },
            })
            .sort({
                fecha: -1,
                hora: -1,
            })
            .limit(50)
            .toArray(function (err, pedidos) {
                if (err) {
                    let msgError = "No se encontró ningún Pedido";
                    return callback(msgError, null);
                }
                return callback(null, pedidos);
            });
    };

    this.getPedidoMozo = function (id, callback) {
        pedidos
            .find({ "usuario._id": { $eq: id } })
            .sort({
                fecha: -1,
                hora: -1,
            })
            .limit(50)
            .toArray(function (err, pedidos) {
                if (err) {
                    let msgError = "No se encontró ningún Pedido";
                    return callback(msgError, null);
                }
                return callback(null, pedidos);
            });
    };

    this.put = function (ped, callback) {
        pedidos.findOneAndUpdate(
            { _id: ObjectId(ped._id) },
            {
                $set: {
                    fecha: ped.fecha,
                    hora: ped.hora,
                    descripcion: ped.descripcion,
                    estado: ped.estado,
                    usuario: ped.usuario,
                    mesa: ped.mesa,
                    productos: ped.productos,
                },
            },
            { returnOriginal: false },
            function (err, ped) {
                if (err) throw err;

                console.log("Nueva pedido actualizado");

                return callback(null, ped.value);
            }
        );
    };

    this.deleteAll = function (callback) {
        // deleteMany() usa 'filter' para eliminar datos que coincidan
        // Pasamos un objeto vacio, para eliminar toda la collecion
        pedidos.deleteMany({}, function (err, data) {
            if (err) throw new Error(err);
            return callback(null, data);
        });
    };

    this.deleteOne = function (id, callback) {
        pedidos.deleteOne({ _id: ObjectId(id) }, function (err, data) {
            if (err) throw err;
            return callback(null, data);
        });
    };
}

module.exports.PedidosDAO = PedidosDAO;
