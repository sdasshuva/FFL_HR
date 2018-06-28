module.exports = function() {};


function deduction_details(db, EID, callback) {
    db.deduction.findAll({
        where: {
            employee: EID
        },
        attributes: [
            'id', 'employee', 'month', 'advance', 'ait', 'others'
        ],
        include: [{
            model: db.employee,
            attributes: ['user'],
            include: [{
                model: db.user,
                attributes: ['first_name']
            }],
        }],
        order: [
            ['month', 'ASC']
        ]
    }).complete(function(err, deductList) {
        callback(deductList);
    })
}

function getDeduction(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    findData.where = [];
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee
    if (QUERY.month) {
        var date = new Date(QUERY.month);
        var SM = date.getMonth() + 1;
        var SY = date.getFullYear();
        findData.where.push(['MONTH(month)=? AND YEAR(month)=?', SM, SY]);
    }
    findData.where.push(SEARCH);
    findData.attributes = [
        'id', 'employee', 'month', 'advance',
        'ait', 'others'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'month';
    var DIR = (QUERY.dir) ? QUERY.dir : 'DESC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.deduction.findAll(findData).complete(function(err, d) {
        callback(d);
    })
}

function getDeductionJson(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    findData.where = [];
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee
    if (QUERY.date) {
        var date = new Date(QUERY.date);
        var SM = date.getMonth() + 1;
        var SY = date.getFullYear();
        findData.where.push(['MONTH(month)=? AND YEAR(month)=?', SM, SY]);
    }
    findData.where.push(SEARCH);
    findData.attributes = [
        'id', 'employee', 'month', 'advance',
        'ait', 'others'
    ];
    var o = {};
    o.advanceDeduct = 0;
    o.othersDeduct = 0;
    o.aitDeduct = 0;
    db.deduction.findAll(findData).complete(function(err, deductData) {
        async.each(deductData, function(deduct, cb_deduct) {
            o.employee = deduct.employee;
            o.advanceDeduct = deduct.advance;
            o.othersDeduct = deduct.others;
            o.aitDeduct = deduct.ait;
            cb_deduct();
        }, function(err) {
            callback(o);
        })
    })
}

function DestroySalaryDeduction(db, DATA, callback) {
    db.deduction.destroy({
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

function CreateSalaryDeduction(db, DATA, callback) {
    db.deduction.create({
        employee: DATA.employee,
        month: DATA.month,
        advance: DATA.advance,
        ait: DATA.ait,
        others: DATA.others,
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

    app.get('/deduction_details/:EID', /*isAuthenticated,*/ function(req, res) {
        var EID = req.params.EID;
        deduction_details(db, EID, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getDeduction', function(req, res) {
        QUERY = {};
        QUERY.employee = 89;
        getDeduction(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getDeductionJson', function(req, res) {
        QUERY = {};
        QUERY.employee = 89;
        getDeductionJson(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroySalaryDeduction', function(data) {
        DestroySalaryDeduction(db, data, function(data) {
            socket.emit("DestroySalaryDeduction", data)
        });
    });

    socket.on('CreateSalaryDeduction', function(data) {
        CreateSalaryDeduction(db, data, function(data) {
            socket.emit("CreateSalaryDeduction", data)
        });
    });

}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;