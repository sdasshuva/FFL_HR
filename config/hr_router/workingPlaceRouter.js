module.exports = function() {};

function working_place_list(db, callback) {
    db.working_place.findAll().complete(function(err, data) {
        callback(data);
    })
}

function DestroyWorkingPlace(db, DATA, callback) {
    db.working_place.destroy({
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

function CreateWorkingPlace(db, DATA, callback) {
    db.working_place.create({
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

    app.get('/working_place', /*isAuthenticated,*/ function(req, res) {
        working_place_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyWorkingPlace', function(data) {
        DestroyWorkingPlace(db, data, function(data) {
            socket.emit("DestroyWorkingPlace", data)
        });
    });

    socket.on('CreateWorkingPlace', function(data) {
        CreateWorkingPlace(db, data, function(data) {
            socket.emit("CreateWorkingPlace", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;