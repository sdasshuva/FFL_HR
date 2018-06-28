module.exports = function() {};


function user_list(db,callback)
{
    db.user.findAll({
        where: {
            id: { gt: 1 }
        }
    }).complete(function(err, data) {
        callback(data);
    })
}

function CreateCSVUser(db,DATA, callback)
{
	var bulkArray = [];
	for (var i = 0; i <= DATA.length - 1; i++) {
		var inputs = {};
		var t = DATA[i].split("\t");
		if(t[0]){
			inputs.employee = parseInt(t[0]);
			//inputs.rest2 = t[2];
			var td = t[2].split(" ");
			//inputs.rest3 = td[0];
			var tdd = td[0].split("-");
			//inputs.rest4 = tdd;
			var tdt = td[1].split(":");
			//inputs.rest5 = tdt;
			//var date = new Date(t[2]);
			inputs.punch_time = new Date(parseInt(tdd[0]), (parseInt(tdd[1])-1), parseInt(tdd[2]), parseInt(tdt[0])+6, parseInt(tdt[1]), parseInt(tdt[2]), 00);
			//bulkArray.push(inputs);
			db.attendance.create(inputs).complete(function (err, attendance) {
				/*if (err) {
					callback("error");
					//throw err;
				}else{
					//callback("success")
				}*/
			})
		}
		if(i==DATA.length-1){
			callback("success");
		}
	};
}

function UpdateUserAccessLevel(db,DATA, callback)
{
    db.user.update(
        { access_level: DATA.access_level },
        {
            id: DATA.id
        }
    ).complete(function (err, break_down) {
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

function UpdateUserFirstName(db,DATA, callback)
{
    db.user.update(
        { first_name: DATA.first_name },
        {
            id: DATA.id
        }
    ).complete(function (err, break_down) {
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

function UpdateUserLastName(db,DATA, callback)
{
    db.user.update(
        { last_name: DATA.last_name },
        {
            id: DATA.id
        }
    ).complete(function (err, break_down) {
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

function UpdateUserEmail(db,DATA, callback)
{
    db.user.update(
        { email: DATA.email },
        {
            id: DATA.id
        }
    ).complete(function (err, break_down) {
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

function ChangeUserPassword(db,DATA, callback)
{
    db.user.update(
        { password: DATA.password },
        {
            email: DATA.email
        }
    ).complete(function (err, user) {
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

function AssignUserPassword(db,DATA, callback)
{
    db.user.update(
        { password: DATA.password },
        {
            id: DATA.id
        }
    ).complete(function (err, user) {
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

function CreateUser(db,DATA, callback)
{
	db.user.create({
		first_name: DATA.first_name,
		last_name: DATA.last_name,
		card_no: DATA.card_no,
		finger_print_id: DATA.finger_print_id,
		email: DATA.email,
		password: DATA.password,
	}).complete(function (err, user) {
		if (err) {
			callback("error");
		}else{
			db.employee.create({
				id: user.finger_print_id,
				user: user.id,
				department: DATA.department,
				designation: DATA.designation
			}).complete(function (err, employee) {
				if (err) {
					callback("error");
				}else{
					callback("success")
				}
			})
		}
	})
}

function DestroyUser(db, DATA, callback)
{
	db.user.destroy({ id: [DATA] }).complete(function (err, data) {
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

    app.get('/user', /*isAuthenticated,*/ function(req, res) {
        user_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.post('/CreateCSVUser', function(req, res) {
        var rawFile = req.files.user_file.path;
        var password = createHash('ffljcl1234');
        fs.readFile(rawFile, 'utf8', function(err, data) {
            if (err) throw err;
            var d = data.split("\r\n");
            input.CreateCSVUser(db, d, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            });
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('UpdateUserAccessLevel', function(data) {
            UpdateUserAccessLevel(db, data, function(data) {
                socket.emit("UpdateUserAccessLevel", data)
            });
        });

        socket.on('UpdateUserFirstName', function(data) {
            UpdateUserFirstName(db, data, function(data) {
                socket.emit("UpdateUserFirstName", data)
            });
        });

        socket.on('UpdateUserLastName', function(data) {
            UpdateUserLastName(db, data, function(data) {
                socket.emit("UpdateUserLastName", data)
            });
        });

        socket.on('UpdateUserEmail', function(data) {
            UpdateUserEmail(db, data, function(data) {
                socket.emit("UpdateUserEmail", data)
            });
        });

        socket.on('CheckPasswordMatch', function(data) {
            db.user.findAll({
                where: {
                    email: data.email
                },
                limit: 1
            }).complete(function(err, user) {
                if (err) {
                    socket.emit("CheckPasswordMatch", 'error');
                }
                if (!user[0]) {
                    socket.emit("CheckPasswordMatch", 'error');
                }
                // User exists but wrong password, log the error 
                if (!isValidPassword(user[0], data.password)) {
                    socket.emit("CheckPasswordMatch", 'error');
                } else {
                    socket.emit("CheckPasswordMatch", 'success');
                }
            })
        });

        socket.on('ChangeUserPassword', function(data) {
            var values = {};
            values.email = data.email;
            values.password = createHash(data.password);
            ChangeUserPassword(db, values, function(data) {
                socket.emit("ChangeUserPassword", data);
            });
        });

        socket.on('AssignUserPassword', function(data) {
            var values = {};
            values.id = data.id;
            values.password = createHash(data.password);
            AssignUserPassword(db, values, function(data) {
                socket.emit("AssignUserPassword", data);
            });
        });

        socket.on('CreateUser', function(data) {
            data.password = createHash(data.password[0]);
            CreateUser(db, data, function(data) {
                socket.emit("CreateUser", data)
            });
        });

        socket.on('CreateUserMonthlyReportPDF', function(data, file_name) {
            var options = {
                format: 'Letter'
            };
            pdf.create(data, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                socket.emit("CreateUserMonthlyReportPDF", 'success');
            });
        });

        socket.on('DestroyUser', function(data) {
            console.log("STEP DestroyUser: " + JSON.stringify(data, null, 4));
            destroy.DestroyUser(db, data, function(data) {
                socket.emit("DestroyUser", data)
            });
        });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;