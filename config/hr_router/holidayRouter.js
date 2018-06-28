module.exports = function() {};

function holiday_list(db, callback) {
    db.holiday.findAll().complete(function(err, data) {
        callback(data);
    })
}

function DestroyHoliday(db, DATA, callback) {
    db.holiday.destroy({
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

function CreateHoliday(db, DATA, callback) {
    db.holiday.create({
        reason: DATA.reason,
        type: DATA.type,
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

    app.get('/holiday', /*isAuthenticated,*/ function(req, res) {
        holiday_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyHoliday', function(data) {
        DestroyHoliday(db, data, function(data) {
            socket.emit("DestroyHoliday", data)
        });
    });

    socket.on('CreateHoliday', function(data) {
        CreateHoliday(db, data, function(data) {
            socket.emit("CreateHoliday", data)
        });
    });


}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;