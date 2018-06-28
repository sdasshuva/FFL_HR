module.exports = function() {};


function getBankAccount(db, QUERY, callback) {
    var SEARCH = {};
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee;
    db.bank_account.findAll({
        where: SEARCH,
        attributes: [
            'id', 'bank', 'branch_code', 'account_type',
            'employee', 'account_no', 'is_active'
        ],
        include: [{
            model: db.bank,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            ['employee', 'ASC']
        ]
    }).complete(function(err, d) {
        callback(d);
    })
}

function getBankAccountNo(db, QUERY, callback) {
    var SEARCH = {};
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee
    SEARCH.is_active = 1;
    var o = {};
    o.branch_code = '000';
    o.account_type = '000';
    o.account_no = '0000000';
    o.account = '000-000-0000000';
    db.bank_account.findAll({
        where: SEARCH,
        attributes: [
            'id', 'branch_code', 'account_type',
            'account_no', 'is_active'
        ],
        order: [
            ['employee', 'ASC']
        ],
        limit: 1
    }).complete(function(err, baData) {
        async.each(baData, function(ba, cb_ba) {
            o.branch_code = addLeadingZero(3, ba.branch_code);
            o.account_type = addLeadingZero(3, ba.account_type);
            o.account_no = addLeadingZero(7, ba.account_no);
            o.account = addLeadingZero(3, ba.branch_code) +
                '-' + addLeadingZero(3, ba.account_type) +
                '-' + addLeadingZero(7, ba.account_no);
            cb_ba();
        }, function(err) {
            callback(o);
        })
    })
}

function getBankList(db, QUERY, callback) {
    var SEARCH = {};
    if (QUERY.id)
        SEARCH.id = QUERY.id;
    if (QUERY.name)
        SEARCH.name = QUERY.name;
    db.bank.findAll({
        where: SEARCH,
        attributes: [
            'id', 'name'
        ],
        order: [
            ['id', 'ASC']
        ]
    }).complete(function(err, d) {
        callback(d);
    })
}

function getBankAccountDetails(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee;
    var branch_code = '000';
    var account_type = '000';
    var account_no = '0000000';
    var account = '000-000-0000000';
    db.bank_account.findAll({
        where: SEARCH,
        attributes: [
            'id', 'bank', 'branch_code', 'account_type',
            'employee', 'account_no', 'is_active'
        ],
        include: [{
            model: db.bank,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            ['employee', 'ASC']
        ]
    }).complete(function(err, baData) {
        async.each(baData, function(ba, cb_ba) {
            var o = {};
            o.id = ba.id;
            o.branch_code = addLeadingZero(3, ba.branch_code);
            o.account_type = addLeadingZero(3, ba.account_type);
            o.account_no = addLeadingZero(7, ba.account_no);
            o.account = addLeadingZero(3, ba.branch_code) +
                '-' + addLeadingZero(3, ba.account_type) +
                '-' + addLeadingZero(7, ba.account_no);
            o.bank = ba.bank;
            o.bankName = ba.bankTable.name;
            o.bankTable = ba.bankTable;
            o.is_active = ba.is_active;
            returnData.push(o);
            cb_ba();
        }, function(err) {
            callback(returnData);
        })
    })
}

function getEMPBankAccountList(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee;
    db.bank_account.findAll({
        where: SEARCH,
        attributes: [
            'id', 'bank', 'branch_code', 'account_type',
            'employee', 'account_no', 'is_active'
        ],
        include: [{
            model: db.bank,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            ['employee', 'ASC']
        ],
    }).complete(function(err, baData) {
        async.each(baData, function(ba, cb_ba) {
            var o = {};
            o.id = ba.id;
            o.employee = ba.employee;
            o.branch_code = addLeadingZero(3, ba.branch_code);
            o.account_type = addLeadingZero(3, ba.account_type);
            o.account_no = addLeadingZero(7, ba.account_no);
            o.account = addLeadingZero(3, ba.branch_code) +
                '-' + addLeadingZero(3, ba.account_type) +
                '-' + addLeadingZero(7, ba.account_no);
            o.bank = ba.bank;
            o.bankName = ba.bankTable.name;
            o.bankTable = ba.bankTable;
            o.is_active = ba.is_active;
            returnData.push(o);
            cb_ba();
        }, function(err) {
            callback(returnData);
        })
    })
}

function ActivateEMPBankAccount(db, DATA, callback) {
    var returnData = [];
    var SEARCH = {};
    SEARCH.employee = DATA.employee;
    db.bank_account.findAll({
        where: SEARCH,
        attributes: [
            'id', 'bank', 'branch_code', 'account_type',
            'employee', 'account_no', 'is_active'
        ],
    }).complete(function(err, baData) {
        async.each(baData, function(ba, cb_ba) {
            var o = {};
            if (DATA.bank == ba.bank) {
                db.bank_account.update({
                    is_active: 1
                }, {
                    id: ba.id
                }).complete(function(err, employee) {
                    cb_ba();
                });
            } else {
                db.bank_account.update({
                    is_active: 0
                }, {
                    id: ba.id
                }).complete(function(err, employee) {
                    cb_ba();
                });
            }
        }, function(err) {
            if (err)
                callback("error");
            else
                callback("success");
        })
    });
}

function CreateUpdateEMPBankAccount(db, DATA, EMP, callback) {
    db.bank_account.create({
        employee: EMP.id,
        bank: DATA.bank,
        branch_code: DATA.branch_code,
        account_type: DATA.account_type,
        account_no: DATA.account_no,
        is_active: DATA.is_active
    }).complete(function(err, r) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}

function CreateBankAccount(db, DATA, callback) {
    db.bank_account.create({
        bank: DATA.bank,
        employee: DATA.employee,
        branch_code: DATA.branch_code,
        account_type: DATA.account_type,
        account_no: DATA.account_no,
        is_active: DATA.is_active,
    }).complete(function(err, bank_account) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            db.employee.update({
                payment_method: 2
            }, {
                id: DATA.employee
            }).complete(function(err, employee) {
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
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/getBankAccount', function(req, res) {
        QUERY = {};
        QUERY.employee = 89;
        getBankAccount(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getBankAccountNo', function(req, res) {
        QUERY = {};
        QUERY.employee = 89;
        getBankAccountNo(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getBankList', /*isAuthenticated,*/ function(req, res) {
        getBankList(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getEMPBankAccountList/:EID', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.employee = req.params.EID;
        getEMPBankAccountList(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getBankAccountDetails', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.employee = 140817307;
        getBankAccountDetails(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('ActivateEMPBankAccount', function(data) {
        ActivateEMPBankAccount(db, data, function(data) {
            socket.emit("ActivateEMPBankAccount", data)
        });
    });

    socket.on('CreateUpdateEMPBankAccount', function(data, emp) {
        CreateUpdateEMPBankAccount(db, data, emp, function(data1) {
            var UpdateData = {};
            UpdateData.employee = emp.id;
            UpdateData.bank = data.bank;
            ActivateEMPBankAccount(db, UpdateData, function(data2) {
                socket.emit("CreateUpdateEMPBankAccount", data2)
            });
        });
    });

    socket.on('CreateBankAccount', function(data) {
        console.log("STEP CreateBankAccount: " + JSON.stringify(data, null, 4));
        CreateBankAccount(db, data, function(data) {
            socket.emit("CreateBankAccount", data)
        });
    });

    socket.on('DownloadBonusBankStatement', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var i = 3;
        var GaziAhmadHasan = (QUERY.bonus_type == 'BASIC') ? 120000 : 100000;
        var HelalUddinAhmad = (QUERY.bonus_type == 'BASIC') ? 120000 : 100000;
        var MdMizanurRahman = (QUERY.bonus_type == 'BASIC') ? 120000 : 100000;
        var netPayable = GaziAhmadHasan + HelalUddinAhmad + MdMizanurRahman;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            bankStatementReportHead() +
            '<div id="pageBody">' +
            '<table style="width:100%">' +
            '<tr>' +
            '<th>#</th>' +
            '<th>EMPLOYEE NAME</th>' +
            '<th colspan="3">ACCOUNT NUMBER</th>' +
            '<th style="width:12%">AMOUNT IN TAKA</th>' +
            '<th>ACCOUNT NUMBER</th>' +
            '</tr>' +
            '<tr>' +
            '<td align="center">1</td>' +
            '<td>GAZI AHMAD HASAN</td>' +
            '<td align="center">117</td>' +
            '<td align="center">103</td>' +
            '<td align="center">044148</td>' +
            '<td align="right">' + GaziAhmadHasan.formatMoney(2, '.', ',') + '</td>' +
            '<td align="center">117-103-044148</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="center">2</td>' +
            '<td>HELAL UDDIN AHMAD</td>' +
            '<td align="center">117</td>' +
            '<td align="center">103</td>' +
            '<td align="center">044136</td>' +
            '<td align="right">' + HelalUddinAhmad.formatMoney(2, '.', ',') + '</td>' +
            '<td align="center">117-103-044136</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="center">3</td>' +
            '<td>MD. MIZANUR RAHMAN</td>' +
            '<td align="center">117</td>' +
            '<td align="center">103</td>' +
            '<td align="center">044150</td>' +
            '<td align="right">' + MdMizanurRahman.formatMoney(2, '.', ',') + '</td>' +
            '<td align="center">117-103-044150</td>' +
            '</tr>';
        getC.getDepartment(db, QUERY, function(depList) {
            async.each(depList, function(dep, cb_dep) {
                var empSearch = {};
                empSearch.department = dep.id;
                empSearch.date = d;
                getC.getEmployeeDetails(db, empSearch, function(empData) {
                    async.each(empData, function(emp, cb_emp) {
                        var empDOJ = new Date(emp.date_of_join);
                        var tmpSD = new Date(QUERY.date);
                        tmpSD.setDate(1);
                        tmpSD.setMonth(tmpSD.getMonth() + 1);
                        tmpSD.setFullYear(tmpSD.getFullYear() - 1);
                        if (empDOJ <= tmpSD && emp.payment_method == 2) {
                            var payAmount = (QUERY.bonus_type == 'BASIC') ? Math.round(emp.basic) : Math.round(emp.salary / 2);
                            netPayable += payAmount;
                            i++;
                            htmlData += '<tr>' +
                                '<td align="center">' + i + '</td>' +
                                '<td>' + emp.name + '</td>' +
                                '<td align="center">' + emp.branch_code + '</td>' +
                                '<td align="center">' + emp.account_type + '</td>' +
                                '<td align="center">' + emp.account_no + '</td>' +
                                '<td align="right">' + payAmount.formatMoney(2, '.', ',') + '</td>' +
                                '<td align="center">' + emp.account + '</td>' +
                                '</tr>';
                        }
                        cb_emp();
                    }, function(err) {
                        cb_dep();
                    });
                });
            }, function(err) {
                htmlData += '<tr>' +
                    '<td colspan="5"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + netPayable.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"></td>' +
                    '</tr>' +
                    '</table></div>' +
                    '</body></html>';
                var pt = new Date();
                var options = {
                    format: 'A4',
                    orientation: "portrait",
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: bonusStatementHeader(d, QUERY.festive_type)
                    },
                    footer: {
                        height: "30mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    if (err) return console.log(err);
                    socket.emit("DownloadBonusBankStatement", 'success');
                });
            });
        });
    });

    socket.on('CreateDailyReportPDF', function(data, file_name) {
            var options = {
                format: 'Letter'
            };
            pdf.create(data, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                socket.emit("CreateDailyReportPDF", 'success');
            });
        });

}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;