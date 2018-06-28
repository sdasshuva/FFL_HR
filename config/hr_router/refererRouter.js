module.exports = function() {};

function referer_list(db, callback) {
    db.referer.findAll().complete(function(err, data) {
        callback(data);
    })
}

function DestroyReferer(db, DATA, callback) {
    db.referer.destroy({
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

function CreateReferer(db, DATA, callback) {
    db.referer.create({
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

    app.get('/referer', /*isAuthenticated,*/ function(req, res) {
        referer_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyReferer', function(data) {
        DestroyReferer(db, data, function(data) {
            socket.emit("DestroyReferer", data)
        });
    });

    socket.on('CreateReferer', function(data) {
        CreateReferer(db, data, function(data) {
            socket.emit("CreateReferer", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;