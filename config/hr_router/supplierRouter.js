module.exports = function() {};

function supplier_list(db,callback)
{
    db.supplier.findAll({
        order: [
            ['name', 'ASC']
        ]
    }).complete(function(err, data) {
        callback(data);
    })
}

function CreateSupplier(db,DATA, callback)
{
    db.supplier.create({
        name: DATA.name
    }).complete(function (err, supplier) {
        if (err) {
            callback("error");
        }else{
            callback("success")
        }
    })
}

function DestroySupplier(db, DATA, callback)
{
    db.supplier.destroy({ id: [DATA] }).complete(function (err, data) {
        if (err) {
            if(err[0].code == "ER_ROW_IS_REFERENCED_" ){
                callback("referenced");
            }else{
                callback("error");
            }
        }else{
            callback("success")
        }
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/supplier', function(req, res){
        supplier_list(db,function(d){
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR
    
    socket.on('CreateSupplier',function(data){
            CreateSupplier(db,data,function(data){
                socket.emit("CreateSupplier",data)
            });
        });

    socket.on('DestroySupplier',function(data){
            DestroySupplier(db,data,function(data){
                socket.emit("DestroySupplier",data)
            });
        });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;