// Puertos
// ============================================
//process.env.PORT = process.env.PORT || 3000;
process.env.PORT = process.env.PORT || 8080;

// Entornos
// ============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/* Mongodb config */
var mdbconf = {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    db: process.env.MONGO_DATABASE
};

module.exports.mdbconf = mdbconf;