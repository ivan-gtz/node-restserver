
const express = require('express');

const { verificaToken, vericaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');
const _ = require('underscore');




//===========================================
//Obtener producto
//===========================================

app.get('/productos',verificaToken,(req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible:true })
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, producto) =>{

                if(err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Producto.count((err, conteo) => {
                    
                    res.json({
                        ok: true,
                        producto,
                        cuantos: conteo
                    });

                });
            })
    // trae todos los productos
    //populate: usuario y la categoria
    //paginado
});

//===========================================
//Obtener un producto por ID
//===========================================

app.get('/productos/:id',verificaToken, (req, res) => {
    //populate: usuario y la categoria
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El ID no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB,
        });

    }).populate('usuario', 'nombre email')
      .populate('categoria', 'descripcion');
});

//===========================================
//Buscar producto
//===========================================

app.get('/productos/buscar/:termino',verificaToken, (req, res) =>{

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, producto) =>{
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            } 

            res.json({
                ok: true,
                producto
            })
        });
});


//===========================================
//Crear un nuevo producto
//===========================================
app.post('/productos',verificaToken, (req, res) => {

        let body = req.body;
        let producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: true,
            categoria: body.categoria,
            usuario: req.usuario._id
        });
        
    producto.save((err, productoDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true, 
            producto: productoDB
        });
    });
    // grabar el usuario
    // grabar una categoria del listado
});


//===========================================
//Actualizar un producto
//===========================================
app.put('/productos/:id',verificaToken, (req, res) => {
    let id = req.params.id;
    let body =_.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);
    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, productoDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El ID no existe'
                }
            });
        }
        
        res.json({
            ok: true,
            usuario: productoDB
        })

    })
    // grabar el usuario
    // grabar una categoria del listado
});


//===========================================
//Borrar un producto
//===========================================
app.delete('/productos/:id', [verificaToken, vericaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    };
    Producto.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, productoBorrado) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            producto: productoBorrado,
            mensaje: 'Producto borrado'
        })
    }); 
});













module.exports = app;