function adminMW(req, res, next) {
    const authString = req.headers["authorization"];

    if (typeof authString === "string" && authString.indexOf(" ") > -1) {
        const authArray = authString.split(" ");
        const token = authArray[1];
        jwt.verify(token, config.jwtSecret, async (err, decoded) => {
            if (err)
                res.status(403).send({
                    ok: false,
                    msg: "Token no válido: No tiene autorización para este recurso",
                    error: err,
                });
            else if (decoded.role === "ADMIN") next();
        });
    } else {
        res.status(403).send({
            ok: false,
            msg: "Token no válido.",
        });
    }
}


function mozoMW(req, res, next) {
    const authString = req.headers["authorization"];

    if (typeof authString === "string" && authString.indexOf(" ") > -1) {
        const authArray = authString.split(" ");
        const token = authArray[1];
        jwt.verify(token, config.jwtSecret, async (err, decoded) => {
            if (err)
                res.status(403).send({
                    ok: false,
                    msg: "Token no válido: No tiene autorización para este recurso",
                    error: err,
                });
            else if (decoded.role === "ADMIN") next();
        });
    } else {
        res.status(403).send({
            ok: false,
            msg: "Token no válido.",
        });
    }
}

module.exports = {
    adminMW,
    mozoMW
}