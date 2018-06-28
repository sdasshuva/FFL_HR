module.exports = function() {};

function experience_list(db, callback) {
    db.experience.findAll({
        include: [{
            model: db.user,
            attributes: [
                'first_name', 'last_name', 'card_no',
                'finger_print_id', 'email'
            ]
        }, {
            model: db.employee,
            attributes: ['name']
        }, {
            model: db.designation,
            attributes: ['name']
        }],
        order: [
            ['id', 'DESC']
        ]
    }).complete(function(err, data) {
        callback(data);
    })
}

function employee_experience_list(db, EID, callback) {
    db.experience.findAll({
        include: [{
            model: db.employee,
            attributes: ['name']
        }, {
            model: db.designation,
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

function DestroyExperience(db, DATA, callback) {
    db.experience.destroy({
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

function DestroyEmployeeExperience(db, DATA, callback) {
    db.experience.destroy({
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

function CreateExperience(db, DATA, callback) {
    db.experience.create({
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

    app.get('/experience', /*isAuthenticated,*/ function(req, res) {
        experience_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/experience/:EID', /*isAuthenticated,*/ function(req, res) {
        var EID = req.params.EID;
        employee_experience_list(db, EID, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyExperience', function(data) {
        DestroyExperience(db, data, function(data) {
            socket.emit("DestroyExperience", data)
        });
    });

    socket.on('DestroyEmployeeExperience', function(data) {
        DestroyEmployeeExperience(db, data, function(data) {
            socket.emit("DestroyEmployeeExperience", data)
        });
    });

    socket.on('CreateExperience', function(data) {
        CreateExperience(db, data, function(data) {
            socket.emit("CreateExperience", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;