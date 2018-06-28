module.exports = function() {};

function police_station_list(db, callback) {
    db.police_station.findAll().complete(function(err, data) {
        callback(data);
    })
}

function DestroyPoliceStation(db, DATA, callback) {
    db.police_station.destroy({
        id: [DATA]
    }).complete(function(err, data) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function CreatePoliceStation(db, DATA, callback) {
    db.police_station.create({
        name: DATA.name,
    }).complete(function(err, employee) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/police_station', /*isAuthenticated,*/ function(req, res) {
        police_station_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyPoliceStation', function(data) {
        DestroyPoliceStation(db, data, function(data) {
            socket.emit("DestroyPoliceStation", data)
        });
    });

    socket.on('CreatePoliceStation', function(data) {
        CreatePoliceStation(db, data, function(data) {
            socket.emit("CreatePoliceStation", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;