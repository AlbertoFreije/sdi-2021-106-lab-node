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
                    res.send("Error insertando el comentario");
                } else {
                    res.send("añadido correctamente");
                }
            });

        } else {
            res.send("Error: Usuario no ha iniciado sesion");
        }

    })

};
