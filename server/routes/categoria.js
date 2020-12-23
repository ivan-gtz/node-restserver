
const express = require('express');

let { verificaToken, vericaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//=============================
// Mostrar todas las categorias
//=============================  

app.get('/categoria', verificaToken,  (req, res) => {
    Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, categorias) =>{

                if(err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    categorias,
                });


            })

});
//=============================
// Mostrar una categoria por ID
//=============================  
app.get('/categoria/:id',verificaToken ,(req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El ID no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            categoriaDB,
        });

    });

});

//=============================
// Crear nueva categoria
//=============================  
app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    let body = req.body;
    let _id = req.usuario._id;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: _id
    });

    categoria.save((err, categoriaDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true, 
            categoria: categoriaDB
        });


    });
    //req.usuario._id
});

//=============================
// Actualiza la categoria
//=============================  
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let desCategoria = {
        descripcion: body.descripcion
    }


    Categoria.findByIdAndUpdate(id, desCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if(!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok: true,
            usuario: categoriaDB
        })

    })
});

// //=============================
// // Borra una categoria
// //=============================  
app.delete('/categoria/:id' , [verificaToken, vericaAdmin_Role], (req, res) => {
    // solo un administrador puede borrar categorias
    //Categoria.findByIdAndRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        
        if(!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria borrada'
        })
    });
        
});






module.exports = app;

