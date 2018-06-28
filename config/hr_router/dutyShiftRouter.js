module.exports = function() {};

function duty_shift_list(db,callback)
{
    db.duty_shift.findAll().complete(function(err, data) {
        callback(data);
    })
}

function DestroyDutyShift(db, DATA, callback)
{
	db.duty_shift.destroy({ id: [DATA] }).complete(function (err, data) {
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


function CreateDutyShift(db,DATA, callback)
{
	db.duty_shift.create({
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


function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/duty_shift', /*isAuthenticated,*/ function(req, res){
        duty_shift_list(db,function(d){
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyDutyShift',function(data){
            DestroyDutyShift(db,data,function(data){
                socket.emit("DestroyDutyShift",data)
            });
        });

    socket.on('CreateDutyShift',function(data){
            CreateDutyShift(db,data,function(data){
                socket.emit("CreateDutyShift",data)
            });
        });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;