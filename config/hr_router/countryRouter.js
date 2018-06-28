module.exports = function() {};

function country_list(db, callback) {
    db.country.findAll({
        order: [
            ['name', 'ASC']
        ]
    }).complete(function(err, data) {
        callback(data);
    })
}

function CreateCountry(db, DATA, callback) {
    db.country.create({
        name: DATA.name
    }).complete(function(err, country) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}

function DestroyCountry(db, DATA, callback) {
    db.country.destroy({
        id: [DATA]
    }).complete(function(err, country) {
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

function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/country', function(req, res) {
        country_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('CreateCountry', function(data) {
        CreateCountry(db, data, function(data) {
            socket.emit("CreateCountry", data)
        });
    });

    socket.on('DestroyCountry', function(data) {
        console.log("STEP DestroyCountry: " + JSON.stringify(data, null, 4));
        DestroyCountry(db, data, function(data) {
            socket.emit("DestroyCountry", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;