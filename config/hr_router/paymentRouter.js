module.exports = function() {};

function getSalaryPayment(db, QUERY, callback) {
    QUERY.date = (QUERY.date) ? new Date(QUERY.date) : new Date();
    QUERY.year = (QUERY.year) ? QUERY.year : QUERY.date.getFullYear();
    QUERY.month = (QUERY.month) ? QUERY.month : QUERY.date.getMonth() + 1;
    QUERY.date.setDate(10);
    var returnData = [];
    var SearchEMP = {};
    SearchEMP.status = (QUERY.status) ? QUERY.status : 1;
    if (QUERY.payment_method)
        SearchEMP.payment_method = QUERY.payment_method;
    getEmployee(db, SearchEMP, function(empData) {
        async.each(empData, function(emp, cb_emp) {
            var o = {};
            o.year = QUERY.year;
            o.month = QUERY.month;
            o.payment_type = 1;
            o.salary_amount = 0;
            o.deduct_amount = 0;
            o.paid_amount = 0;
            o.payment_status = 1;
            o.user = null;
            o.id = emp.id;
            o.name = emp.name;
            o.designation = emp.designation;
            o.designationName = emp.designationName;
            o.department = emp.department;
            o.departmentName = emp.departmentName;
            o.workInTime = emp.workInTime;
            o.workOutTime = emp.workOutTime;
            o.date_of_birth = emp.date_of_birth;
            o.date_of_join = emp.date_of_join;
            o.date_of_release = emp.date_of_release;
            o.payment_method = emp.payment_method;
            o.pay_mode = (o.payment_method == 1) ? 'CASH' : 'BANK';
            o.status = emp.status;
            o.statusName = emp.statusName;
            o.last_punch = emp.last_punch;
            o.branch_code = '000';
            o.account_type = '000';
            o.account_no = '0000000';
            o.account = '000-000-0000000';
            o.bank = 'NO BANK ACCOUNT';
            var findData = {};
            findData.where = {
                employee: emp.id,
                year: QUERY.year,
                month: QUERY.month,
            };
            findData.attributes = [
                    'id', 'employee', 'year', 'month', 'payment_type',
                    'salary_amount', 'deduct_amount', 'paid_amount',
                    'payment_status', 'user', 'created_at', 'updated_at'
                ],
                db.salary_payment.findAll(findData).complete(function(err, mtData) {
                    async.each(mtData, function(mtp, cb_mtp) {
                        o.year = QUERY.year;
                        o.month = QUERY.month;
                        o.payment_type = mtp.payment_type;
                        o.salary_amount = mtp.salary_amount;
                        o.deduct_amount = mtp.deduct_amount;
                        o.paid_amount = mtp.paid_amount;
                        o.payment_status = mtp.payment_status;
                        o.user = mtp.user;
                        // console.log(mtp);
                        cb_mtp();
                    }, function(err) {
                        var SearchAcc = {};
                        SearchAcc.employee = emp.id;
                        getBankAccountDetails(db, SearchAcc, function(baData) {
                            async.each(baData, function(ba, cb_ba) {
                                if (ba.is_active == 1) {
                                    o.branch_code = ba.branch_code;
                                    o.account_type = ba.account_type;
                                    o.account_no = ba.account_no;
                                    o.account = ba.account;
                                    o.bank = ba.bankName;
                                    o.bankID = ba.bank;
                                }
                                cb_ba();
                            }, function(err) {
                                returnData.push(o);
                                cb_emp();
                            });
                        });
                    });
                });
        }, function(err) {
            returnData.sort(function(a, b) {
                if (a.id < b.id)
                    return -1;
                if (a.id > b.id)
                    return 1;
                return 0;
            });
            callback(returnData);
        });
    });
}

function getPaymentType(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    // findData.where = {
    //   name: QUERY.name
    // };
    if (QUERY.name) {
        SEARCH.name = QUERY.name;
        findData.where = SEARCH;
    }
    findData.attributes = [
        'id', 'name', 'percent'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    db.payment_type.findAll(findData).complete(function(err, rData) {
        callback(rData);
    })
}

function DestroyPaymentType(db, DATA, callback) {
    db.payment_type.destroy({
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

function CreatePaymentType(db, DATA, callback) {
    db.payment_type.create({
        name: DATA.name,
        percent: DATA.percent,
    }).complete(function(err, rdata) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}

function getEmployeeMonthSummary(db, QUERY, callback) {
    var returnData = [];
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    var dayArray = dayArrayFunc(d.monthDays());
    getEmployeeMonthAttendance(db, QUERY, function(empData) {
        async.each(empData, function(emp, cb_emp) {
            var o = {};
            o.id = emp.id;
            o.fp = addLeadingZero(9, emp.id);
            o.name = emp.name;
            o.departmentID = emp.department;
            o.department = emp.departmentName;
            o.designationID = emp.designation;
            o.designation = emp.designationName;
            o.date_of_join = emp.date_of_join.formatDate();
            o.date_of_birth = emp.date_of_birth.formatDate();
            o.payment_method = emp.payment_method;
            o.status = emp.statusName;
            o.salary = emp.salary;
            o.basic = emp.salary / 100 * 60;
            o.house_rent = emp.salary / 100 * 30;
            o.medical = emp.salary / 100 * 5;
            o.conveyance = emp.salary / 100 * 5;
            o.advanceDeduct = (emp.salary > 0) ? emp.advanceDeduct : 0;
            o.othersDeduct = (emp.salary > 0) ?
                (
                    (emp.payment_method == 1) ?
                    10 + emp.othersDeduct :
                    emp.othersDeduct
                ) :
                0;
            o.aitDeduct = (emp.salary > 0) ? emp.aitDeduct : 0;
            o.absentDeduct = 0;
            o.totalDeduct = 0;
            o.netPayable = 0;
            o.branch_code = emp.branch_code;
            o.account_type = emp.account_type;
            o.account_no = emp.account_no;
            o.account = emp.account;
            o.present = 0;
            o.absent = 0;
            o.late = 0;
            o.leave = 0;
            o.outLeave = 0;
            o.compensation = 0;
            o.directWorkPlace = 0;
            o.absentForLate = 0;
            o.holiday = 0;
            o.weekend = 0;
            o.inLate = 0;
            o.absentForInLate = 0;
            o.outLate = 0;
            o.absentForOutLate = 0;
            o.totalDays = 0;
            o.totalPayableDays = 0;
            o.totalDeductDays = 0;
            o.attendance = {};
            var workInTime = emp.workInTime.split(":");
            var workOutTime = emp.workOutTime.split(":");
            var inH = parseInt(workInTime[0]);
            var inM = parseInt(workInTime[1]);
            var outH = parseInt(workOutTime[0]) - 12;
            var outM = parseInt(workOutTime[1]);
            async.each(dayArray, function(day, cb_day) {
                d.setDate(day);
                var Y = d.getFullYear();
                var M = d.getMonth() + 1;
                var D = d.getDate();
                var YMD = Y + '-' + M + '-' + D;
                inM = (ramadan2017.indexOf(YMD) != -1) ? 0 : parseInt(workInTime[1]);
                outH = (ramadan2017.indexOf(YMD) != -1) ? parseInt(workOutTime[0]) - 1 : parseInt(workOutTime[0]);
                outM = (ramadan2017.indexOf(YMD) != -1) ? 0 : parseInt(workOutTime[1]);

                var InStatus = (emp.attendance[YMD].officeIn.flag) ?
                    (
                        (emp.attendance[YMD].officeIn.h <= inH) ?
                        (
                            (emp.attendance[YMD].officeIn.h == inH && emp.attendance[YMD].officeIn.m > inM) ?
                            'L' :
                            'P'
                        ) :
                        'L'
                    ) :
                    'A';
                var OutStatus = (emp.attendance[YMD].officeOut.flag) ?
                    (
                        (emp.attendance[YMD].officeOut.h >= outH) ?
                        (
                            (emp.attendance[YMD].officeOut.h == outH && emp.attendance[YMD].officeOut.m < outM) ?
                            'L' :
                            'P'
                        ) :
                        'L'
                    ) :
                    'A';
                // var OutStatus = (emp.attendance[YMD].officeOut.flag)?((emp.attendance[YMD].officeOut.h>=outH)?'P':'L'):'A';
                var empStatus = (InStatus == 'P' && OutStatus == 'P') ?
                    'P' :
                    ((
                            (InStatus == 'P' && (OutStatus == 'L' || OutStatus == 'A')) ||
                            ((InStatus == 'L' || InStatus == 'A') && OutStatus == 'P') ||
                            (InStatus == 'L' && OutStatus == 'A') ||
                            (InStatus == 'A' && OutStatus == 'L') ||
                            (InStatus == 'L' && OutStatus == 'L')
                        ) ?
                        'L' :
                        'A');

                /////////// Temporary Space For OCT 2017 Only /////////
                var tmpOCT2017 = ['2017-10-26', '2017-10-27', '2017-10-28', '2017-10-29', '2017-10-30', '2017-10-31'];
                if (tmpOCT2017.indexOf(YMD) != -1) {
                    emp.attendance[YMD].holiday = true;
                    emp.attendance[YMD].payable = true;
                    empStatus = 'H';
                }
                /////////// Temporary Space For OCT 2017 Only /////////

                empStatus = (emp.attendance[YMD].leave) ? emp.attendance[YMD].leaveName : empStatus;
                if (emp.attendance[YMD].leave) {
                    empStatus = emp.attendance[YMD].leaveName;
                    if (emp.attendance[YMD].leaveName == 'OL')
                        o.outLeave++;
                    else if (emp.attendance[YMD].leaveName == 'C')
                        o.compensation++;
                    else if (emp.attendance[YMD].leaveName == 'DWP')
                        o.directWorkPlace++;
                    else
                        o.leave++;
                } else if (!emp.attendance[YMD].adjust) {
                    if (emp.attendance[YMD].holiday) {
                        if (emp.attendance[YMD].payable) {
                            empStatus = 'H';
                            o.holiday++;
                        } else {
                            empStatus = 'A';
                            o.absent++;
                        }
                    } else {
                        if (emp.attendance[YMD].weekend) {
                            if (emp.attendance[YMD].payable) {
                                empStatus = 'W';
                                o.weekend++;
                            } else {
                                empStatus = 'A';
                                o.absent++;
                            }
                        } else {
                            if (empStatus == 'A') {
                                empStatus = 'A';
                                o.absent++;
                            }
                        }
                    }
                } else {
                    if (empStatus == 'A') {
                        empStatus = 'A';
                        o.absent++;
                    }
                }
                if (empStatus == 'P') {
                    o.present++;
                } else if (empStatus == 'L') {
                    if (InStatus == 'L' || InStatus == 'A') {
                        o.inLate++;
                    }
                    if (OutStatus == 'L' || OutStatus == 'A') {
                        o.outLate++;
                    }
                    o.late++;
                }
                o.attendance[YMD] = empStatus;
                cb_day();
            }, function(err) {
                var tmpSD = (QUERY.date) ? new Date(QUERY.date) : new Date();
                var tmpSD2 = (QUERY.date) ? new Date(QUERY.date) : new Date();
                var tmpSD2Y = tmpSD2.getFullYear();
                var tmpSD2M = tmpSD2.getMonth();
                tmpSD.setMonth(tmpSD.getMonth() + 1);
                tmpSD.setDate(1);
                var tmpDOJ = (emp.date_of_join) ? new Date(emp.date_of_join) : new Date();
                var tmpDOJY = tmpDOJ.getFullYear();
                var tmpDOJM = tmpDOJ.getMonth();
                var tmpDOJD = tmpDOJ.getDate();

                o.absentForInLate = parseInt(o.inLate / 3);
                o.absentForOutLate = parseInt(o.outLate / 3);
                o.absentForLate = parseInt(o.inLate / 3) + parseInt(o.outLate / 3);
                o.totalDays = o.absent + o.present + o.late + o.leave + o.outLeave + o.compensation + o.directWorkPlace + o.holiday + o.weekend;
                o.totalDeductDays = o.absent + o.absentForLate + o.compensation;
                o.totalPayableDays = o.totalDays - o.totalDeductDays;
                o.absentDeduct = Math.round(o.salary / o.totalDays * o.totalDeductDays);

                /////////// Temporary Space For OCT 2017 Only /////////
                var OCT2017Deduct = Math.round(o.salary / o.totalDays * 6);
                o.absentDeduct = o.absentDeduct + OCT2017Deduct;
                o.totalDeductDays = o.totalDeductDays + 6;
                o.totalPayableDays = o.totalPayableDays - 6;
                /////////// Temporary Space For OCT 2017 Only /////////

                o.totalDeduct = o.absentDeduct + o.advanceDeduct + o.othersDeduct + o.aitDeduct;
                o.netPayable = o.salary - o.totalDeduct;
                if (tmpSD > tmpDOJ) {
                    if (parseInt(o.netPayable) > 0) {
                        returnData.push(o);
                    }
                }
                cb_emp();
            });
        }, function(err) {
            returnData.sort(function(a, b) {
                if (a.designationID < b.designationID)
                    return -1;
                if (a.designationID > b.designationID)
                    return 1;
                return 0;
            });
            callback(returnData);
        });
    });
}


function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/getSalaryPayment', /*isAuthenticated,*/ function(req, res) {
        getSalaryPayment(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getPaymentType', /*isAuthenticated,*/ function(req, res) {
        getPaymentType(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroyPaymentType', function(data) {
        DestroyPaymentType(db, data, function(data) {
            socket.emit("DestroyPaymentType", data)
        });
    });

    socket.on('CreatePaymentType', function(data) {
        CreatePaymentType(db, data, function(data) {
            socket.emit("CreatePaymentType", data)
        });
    });

    socket.on('CreateUpdateSalaryPayment', function(QUERY) {
        var InputData = [];
        var SEARCH = {};
        SEARCH.status = QUERY.status;
        SEARCH.date = QUERY.date;
        getEmployeeMonthSummary(db, SEARCH, function(monthData) {
            async.each(monthData, function(md, cb_md) {
                var o = {};
                o.employee = md.id;
                o.year = QUERY.year;
                o.month = QUERY.month;
                o.payment_type = QUERY.payment_type;
                o.salary_amount = md.salary;
                o.deduct_amount = md.totalDeduct;
                o.paid_amount = md.netPayable;
                o.payment_status = 1;
                o.user = QUERY.user.id;
                InputData.push(o);
                cb_md();
            }, function(err) {
                input.CreateUpdateSalaryPayment(db, InputData, function(data) {
                    socket.emit("CreateUpdateSalaryPayment", data)
                });
            });
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;