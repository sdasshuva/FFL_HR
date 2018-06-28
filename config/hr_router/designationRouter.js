module.exports = function() {};

function designation_list(db, callback) {
    db.designation.findAll().complete(function(err, data) {
        callback(data);
    })
}

function CreateDesignation(db, DATA, callback) {
    db.designation.create({
        name: DATA.name,
    }).complete(function(err, employee) {
        if (err) {
            callback("error");
        } else {
            callback("success")
        }
    })
}

function DestroyDesignation(db, DATA, callback) {
    db.designation.destroy({
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

function getDesignation(db, QUERY, callback) {
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
    db.designation.findAll(findData).complete(function(err, d) {
        callback(d);
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/designation', /*isAuthenticated,*/ function(req, res) {
        designation_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getDesignation', function(req, res) {
        QUERY = {};
        getDesignation(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getDesignation', function(req, res) {
        QUERY = {};
        getDesignation(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    

}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('CreateDesignation', function(data) {
        CreateDesignation(db, data, function(data) {
            socket.emit("CreateDesignation", data)
        });
    });

    socket.on('DestroyDesignation', function(data) {
        DestroyDesignation(db, data, function(data) {
            socket.emit("DestroyDesignation", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;