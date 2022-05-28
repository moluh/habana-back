function MesasDAO(db) {
    let ObjectId = require("mongodb").ObjectId;

    if (false == this instanceof MesasDAO) {
        console.log(
            'WARNING: UserDAO constructor called without "new" operator'
        );
        return new MesasDAO(db);
    }

    let database = db.db("app_habb");
    let mesas = database.collection("mesas");

    this.post = function (mesa, callback) {
        mesas.findOne({ numero: mesa.numero }, function (err, m) {
            if (err) return new Error(err);

            if (m) {
                let msgError = "Este numero de mesa ya existe";
                return callback(msgError, null);
            } else {
                mesas.insertOne(mesa, function (err, result) {
                    if (err) return callback(err, null);

                    console.log("Nueva mesa creado");
                    return callback(null, result[0]);
                });
            }
        });
    };

    this.getAll = function (callback) {
        mesas.find({}).toArray(function (err, mesas) {
            if (err) {
                let msgError = new Error("No hay mesas aún");
                return callback(msgError, null);
            }
            return callback(null, mesas);
        });
    };

    this.getById = function (id, callback) {
        mesas.findOne({ _id: ObjectId(id) }, function (err, mesa) {
            if (err) {
                let msgError = "No se encontró ningún Producto";
                return callback(msgError, null);
            }
            return callback(null, mesa);
        });
    };

    this.put = function (m, callback) {
        mesas.updateOne(
            { _id: ObjectId(m._id) },
            {
                $set: {
                    numero: m.numero,
                    estado: m.estado,
                },
            },
            { upsert: true },
            function (err, m) {
                if (err) throw err;
                callback(null, m);
            }
        );
    };

    this.delete = function (id, callback) {
        mesas.deleteOne({ _id: ObjectId(id) }, function (err, mesa) {
            if (err) throw err;
            callback(null, mesa);
        });
    };
}

module.exports.MesasDAO = MesasDAO;
