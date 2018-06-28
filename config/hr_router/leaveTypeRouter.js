module.exports = function() {};

function leave_type_list(db, callback) {
    db.leave_type.findAll().complete(function(err, data) {
        callback(data);
    })
}

function DestroyLeaveType(db, DATA, callback) {
    db.leave_type.destroy({
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

function CreateLeaveType(db, DATA, callback) {
    db.leave_type.create({
        name: DATA.name,
        amount: DATA.amount
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

    app.get('/leave_type', /*isAuthenticated,*/ function(req, res) {
        leave_type_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyLeaveType', function(data) {
        DestroyLeaveType(db, data, function(data) {
            socket.emit("DestroyLeaveType", data)
        });
    });

    socket.on('CreateLeaveType', function(data) {
        CreateLeaveType(db, data, function(data) {
            socket.emit("CreateLeaveType", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;