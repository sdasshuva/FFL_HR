module.exports = function() {};

function district_list(db, callback) {
    db.district.findAll().complete(function(err, data) {
        callback(data);
    })
}

function DestroyDistrict(db, DATA, callback) {
    db.district.destroy({
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

function CreateDistrict(db, DATA, callback) {
    db.district.create({
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

    app.get('/district', /*isAuthenticated,*/ function(req, res) {
        district_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyDistrict', function(data) {
        DestroyDistrict(db, data, function(data) {
            socket.emit("DestroyDistrict", data)
        });
    });

    socket.on('CreateDistrict', function(data) {
        CreateDistrict(db, data, function(data) {
            socket.emit("CreateDistrict", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;