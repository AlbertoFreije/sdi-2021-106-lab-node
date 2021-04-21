module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.get("/api/cancion/:id", function(req, res) {

        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });

    app.delete("/api/cancion/:id", function(req, res) {

        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        var token = req.headers['token'] || req.body.token || req.query.token;

        var usuario = req.session.usuario;

                gestorBD.eliminarCancion(criterio,function(canciones){
                    if ( canciones == null ){
                        res.status(500);
                        res.json({
                            error : errors
                        })
                    } else {

                        validarEsAutor(token,usuario,canciones,function(errors) {

                            if(errors !==null && errors.length>0) {
                                res.status(403);
                                res.json({
                                    errores: errors
                                })
                            }else{

                                res.status(200);
                                res.send(JSON.stringify(canciones));
                            }


                        })
                    }
                });

    });

    app.post("/api/cancion", function(req, res) {
        let cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio,
            autor : res.usuario
        }

        // ¿Validar nombre, genero, precio?
        validacionDatos(cancion, function (errors){

            if(errors !==null && errors.length>0){
                res.status(403);
                res.json({
                    errores:errors
                })
            }
            else{

                gestorBD.insertarCancion(cancion, function(id){
                    if (id == null) {
                        res.status(500);
                        res.json({
                            error : errors
                        })
                    } else {
                        res.status(201);
                        res.json({
                            mensaje : "canción insertada",
                            _id : id
                        })
                    }
                });

            }

        })
    });

    app.put("/api/cancion/:id", function(req, res) {

        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };

        let cancion = {}; // Solo los atributos a modificar

        if ( req.body.nombre != null)
            cancion.nombre = req.body.nombre;

        if ( req.body.genero != null)
            cancion.genero = req.body.genero;

        if ( req.body.precio != null)
            cancion.precio = req.body.precio;

        validacionDatosModificar(cancion, function (errors){

            if(errors !==null && errors.length>0){
                res.status(403);
                res.json({
                    errores:errors
                })
            }else{

                gestorBD.modificarCancion(criterio, cancion, function(result) {
                    if (result == null) {
                        res.status(500);
                        res.json({
                            error : "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.json({
                            mensaje : "canción modificada",
                            _id : req.params.id
                        })
                    }
                });

            }

        })

    });

    app.post("/api/autenticar/", function(req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email : req.body.email,
            password : seguro
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if ( usuarios == null || usuarios.length == 0){
                res.status(401); // unauthorized
                res.json({
                    autenticado: false
                })
            }else {
                let token = app.get('jwt').sign(
                    {usuario: criterio.email ,
                        tiempo: Date.now()/1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado : true,
                    token: token
                })
            }
        });
    });

    function validacionDatos(cancion, functionCallback){

        let errors = new Array();

        if(cancion.nombre === null || typeof cancion.nombre === 'undefined' || cancion.nombre === "" ){
            errors.push("El nombre de la cancion no puede estar vacio");
        }
        if(cancion.genero === null || typeof cancion.genero === 'undefined' || cancion.genero === "" ){
            errors.push("El genero de la cancion no puede estar vacio");
        }
        if(cancion.precio === null || typeof cancion.precio === 'undefined' || cancion.precio < 0 || cancion.precio ==="" ){
            errors.push("El precio de la cancion no puede estar vacio o no puede ser menor de 0");
        }
        if(errors.length<=0){
            functionCallback(null);
        }else{
            functionCallback(errors);
        }


    }

    function validacionDatosModificar(cancion, functionCallback){

        let errors = new Array();

        if(cancion.nombre !== null || typeof cancion.nombre !== 'undefined' || cancion.nombre !== "" ){
            if(cancion.nombre.length >20 ){
                errors.push("El nombre de la cancion no puede tener mas de 20 caracteres");
            }
        }
        if(cancion.genero !== null || typeof cancion.genero !== 'undefined' || cancion.genero !== "" ){
           if(cancion.genero.length>20){
               errors.push("El genero de la cancion no puede tener mas de 20 caracteres");
           }
        }
        if(cancion.precio !== null || typeof cancion.precio !== 'undefined' || cancion.precio !=="" ){
            if(cancion.precio < 0){
                errors.push("El precio de la cancion no ser menor de 0");
            }

        }
        if(errors.length<=0){
            functionCallback(null);
        }else{
            functionCallback(errors);
        }


    }

    function validarEsAutor(token,usuario,canciones,functionCallback){


        let errors = new Array();

        if(token===null){

            errors.push("Debe loguearse primero");

        }else{

            if(canciones.autor === usuario){
                errors.push("Solo el autor puede eliminar o modificar canciones");
            }

            if(errors.length<=0){
                functionCallback(null);
            }else{
                functionCallback(errors);
            }

        }




    }
}


