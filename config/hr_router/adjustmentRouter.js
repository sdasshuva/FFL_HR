module.exports = function() {};

function adjustment_list(db, callback) {
    db.adjustment.findAll().complete(function(err, data) {
        callback(data);
    })
}

function getAdjustment(db, QUERY, callback) {
    var returnData = [];
    var findData = {};
    var SEARCH = {};
    if (QUERY.date) {
        var f = new Date(QUERY.date);
        f.setDate(20);
        f.setMonth(f.getMonth() - 1);
        var t = new Date(QUERY.date);
        t.setDate(10);
        t.setMonth(t.getMonth() + 1);
        SEARCH.date = {};
        SEARCH.date.between = [f, t];
    }
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'reason', 'date'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'date';
    var DIR = (QUERY.dir) ? QUERY.dir : 'DESC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.adjustment.findAll(findData).complete(function(err, adjData) {
        async.each(adjData, function(adj, cb_adj) {
            var d = (adj.date) ? new Date(adj.date) : new Date();
            var Y = d.getFullYear();
            var M = d.getMonth() + 1;
            var D = d.getDate();
            var YMD = Y + '-' + M + '-' + D;
            var o = {};
            o.id = adj.id;
            o.reason = adj.reason;
            o.date = adj.date;
            o.d = YMD;
            returnData.push(o)
            cb_adj();
        }, function(err) {
            callback(returnData);
        });
    })
}


function DestroyAdjustment(db, DATA, callback) {
    db.adjustment.destroy({
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

function CreateAdjustment(db, DATA, callback) {
    db.adjustment.create({
        reason: DATA.reason,
        date: DATA.date,
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

    app.get('/adjustment', /*isAuthenticated,*/ function(req, res) {
        adjustment_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getAdjustment', function(req, res) {
        QUERY = {};
        QUERY.employee = 89;
        getAdjustment(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyAdjustment', function(data) {
        DestroyAdjustment(db, data, function(data) {
            socket.emit("DestroyAdjustment", data)
        });
    });

    socket.on('CreateAdjustment', function(data) {
        CreateAdjustment(db, data, function(data) {
            socket.emit("CreateAdjustment", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;