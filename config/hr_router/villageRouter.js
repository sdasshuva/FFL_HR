module.exports = function() {};

function village_list(db, callback) {
    db.village.findAll().complete(function(err, data) {
        callback(data);
    })
}

function DestroyVillage(db, DATA, callback) {
    db.village.destroy({
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

function CreateVillage(db, DATA, callback) {
    db.village.create({
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

    app.get('/village', /*isAuthenticated,*/ function(req, res) {
        village_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyVillage', function(data) {
        DestroyVillage(db, data, function(data) {
            socket.emit("DestroyVillage", data)
        });
    });

    socket.on('CreateVillage', function(data) {
        CreateVillage(db, data, function(data) {
            socket.emit("CreateVillage", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;