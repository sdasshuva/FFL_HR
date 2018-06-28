module.exports = function() {};


function leave_report(db, EID, DATA, callback) {
    var d = (DATA.year) ? new Date(DATA.year) : new Date();
    var returnData = [];
    db.leave_type.findAll({
        attributes: [
            'id', 'name', 'amount'
        ],
        order: [
            ['id', 'ASC']
        ]
    }).complete(function(err, leave_types) {
        async.each(leave_types, function(leave_type, cb_leave_type) {
            var lt = {};
            lt.id = leave_type.id;
            lt.leave = leave_type.name.toUpperCase();
            lt.allocation = leave_type.amount;
            db.leave.findAll({
                where: [{
                        employee: EID,
                        leave_type: lt.id
                    },
                    ['YEAR(date)=?', d.getFullYear()],
                ],
                attributes: [
                    'id', 'date'
                ],
            }).complete(function(err, leaves) {
                lt.leaves = leaves;
                returnData.push(lt)
                cb_leave_type();
            })
        }, function(err) {
            if (err) {
                throw err;
            }
            returnData.sort(function(a, b) {
                if (a.id < b.id)
                    return -1;
                if (a.id > b.id)
                    return 1;
                return 0;
            });
            callback(returnData);
        });
    })
}

function leave_list(db, callback) {
    db.leave.findAll({
        limit: 30
    }).complete(function(err, data) {
        callback(data);
    })
}

function employee_leave_list(db, EID, callback) {
    var d = new Date();
    var f = d.getUTCFullYear() + '-' + 01 + '-' + 01;
    var t = d.getUTCFullYear() + '-' + 12 + '-' + 31;
    db.leave.findAll({
        include: [{
            model: db.leave_type,
            attributes: ['name', 'amount']
        }, ],
        where: {
            employee: EID,
            date: {
                between: [f, t]
            },
        }
    }).complete(function(err, data) {
        callback(data);
    })
}

function leave_user_list(db, EID, LTID, callback) {
    var d = new Date();
    var f = d.getUTCFullYear() + '-' + 01 + '-' + 01;
    var t = d.getUTCFullYear() + '-' + 12 + '-' + 31;
    db.leave.findAll({
        include: [{
            model: db.leave_type,
            attributes: ['name']
        }, ],
        where: {
            employee: EID,
            leave_type: LTID,
            date: {
                between: [f, t]
            },
        }
    }).complete(function(err, data) {
        callback(data);
    })
}

function DestroyLeaveDate(db, DATA, callback) {
    db.leave.destroy({
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

function CreateEmployeeLeave(db, DATA, callback) {
    var from_date = new Date(DATA.from_date);
    var to_date = new Date(DATA.to_date);
    var bulkArray = [];
    while (from_date <= to_date) {
        var jsData = {};
        jsData.employee = DATA.employee;
        jsData.leave_type = DATA.leave_type;
        jsData.date = new Date(from_date);
        bulkArray.push(jsData)
        from_date.setDate(from_date.getDate() + 1);
    }
    db.leave.bulkCreate(bulkArray).complete(function(err, employee) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    });
}

function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/leave_report/:EID', /*isAuthenticated,*/ function(req, res) {
        var EID = req.params.EID;
        leave_report(db, EID, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/leave', /*isAuthenticated,*/ function(req, res) {
        leave_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/leave/:EID', /*isAuthenticated,*/ function(req, res) {
        var EID = req.params.EID;
        employee_leave_list(db, EID, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/leave/:EID/:LTID', /*isAuthenticated,*/ function(req, res) {
        var EID = req.params.EID;
        var LTID = req.params.LTID;
        leave_user_list(db, EID, LTID, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyLeaveDate', function(data) {
        console.log("STEP DestroyLeaveDate: " + JSON.stringify(data, null, 4));
        DestroyLeaveDate(db, data, function(data) {
            socket.emit("DestroyLeaveDate", data)
        });
    });

    socket.on('CreateEmployeeLeave', function(data) {
        console.log("STEP CreateEmployeeLeave: " + JSON.stringify(data, null, 4));
        CreateEmployeeLeave(db, data, function(data) {
            socket.emit("CreateEmployeeLeave", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;