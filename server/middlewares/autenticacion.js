const jwt = require('jsonwebtoken');

//======================================================
//Verificar Token
//======================================================
let verificaToken = ( req, res, next ) => {

    let token = req.get('token');
     
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

// ======================================================
// Verifica AdminRole
// ======================================================

let vericaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    // console.log(usuario);
    if(usuario.role === 'ADMIN_ROLE' ){
        next();
        return;   
    } else{
        return res.json({
                ok: false,
                err: {
                    nessage: 'El usuario no es administrador'
                }
        });
    }
};
//======================================================
//Verificar Token para imagen
//======================================================
let verificaTokenImg = ( req, res, next ) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

}

module.exports = {
    verificaToken,
    vericaAdmin_Role,
    verificaTokenImg
}