module.exports = function() {};

function employee_type_list(db, callback) {
    db.employee_type.findAll().complete(function(err, data) {
        callback(data);
    })
}

function DestroyEmployeeType(db, DATA, callback) {
    db.employee_type.destroy({
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

function UpdateEmployeeType(db, DATA, callback) {
    db.employee.update({
        working_place: DATA.working_place
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
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

function CreateEmployeeType(db, DATA, callback) {
    db.employee_type.create({
        name: DATA.name,
    }).complete(function(err, employee) {
        if (err) {
            callback("error");
        } else {
            callback("success")
        }
    })
}


function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/employee_type', /*isAuthenticated,*/ function(req, res) {
        employee_type_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyEmployeeType', function(data) {
        DestroyEmployeeType(db, data, function(data) {
            socket.emit("DestroyEmployeeType", data)
        });
    });

    socket.on('UpdateEmployeeType', function(data) {
        UpdateEmployeeType(db, data, function(data) {
            socket.emit("UpdateEmployeeType", data)
        });
    });

    socket.on('CreateEmployeeType', function(data) {
        CreateEmployeeType(db, data, function(data) {
            socket.emit("CreateEmployeeType", data)
        });
    });


}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;