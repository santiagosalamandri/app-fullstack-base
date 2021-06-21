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
    utils.query(`Select * from smart_home.Devices where id=${req.params.id}`, function (err, rta, field) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(rta);
    });

});

//Ejercicio 6
//Espera recibir {id:1,state:1/0} , impacta el cambio y lo devuelve
app.post('/devices/:id', function (req, res) {
    let datosFiltrados = datos.filter(item => item.id == req.params.id);
    if (datosFiltrados.length > 0) {
        if (datosFiltrados[0].type == 1) {
            datosFiltrados[0].status = parseInt(req.body.status);
            res.status(200).json(datosFiltrados[0]);
        } else {
            datosFiltrados[0].state = req.body.state;
            res.status(200).json(datosFiltrados[0]);
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
        res.json(datos[datos.length - 1]);
    }
    else {
        res.status(400).json({ "Error": "Formato incorrecto" });
    }

});

app.get('/todos', function (req, res, next) {
    let id=1;
    let name="Lámpara 2999";
    let type = 1;
    let description="nueva lamp";
    utils.query(`SELECT * FROM smart_home.Devices`, function (err, rta, field) { //get all devices

    //utils.query(`SELECT * FROM smart_home.Devices WHERE id=${id}`, function (err, rta, field) { //get one device
    //utils.query(`Update smart_home.Devices SET name='${name}' where id=${id}`, function (err, rta, field) {   //update field
    //utils.query(`INSERT INTO smart_home.Devices(name,description,type) VALUES ('${name}','${description}',${type})`, function (err, rta, field) { //insert
    //utils.query(`DELETE FROM smart_home.Devices WHERE id=${id}`, function (err, rta, field) { //delete
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(rta);
    });
});

//=======[ Main module code ]==================================================
app.listen(PORT, function (req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================