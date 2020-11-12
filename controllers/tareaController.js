const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearTarea = async (req, res) => {

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        //extraerel proyecto para comprobar que existe
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(400).json({ msg: 'No Autorizado' });
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();

        res.json({ msg: 'Tarea creada' });


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

exports.obtenerTareas = async (req, res) => {
    try {
        //extraerel proyecto para comprobar que existe
        const { proyecto } = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(400).json({ msg: 'No Autorizado' });
        }

        //Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto });
        res.json({ tareas });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Acutalizar Tarea
exports.actualizarTarea = async (req, res) => {

    try {

        //extraerel proyecto para comprobar que existe
        const { proyecto, nombre, estado } = req.body;

        //si la tarea existe o no
        const existeTarea = await Tarea.findById(req.params.id);

        if (!existeTarea) {
            return res.status(404).json({ msg: 'La tarea no existe' });
        }

        const existeProyecto = await Proyecto.findById(proyecto);

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(400).json({ msg: 'No Autorizado' });
        }

        //Crear un nuevo objeto con la nueva informacion
        const nuevaTarea = {};

        if (nombre !== null) nuevaTarea.nombre = nombre;
        if (estado !== null) nuevaTarea.estado = estado;

        //Guardar la tarea
        const tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Eliminar Tarea
exports.eliminarTarea = async (req, res) => {
    try {

        //extraerel proyecto para comprobar que existe
        const { proyecto, nombre, estado } = req.query;

        //si la tarea existe o no
        const existeTarea = await Tarea.findById(req.params.id);

        if (!existeTarea) {
            return res.status(404).json({ msg: 'La tarea no existe' });
        }

        const existeProyecto = await Proyecto.findById(proyecto);

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(400).json({ msg: 'No Autorizado' });
        }

        //Eliminar 
        await Tarea.findOneAndDelete({ _id: req.params.id });

        res.json({ msg: 'Tarea Eliminada' });



    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}