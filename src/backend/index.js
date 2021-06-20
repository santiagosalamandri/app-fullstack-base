//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require('express');
var app = express();
var utils = require('./mysql-connector');

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));

//Ejercicio 3
var datos = require('./datos.json');

//Ejercicio 4
app.get('/devices/', function (req, res) {
    //res.send(datos);
    res.json(datos);
});

//Ejercicio 5
//Espera una consulta al endpoint EJ /devices/1
//Parámetro id = el id del dispositivo a buscar
// devuelve el dispositivo con el id que viene del parametro
app.get('/devices/:id', function (req, res) {
    let datosFiltrados = datos.filter(item => item.id == req.params.id);

    res.json(datosFiltrados[0]);
});

//Ejercicio 6
//Espera recibir {id:1,state:1/0} , impacta el cambio y lo devuelve
app.post('/devices/:id', function (req, res) {
    let datosFiltrados = datos.filter(item => item.id == req.params.id);
    if (datosFiltrados.length > 0) {
        if (req.body.status != undefined) {
            datosFiltrados[0].status = req.body.status;
            res.status(200).json(datosFiltrados[0]);
        }else if(req.body.state != undefined){
            datosFiltrados[0].state = req.body.state;
            res.status(200).json(datosFiltrados[0]);
        }
        else {
            res.status(404).json({ "Error": "Not Found" });

        }
    }
    else {
        res.status(404).json({ "Error": "Not Found" });
    }
});

app.delete('/devices/:id', function (req, res) {
    //let datosFiltrados = datos.filter(item => item.id == (req.params.id)-1);
    let index = datos.findIndex(item => item.id == req.params.id);
    if (index >= 0) {
        datos.splice(index, 1);
        res.json(datos);
    }
    else {
        res.status(404).json({ "Error": "Not Found" });
    }
});
app.put('/devices/:id', function (req, res) {
    let datosFiltrados = datos.filter(item => item.id == req.params.id);
    if (datosFiltrados.length > 0) {
        if (req.body.name != undefined) {
            datosFiltrados[0].name = req.body.name;
        }
        if (req.body.description != undefined) {
            datosFiltrados[0].description = req.body.description;
        }
        if (req.body.type != undefined) {
            datosFiltrados[0].type = req.body.type;
        }
        res.status(200).json(datosFiltrados[0]);

    }
    else {
        res.status(400).json({ "Error": "Formato incorrecto" });
    }

});

app.post('/devices/', function (req, res) {
    //let datosFiltrados = datos.filter(item => item.id == req.params.id);
    if (req.body.name != undefined && req.body.description != undefined && req.body.type != undefined) {
        datos.push({ "id": datos.length + 1, "name": req.body.name, "description": req.body.description, "type": req.body.type, "status": 0 });
        res.json(datos[datos.length-1]);
    }
    else {
        res.status(400).json({ "Error": "Formato incorrecto" });
    }

});

//=======[ Main module code ]==================================================
app.listen(PORT, function (req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================