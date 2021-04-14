module.exports = function(app, swig, gestorBD) {

    app.post("/comentarios/:cancion_id", function (req, res) {

        if( req.session.usuario != null) {

            let comentario = {
                autor: req.session.usuario,
                texto: req.body.texto,
                cancion_id: gestorBD.mongo.ObjectID(req.params.id)
            }

            gestorBD.insertarComentario(comentario, function (id) {
                if (id == null) {

                    let respuesta = swig.renderFile('views/error.html',
                        {
                            mensaje: "Error insertando el comentario"
                        });
                    res.send(respuesta);
                } else {
                    res.send("añadido correctamente");
                }
            });

        } else {
            let respuesta = swig.renderFile('views/error.html',
                {
                    mensaje: "Error: Usuario no ha iniciado sesion"
                });
            res.send(respuesta);
        }

    })

};
