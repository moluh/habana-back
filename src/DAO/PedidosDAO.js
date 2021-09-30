function PedidosDAO(db) {

    let ObjectId = require('mongodb').ObjectID;

    if (false == (this instanceof PedidosDAO)) {
        console.log('WARNING: PedidosDAO constructor called without "new" operator');
        return new PedidosDAO(db);
    }

    let database = db.db('app_habb');
    let pedidos = database.collection('pedidos')


    this.post = function (pedido, callback) {

        // Primer documento que debe haber en la BD para hacer el increment de nro_pedido:
        // {
        //     "nro_pedido": "numeroPed",
        //     "sequence_value": 0
        // }

        // Buscamos el contador de pedido
        pedidos.findOne({
            nro_pedido: "numeroPed",
        }, function (err, ped) {
            if (err) throw err;

            // Si no se encuentra, lo creamos
            if (!ped) {
                pedidos.insertOne({
                        nro_pedido: "numeroPed",
                        sequence_value: 2
                    },
                    function (err, result) {
                        if (err) return callback(err, null);
                        console.log('Contador de Pedidos creado');
                        // return callback(null, result.ops[0]);
                        console.log('result', result.ops[0].sequence_value);
                        // value = seq_val.value;
                        // console.log('Último numero de Pedido: ', value.sequence_value);

                        //Asignamos el ultimo numero de pedido al Nuevo pedido
                        // pedido.nro_pedido = result.ops[0].sequence_value + 1;
                        pedido.nro_pedido = 1;

                        pedidos.insertOne(pedido, function (err, result) {
                            if (err) return callback(err, null);

                            console.log('Nuevo pedido creado');
                            return callback(null, result.ops[0]);
                        });
                    }
                )
            } else {

                // Si se encuentra el contador hacemos el post del pedido
                let value;
                // Actulizamos el documento que lleva el contador de los pedidos
                pedidos.findOneAndUpdate({
                        nro_pedido: "numeroPed"
                    }, {
                        $inc: {
                            sequence_value: 1
                        }
                    }, {
                        new: true
                    },
                    function (err, seq_val) {
                        value = seq_val.value;
                        console.log('Último numero de Pedido: ', value.sequence_value);

                        //Asignamos el ultimo numero de pedido al Nuevo pedido
                        pedido.nro_pedido = value.sequence_value;

                        pedidos.insertOne(pedido, function (err, result) {
                            if (err) return callback(err, null);

                            console.log('Nuevo pedido creado');
                            return callback(null, result.ops[0]);
                        });
                    });
            }
        })
    }

    this.getAll = function (callback) {
        pedidos.find({
                nro_pedido: {
                    $ne: 'numeroPed'
                }
            })
            .sort({
                fecha: -1,
                hora: -1
            })
            .toArray(function (err, pedidos) {
                if (err) {
                    let msgError = new Error('No hay pedidos aún');
                    return callback(msgError, null);
                }
                return callback(null, pedidos);
            });
    }

    this.getById = function (id, callback) {
        pedidos.findOne({
            "_id": ObjectId(id)
        }, function (err, pedido) {
            if (err) {
                let msgError = "No se encontró ningún Pedido"
                return callback(msgError, null)
            }
            return callback(null, pedido);
        })
    }

    this.getPendAndEnt = function (callback) {
        pedidos.find({
                estado: {
                    $ne: 'Listo'
                },
                nro_pedido: {
                    $ne: 'numeroPed'
                }
            })
            .sort({
                fecha: 1,
                hora: 1
            })
            .toArray(function (err, pedidos) {
                if (err) {
                    let msgError = "No se encontró ningún Pedido"
                    return callback(msgError, null)
                }
                return callback(null, pedidos);
            })
    }

    this.getPendientes = function (callback) {
        pedidos.find({
                estado: {
                    $eq: 'Pendiente'
                },
                nro_pedido: {
                    $ne: 'numeroPed'
                }
            })
            .sort({
                fecha: -1,
                hora: -1
            })
            .toArray(function (err, pedidos) {
                if (err) {
                    let msgError = "No se encontró ningún Pedido"
                    return callback(msgError, null)
                }
                return callback(null, pedidos);
            })
    }

    this.getEntregados = function (callback) {
        pedidos.find({
                estado: {
                    $eq: 'Entregado'
                },
                nro_pedido: {
                    $ne: 'numeroPed'
                }
            })
            .sort({
                fecha: -1,
                hora: -1
            })
            .limit(50)
            .toArray(function (err, pedidos) {
                if (err) {
                    let msgError = "No se encontró ningún Pedido"
                    return callback(msgError, null)
                }
                return callback(null, pedidos);
            })
    }

    this.getListos = function (callback) {
        pedidos.find({
                estado: {
                    $eq: 'Listo'
                },
                nro_pedido: {
                    $ne: 'numeroPed'
                }
            })
            .sort({
                fecha: -1,
                hora: -1
            })
            .limit(50)
            .toArray(function (err, pedidos) {
                if (err) {
                    let msgError = "No se encontró ningún Pedido"
                    return callback(msgError, null)
                }
                return callback(null, pedidos);
            })
    }

    this.getPedidoMozo = function (id, callback) {
        pedidos.find({
                "usuario._id": {
                    $eq: id
                }
            })
            .sort({
                fecha: -1,
                hora: -1
            })
            .limit(50)
            .toArray(function (err, pedidos) {
                if (err) {
                    let msgError = "No se encontró ningún Pedido"
                    return callback(msgError, null)
                }
                return callback(null, pedidos);
            })
    }

    this.put = function (ped, callback) {
        pedidos.findOneAndUpdate({
                "_id": ObjectId(ped._id)
            }, {
                $set: {
                    "fecha": ped.fecha,
                    "hora": ped.hora,
                    "descripcion": ped.descripcion,
                    "estado": ped.estado,
                    "usuario": ped.usuario,
                    "mesa": ped.mesa,
                    "productos": ped.productos,
                }
            }, {
                returnOriginal: false
            },
            function (err, ped) {
                if (err) throw err;

                console.log('Nueva pedido actualizado');

                callback(null, ped.value);
            });
    }

    this.deleteAll = function (callback) {
        // deleteMany() usa 'filter' para eliminar datos que coincidan
        // Pasamos un objeto vacio, para eliminar toda la collecion
        pedidos.deleteMany({}, function (err, ped) {
            if (err) throw new Error(err);
            callback(null, null)
        });
    }

    this.deleteOne = function (id, callback) {
        pedidos.deleteOne({
            "_id": ObjectId(id)
        }, function (err, ped) {
            if (err) throw err;
            callback(null, ped)
        });
    }

}

module.exports.PedidosDAO = PedidosDAO;