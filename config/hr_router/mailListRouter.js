module.exports = function() {};




function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/mail_list', /*isAuthenticated,*/ function(req, res) {
        database.mail_server.query('SELECT * FROM virtual_users WHERE domain_id = 5 AND id NOT IN (3, 6)').complete(function(err, data) {
            res.setHeader('Content-Type', 'application/json');
            res.send(data);
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('CreateNewMail', function(data) {
        database.mail_server.query(
            "INSERT INTO `mailserver`.`virtual_users` " +
            "(`id`, `domain_id`, `password` , `email` , `pass`) " +
            "VALUES (DEFAULT, 5, ENCRYPT('" + data.password + "', " +
            "CONCAT('$6$', SUBSTRING(SHA(RAND()), -16))), " +
            "'" + data.email + "', '" + data.password + "');"
        ).complete(function(err, data) {
            if (err) {
                socket.emit("CreateNewMail", "error");
            } else {
                socket.emit("CreateNewMail", "success");
            }
        });
    });

    socket.on('DestroyMailUser', function(data) {
        database.mail_server.query(
            "DELETE FROM `virtual_users` WHERE `virtual_users`.`id` = " + data
        ).complete(function(err, data) {
            if (err) {
                socket.emit("DestroyMailUser", "error");
            } else {
                socket.emit("DestroyMailUser", "success");
            }
        });
    });

    socket.on('UpdateEmailPassword', function(data) {
        database.mail_server.query(
            "UPDATE  `mailserver`.`virtual_users` SET `pass` = '" +
            data.pass + "', `password` = ENCRYPT('" + data.pass + "', " +
            "CONCAT('$6$', SUBSTRING(SHA(RAND()), -16))) " +
            "WHERE `virtual_users`.`id` = '" +
            data.id + "';"
        ).then(function() {
            socket.emit("UpdateEmailPassword", "success");
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;