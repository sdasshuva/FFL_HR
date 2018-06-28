module.exports = function() {};

function department_list(db, callback) {
    db.department.findAll().complete(function(err, data) {
        callback(data);
    })
}

function DestroyDepartment(db, DATA, callback) {
    db.department.destroy({
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

function CreateDepartment(db,DATA, callback)
{
    db.department.create({
        name: DATA.name,
    }).complete(function (err, employee) {
        if (err) {
            callback("error");
            //throw err;
        }else{
            callback("success")
        }
    })
}

function getDepartment(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.name)
        SEARCH.name = QUERY.name
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'name'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'name';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.department.findAll(findData).complete(function(err, depList) {
        depList.sort(function(a, b) {
            var p1 = a.name;
            var p2 = b.name;
            if (p1 < p2) return -1;
            if (p1 > p2) return 1;
            return 0;
        });
        callback(depList);
    })
}

function department_attendance_list(db, DATA, callback) {
    var d = new Date();
    var department = [];
    if (DATA.form_date) {
        d = new Date(DATA.form_date)
    }
    var f = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    var t = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() + 1);
    if (DATA.department) {
        department.push(DATA.department)
        db.attendance.findAll({
            where: {
                punch_time: {
                    between: [f, t]
                },
            },
            group: [
                'employee'
            ],
            include: [{
                model: db.employee,
                attributes: ['id', 'user', 'department'],
                include: [{
                    model: db.user,
                    attributes: [
                        'id', 'first_name', 'last_name'
                    ]
                }, {
                    model: db.department,
                    attributes: [
                        'id', 'name'
                    ]
                }],
                where: {
                    department: department
                },

            }],
            order: [
                ['employee', 'ASC']
            ],
        }).complete(function(err, data) {
            callback(data);
        })
    } else {
        callback([]);
    }
}

function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/department', /*isAuthenticated,*/ function(req, res) {
        department_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getDepartment', function(req, res) {
        QUERY = {};
        getDepartment(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/department_attendance', /*isAuthenticated,*/ function(req, res) {
        department_attendance_list(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyDepartment', function(data) {
        DestroyDepartment(db, data, function(data) {
            socket.emit("DestroyDepartment", data)
        });
    });

    socket.on('CreateDepartment', function(data) {
        CreateDepartment(db, data, function(data) {
            socket.emit("CreateDepartment", data)
        });
    });


}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;