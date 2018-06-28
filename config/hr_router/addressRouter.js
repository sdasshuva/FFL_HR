module.exports = function() {};

function address_list(db, callback) {
    db.address.findAll({
        include: [{
            model: db.employee,
            attributes: ['id']
        }, {
            model: db.address_type,
            attributes: ['name']
        }, {
            model: db.village,
            attributes: ['name']
        }, {
            model: db.post_office,
            attributes: ['name']
        }, {
            model: db.police_station,
            attributes: ['name']
        }, {
            model: db.district,
            attributes: ['name']
        }],
        order: [
            ['id', 'DESC']
        ]
    }).complete(function(err, data) {
        callback(data);
    })
}

function employee_address_list(db, EID, callback) {
    db.address.findAll({
        include: [{
            model: db.employee,
            attributes: ['id']
        }, {
            model: db.address_type,
            attributes: ['name']
        }, {
            model: db.village,
            attributes: ['name']
        }, {
            model: db.post_office,
            attributes: ['name']
        }, {
            model: db.police_station,
            attributes: ['name']
        }, {
            model: db.district,
            attributes: ['name']
        }],
        order: [
            ['id', 'DESC']
        ],
        where: {
            employee: EID
        }
    }).complete(function(err, data) {
        callback(data);
    })
}

function DestroyAddress(db, DATA, callback) {
    db.address.destroy({
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


function CreateAddress(db, DATA, callback) {
    db.address.create({
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

    app.get('/address', /*isAuthenticated,*/ function(req, res) {
        address_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/address/:EID', /*isAuthenticated,*/ function(req, res) {
        var EID = req.params.EID;
        employee_address_list(db, EID, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyAddress', function(data) {
        DestroyAddress(db, data, function(data) {
            socket.emit("DestroyAddress", data)
        });
    });

    socket.on('CreateAddress', function(data) {
        CreateAddress(db, data, function(data) {
            socket.emit("CreateAddress", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;