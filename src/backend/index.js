//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require('express');
var app = express();
var utils = require('./mysql-connector');

app.use(express.json());
app.use(express.static('/home/node/app/static/'));

var datos = require('./datos.json');
const { json } = require('express');

/**
 * Devuelve un dispositivo especifico
 */
app.get('/devices/:id', function (req, res) {
    utils.query(`Select * from smart_home.Devices where id=${req.params.id}`, function (err, rta, field) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        if (rta[0]) {
            res.send(rta[0]);
        }
        else {
            res.status(404).json({ "Error": "Not Found" });
        }
    });

});

/**
 * Actualizar estado de dispositivo
 */
app.post('/devices/:id', function (req, res) {
    let state = req.body.state? req.body.state :0;
    let status = req.body.status?req.body.status:0;
    
    utils.query(`UPDATE smart_home.Devices SET status='${status}', state='${state}' where id=${req.params.id}`, function (err, rta, field) {   //update field
        if (err) {
            res.send(err).status(400);
            return;
        }
        let result=rta.affectedRows;
        if(result ==1){
            utils.query(`SELECT * FROM smart_home.Devices WHERE id=${req.params.id} LIMIT 0,1`, function (err, rta, field) { //get one device
                if (err) {
                    res.send(err).status(400);
                    return;
                }
                res.send(rta[0]);
            });
        }
        else{
            res.status(404).json({ "Error": "Not Found" });
    
        }});
});
/**
 * Borrar dispositivo
 */
app.delete('/devices/:id', function (req, res) {
    //let datosFiltrados = datos.filter(item => item.id == (req.params.id)-1);
    utils.query(`DELETE FROM smart_home.Devices WHERE id=${req.params.id}`, function (err, rta, field) { //delete
        if (err) {
            res.send(err).status(400);
            return;
        }
        let result=rta.affectedRows;
        if(result ==1){
            res.status(200).json({ "id": req.params.id });

        }
        else{
            res.status(404).json({ "Error": "Not Found" });
 
        }
    });
});
/**
 * Actualizador datos de dispositivo
 */
app.put('/devices/:id', function (req, res) {
utils.query(`UPDATE smart_home.Devices SET name='${req.body.name}', description='${req.body.description}',type='${req.body.type}' where id=${req.params.id}`, function (err, rta, field) {   //update field
    if (err) {
        res.send(err).status(400);
        return;
    }
    let result=rta.affectedRows;
    if(result ==1){
        utils.query(`SELECT * FROM smart_home.Devices WHERE id=${req.params.id} LIMIT 0,1`, function (err, rta, field) { //get one device
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send(rta[0]);
        });
    }
    else{
        res.status(404).json({ "Error": "Not Found" });

    }});

});
/**
 * Agregar nuevo dispositivo
 */
app.post('/devices/', function (req, res) {
    //let datosFiltrados = datos.filter(item => item.id == req.params.id);
    if (req.body.name != undefined && req.body.description != undefined && req.body.type != undefined) {
        utils.query(`INSERT INTO smart_home.Devices(name,description,type) VALUES ('${req.body.name}','${req.body.description}',${req.body.type})`, function (err, rta, field) { //insert            if (err) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            //res.send(rta);
            let index = rta.insertId;
            utils.query(`SELECT * FROM smart_home.Devices WHERE id=${index} LIMIT 0,1`, function (err, rta, field) { //get one device
                // let result=JSON.parse(field);
                res.send(rta[0]);
            });

        });
    }
    else {
        res.status(400).json({ "Error": "Formato incorrecto" });
    }

});
/**
 * Listar todos los dispositivos
 */
app.get('/devices/', function (req, res, next) {
    let id = 11;
    let name = "Lámpara 2999";
    let type = 1;
    let description = "nueva lamp";
    utils.query(`SELECT * FROM smart_home.Devices`, function (err, rta, field) { 
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