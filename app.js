//Módulos
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let swig = require('swig');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Variables
app.set('port', 8081);

require("./routes/rusuarios.js")(app, swig); // (app, param1, param2, etc.)
require("./routes/rcanciones.js")(app, swig); // (app, param1, param2, etc.)
require("./routes/rautores.js")(app, swig); // (app, param1, param2, etc.)

// lanzar el servidor
app.listen(app.get('port'), function(){
    console.log('Servidor activo');
});