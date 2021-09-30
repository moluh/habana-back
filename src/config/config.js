// Puertos
// ============================================
//process.env.PORT = process.env.PORT || 3000;
process.env.PORT = process.env.PORT || 8080;

// Entornos
// ============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/* Mongodb config */
var mdbconf = {
    host: 'localhost',
    port: '27017',
    db: 'app_habb'
};

module.exports.mdbconf = mdbconf;