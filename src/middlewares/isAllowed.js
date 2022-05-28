const jwt = require("jsonwebtoken");
const { ADMIN } = require("../constants/roles");
const jwtSecret = process.env.JWT_SECRET;

function isAllowed(requiredRoles = null) {
    return function (req, res, next) {
        // return next()
        const authString = req.headers["authorization"];

        if (typeof authString === "string" && authString.indexOf(" ") > -1) {
            const authArray = authString.split(" ");
            const token = authArray[1];
            jwt.verify(token, jwtSecret, async (err, decoded) => {
                if (err) return res.json({ error: "Token no válido." });

                if (
                    requiredRoles.some(
                        (role) =>
                            decoded.role === role || decoded.role === ADMIN
                    )
                )
                    next();
            });
        } else {
            return res.json({ error: "Usuario no logueado." });
        }
    };
}

module.exports.isAllowed = isAllowed;
