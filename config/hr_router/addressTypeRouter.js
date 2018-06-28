module.exports = function() {};

function address_type_list(db, callback) {
    db.address_type.findAll().complete(function(err, data) {
        callback(data);
    })
}

function CreateAddressType(db, DATA, callback) {
    db.address_type.create({
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

function DestroyAddressType(db, DATA, callback) {
    db.address_type.destroy({
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

function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/address_type', /*isAuthenticated,*/ function(req, res) {
        address_type_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyAddressType', function(data) {
        DestroyAddressType(db, data, function(data) {
            socket.emit("DestroyAddressType", data)
        });
    });

    socket.on('CreateAddressType', function(data) {
        CreateAddressType(db, data, function(data) {
            socket.emit("CreateAddressType", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;