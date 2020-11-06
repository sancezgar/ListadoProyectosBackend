const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //leer el token del header
    const token = req.header('x-auth-token');

    //Revisar si  no hay token
    if (!token) {
        return res.status(400).json({ msg: 'No hay Token, permiso no válido' })
    }
    
    //validar el token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json('Token no válido');
    }
}