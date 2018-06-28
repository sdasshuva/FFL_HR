module.exports = function() {};

function buyer_list(db, callback) {
    db.buyer.findAll({
        include: [{
            model: db.country,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            ['name', 'ASC']
        ]
    }).complete(function(err, data) {
        callback(data);
    })
}

function DestroyBuyer(db, DATA, callback) {
    db.buyer.destroy({
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

function CreateBuyer(db, DATA, callback) {
    db.buyer.create({
        name: DATA.name,
        country: DATA.country
    }).complete(function(err, buyer) {
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

    app.get('/buyer', function(req, res) {
        buyer_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyBuyer', function(data) {
        DestroyBuyer(db, data, function(data) {
            socket.emit("DestroyBuyer", data)
        });
    });

    socket.on('CreateBuyer', function(data) {
        CreateBuyer(db, data, function(data) {
            socket.emit("CreateBuyer", data)
        });
    });


}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;