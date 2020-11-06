const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');

//api/tareas
//crear tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre no puede estar vacío').not().isEmpty(),
        check('proyecto', 'El proyecto no puede estar vacío').not().isEmpty()
    ],
    tareaController.crearTarea
);

//Obtener las tareas por proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas
)

//Actualizar tarea
router.put('/:id',
    auth,
    tareaController.actualizarTarea
)

//Eliminar Tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)


module.exports = router;