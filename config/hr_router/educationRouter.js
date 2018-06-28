module.exports = function() {};

function education_list(db, callback) {
    db.education.findAll({
        include: [{
            model: db.employee,
            attributes: ['name']
        }],
        order: [
            ['id', 'DESC']
        ]
    }).complete(function(err, data) {
        callback(data);
    })
}

function employee_education_list(db, EID, callback) {
    db.education.findAll({
        include: [{
            model: db.employee,
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

function DestroyEmployeeEducation(db, DATA, callback) {
    db.education.destroy({
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

function DestroyEducation(db, DATA, callback) {
    db.education.destroy({
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

function CreateEducation(db, DATA, callback) {
    db.education.create({
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

    app.get('/education', /*isAuthenticated,*/ function(req, res) {
        education_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/education/:EID', /*isAuthenticated,*/ function(req, res) {
        var EID = req.params.EID;
        employee_education_list(db, EID, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyEducation', function(data) {
        DestroyEducation(db, data, function(data) {
            socket.emit("DestroyEducation", data)
        });
    });

    socket.on('DestroyEmployeeEducation', function(data) {
        DestroyEmployeeEducation(db, data, function(data) {
            socket.emit("DestroyEmployeeEducation", data)
        });
    });

    socket.on('CreateEducation', function(data) {
        CreateEducation(db, data, function(data) {
            socket.emit("CreateEducation", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;