module.exports = function(app, swig) {


    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/autores-agregar.html', {

        });
        res.send(respuesta);
    })

    app.get("/autores", function(req, res) {

        var autores = [{
            "nombre": "Alex Turner",
            "grupo": "Arctic Monkeys",
            "rol": "Cantante"
        }, {
            "nombre": "Slash",
            "grupo": "Guns N'Roses",
            "rol": "Guitarra"
        }, {
            "nombre": "Chris Slade",
            "grupo": "AC/DC",
            "rol": "Bateria"
        }];

        let respuesta = swig.renderFile('views/autores.html', {
            vendedor : 'Tienda de canciones',
            autores : autores
        });

        res.send(respuesta);
    });

    app.post("/autor", function (req, res) {
        res.send("Autor agregado: " + req.body.nombre + "<br>" + "grupo: " + req.body.grupo + "<br>"  + "rol: " + req.body.rol);
    });

    app.get('/autores*', function (req, res) {
        res.redirect('/autores');
    });


};
