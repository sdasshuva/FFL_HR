module.exports = function() {};

function post_office_list(db,callback)
{
    db.post_office.findAll().complete(function(err, data) {
        callback(data);
    })
}

function DestroyPostOffice(db, DATA, callback)
{
	db.post_office.destroy({ id: [DATA] }).complete(function (err, data) {
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

function CreatePostOffice(db,DATA, callback)
{
	db.post_office.create({
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

    app.get('/post_office', /*isAuthenticated,*/ function(req, res) {
        post_office_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyPostOffice', function(data) {
        DestroyPostOffice(db, data, function(data) {
            socket.emit("DestroyPostOffice", data)
        });
    });

    socket.on('CreatePostOffice', function(data) {
        CreatePostOffice(db, data, function(data) {
            socket.emit("CreatePostOffice", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;