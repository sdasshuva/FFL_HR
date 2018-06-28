module.exports = function() {};

function emp_month_attendance(db, SD, EID, callback) {
    var d = (SD) ? new Date(SD) : new Date();
    var e = (EID) ? EID.id : 1;
    /*d.setDate(1);
    var e = (EID)?EID.id:1;
    var f = new Date(d);
    d.setMonth(d.getMonth()+1);
    var t = new Date(d);*/
    var SM = d.getMonth() + 1;
    var SY = d.getFullYear();

    var returnData = [];
    var holiday = [];
    var adjustment = [];
    var dateList = dateListFromMonth(d);
    var empJson = {};
    empJson.name = 'NOT GIVEN';
    empJson.card_no = '';
    empJson.email = '';
    empJson.fp_id = '';
    empJson.access_level = '';
    empJson.date_of_join = '';
    empJson.department = '';
    empJson.designation = '';
    empJson.absent = 0;
    empJson.present = 0;
    empJson.late = 0;
    empJson.holiday = 0;
    empJson.weekend = 0;
    empJson.inLate = 0;
    empJson.outLate = 0;
    empJson.attendance = [];
    empJson.dateJson = {};

    ///////////////////////////// Holiday Start /////////////////////////////////
    db.holiday.findAll({
        attributes: ['id', 'date'],
        where: ['MONTH(date)=? AND YEAR(date)=?', SM, SY],
    }).complete(function(err, hData) {
        async.each(hData, function(holid, cb_holid) {
            if (holid.date) {
                holiday.push(holid.date.getDate());
            }
            cb_holid();
        }, function(err) {
            ///////////////////////////// Adjustment Start /////////////////////////////////
            db.adjustment.findAll({
                attributes: ['id', 'date'],
                where: ['MONTH(date)=? AND YEAR(date)=?', SM, SY],
            }).complete(function(err, aData) {
                async.each(aData, function(adj, cb_adj) {
                    if (adj.date) {
                        adjustment.push(adj.date.getDate());
                    }
                    cb_adj();
                }, function(err) {
                    async.each(dateList, function(dLDT, cb_dLDT) {
                        var tmpdLDT1 = dLDT + '-' + mthNames[d.getMonth()] + '-' + d.getFullYear();
                        var tmpdLDT2 = new Date(tmpdLDT1);
                        empJson.dateJson[tmpdLDT1] = {};
                        empJson.dateJson[tmpdLDT1].punches = [];
                        empJson.dateJson[tmpdLDT1].attendance = (holiday.indexOf(dLDT) != -1) ?
                            'H' :
                            ((tmpdLDT2.getDay() == 5) ?
                                'W' :
                                'A'
                            );
                        if (adjustment.indexOf(dLDT) != -1) {
                            empJson.dateJson[tmpdLDT1].attendance = 'A';
                        }
                        empJson.dateJson[tmpdLDT1].in = {};
                        empJson.dateJson[tmpdLDT1].in.A = 'A';
                        empJson.dateJson[tmpdLDT1].in.T = [];
                        empJson.dateJson[tmpdLDT1].in.H = 24;
                        empJson.dateJson[tmpdLDT1].in.M = 59;
                        empJson.dateJson[tmpdLDT1].in.S = 59;
                        empJson.dateJson[tmpdLDT1].out = {};
                        empJson.dateJson[tmpdLDT1].out.A = 'A';
                        empJson.dateJson[tmpdLDT1].out.T = [];
                        empJson.dateJson[tmpdLDT1].out.H = 24;
                        empJson.dateJson[tmpdLDT1].out.M = 59;
                        empJson.dateJson[tmpdLDT1].out.S = 59;

                        cb_dLDT();
                    }, function(err) {
                        db.attendance.findAll({
                            attributes: ['id', 'punch_time'],
                            where: ['MONTH(punch_time)=? AND YEAR(punch_time)=? AND employee=?', SM, SY, e],
                            include: [{
                                model: db.employee,
                                attributes: ['id', 'user', 'date_of_join', 'department', 'designation'],
                                include: [{
                                    model: db.user,
                                    attributes: [
                                        'id', 'first_name', 'last_name',
                                        'card_no', 'finger_print_id', 'email',
                                        'access_level', 'created_at'
                                    ]
                                }, {
                                    model: db.department,
                                    attributes: [
                                        'id', 'name'
                                    ]
                                }, {
                                    model: db.designation,
                                    attributes: [
                                        'id', 'name'
                                    ]
                                }],
                            }],
                            order: [
                                ['employee', 'ASC']
                            ],
                        }).complete(function(err, attData) {
                            async.each(attData, function(att, cb_att) {
                                empJson.name = (att.employeeTable) ?
                                    ((att.employeeTable.userTable) ?
                                        ((att.employeeTable.userTable.first_name) ?
                                            ((att.employeeTable.userTable.last_name) ?
                                                att.employeeTable.userTable.first_name.toUpperCase() + ' ' + att.employeeTable.userTable.last_name.toUpperCase() :
                                                att.employeeTable.userTable.first_name.toUpperCase()) :
                                            'NOT GIVEN') :
                                        'NOT GIVEN') :
                                    'NOT GIVEN';
                                empJson.card_no = (att.employeeTable) ?
                                    ((att.employeeTable.userTable) ?
                                        ((att.employeeTable.userTable.card_no) ?
                                            att.employeeTable.userTable.card_no :
                                            '') :
                                        '') :
                                    '';
                                empJson.email = (att.employeeTable) ?
                                    ((att.employeeTable.userTable) ?
                                        ((att.employeeTable.userTable.email) ?
                                            att.employeeTable.userTable.email :
                                            '') :
                                        '') :
                                    '';
                                empJson.fp_id = (att.employeeTable) ?
                                    ((att.employeeTable.userTable) ?
                                        ((att.employeeTable.userTable.finger_print_id) ?
                                            att.employeeTable.userTable.finger_print_id :
                                            '') :
                                        '') :
                                    '';
                                empJson.access_level = (att.employeeTable) ?
                                    ((att.employeeTable.userTable) ?
                                        ((att.employeeTable.userTable.access_level) ?
                                            att.employeeTable.userTable.access_level :
                                            '') :
                                        '') :
                                    '';
                                empJson.date_of_join = (att.employeeTable) ?
                                    ((att.employeeTable.date_of_join) ?
                                        att.employeeTable.date_of_join :
                                        '') :
                                    '';
                                empJson.department = (att.employeeTable) ?
                                    ((att.employeeTable.departmentTable) ?
                                        ((att.employeeTable.departmentTable.name) ?
                                            att.employeeTable.departmentTable.name :
                                            '') :
                                        '') :
                                    '';
                                empJson.designation = (att.employeeTable) ?
                                    ((att.employeeTable.designationTable) ?
                                        ((att.employeeTable.designationTable.name) ?
                                            att.employeeTable.designationTable.name :
                                            '') :
                                        '') :
                                    '';
                                var pUD = att.punch_time.getUTCDate();
                                var pUM = att.punch_time.getUTCMonth();
                                var pUY = att.punch_time.getUTCFullYear();
                                var pDT = pUD + '-' + mthNames[pUM] + '-' + pUY;

                                var pUTH = att.punch_time.getUTCHours();
                                var pUTM = att.punch_time.getUTCMinutes();
                                var pUTS = att.punch_time.getUTCSeconds();
                                var pUT = pUTH + ':' + pUTM + ':' + pUTS;
                                if (empJson.dateJson[pDT]) {
                                    var tmpD1 = new Date(pDT);
                                    if (empJson.dateJson[pDT].attendance == 'W' || empJson.dateJson[pDT].attendance == 'H') {} else {
                                        empJson.dateJson[pDT].punches.push(pUT);
                                        if (pUTH < 17) {
                                            empJson.dateJson[pDT].in.T.push(pUT);
                                            if (pUTH <= empJson.dateJson[pDT].in.H) {
                                                empJson.dateJson[pDT].in.A = 'L';
                                                if (pUTH == empJson.dateJson[pDT].in.H && pUTM < empJson.dateJson[pDT].in.M) {
                                                    empJson.dateJson[pDT].in.H = pUTH;
                                                    empJson.dateJson[pDT].in.M = pUTM;
                                                    empJson.dateJson[pDT].in.S = pUTS;
                                                } else {
                                                    empJson.dateJson[pDT].in.H = pUTH;
                                                    empJson.dateJson[pDT].in.M = pUTM;
                                                    empJson.dateJson[pDT].in.S = pUTS;
                                                }
                                            }
                                        } else {
                                            empJson.dateJson[pDT].out.T.push(pUT);
                                            if (pUTH <= empJson.dateJson[pDT].out.H) {
                                                empJson.dateJson[pDT].out.A = 'P';
                                                if (pUTH == empJson.dateJson[pDT].out.H && pUTM < empJson.dateJson[pDT].out.M) {
                                                    empJson.dateJson[pDT].out.H = pUTH;
                                                    empJson.dateJson[pDT].out.M = pUTM;
                                                    empJson.dateJson[pDT].out.S = pUTS;
                                                } else {
                                                    empJson.dateJson[pDT].out.H = pUTH;
                                                    empJson.dateJson[pDT].out.M = pUTM;
                                                    empJson.dateJson[pDT].out.S = pUTS;
                                                }
                                            }
                                        }
                                        if (empJson.dateJson[pDT].in.H <= 9) {
                                            if (empJson.dateJson[pDT].in.H == 9) {
                                                if (empJson.dateJson[pDT].in.M < 30) {
                                                    empJson.dateJson[pDT].in.A = 'P';
                                                }
                                            } else {
                                                empJson.dateJson[pDT].in.A = 'P';
                                            }
                                        }
                                        if (empJson.dateJson[pDT].in.A == 'P' && empJson.dateJson[pDT].out.A == 'P') {
                                            empJson.dateJson[pDT].attendance = 'P'
                                        }
                                        if (empJson.dateJson[pDT].in.A == 'L') {
                                            empJson.dateJson[pDT].attendance = 'L'
                                        }
                                        if (empJson.dateJson[pDT].out.A == 'A' && (empJson.dateJson[pDT].in.A == 'P' || empJson.dateJson[pDT].in.A == 'L')) {
                                            empJson.dateJson[pDT].attendance = 'L'
                                        }
                                    }
                                }
                                cb_att();
                            }, function(err) {
                                for (key in empJson.dateJson) {
                                    var inH = (empJson.dateJson[key].in.H < 24) ? addLeadingZero(2, empJson.dateJson[key].in.H) : '00';
                                    var inM = (empJson.dateJson[key].in.H < 24) ? addLeadingZero(2, empJson.dateJson[key].in.M) : '00';
                                    var inS = (empJson.dateJson[key].in.H < 24) ? addLeadingZero(2, empJson.dateJson[key].in.S) : '00';
                                    var outH = (empJson.dateJson[key].out.H < 24) ? addLeadingZero(2, (empJson.dateJson[key].out.H - 12)) : '00';
                                    var outM = (empJson.dateJson[key].out.H < 24) ? addLeadingZero(2, empJson.dateJson[key].out.M) : '00';
                                    var outS = (empJson.dateJson[key].out.H < 24) ? addLeadingZero(2, empJson.dateJson[key].out.S) : '00';
                                    var t1 = {};
                                    t1.date = key;
                                    t1.status = empJson.dateJson[key].attendance;
                                    t1.inStatus = empJson.dateJson[key].in.A;
                                    t1.outStatus = empJson.dateJson[key].out.A;
                                    t1.in_time = inH + ':' + inM + ':' + inS;
                                    t1.in_time += (parseInt(inH) < 12) ? ' AM' : 'PM';
                                    t1.out_time = outH + ':' + outM + ':' + outS + ' PM';
                                    t1.overTime = (outH > 5) ? outH - 5 : 0;
                                    empJson.overTime += t1.overTime;
                                    switch (t1.status) {
                                        case 'A':
                                            empJson.absent++;
                                            t1.in_time = 'ABSENT';
                                            t1.out_time = 'ABSENT';
                                            break;
                                        case 'H':
                                            empJson.holiday++;
                                            t1.in_time = 'HOLIDAY';
                                            t1.out_time = 'HOLIDAY';
                                            break;
                                        case 'W':
                                            empJson.weekend++;
                                            t1.in_time = 'WEEKEND';
                                            t1.out_time = 'WEEKEND';
                                            break;
                                        case 'P':
                                            empJson.present++;
                                            break;
                                        case 'L':
                                            empJson.late++;
                                            if (t1.inStatus == 'L') {
                                                t1.status = 'IL';
                                                empJson.inLate++;
                                            }
                                            if (t1.outStatus == 'L' || t1.outStatus == 'A') {
                                                t1.status = 'OL';
                                                empJson.outLate++;
                                            }
                                            break;
                                    }
                                    empJson.attendance.push(t1);
                                }
                                callback([empJson]);
                            });
                        });
                    })

                });
            });
            //////////// Adjustment End /////////
        });
    });
    /////////// Holiday End //////////
}

function attendance_list(db, DATA, callback) {
    var d = new Date();
    if (DATA.form_date) {
        d = new Date(DATA.form_date)
    }
    var f = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    d.setDate(d.getDate() + 1);
    var t = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate());
    db.attendance.findAll({
        where: {
            punch_time: {
                between: [f, t]
            },
        },
        group: [
            'employee'
        ],
        include: [{
            model: db.employee,
            attributes: ['id', 'user', 'department'],
            include: [{
                model: db.user,
                attributes: [
                    'id', 'first_name', 'last_name'
                ]
            }, {
                model: db.department,
                attributes: [
                    'id', 'name'
                ]
            }],
            /*where: {
                department: 1
            },*/

        }],
        order: [
            ['employee', 'ASC']
        ],
    }).complete(function(err, data) {
        callback(data);
    })
}

function CreateEmployeeManualPunch(db, DATA, callback) {
    db.attendance.create({
        employee: DATA.employee,
        punch_time: DATA.punch_time,
        type: DATA.type
    }).complete(function(err, employee) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}

function attendance_report(db, DEPARTMENT_ID, DATA, callback) {
    var d = new Date();
    var search_month = new Date(d.getFullYear(), d.getMonth(), 01);
    var search_year = new Date(d.getFullYear(), 00, 01);
    var next_year = new Date(d.getFullYear() + 1, 00, 01);
    var holiday = 0
    var holiday_array = [];
    var adjustment = [];
    if (DATA.month) {
        d = new Date(DATA.month);
        holiday = DATA.holiday;
        search_month = new Date(d.getFullYear(), d.getMonth(), 01);
        search_year = new Date(d.getFullYear(), 00, 01);
        next_year = new Date(d.getFullYear() + 1, 00, 01);
        holiday_array = DATA.holiday_array
        adjustment = DATA.adjustment;
    }
    var dateList = dateListFromMonth(d);
    //var weekend = weekendCount(d);
    var total_days = dateList.length;
    var f = new Date(d);
    d.setMonth(d.getMonth() + 1);
    var t = new Date(d);
    var returnData = [];
    db.employee.findAll({
        where: {
            department: DEPARTMENT_ID,
            status: 0
        },
        include: [{
            model: db.user,
            attributes: [
                'id', 'first_name', 'last_name'
            ]
        }, {
            model: db.department,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            ['id', 'ASC']
        ],
    }).complete(function(err, employee_data) {
        async.each(employee_data, function(employee, cb_employee_data) {
            var emp = {};
            emp.employee = employee;
            emp.attendance = {};
            emp.days = {};
            emp.punch_hour = {};
            emp.punch_min = {};
            emp.punch_sec = {};
            emp.id = employee.id;
            emp.first_name = employee.userTable.first_name;
            emp.last_name = employee.userTable.last_name;
            emp.department = employee.departmentTable.name;
            emp.leave_details = '';
            emp.leave = 0;
            emp.late_leave = 0;
            emp.absent_late_leave = 0;
            var cl = 0;
            var sl = 0;
            var nextdays = 0;
            var absent = 0;
            var present = 0;
            var weekend = 0;
            var late = 0;
            var holidays = 0;
            for (var i = 0; i < dateList.length; i++) {
                emp.attendance[dateList[i]] = 'A';
                emp.punch_hour[dateList[i]] = 24;
                emp.punch_min[dateList[i]] = 60;
                emp.punch_sec[dateList[i]] = 60;
            };
            db.leave.findAll({
                where: {
                    employee: employee.id,
                    date: {
                        gte: search_year,
                        lt: next_year,
                    }
                },
                include: [{
                    model: db.leave_type,
                    attributes: ['id', 'name']
                }, ]
            }).complete(function(err, leaves) {
                if (leaves.length) {
                    for (var i = 0; i < leaves.length; i++) {
                        var leave_date = new Date(leaves[i].date);
                        var ldgy = leave_date.getFullYear();
                        var ldgm = leave_date.getMonth();
                        var smgy = search_month.getFullYear();
                        var smgm = search_month.getMonth();
                        if (ldgy == smgy && ldgm == smgm) {
                            if (leaves[i].leave_type == 4) {
                                emp.late_leave++;
                            } else {
                                emp.leave++;
                            }
                        }
                        if (leaves[i].leave_type == 1) {
                            sl++;
                        } else if (leaves[i].leave_type == 2) {
                            cl++;
                        }
                    };
                }
                emp.leave_details = leaves;
                emp.sick_leave = sl;
                emp.casual_leave = cl;
                db.attendance.findAll({
                    where: {
                        punch_time: {
                            between: [f, t]
                        },
                        employee: employee.id
                    },
                    order: [
                        ['id', 'ASC']
                    ],
                }).complete(function(err, attendance_data) {
                    for (var i = 0; i < attendance_data.length; i++) {
                        emp.attendance[attendance_data[i].punch_time.getUTCDate()] = 'P'
                        if (attendance_data[i].punch_time.getUTCHours() < emp.punch_hour[attendance_data[i].punch_time.getUTCDate()]) {
                            emp.punch_hour[attendance_data[i].punch_time.getUTCDate()] = attendance_data[i].punch_time.getUTCHours();
                            if (attendance_data[i].punch_time.getUTCMinutes() < emp.punch_min[attendance_data[i].punch_time.getUTCDate()]) {
                                emp.punch_min[attendance_data[i].punch_time.getUTCDate()] = attendance_data[i].punch_time.getUTCMinutes();
                                emp.punch_sec[attendance_data[i].punch_time.getUTCDate()] = attendance_data[i].punch_time.getUTCSeconds();
                            }
                        }
                    };
                    for (var i = 0; i < dateList.length; i++) {
                        var tmp_day = new Date(search_month.getFullYear(), search_month.getMonth(), dateList[i]);
                        if (holiday_array.indexOf(parseInt(dateList[i])) != -1) {
                            emp.attendance[dateList[i]] = 'H'
                        }
                        if (tmp_day.getDay() == 5) {
                            if (adjustment.indexOf(parseInt(dateList[i])) != -1) {} else {
                                emp.attendance[dateList[i]] = 'W';
                            }
                        }
                        if (emp.attendance[dateList[i]] == 'W' || emp.attendance[dateList[i]] == 'H') {
                            if (emp.attendance[dateList[i - 1]] == 'A' && emp.attendance[dateList[i + 1]] == 'A') {
                                emp.attendance[dateList[i]] = 'A';
                            }
                        }
                        if (emp.attendance[dateList[i]] == 'P') {
                            if (emp.punch_hour[dateList[i]] < 10) {
                                if (emp.punch_hour[dateList[i]] == 9) {
                                    if (emp.punch_min[dateList[i]] > 29) {
                                        emp.attendance[dateList[i]] = 'L'
                                    }
                                }
                            } else {
                                emp.attendance[dateList[i]] = 'L'
                            }
                        }
                        if (emp.attendance[dateList[i]] == 'L') {
                            emp.days['day_' + dateList[i]] = addLeadingZero(2, emp.punch_hour[dateList[i]].toString()) + ':' +
                                addLeadingZero(2, emp.punch_min[dateList[i]].toString()) + ':' +
                                addLeadingZero(2, emp.punch_sec[dateList[i]].toString());
                        } else {
                            emp.days['day_' + dateList[i]] = emp.attendance[dateList[i]];
                        }
                        if (emp.attendance[dateList[i]] == 'P')
                            present++;
                        if (emp.attendance[dateList[i]] == 'L')
                            late++;
                        if (emp.attendance[dateList[i]] == 'A')
                            absent++;
                        if (emp.attendance[dateList[i]] == 'W')
                            weekend++;
                        if (emp.attendance[dateList[i]] == 'H')
                            holidays++;
                    };
                    for (var i = 0; i < dateList.length; i++) {
                        if (leaves.length) {
                            for (var j = 0; j < leaves.length; j++) {
                                var leave_date = new Date(leaves[j].date);
                                var ldgy = leave_date.getFullYear();
                                var ldgm = leave_date.getMonth();
                                var ldgd = leave_date.getDate();
                                var smgy = search_month.getFullYear();
                                var smgm = search_month.getMonth();
                                if (ldgy == smgy && ldgm == smgm) {
                                    if (parseInt(dateList[i]) == ldgd) {
                                        var ldtn = shortNames(leaves[j].leaveTypeTable.name);
                                        if (emp.attendance[dateList[i]] == 'A' && ldtn == 'LL') {
                                            emp.absent_late_leave++;
                                        }
                                        emp.attendance[dateList[i]] = ldtn;
                                        emp.days['day_' + dateList[i]] = emp.attendance[dateList[i]];
                                    }
                                }
                            };
                        }
                    };
                    emp.weekend = weekend;
                    //emp.weekends = weekends;
                    emp.absent = absent;
                    emp.present = present;
                    emp.late = late;
                    emp.holidays = holidays;
                    emp.day_length = dateList.length;
                    //var ex_la = parseInt(late/3);
                    //emp.absent+=ex_la;
                    emp.total = emp.present + emp.late + emp.absent;
                    returnData.push(emp);
                    cb_employee_data();
                })
            })
        }, function(err) {
            if (err) {
                throw err;
            }
            callback(returnData);
        });
    })
}

function user_attendance_list(db, DATA, callback) {
    var holiday = [];
    var adjustment = [];
    if (DATA.holiday) {
        for (var i = 0; i < DATA.holiday.length; i++) {
            if (parseInt(DATA.holiday[i]) > 0) {
                holiday.push(DATA.holiday[i]);
            }
        };
    }
    if (DATA.adjustment) {
        for (var i = 0; i < DATA.adjustment.length; i++) {
            if (parseInt(DATA.adjustment[i]) > 0) {
                adjustment.push(DATA.adjustment[i]);
            }
        };
    }
    var e = 1;
    var d = new Date();
    if (DATA.employee) {
        e = parseInt(DATA.employee);
    }
    if (DATA.month) {
        d = new Date(DATA.month);
    }
    var f = new Date(d);
    d.setMonth(d.getMonth() + 1);
    var t = new Date(d);
    db.attendance.findAll({
        where: {
            punch_time: {
                between: [f, t]
            },
            employee: e
        },
        include: [{
            model: db.employee,
            attributes: ['id', 'user', 'date_of_join', 'department', 'designation'],
            include: [{
                model: db.user,
                attributes: [
                    'id', 'first_name', 'last_name',
                    'card_no', 'finger_print_id', 'email',
                    'access_level', 'created_at'
                ]
            }, {
                model: db.department,
                attributes: [
                    'id', 'name'
                ]
            }, {
                model: db.designation,
                attributes: [
                    'id', 'name'
                ]
            }],
        }],
        order: [
            ['employee', 'ASC']
        ],
    }).complete(function(err, data) {
        var r_data = [];
        var dateList = dateListFromMonth(DATA.month);
        var sDate = new Date(DATA.month);
        var dateJson = {};
        var first_name = '';
        var last_name = '';
        var card_no = '';
        var finger_print_id = '';
        var email = '';
        var access_level = '';
        var date_of_join = '';
        var department = '';
        var designation = '';
        if (data[0]) {
            first_name = data[0].employeeTable.userTable.first_name;
            last_name = data[0].employeeTable.userTable.last_name;
            card_no = data[0].employeeTable.userTable.card_no;
            finger_print_id = data[0].employeeTable.userTable.finger_print_id;
            email = data[0].employeeTable.userTable.email;
            access_level = data[0].employeeTable.userTable.access_level;
            if (data[0].employeeTable.departmentTable)
                department = data[0].employeeTable.departmentTable.name;
            if (data[0].employeeTable.designationTable)
                designation = data[0].employeeTable.designationTable.name;
            date_of_join = data[0].employeeTable.date_of_join;
        }
        var weekend = 0;
        var nextdays = 0;
        var absent = 0;
        var present = 0;
        var late = 0;
        var holidays = 0;
        for (var i = 0; i < dateList.length; i++) {
            dateJson[dateList[i]] = {};
            var td1 = dateList[i] + '-' + mthNames[sDate.getMonth()] + '-' + sDate.getFullYear();
            var td2 = new Date(td1);
            var td3 = new Date();
            dateJson[dateList[i]].date = td1;
            if (td2.getDay() == 5 && adjustment.indexOf(dateList[i].toString()) == -1) {
                dateJson[dateList[i]].attendance = 'W';
            } else if (td2.getDate() > td3.getDate() && td2.getMonth() == td3.getMonth()) {
                dateJson[dateList[i]].attendance = 'N';
            } else {
                dateJson[dateList[i]].attendance = 'A';
                for (var z = 0; z < holiday.length; z++) {
                    if (parseInt(dateList[i]) == parseInt(holiday[z])) {
                        dateJson[dateList[i]].attendance = 'H';
                    }
                };
            }
            dateJson[dateList[i]].punch_time = [];
            dateJson[dateList[i]].punch_dates = [];
            dateJson[dateList[i]].in_time = null;
            dateJson[dateList[i]].in_time_h = 24;
            dateJson[dateList[i]].in_time_m = 59;
            dateJson[dateList[i]].in_time_s = 59;
        };
        for (var i = 0; i <= data.length - 1; i++) {
            var exact_datetime = data[i].punch_time.toISOString();
            var exact_datetime_array = exact_datetime.split('T');
            var exact_date_array = exact_datetime_array[0].split('-');
            var exact_time_array = exact_datetime_array[1].split('.');
            var exact_time_array = exact_time_array[0].split(':');
            var e_date = parseInt(exact_date_array[2]);
            var e_month = parseInt(exact_date_array[1]);
            var e_year = parseInt(exact_date_array[0]);
            var e_hour = exact_time_array[0];
            var e_min = exact_time_array[1];
            var e_sec = exact_time_array[2];
            var e_period = 'AM';
            if (e_hour > 12)
                e_period = 'PM';
            if (dateJson[e_date].in_time_h > parseInt(e_hour)) {
                dateJson[e_date].in_time = exact_datetime;
                dateJson[e_date].in_time_h = e_hour;
                if (dateJson[e_date].in_time_m > parseInt(e_min)) {
                    dateJson[e_date].in_time = exact_datetime;
                    dateJson[e_date].in_time_m = e_min;
                    if (dateJson[e_date].in_time_s > parseInt(e_sec)) {
                        dateJson[e_date].in_time = exact_datetime;
                        dateJson[e_date].in_time_s = e_sec;
                    }
                }
            }

            /*if(e_date<=6){
                if(dateJson[e_date].in_time_h<9){
                    dateJson[e_date].attendance = 'P';
                    if(dateJson[e_date].in_time_h==8){
                        if(dateJson[e_date].in_time_m>29){
                            dateJson[e_date].attendance = 'L';
                        }
                    }
                }else{
                    dateJson[e_date].attendance = 'L';
                }
            }else{*/
            if (dateJson[e_date].in_time_h < 10) {
                dateJson[e_date].attendance = 'P';
                if (dateJson[e_date].in_time_h == 9) {
                    if (dateJson[e_date].in_time_m > 29) {
                        dateJson[e_date].attendance = 'L';
                    }
                }
            } else {
                dateJson[e_date].attendance = 'L';
            }
            //}
            var tmp_time = '[ ' + e_hour + ':' + e_min + ':' + e_sec + ' ' + e_period + ' ] ';
            dateJson[e_date].punch_time.push(tmp_time);
            dateJson[e_date].punch_dates.push(exact_datetime_array[0]);
        };
        for (var i = 0; i < dateList.length; i++) {
            if (dateJson[dateList[i]].attendance == 'W')
                weekend++;
            else if (dateJson[dateList[i]].attendance == 'N')
                nextdays++;
            else if (dateJson[dateList[i]].attendance == 'A')
                absent++;
            else if (dateJson[dateList[i]].attendance == 'P')
                present++;
            else if (dateJson[dateList[i]].attendance == 'L')
                late++;
            else if (dateJson[dateList[i]].attendance == 'H')
                holidays++;
            if (i == dateList.length - 1) {
                dateJson[dateList[i]].weekend = weekend;
                dateJson[dateList[i]].nextdays = nextdays;
                dateJson[dateList[i]].absent = absent;
                dateJson[dateList[i]].present = present;
                dateJson[dateList[i]].late = late;
                dateJson[dateList[i]].holiday = holidays;
                dateJson[dateList[i]].finger_print_id = finger_print_id;
                dateJson[dateList[i]].card_no = card_no;
                dateJson[dateList[i]].email = email;
                dateJson[dateList[i]].access_level = access_level;
                dateJson[dateList[i]].date_of_join = date_of_join;
                dateJson[dateList[i]].department = department;
                dateJson[dateList[i]].designation = designation;
                if (first_name) {
                    if (last_name) {
                        dateJson[dateList[i]].name = first_name + ' ' + last_name;
                    } else {
                        dateJson[dateList[i]].name = first_name;
                    }
                }
            }
        };
        for (key in dateJson) {
            r_data.push(dateJson[key]);
        }
        if (r_data[0].date == 'NaN-undefined-NaN')
            r_data = [];
        callback(r_data);
    })
}

function getAttendance(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee
    if (QUERY.type)
        SEARCH.type = QUERY.type
    if (QUERY.date) {
        var f = new Date(QUERY.date);
        f.setDate(f.getDate() - 1);
        f.setHours(0);
        f.setMinutes(0);
        var t = new Date(QUERY.date);
        t.setDate(t.getDate() + 1);
        t.setHours(18);
        t.setMinutes(18);
        SEARCH.punch_time = {};
        SEARCH.punch_time.between = [f, t];
    }
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'employee', 'punch_time', 'type'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'punch_time';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.attendance.findAll(findData).complete(function(err, d) {
        callback(d);
    })
}


function CreateArchiveAttendance(db, DATA, callback) {
    for (var i = 0; i < DATA.length; i++) {
        fs.readFile(DATA[i], 'utf8', function(err, data) {
            if (err) throw err;
            var file_array = data.split("\r\n");
            var bulkArray = [];
            for (var j = 0; j < file_array.length; j++) {
                var inputs = {};
                if (file_array[j] != '') {
                    var filedatetime_array = file_array[j].split(" ");
                    if (filedatetime_array[1] == 'AM' || filedatetime_array[1] == 'PM') {
                        var datetime_array = filedatetime_array[0].split(":");
                        inputs.employee = parseInt(datetime_array[1]);
                        var date = new Date(datetime_array[2]);
                        var year = date.getFullYear();
                        var month = date.getMonth();
                        var day = date.getDate();
                        var hours = parseInt(datetime_array[3]);
                        var minutes = parseInt(datetime_array[4]);
                        var seconds = parseInt(datetime_array[5]);
                        if (filedatetime_array[1] == 'PM') {
                            hours += 12;
                        }
                        inputs.punch_time = Date.UTC(year, month, day, hours, minutes, seconds, 00);
                        bulkArray.push(inputs)
                    }
                }
            };
            db.attendance.bulkCreate(bulkArray).complete(function(err, wash) {
                if (err) {
                    callback("error");
                    //throw err;
                }
            });
        });
        if (i == DATA.length - 1) {
            callback("success")
        }
    };
}



function headerContents() {
    var hC = '<div style="' +
        'color: #444;' +
        'font-size: 9px;' +
        'position: fixed;' +
        'top: 15;' +
        'right: 15;' +
        '">' +
        '<span>PRINT TIME: ' +
        new Date() +
        '</span>' +
        '</div>' +
        '<br />' +
        '<h3 style="' +
        'line-height: 0;' +
        '">' + factoryName + '</h3>';
    return hC;
}

function addLeadingZero(length, str) {
    var returnString = str.toString();
    var l = length - returnString.length;
    var zero = '';
    while (l > 0) {
        zero += '0';
        l--
    }
    return zero + returnString;
}

function dayArrayFunc(a) {
    switch (a) {
        case 28:
            return [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28
            ];
            break;
        case 29:
            return [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29
            ];
            break;
        case 30:
            return [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30
            ];
            break;
        case 31:
            return [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
            ];
            break;
        default:
            return [];
    }
}

function rangeMArrayFunc(d) {
    var f = new Date(d);
    f.setUTCMonth(f.getUTCMonth() - 1);
    f.setUTCDate(26);
    var t = new Date(d);
    t.setUTCDate(25);
    var r = [];
    while (f <= t) {
        var Y = f.getUTCFullYear();
        var M = f.getUTCMonth() + 1;
        var D = f.getUTCDate();
        var YMD = Y + '-' + M + '-' + D;
        r.push(YMD);
        f.setUTCDate(f.getUTCDate() + 1);
    }
    return r;
}

function getEmployeeMonthAttendanceV2(db, QUERY, callback) {
    var returnData = [];
    var c = (QUERY.date) ? new Date(QUERY.date) : new Date();
    c.setDate(1);
    var f = (QUERY.date) ? new Date(QUERY.date) : new Date();
    f.setMonth(f.getMonth() - 1);
    f.setDate(20);
    var t = (QUERY.date) ? new Date(QUERY.date) : new Date();
    t.setMonth(t.getMonth() + 1);
    t.setDate(10);
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    d.setDate(20);
    getEmployee(db, QUERY, function(empData) {
        async.each(empData, function(emp, cb_emp) {
            var o = {};
            o = emp;
            o.salary = 0;
            o.advanceDeduct = 0;
            o.othersDeduct = 0;
            o.aitDeduct = 0;
            o.branch_code = '000';
            o.account_type = '000';
            o.account_no = '0000000';
            o.account = '000-000-0000000';
            o.attendance = {};
            var Y = d.getFullYear();
            var M = d.getMonth();
            var D = d.getDate();
            var YMD = Y + '-' + M + '-' + D;
            var SEARCH = {};
            SEARCH.employee = emp.id;
            SEARCH.id = emp.id;
            SEARCH.date = YMD;
            var d1 = new Date(d);
            d1.setMonth(d.getMonth() - 1);
            var Y1 = d1.getFullYear();
            var M1 = d1.getMonth() + 1;
            var D1 = d1.getDate();
            var Y1M1D1 = Y1 + '-' + M1 + '-' + D1;
            SEARCH.date = Y1M1D1;
            getEmployeeMonthPunch(db, SEARCH, function(monthData) {
                Object.keys(monthData).forEach((key) => (monthData[key].day > 15) ? o.attendance[key] = monthData[key] : null);
                M = d.getMonth() + 1;
                YMD = Y + '-' + M + '-' + D;
                SEARCH.date = YMD;
                getEmployeeMonthPunch(db, SEARCH, function(month2Data) {
                    Object.keys(month2Data).forEach((key) => o.attendance[key] = month2Data[key]);
                    var d2 = new Date(d);
                    d2.setMonth(d.getMonth() + 1);
                    var Y2 = d2.getFullYear();
                    var M2 = d2.getMonth() + 1;
                    var D2 = d2.getDate();
                    var Y2M2D2 = Y2 + '-' + M2 + '-' + D2;
                    SEARCH.date = Y2M2D2;
                    getEmployeeMonthPunch(db, SEARCH, function(month3Data) {
                        Object.keys(month3Data).forEach((key) => (month3Data[key].day < 15) ? o.attendance[key] = month3Data[key] : null);
                        M = d.getMonth() + 1;
                        YMD = Y + '-' + M + '-' + D;
                        SEARCH.date = YMD;
                        getAdjustment(db, SEARCH, function(adjData) {
                            async.each(adjData, function(adj, cb_adj) {
                                if (o.attendance[adj.d]) {
                                    o.attendance[adj.d].adjust = true;
                                    o.attendance[adj.d].weekend = false;
                                }
                                cb_adj();
                            }, function(err) {
                                getHoliday(db, SEARCH, function(holiData) {
                                    async.each(holiData, function(holi, cb_holi) {
                                        if (o.attendance[holi.d]) {
                                            o.attendance[holi.d].holiday = true;
                                            o.attendance[holi.d].weekend = false;
                                        }
                                        cb_holi();
                                    }, function(err) {
                                        getLeave(db, SEARCH, function(lvData) {
                                            async.each(lvData, function(lv, cb_lv) {
                                                if (o.attendance[lv.d]) {
                                                    o.attendance[lv.d].leave = true;
                                                    o.attendance[lv.d].leaveName = lv.leave;
                                                    o.attendance[lv.d].leaveType = lv.leave_type;
                                                }
                                                cb_lv();
                                            }, function(err) {
                                                getDateArray(f, t, function(dtArr) {
                                                    var tmpO = {};
                                                    tmpO.flag = false;
                                                    tmpO.tmpFlag = false;
                                                    tmpO.date = [];
                                                    tmpO.tmpDate = [];
                                                    async.each(dtArr, function(dt, cb_dt) {
                                                        tmpO.flag = (
                                                            (o.attendance[dt].weekend && !o.attendance[dt].adjust) ||
                                                            (o.attendance[dt].attend && o.attendance[dt].adjust && o.attendance[dt].weekend) ||
                                                            (o.attendance[dt].attend && !o.attendance[dt].adjust && !o.attendance[dt].weekend) ||
                                                            o.attendance[dt].holiday
                                                        );
                                                        o.attendance[dt].payable = tmpO.flag;
                                                        if (
                                                            (!tmpO.tmpFlag || (tmpO.tmpDate.length > 0)) &&
                                                            (o.attendance[dt].weekend || o.attendance[dt].holiday)
                                                        ) {
                                                            tmpO.tmpDate.push(dt);
                                                        }
                                                        if (!tmpO.flag) {
                                                            if (tmpO.tmpFlag) {
                                                                if (
                                                                    (!o.attendance[dt].weekend || !o.attendance[dt].holiday) &&
                                                                    (tmpO.tmpDate.length > 0)
                                                                ) {
                                                                    tmpO.date = tmpO.date.concat(tmpO.tmpDate);
                                                                    tmpO.tmpDate = [];
                                                                }
                                                            }
                                                        }
                                                        if (o.attendance[dt].attend && !o.attendance[dt].weekend && !o.attendance[dt].holiday) {
                                                            tmpO.tmpDate = [];
                                                        }
                                                        tmpO.tmpFlag = tmpO.flag;
                                                        cb_dt()
                                                    }, function(err) {
                                                        async.each(tmpO.date, function(tdt, cb_tdt) {
                                                            o.attendance[tdt].payable = false;
                                                            cb_tdt();
                                                        }, function(err) {
                                                            var salSearch = {};
                                                            salSearch.employee = emp.id;
                                                            salSearch.date = new Date(c);
                                                            getSalaryJson(db, salSearch, function(salData) {
                                                                o.salary = (salData.amount > 0) ? salData.amount : o.salary;
                                                                o.advanceDeduct = (salData.advanceDeduct > 0) ? salData.advanceDeduct : o.advanceDeduct;
                                                                o.othersDeduct = (salData.othersDeduct > 0) ? salData.othersDeduct : o.othersDeduct;
                                                                o.aitDeduct = (salData.aitDeduct > 0) ? salData.aitDeduct : o.aitDeduct;
                                                                o.branch_code = (salData.branch_code) ? salData.branch_code : o.branch_code;
                                                                o.account_type = (salData.account_type) ? salData.account_type : o.account_type;
                                                                o.account_no = (salData.account_no) ? salData.account_no : o.account_no;
                                                                o.account = (salData.account) ? salData.account : o.account;
                                                                returnData.push(o);
                                                                cb_emp();
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }, function(err) {
            callback(returnData);
        });
    })
}


function dailyReportHead() {
    var dRH = '<head>' +
        '<style>' +
        'table, th, td {' +
        'border: 1px solid black;' +
        'border-collapse: collapse;' +
        '}' +
        'th, td {' +
        'padding: 5px;' +
        'line-height: 0.7;' +
        'align: center;' +
        '}' +
        'h1, h2, h3, h4, h5, h6 {' +
        'line-height: 0;' +
        'text-align: center;' +
        '}' +
        '#pageBody {' +
        'font-size: 9px;' +
        'padding: 0px 20px 0px 20px;' +
        'page-break-after: always;' +
        '}' +
        '#pageBody:last-child {' +
        'page-break-after: avoid;' +
        '}' +
        'body {' +
        'font-family: Arial, Helvetica, sans-serif;' +
        '}' +
        '</style>' +
        '</head>';
    return dRH;
}

function dateListFromMonth(a) {
    var tmpd3 = new Date(a);
    var tmpd1 = new Date(tmpd3.getFullYear(), tmpd3.getMonth(), 01);
    var tmpd2 = new Date(tmpd3.getFullYear(), tmpd3.getMonth(), 01);
    var r_array = [];
    var OK = true;
    while (OK) {
        r_array.push(tmpd1.getDate());
        tmpd1.setDate(tmpd1.getDate() + 1)
        if (tmpd1.getMonth() != tmpd2.getMonth()) {
            OK = false;
        }
    }
    return r_array;
}

function monthlyReportHead() {
    var mRH = '<head>' +
        '<style>' +
        'table, th, td {' +
        'border: 1px solid black;' +
        'border-collapse: collapse;' +
        '}' +
        'th, td {' +
        'padding: 5px;' +
        'line-height: 1.2;' +
        'align: center;' +
        '}' +
        'h1, h2, h4 {' +
        'line-height: 0.8;' +
        'text-align: center;' +
        '}' +
        'div {' +
        'font-size: 20px;' +
        'padding: 0px 30px;' +
        '}' +
        'hr {' +
        'page-break-after: always;' +
        '}' +
        '</style>' +
        '</head>';
    return mRH;
}

function SendIndividualDayAttendance(db, DATA, callback) {
    var d = new Date();
    var f = new Date(d.getFullYear(), d.getMonth(), 1);
    var t = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    var f = f.getFullYear() + '-' + (f.getMonth() + 1) + '-' + f.getDate();
    var t = t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate();
    var sendData = {};
    sendData.from = 'no_reply@fashionflashltd.com';
    sendData.bcc = 'rips@fashionflashltd.com';

    db.employee.findAll({
        where: {
            // id:89,
            status: 0,
        },
        include: [{
            model: db.user,
            attributes: [
                'id', 'first_name', 'email'
            ]
        }, ],
        order: [
            ['id', 'ASC']
        ]
    }).complete(function(err, employee_data) {
        async.each(employee_data, function(employee, cb_employee_data) {
            db.attendance.findAll({
                where: {
                    punch_time: {
                        between: [f, t]
                    },
                    employee: employee.id
                        // employee: employee.id
                },
                attributes: [
                    'id', 'punch_time'
                ],
                order: [
                    ['punch_time', 'DESC']
                ],
            }).complete(function(err, att) {
                var t_d = new Date();
                sendData.to = employee.userTable.email;
                sendData.subject = 'Attendance Report For ' + t_d.getDate() + ' ' + mthCPNames[t_d.getMonth()] + ' ' + t_d.getFullYear();
                sendData.html = '<b>Dear ' + employee.userTable.first_name +
                    ',</b><br /><p>Please find your attendance report from below.</p>';
                if (!employee.userTable.email) {} else {
                    if (att.length > 0) {
                        var tp = false;
                        for (var i = att.length - 1; i >= 0; i--) {
                            var p = new Date(att[i].punch_time);
                            p.setHours(p.getHours() - 6);
                            if (t_d.getDate() != p.getDate()) {
                                sendData.html += '<p><b style="color:gray;">' + p.toLocaleString('en-US') + '</b></p>';
                            } else {
                                tp = true;
                                sendData.html += '<p><b style="color:green">Today Attendance</b></p>';
                                sendData.html += '<p><big><b style="color:green;">' + p.toLocaleString('en-US') + '</b></big></p>';
                            }
                        }
                        if (!tp) {
                            sendData.html += '<p><b style="color:red">Today Attendance</b></p>';
                            sendData.html += '<p><big><b style="color:red">No Punch Found</b></big></p>';
                        }
                    } else {
                        sendData.html += '<p><big><b style="color:red">No Punch Found</b></big></p>';
                    }
                    sendData.html += '<p><i style="color:gray"><small><b>N:B:</b> This is an automatically generated email, please do not reply. If you have any concerns regarding this mail,' +
                        'report to IT Department whithin 24 hours from ' + t_d.toLocaleString('en-US') +
                        ' with proper document.</i></small></p>';
                    sendData.text = sendData.html;

                    transporter.sendMail(sendData, function(error, info) {
                        cb_employee_data();
                    });
                }
            })
        }, function(err) {
            //if (err) { throw err; }
            callback('success');
        });
    });

}

function SendDailyAttendanceReport(db, values, vHTML, callback) {
    var sendData = {};
    sendData.from = 'no_reply@fashionflashltd.com';
    sendData.bcc = 'ripon@fashionflashltd.com,sazzad@fashionflashltd.com';
    sendData.to = 'helal@fashionflashltd.com,kmizan@fashionflashltd.com,hasan@fashionflashltd.com,zahir@fjeansltd.com';
    // sendData.to = 'rips@ff-ltd.com';

    var t_d = new Date(values.date);
    sendData.subject = 'Fashion Flash LTD Head Office Attendance Report For ' + t_d.getDate() + ' ' + mthCPNames[t_d.getMonth()] + ' ' + t_d.getFullYear();
    sendData.html = '<b>Dear All' +
        ',</b><br /><p>Please find daily attendance report from attached file.</p>' + vHTML;

    sendData.html += '<p><i style="color:gray"><small><b>N:B:</b> This is an automatically generated email, please do not reply. If you have any concerns regarding this mail,' +
        'report to IT Department.</i></small></p>';
    sendData.attachments = [{
        path: values.filePath
    }, ];
    transporter.sendMail(sendData, function(error, info) {
        callback('success');
    });
}

function DestroyAttendance(db, DATA, callback) {
    db.attendance.destroy({
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

function CreateAttendance(db, DATA, callback) {
    db.attendance.create({
        name: DATA.name,
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

    app.get('/attendance', /*isAuthenticated,*/ function(req, res) {
        attendance_list(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/attendance_report/:DEPARTMENT_ID', /*isAuthenticated,*/ function(req, res) {
        var DEPARTMENT_ID = req.params.DEPARTMENT_ID;
        attendance_report(db, DEPARTMENT_ID, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/user_attendance', /*isAuthenticated,*/ function(req, res) {
        list.user_attendance_list(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getAttendance', function(req, res) {
        QUERY = {};
        QUERY.employee = 89;
        getAttendance(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.post('/CreateArchiveAttendance', function(req, res) {
        var files = req.files.archive_file;
        var file_path = [];
        if (files.length) {
            for (var i = 0; i < files.length; i++) {
                file_path.push(files[i].path)
            };
        } else {
            file_path.push(files.path)
        }
        CreateArchiveAttendance(db, file_path, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });


    app.get('/attendanceTransfer', /*isAuthenticated,*/ function(req, res) {
        dataArray = [{
            active: '`ffl_erp`',
            id: 146,
            office: [{
                place: '`da_hr`',
                id: 148417116,
                flag: true,
            }, {
                place: '`ffl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: 146,
                flag: true,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 145,
            office: [{
                place: '`da_hr`',
                id: null,
                flag: false,
            }, {
                place: '`ffl_hr`',
                id: 126617102,
                flag: true,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: null,
                flag: false,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 137,
            office: [{
                place: '`da_hr`',
                id: 1137,
                flag: true,
            }, {
                place: '`ffl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: 137,
                flag: true,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 136,
            office: [{
                place: '`da_hr`',
                id: null,
                flag: false,
            }, {
                place: '`ffl_hr`',
                id: 126317103,
                flag: true,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: null,
                flag: false,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 26,
            office: [{
                place: '`da_hr`',
                id: null,
                flag: false,
            }, {
                place: '`ffl_hr`',
                id: 1213,
                flag: true,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: null,
                flag: false,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 37,
            office: [{
                place: '`da_hr`',
                id: 1037,
                flag: true,
            }, {
                place: '`ffl_hr`',
                id: 37,
                flag: true,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: null,
                flag: false,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 40,
            office: [{
                place: '`da_hr`',
                id: 1040,
                flag: true,
            }, {
                place: '`ffl_hr`',
                id: 40,
                flag: true,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: null,
                flag: false,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 56,
            office: [{
                place: '`da_hr`',
                id: null,
                flag: false,
            }, {
                place: '`ffl_hr`',
                id: 56,
                flag: true,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: null,
                flag: false,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 76,
            office: [{
                place: '`da_hr`',
                id: null,
                flag: false,
            }, {
                place: '`ffl_hr`',
                id: 76,
                flag: true,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: null,
                flag: false,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 77,
            office: [{
                place: '`da_hr`',
                id: null,
                flag: false,
            }, {
                place: '`ffl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: 177,
                flag: true,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 78,
            office: [{
                place: '`da_hr`',
                id: 1078,
                flag: true,
            }, {
                place: '`ffl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: null,
                flag: false,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 79,
            office: [{
                place: '`da_hr`',
                id: null,
                flag: false,
            }, {
                place: '`ffl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: 79,
                flag: true,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 90,
            office: [{
                place: '`da_hr`',
                id: null,
                flag: false,
            }, {
                place: '`ffl_hr`',
                id: 90,
                flag: true,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: null,
                flag: false,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 98,
            office: [{
                place: '`da_hr`',
                id: null,
                flag: false,
            }, {
                place: '`ffl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: 98,
                flag: true,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 117,
            office: [{
                place: '`da_hr`',
                id: 180,
                flag: true,
            }, {
                place: '`ffl_hr`',
                id: 1276,
                flag: true,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: null,
                flag: false,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 132,
            office: [{
                place: '`da_hr`',
                id: null,
                flag: false,
            }, {
                place: '`ffl_hr`',
                id: 126417102,
                flag: true,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: null,
                flag: false,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 133,
            office: [{
                place: '`da_hr`',
                id: null,
                flag: false,
            }, {
                place: '`ffl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: 1197,
                flag: true,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 134,
            office: [{
                place: '`da_hr`',
                id: 148717100,
                flag: true,
            }, {
                place: '`ffl_hr`',
                id: 126317102,
                flag: true,
            }, {
                place: '`fjl_hr`',
                id: 136317102,
                flag: true,
            }, {
                place: '`jcl_wash`',
                id: null,
                flag: false,
            }, ]
        }, {
            active: '`ffl_erp`',
            id: 140,
            office: [{
                place: '`da_hr`',
                id: null,
                flag: false,
            }, {
                place: '`ffl_hr`',
                id: 127817102,
                flag: true,
            }, {
                place: '`fjl_hr`',
                id: null,
                flag: false,
            }, {
                place: '`jcl_wash`',
                id: null,
                flag: false,
            }, ]
        }, ];
        async.each(dataArray, function(dA, cb_dA) {
            var o = {};
            o.employee = dA.id;
            o.query = '';
            o.punch_time = [];
            async.each(dA.office, function(ofF, cb_ofF) {
                if (ofF.flag) {
                    database.sequelize.query('SELECT * FROM ' + ofF.place + '.`attendance` WHERE `employee` = ' + ofF.id + ';').complete(function(err, attData) {
                        if (attData) {
                            async.each(attData, function(att, cb_att) {
                                var dt = new Date(att.punch_time);
                                var ob = {};
                                ob.employee = o.employee;
                                ob.punch_time = dt;
                                ob.type = 3;
                                db.attendance.create(ob).complete(function(err, attendance) {
                                    cb_att();
                                })
                            }, function(err) {
                                cb_ofF();
                            });
                        } else {
                            cb_ofF();
                        }
                    });
                } else
                    cb_ofF();
            }, function(err) {
                // returnData.push(o);
                cb_dA();
            });
        }, function(err) {
            res.setHeader('Content-Type', 'application/json');
            res.send([]);
        });
    });

}




function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('CreateMonthlyAttendanceReportPDF', function(data, file_name) {
        var options = {
            width: '7120px',
            height: '4320px'
        };
        pdf.create(data, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
            console.log('TEST');
            socket.emit("CreateMonthlyAttendanceReportPDF", 'success');
        });
    });

    socket.on('DownloadEmployeeMonthlyAttendance', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var dayArray = dayArrayFunc(d.monthDays());
        var options = {};
        getC.getEmployeeMonthAttendance(db, QUERY, function(empData) {
            var htmlData =
                '<!DOCTYPE html><body>' +
                dailyReportHead() +
                '<div id="pageBody">' +
                '<table style="width:100%">' +
                '<tr>' +
                '<td rowspan="2" align="center">' +
                '<b>' +
                'EMPLOYEE ATTENDANCE REPORT ' +
                monthCapitalNames[d.getMonth()] + ', ' +
                d.getUTCFullYear() +
                '</b>' +
                '</td>' +
                '</tr>' +
                '</table>';
            var gridData = '';
            var present = 0;
            var absent = 0;
            var late = 0;
            var holiday = 0;
            var weekend = 0;
            var leave = 0;
            var inLate = 0;
            var outLate = 0;
            var fp = addLeadingZero(9, QUERY.id);
            var name = '';
            var joinDate = '';
            var department = '';
            var designation = '';
            async.each(empData, function(emp, cb_emp) {
                name = emp.name;
                joinDate = emp.date_of_join.formatFullDate();
                department = emp.departmentName;
                designation = emp.designationName;
                options = {
                    format: 'Letter',
                    header: {
                        height: "27mm",
                        contents: headerContents() +
                            '<h4 style="' +
                            'line-height: 0;' +
                            '">MONTHLY ATTENDANCE REPORT</h4>' +
                            '<h6 style="line-height: 0;">' +
                            emp.name + ' | ' +
                            monthCapitalNames[d.getMonth()] + ', ' +
                            d.getUTCFullYear() +
                            '</h6>'
                    },
                    footer: {
                        height: "15mm",
                        contents: footerContents()
                    },
                };
                var workInTime = emp.workInTime.split(":");
                var workOutTime = emp.workOutTime.split(":");
                var inH = parseInt(workInTime[0]);
                var inM = parseInt(workInTime[1]);
                var outH = parseInt(workOutTime[0]) - 12;
                var outM = parseInt(workOutTime[1]);
                gridData += '<table style="width:100%">' +
                    '<tr>' +
                    '<th>DATE</th>' +
                    '<th>OFFICE IN</th>' +
                    '<th>OFFICE OUT</th>' +
                    '<th>STATUS</th>' +
                    '</tr>';
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
                    // var InStatus = (emp.attendance[YMD].officeIn.flag)?((emp.attendance[YMD].officeIn.h<inH)?'P':'L'):'A';
                    // var OutStatus = (emp.attendance[YMD].officeOut.flag)?((emp.attendance[YMD].officeOut.h>=outH)?'P':'L'):'A';
                    var empStatus = (InStatus == 'P' && OutStatus == 'P') ?
                        'P' :
                        (
                            (
                                (InStatus == 'P' && (OutStatus == 'L' || OutStatus == 'A')) ||
                                ((InStatus == 'L' || InStatus == 'A') && OutStatus == 'P') ||
                                (InStatus == 'L' && OutStatus == 'A') ||
                                (InStatus == 'A' && OutStatus == 'L') ||
                                (InStatus == 'L' && OutStatus == 'L')
                            ) ?
                            'L' :
                            'A'
                        );
                    var cDate = addLeadingZero(2, parseInt(D)) + '-' + mthCPNames[M - 1] + '-' + Y;
                    var officeIn = emp.attendance[YMD].officeIn.time + ' (' + InStatus + ')';
                    var officeOut = emp.attendance[YMD].officeOut.time + ' (' + OutStatus + ')';
                    if (emp.attendance[YMD].leave) {
                        officeIn = emp.attendance[YMD].leaveType;
                        officeOut = emp.attendance[YMD].leaveType;
                        empStatus = emp.attendance[YMD].leaveName;
                        leave++;
                    } else if (!emp.attendance[YMD].adjust) {
                        if (emp.attendance[YMD].holiday) {
                            if (emp.attendance[YMD].payable) {
                                officeIn = 'HOLIDAY';
                                officeOut = 'HOLIDAY';
                                empStatus = 'H';
                                holiday++;
                            } else {
                                officeIn = 'ABSENT';
                                officeOut = 'ABSENT';
                                empStatus = 'A';
                                absent++;
                            }
                        } else {
                            if (emp.attendance[YMD].weekend) {
                                if (emp.attendance[YMD].payable) {
                                    officeIn = 'WEEKEND';
                                    officeOut = 'WEEKEND';
                                    empStatus = 'W';
                                    weekend++;
                                } else {
                                    officeIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    absent++;
                                }
                            } else {
                                if (empStatus == 'A') {
                                    officeIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    absent++;
                                }
                            }
                        }
                    } else {
                        if (empStatus == 'A') {
                            officeIn = 'ABSENT';
                            officeOut = 'ABSENT';
                            empStatus = 'A';
                            absent++;
                        }
                    }
                    if (empStatus == 'P') {
                        present++;
                    } else if (empStatus == 'L') {
                        if (InStatus == 'L' || InStatus == 'A') {
                            inLate++;
                        }
                        if (OutStatus == 'L' || OutStatus == 'A') {
                            outLate++;
                        }
                        late++;
                    }
                    gridData += '<tr>' +
                        '<td align="center">' +
                        cDate +
                        '</td>' +
                        '<td align="center">' +
                        officeIn +
                        '</td>' +
                        '<td align="center">' +
                        officeOut +
                        '</td>' +
                        '<td align="center">' +
                        empStatus +
                        '</td>' +
                        '</tr>';
                    cb_day()
                }, function(err) {
                    gridData += '</table><br /></div></body></html>';
                    cb_emp();
                });
            }, function(err) {
                htmlData += '<table style="width:100%;">' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>NAME </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + name + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>EMPLOYEE ID </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + fp + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>PRESENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, present) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>DEPARTMENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + department + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>ABSENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, absent) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>DESIGNATION </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + designation + '</b>' +
                    '</td>' +
                    ///////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>JOINING DATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + joinDate + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>LATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, late) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>IN LATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>: ' + addLeadingZero(2, inLate) + ' ( Absent For Late : ' +
                    addLeadingZero(2, parseInt(inLate / 3)) + ' )</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>HOLIDAY </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, holiday) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>OUT LATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>: ' + addLeadingZero(2, outLate) + ' ( Absent For Late : ' +
                    addLeadingZero(2, parseInt(outLate / 3)) + ' )</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>WEEKEND </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, weekend) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>TOTAL LATE </b>' +
                    '</td>' +
                    '<td style="background:Gainsboro;border-left: 0px solid Gainsboro;border-right: 0px solid Gainsboro;">' +
                    '<b>: ' + addLeadingZero(2, (inLate + outLate)) + ' ( Absent For Late : ' +
                    addLeadingZero(2, (parseInt(inLate / 3) + parseInt(outLate / 3))) + ' )</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>LEAVE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, leave) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>TOTAL </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border-left: 0px solid white;border-right: 0px solid white;border-bottom: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, absent + present + late + holiday + weekend + leave) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    '</table>';
                htmlData += gridData;
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadEmployeeMonthlyAttendance", 'success');
                });
            });
        });
    });


    socket.on('DownloadEmployeeMonthlyAttendanceV2', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        d.setDate(10);
        var dayArray = dayArrayFunc(d.monthDays());
        var rangeMArray = rangeMArrayFunc(d);
        var options = {};
        getC.getEmployeeMonthAttendanceV2(db, QUERY, function(empData) {
            var htmlData =
                '<!DOCTYPE html><body>' +
                dailyReportHead() +
                '<div id="pageBody">' +
                '<table style="width:100%">' +
                '<tr>' +
                '<td rowspan="2" align="center">' +
                '<b>' +
                'EMPLOYEE ATTENDANCE REPORT ' +
                monthCapitalNames[d.getMonth()] + ', ' +
                d.getUTCFullYear() +
                '</b>' +
                '</td>' +
                '</tr>' +
                '</table>';
            var gridData = '';
            var present = 0;
            var absent = 0;
            var late = 0;
            var holiday = 0;
            var weekend = 0;
            var leave = 0;
            var inLate = 0;
            var outLate = 0;
            var fp = addLeadingZero(9, QUERY.id);
            var name = '';
            var joinDate = '';
            var department = '';
            var designation = '';
            async.each(empData, function(emp, cb_emp) {
                name = emp.name;
                joinDate = emp.date_of_join.formatFullDate();
                department = emp.departmentName;
                designation = emp.designationName;
                options = {
                    format: 'Letter',
                    header: {
                        height: "27mm",
                        contents: headerContents() +
                            '<h4 style="' +
                            'line-height: 0;' +
                            '">MONTHLY ATTENDANCE REPORT</h4>' +
                            '<h6 style="line-height: 0;">' +
                            emp.name + ' | ' +
                            monthCapitalNames[d.getMonth()] + ', ' +
                            d.getUTCFullYear() +
                            '</h6>'
                    },
                    footer: {
                        height: "15mm",
                        contents: footerContents()
                    },
                };
                var workInTime = emp.workInTime.split(":");
                var workOutTime = emp.workOutTime.split(":");
                var inH = parseInt(workInTime[0]);
                var inM = parseInt(workInTime[1]);
                var outH = parseInt(workOutTime[0]) - 12;
                var outM = parseInt(workOutTime[1]);
                gridData += '<table style="width:100%">' +
                    '<tr>' +
                    '<th>DATE</th>' +
                    '<th>OFFICE IN</th>' +
                    '<th>OFFICE OUT</th>' +
                    '<th>STATUS</th>' +
                    '</tr>';
                async.each(rangeMArray, function(YMD, cb_day) {
                    var dr = new Date(YMD);
                    var Y = dr.getFullYear();
                    var M = dr.getMonth() + 1;
                    var D = dr.getDate();
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
                    // var InStatus = (emp.attendance[YMD].officeIn.flag)?((emp.attendance[YMD].officeIn.h<inH)?'P':'L'):'A';
                    // var OutStatus = (emp.attendance[YMD].officeOut.flag)?((emp.attendance[YMD].officeOut.h>=outH)?'P':'L'):'A';
                    var empStatus = (InStatus == 'P' && OutStatus == 'P') ?
                        'P' :
                        (
                            (
                                (InStatus == 'P' && (OutStatus == 'L' || OutStatus == 'A')) ||
                                ((InStatus == 'L' || InStatus == 'A') && OutStatus == 'P') ||
                                (InStatus == 'L' && OutStatus == 'A') ||
                                (InStatus == 'A' && OutStatus == 'L') ||
                                (InStatus == 'L' && OutStatus == 'L')
                            ) ?
                            'L' :
                            'A'
                        );
                    var cDate = addLeadingZero(2, parseInt(D)) + '-' + mthCPNames[M - 1] + '-' + Y;
                    var officeIn = emp.attendance[YMD].officeIn.time + ' (' + InStatus + ')';
                    var officeOut = emp.attendance[YMD].officeOut.time + ' (' + OutStatus + ')';
                    if (emp.attendance[YMD].leave) {
                        officeIn = emp.attendance[YMD].leaveType;
                        officeOut = emp.attendance[YMD].leaveType;
                        empStatus = emp.attendance[YMD].leaveName;
                        leave++;
                    } else if (!emp.attendance[YMD].adjust) {
                        if (emp.attendance[YMD].holiday) {
                            if (emp.attendance[YMD].payable) {
                                officeIn = 'HOLIDAY';
                                officeOut = 'HOLIDAY';
                                empStatus = 'H';
                                holiday++;
                            } else {
                                officeIn = 'ABSENT';
                                officeOut = 'ABSENT';
                                empStatus = 'A';
                                absent++;
                            }
                        } else {
                            if (emp.attendance[YMD].weekend) {
                                if (emp.attendance[YMD].payable) {
                                    officeIn = 'WEEKEND';
                                    officeOut = 'WEEKEND';
                                    empStatus = 'W';
                                    weekend++;
                                } else {
                                    officeIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    absent++;
                                }
                            } else {
                                if (empStatus == 'A') {
                                    officeIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    absent++;
                                }
                            }
                        }
                    } else {
                        if (empStatus == 'A') {
                            officeIn = 'ABSENT';
                            officeOut = 'ABSENT';
                            empStatus = 'A';
                            absent++;
                        }
                    }
                    if (empStatus == 'P') {
                        present++;
                    } else if (empStatus == 'L') {
                        if (InStatus == 'L' || InStatus == 'A') {
                            inLate++;
                        }
                        if (OutStatus == 'L' || OutStatus == 'A') {
                            outLate++;
                        }
                        late++;
                    }
                    gridData += '<tr>' +
                        '<td align="center">' +
                        cDate +
                        '</td>' +
                        '<td align="center">' +
                        officeIn +
                        '</td>' +
                        '<td align="center">' +
                        officeOut +
                        '</td>' +
                        '<td align="center">' +
                        empStatus +
                        '</td>' +
                        '</tr>';
                    cb_day()
                }, function(err) {
                    gridData += '</table><br /></div></body></html>';
                    cb_emp();
                });
            }, function(err) {
                htmlData += '<table style="width:100%;">' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>NAME </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + name + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>EMPLOYEE ID </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + fp + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>PRESENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, present) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>DEPARTMENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + department + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>ABSENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, absent) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>DESIGNATION </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + designation + '</b>' +
                    '</td>' +
                    ///////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>JOINING DATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + joinDate + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>LATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, late) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>IN LATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>: ' + addLeadingZero(2, inLate) + ' ( Absent For Late : ' +
                    addLeadingZero(2, parseInt(inLate / 3)) + ' )</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>HOLIDAY </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, holiday) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>OUT LATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>: ' + addLeadingZero(2, outLate) + ' ( Absent For Late : ' +
                    addLeadingZero(2, parseInt(outLate / 3)) + ' )</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>WEEKEND </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, weekend) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>TOTAL LATE </b>' +
                    '</td>' +
                    '<td style="background:Gainsboro;border-left: 0px solid Gainsboro;border-right: 0px solid Gainsboro;">' +
                    '<b>: ' + addLeadingZero(2, (inLate + outLate)) + ' ( Absent For Late : ' +
                    addLeadingZero(2, (parseInt(inLate / 3) + parseInt(outLate / 3))) + ' )</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>LEAVE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, leave) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>TOTAL </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border-left: 0px solid white;border-right: 0px solid white;border-bottom: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, absent + present + late + holiday + weekend + leave) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    '</table>';
                htmlData += gridData;
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadEmployeeMonthlyAttendanceV2", 'success');
                });
            });
        });
    });

    socket.on('CreateMonthlyUserAttendanceReportPDF', function(file_name, site_url, sd, eid) {
        var ms = new Date(sd);
        var ns = new Date(sd);
        ns.setMonth(ns.getMonth() + 1);
        ns.setDate(0);
        var htmlData =
            '<!DOCTYPE html>' +
            '<html>' +
            '<body>' +
            dailyReportHead();
        emp_month_attendance(db, sd, eid, function(empAttDL) {
            var eD = empAttDL[0]
            var eName = (eD.name == 'NOT GIVEN') ? eid.name : eD.name;
            var eFpID = (eD.fp_id == '') ? eid.id : eD.fp_id;
            var eDOJ = (eD.date_of_join == '') ? eid.date_of_join : eD.date_of_join;
            var eDep = (eD.department == '') ? eid.department.toUpperCase() : eD.department.toUpperCase();
            var eDes = (eD.designation == '') ? eid.designation.toUpperCase() : eD.designation.toUpperCase();
            var eEmail = (eD.email == '') ? eid.email : eD.email;
            htmlData += '<div id="pageBody">' +
                '<table style="width:100%">' +
                '<tr>' +
                '<td rowspan="2" align="center">' +
                '<b>' +
                'EMPLOYEE ATTENDANCE REPORT- 1' +
                '<sup>' +
                dayPower[1] +
                '</sup> ' +
                monthCapitalNames[ms.getMonth()] + ', ' +
                ms.getUTCFullYear() +
                ' TO ' +
                ns.getDate() +
                '<sup>' +
                dayPower[ns.getDate()] +
                '</sup> ' +
                monthCapitalNames[ns.getMonth()] + ', ' +
                ns.getUTCFullYear() +
                '</b>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '<table style="width:100%;">' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'EMPLOYEE ID ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                factoryShort +
                addLeadingZero(4, eFpID) +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'PRESENT ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.present) +
                '</b>' +
                '</td>' +
                '</tr>' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'NAME ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                eName +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'ABSENT ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.absent) +
                '</b>' +
                '</td>' +
                '</tr>' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'JOINING DATE ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                eDOJ +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'LATE ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.late) +
                '</b>' +
                '</td>' +
                '</tr>' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'DEPARTMENT ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                eDep +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'HOLIDAY ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.holiday) +
                '</b>' +
                '</td>' +
                '</tr>' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'DESIGNATION ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                eDes +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'WEEKEND ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.weekend) +
                '</b>' +
                '</td>' +
                '</tr>' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                '<b>' +
                'IN LATE ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.inLate) +
                ' ( AL : ' +
                addLeadingZero(2, parseInt(eD.inLate / 3)) +
                ' )' +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'TOTAL ' +
                '</b>' +
                '</td>' +
                '<td style="border-left: 0px solid white;border-right: 0px solid white;border-bottom: 0px solid white;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.absent + eD.present + eD.late + eD.holiday + eD.weekend) +
                '</b>' +
                '</td>' +
                '</tr>' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                '<b>' +
                'OUT LATE ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.outLate) +
                ' ( AL : ' +
                addLeadingZero(2, parseInt(eD.outLate / 3)) +
                ' )' +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<td style="border: 0px solid white;">' +
                '</td>' +
                '</tr>' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                '<b>' +
                'TOTAL LATE ' +
                '</b>' +
                '</td>' +
                '<td style="background:Gainsboro;border-left: 0px solid Gainsboro;border-right: 0px solid Gainsboro;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, (parseInt(eD.inLate) + parseInt(eD.outLate))) +
                ' ( AL : ' +
                addLeadingZero(2, (parseInt(eD.inLate / 3) + parseInt(eD.outLate / 3))) +
                ' )' +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '</td>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '</td>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '<table style="width:100%">' +
                '<tr>' +
                '<th>DATE</th>' +
                '<th>IN TIME</th>' +
                '<th>OUT TIME</th>' +
                '<th>STATUS</th>' +
                '</tr>';
            async.each(eD.attendance, function(att, cb_att) {
                htmlData += '<tr>' +
                    '<td align="center">' +
                    att.date +
                    '</td>' +
                    '<td align="center">' +
                    att.in_time +
                    '</td>' +
                    '<td align="center">' +
                    att.out_time +
                    '</td>' +
                    '<td align="center">' +
                    att.status +
                    '</td>' +
                    '</tr>';
                cb_att();
            }, function(err) {
                htmlData += '</table></div></body></html>';
                var pt = new Date();
                var options = {
                    format: 'Letter',
                    header: {
                        height: "27mm",
                        contents: headerContents() +
                            '<h4 style="' +
                            'line-height: 0;' +
                            '">MONTHLY ATTENDANCE REPORT</h4>' +
                            '<h6 style="line-height: 0;">' +
                            eName + ' | ' +
                            monthCapitalNames[ms.getMonth()] + ', ' +
                            ms.getUTCFullYear() +
                            '</h6>'
                    },
                    footer: {
                        height: "15mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                    if (err) return console.log(err);
                    socket.emit("CreateMonthlyUserAttendanceReportPDF", 'success');
                });
            })
        })
    });

    socket.on('DownloadDailyAttendanceReportPDF', function(values) {
        var ms = (values.date != '') ? new Date(values.date) : new Date();
        var htmlData = '<!DOCTYPE html><head><meta lang="bn" http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" /><?xml version="1.0" encoding="UTF-8"?></head><body>' + dailyReportHead();
        var totalOverView = '<br /><table style="width:90%;font-size: 11px;padding:5px;margin:0 auto;" border=2>' +
            '<tr>' +
            '<th colspan="7" style="background-color:#DDDDDD"><big align="center">ATTENDANCE SUMMARY</big></th>' +
            '</tr>' +
            '<tr>' +
            '<th>#</th>' +
            '<th>DEPARTMENT</th>' +
            '<th>PRESENT</th>' +
            '<th>LATE</th>' +
            '<th>ATTEND</th>' +
            '<th>ABSENT</th>' +
            '<th>TOTAL</th>' +
            '</tr>';
        var r = 0;
        var totalPresent = 0;
        var totalAbsent = 0;
        var totalLate = 0;
        var grandTotal = 0;
        var depSearch = {};
        if (values.department != '')
            depSearch.id = values.department;
        getC.getDepartment(db, depSearch, function(depList) {
            depList.sort(function(a, b) {
                var p1 = a.id;
                var p2 = b.id;

                if (p1 < p2) return -1;
                if (p1 > p2) return 1;
                return 0;
            });
            async.each(depList, function(dep, cb_dep) {
                values.department = dep.id;
                var tmpHtmlData = '';
                var present = 0;
                var absent = 0;
                var late = 0;
                var total = 0;
                var eFSearch = {};
                eFSearch.department = dep.id;
                eFSearch.status = 0;
                eFSearch.date = new Date(ms);
                if (values.employee_type != '')
                    eFSearch.employee_type = values.employee_type;
                if (values.attendance_type != '')
                    eFSearch.attendance_type = values.attendance_type;
                var flag = 0;
                tmpHtmlData += '<table style="width:100%">' +
                    '<tr>' +
                    '<th>FP ID</th>' +
                    '<th>EMPLOYEE NAME</th>' +
                    '<th>DESIGNATION</th>' +
                    '<th><small><small>LAST DAY OUT</small></small></th>' +
                    '<th><small>OFFICE IN</small></th>' +
                    '<th><small>OFFICE OUT</small></th>' +
                    '<th><small><small>STATUS</small></small></th>' +
                    '</tr>';
                getC.getEmployeeDayAttendance(db, eFSearch, function(empList) {
                    empList.sort(function(a, b) {
                        var p1 = a.id;
                        var p2 = b.id;

                        if (p1 < p2) return -1;
                        if (p1 > p2) return 1;
                        return 0;
                    });
                    async.each(empList, function(emp, cb_emp) {
                        var workInTime = emp.workInTime.split(":");;
                        var workOutTime = emp.workOutTime.split(":");;
                        // var inH = parseInt(workInTime[0]);
                        // var inM = parseInt(workInTime[1]);
                        // var outH = parseInt(workOutTime[0]);

                        var inH = parseInt(workInTime[0]);
                        var inM = parseInt(workInTime[1]);
                        var outH = parseInt(workOutTime[0]) - 12;
                        var outM = parseInt(workOutTime[1]);

                        var empStatus = (emp.attendanceStatus == 'P') ?
                            (
                                (emp.officeIn.h < inH) ?
                                'P' :
                                (
                                    (emp.officeIn.h == inH && emp.officeIn.m <= inM) ?
                                    'P' :
                                    'L'
                                )
                            ) :
                            'A';

                        // var InStatus = (emp.officeIn.flag)?
                        // (
                        //   (emp.officeIn.h<=inH)?
                        //   (
                        //     (emp.officeIn.h==inH&&emp.officeIn.m>inM)?
                        //     'L':
                        //     'P'
                        //   ):
                        //   'L'
                        // ):
                        // 'A';
                        // var OutStatus = (emp.officeOut.flag)?
                        // (
                        //   (emp.officeOut.h>=outH)?
                        //   (
                        //     (emp.officeOut.h==outH&&emp.officeOut.m<outM)?
                        //     'L':
                        //     'P'
                        //   ):
                        //   'L'
                        // ):
                        // 'A';
                        // // var OutStatus = (emp.officeOut.flag)?((emp.officeOut.h>=outH)?'P':'L'):'A';
                        // var empStatus = (InStatus=='P'&&OutStatus=='P')?
                        //   'P':
                        //   ((
                        //     (InStatus=='P'&&(OutStatus=='L'||OutStatus=='A'))||
                        //     ((InStatus=='L'||InStatus=='A')&&OutStatus=='P')||
                        //     (InStatus=='L'&&OutStatus=='A')||
                        //     (InStatus=='A'&&OutStatus=='L')||
                        //     (InStatus=='L'&&OutStatus=='L')
                        //   )?
                        //   'L':
                        //   'A');

                        if (empStatus == 'A')
                            absent++;
                        if (empStatus == 'P')
                            present++;
                        if (empStatus == 'L')
                            late++;
                        if (emp.id)
                            flag = 1;
                        tmpHtmlData += '<tr';
                        tmpHtmlData += (emp.attendanceStatus == 'A') ? ' style="background-color:#DDD;"' : '';
                        tmpHtmlData += '>';
                        tmpHtmlData += '<td align="center">';
                        tmpHtmlData += addLeadingZero(9, parseInt(emp.id));
                        tmpHtmlData += '</td>';
                        tmpHtmlData += '<td align="left">';
                        tmpHtmlData += emp.name;
                        tmpHtmlData += '</td>';
                        tmpHtmlData += '<td align="left">';
                        tmpHtmlData += emp.designationName;
                        tmpHtmlData += '</td>';
                        tmpHtmlData += '<td align="center">';
                        tmpHtmlData += emp.lastDayOut.time;
                        tmpHtmlData += (emp.lastDayOut.flag) ? ((emp.lastDayOut.h >= outH) ? ' (P)' : ' (L)') : ' (A)';
                        tmpHtmlData += '</td>';
                        tmpHtmlData += '<td align="center">';
                        tmpHtmlData += emp.officeIn.time;
                        tmpHtmlData += (emp.officeIn.flag) ? (
                                (emp.officeIn.h < inH) ?
                                ' (P)' :
                                (
                                    (emp.officeIn.h == inH && emp.officeIn.m <= inM) ?
                                    ' (P)' :
                                    ' (L)'
                                )
                            ) :
                            ' (A)';
                        tmpHtmlData += '</td>';
                        tmpHtmlData += '<td align="center">';
                        tmpHtmlData += emp.officeOut.time;
                        tmpHtmlData += (emp.officeOut.flag) ? ((emp.officeOut.h >= outH) ? ' (P)' : ' (L)') : ' (A)';
                        tmpHtmlData += '</td>';
                        tmpHtmlData += '<td align="center">';
                        tmpHtmlData += empStatus;
                        tmpHtmlData += '</td>';
                        tmpHtmlData += '</tr>';
                        cb_emp();
                    }, function(err) {
                        total = present + absent + late;
                        totalPresent += present;
                        totalAbsent += absent;
                        totalLate += late;
                        grandTotal += total;
                        tmpHtmlData += '</table></div>';
                        var tmpHtmlHead = '<div id="pageBody">' +
                            '<table style="width:100%">' +
                            '<tr>' +
                            '<td style="border: 0px solid white;width:100px"><b>DEPARTMENT </b></td>' +
                            '<td style="border: 0px solid white;"> : ' +
                            dep.name.toUpperCase() +
                            '</td>' +
                            '<td style="border: 0px solid white;width:60px"><small>PRESENT:</small></td>' +
                            '<td style="border: 0px solid white;width:60px">' +
                            addLeadingZero(2, present) +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="border: 0px solid white;"></td>' +
                            '<td style="border: 0px solid white;"></td>' +
                            '<td style="border: 0px solid white;"><small>ABSENT:</small></td>' +
                            '<td style="border: 0px solid white;">' +
                            addLeadingZero(2, absent) +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="border: 0px solid white;"></td>' +
                            '<td style="border: 0px solid white;"></td>' +
                            '<td style="border: 0px solid white;"><small>LATE:</small></td>' +
                            '<td style="border: 0px solid white;">' +
                            addLeadingZero(2, late) +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="border: 0px solid white;"></td>' +
                            '<td style="border: 0px solid white;"></td>' +
                            '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                            '<small>TOTAL:</small>' +
                            '</td>' +
                            '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                            addLeadingZero(2, total) +
                            '</td>' +
                            '</tr>' +
                            '</table>';
                        r++;
                        totalOverView += '<tr>' +
                            '<td align="center">' +
                            r +
                            '</td>' +
                            '<td>' +
                            dep.name +
                            '</td>' +
                            '<td align="center">' +
                            addLeadingZero(2, present) +
                            '</td>' +
                            '<td align="center">' +
                            addLeadingZero(2, late) +
                            '</td>' +
                            '<td align="center">' +
                            addLeadingZero(2, (present + late)) +
                            '</td>' +
                            '<td align="center">' +
                            addLeadingZero(2, absent) +
                            '</td>' +
                            '<td align="center">' +
                            addLeadingZero(2, total) +
                            '</td>' +
                            '</tr>';
                        if (flag) {
                            htmlData += tmpHtmlHead;
                            htmlData += tmpHtmlData;
                            flag = 0;
                        }
                        cb_dep();
                    });
                });
            }, function(err) {
                totalOverView += '<tr>' +
                    '<td colspan=2><b>TOTAL</b></td>' +
                    '<td align="center"><b>' +
                    addLeadingZero(2, totalPresent) +
                    '</td></b>' +
                    '<td align="center"><b>' +
                    addLeadingZero(2, totalLate) +
                    '</td></b>' +
                    '<td align="center"><b>' +
                    addLeadingZero(2, (totalPresent + totalLate)) +
                    '</td></b>' +
                    '<td align="center"><b>' +
                    addLeadingZero(2, totalAbsent) +
                    '</td></b>' +
                    '<td align="center"><b>' +
                    addLeadingZero(2, grandTotal) +
                    '</td></b>' +
                    '</tr>' +
                    '</table>';

                var tFC = '<br /><br /><br />' +
                    '<table style="bottom:0;width:100%;border: 0px solid white;font-size: 12px;">' +
                    '<td style="border: 0px solid white;" align="center"><u>HR Admin / IT</u></td>' +
                    '<td style="border: 0px solid white;" align="center"><u>DGM / GM</u></td>' +
                    '<td style="border: 0px solid white;" align="center"><u>Managing Director / Director</u></td>' +
                    '</tr>' +
                    '</table>';

                htmlData += totalOverView + tFC;
                htmlData += '</body></html>';
                var options = {
                    format: 'Letter',
                    header: {
                        height: "27mm",
                        contents: headerContents() +
                            '<h4 style="' +
                            'line-height: 0;' +
                            '">DAILY ATTENDANCE REPORT</h4>' +
                            '<h6 style="line-height: 0;">' +
                            ms.getDate() +
                            '<sup>' +
                            dayPower[ms.getDate()] +
                            '</sup> ' +
                            monthCapitalNames[ms.getMonth()] + ', ' +
                            ms.getUTCFullYear() +
                            '</h6>'
                    },
                    footer: {
                        height: "15mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + values.file_name + '.pdf', function(err, res) {
                    if (err) return console.log(err);
                    // tmpStoreData.htmlData = htmlData;
                    // tmpStoreData.createDate = new Date();
                    socket.emit("DownloadDailyAttendanceReportPDF", 'success', totalOverView);
                });
            });
        });
    });

    socket.on('CreateDailyAttendancePDF', function(site_url, sd) {
        var ms = new Date(sd);
        var file_name = ms.getDate() + '_' + monthNames[ms.getMonth()] + '_' + ms.getUTCFullYear() + '_Daily_Report';
        var htmlData =
            '<!DOCTYPE html>' +
            '<html>' +
            '<body>' +
            dailyReportHead();
        list.department_list(db, function(depList) {
            async.each(depList, function(dep, cb_dep) {
                list.daily_report(db, dep.id, ms, function(dailyReport) {
                    var storeData = dailyReport;
                    var l = storeData.length;
                    htmlData += '<div id="pageBody">' +
                        '<table style="width:100%">' +
                        '<tr>' +
                        '<td style="border: 0px solid white;"><b>DEPARTMENT NAME:</b> ' +
                        dep.name.toUpperCase() +
                        '</td>' +
                        '<td style="border: 0px solid white;"><small>PRESENT:</small></td>' +
                        '<td style="border: 0px solid white;">' +
                        addLeadingZero(2, storeData[storeData.length - 1].present) +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="border: 0px solid white;"></td>' +
                        '<td style="border: 0px solid white;"><small>ABSENT:</small></td>' +
                        '<td style="border: 0px solid white;">' +
                        addLeadingZero(2, storeData[storeData.length - 1].absent) +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="border: 0px solid white;"></td>' +
                        '<td style="border: 0px solid white;"><small>LATE:</small></td>' +
                        '<td style="border: 0px solid white;">' +
                        addLeadingZero(2, storeData[storeData.length - 1].late) +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="border: 0px solid white;"></td>' +
                        '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                        '<small>TOTAL:</small>' +
                        '</td>' +
                        '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                        addLeadingZero(2, storeData[storeData.length - 1].total) +
                        '</td>' +
                        '</tr>' +
                        '</table>' +
                        '<table style="width:100%">' +
                        '<tr>' +
                        '<th>EMPLOYEE ID</th>' +
                        '<th>EMPLOYEE NAME</th>' +
                        '<th>IN TIME</th>' +
                        '<th>OUT TIME</th>' +
                        '<th>STATUS</th>' +
                        '</tr>';
                    for (var j = 0; j < storeData.length; j++) {
                        htmlData += '<tr>';
                        htmlData += '<td align="center">';
                        htmlData += 'JCLFFL';
                        htmlData += addLeadingZero(4, parseInt(storeData[j].id));
                        htmlData += '</td>';
                        htmlData += '<td align="left">';
                        htmlData += (storeData[j].first_name) ? ((storeData[j].first_name != '') ? storeData[j].first_name : '') : '';
                        htmlData += (storeData[j].last_name) ? ((storeData[j].last_name != '') ? ' ' + storeData[j].last_name : '') : '';
                        htmlData += '</td>';
                        htmlData += '<td align="center">';
                        htmlData += storeData[j].in_time;
                        htmlData += '</td>';
                        htmlData += '<td align="center">';
                        htmlData += storeData[j].out_time;
                        htmlData += '</td>';
                        htmlData += '<td align="center">';
                        htmlData += storeData[j].attendance;
                        htmlData += '</td>';
                        htmlData += '</tr>';
                    };
                    htmlData += '</table></div>';
                    cb_dep();
                });
            }, function(err) {
                htmlData += '</body></html>';
                var pt = new Date();
                var options = {
                    format: 'Letter',
                    header: {
                        height: "27mm",
                        contents: headerContents() +
                            '<h4 style="' +
                            'line-height: 0;' +
                            '">DAILY ATTENDANCE REPORT</h4>' +
                            '<h6 style="line-height: 0;">' +
                            ms.getDate() +
                            '<sup>' +
                            dayPower[ms.getDate()] +
                            '</sup> ' +
                            monthCapitalNames[ms.getMonth()] + ', ' +
                            ms.getUTCFullYear() +
                            '</h6>'
                    },
                    footer: {
                        height: "15mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                    if (err) return console.log(err);
                    socket.emit("CreateDailyAttendancePDF", 'success');
                });
            });
        })
    });

    socket.on('SendMailCreateDailyAttendancePDF', function(site_url, sd) {
        var ms = new Date(sd);
        var file_name = ms.getDate() + '_' + monthNames[ms.getMonth()] + '_' + ms.getUTCFullYear() + '_Daily_Report';
        var htmlData =
            '<!DOCTYPE html>' +
            '<html>' +
            '<body>' +
            dailyReportHead();
        list.department_list(db, function(depList) {
            async.each(depList, function(dep, cb_dep) {
                list.daily_report(db, dep.id, ms, function(dailyReport) {
                    var storeData = dailyReport;
                    var l = storeData.length;
                    htmlData += '<div id="pageBody">' +
                        '<table style="width:100%">' +
                        '<tr>' +
                        '<td style="border: 0px solid white;"><b>DEPARTMENT NAME:</b> ' +
                        dep.name.toUpperCase() +
                        '</td>' +
                        '<td style="border: 0px solid white;"><small>PRESENT:</small></td>' +
                        '<td style="border: 0px solid white;">' +
                        addLeadingZero(2, storeData[storeData.length - 1].present) +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="border: 0px solid white;"></td>' +
                        '<td style="border: 0px solid white;"><small>ABSENT:</small></td>' +
                        '<td style="border: 0px solid white;">' +
                        addLeadingZero(2, storeData[storeData.length - 1].absent) +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="border: 0px solid white;"></td>' +
                        '<td style="border: 0px solid white;"><small>LATE:</small></td>' +
                        '<td style="border: 0px solid white;">' +
                        addLeadingZero(2, storeData[storeData.length - 1].late) +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="border: 0px solid white;"></td>' +
                        '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                        '<small>TOTAL:</small>' +
                        '</td>' +
                        '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                        addLeadingZero(2, storeData[storeData.length - 1].total) +
                        '</td>' +
                        '</tr>' +
                        '</table>' +
                        '<table style="width:100%">' +
                        '<tr>' +
                        '<th>EMPLOYEE ID</th>' +
                        '<th>EMPLOYEE NAME</th>' +
                        '<th>IN TIME</th>' +
                        '<th>OUT TIME</th>' +
                        '<th>STATUS</th>' +
                        '</tr>';
                    for (var j = 0; j < storeData.length; j++) {
                        htmlData += '<tr>';
                        htmlData += '<td align="center">';
                        htmlData += 'JCLFFL';
                        htmlData += addLeadingZero(4, parseInt(storeData[j].id));
                        htmlData += '</td>';
                        htmlData += '<td align="left">';
                        htmlData += (storeData[j].first_name) ? ((storeData[j].first_name != '') ? storeData[j].first_name : '') : '';
                        htmlData += (storeData[j].last_name) ? ((storeData[j].last_name != '') ? ' ' + storeData[j].last_name : '') : '';
                        htmlData += '</td>';
                        htmlData += '<td align="center">';
                        htmlData += storeData[j].in_time;
                        htmlData += '</td>';
                        htmlData += '<td align="center">';
                        htmlData += storeData[j].out_time;
                        htmlData += '</td>';
                        htmlData += '<td align="center">';
                        htmlData += storeData[j].attendance;
                        htmlData += '</td>';
                        htmlData += '</tr>';
                    };
                    htmlData += '</table></div>';
                    cb_dep();
                });
            }, function(err) {
                htmlData += '</body></html>';
                var pt = new Date();
                var options = {
                    format: 'Letter',
                    header: {
                        height: "27mm",
                        contents: headerContents() +
                            '<h4 style="' +
                            'line-height: 0;' +
                            '">DAILY ATTENDANCE REPORT</h4>' +
                            '<h6 style="line-height: 0;">' +
                            ms.getDate() +
                            '<sup>' +
                            dayPower[ms.getDate()] +
                            '</sup> ' +
                            monthCapitalNames[ms.getMonth()] + ', ' +
                            ms.getUTCFullYear() +
                            '</h6>'
                    },
                    footer: {
                        height: "15mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                    if (err) return console.log(err);
                    socket.emit("SendMailCreateDailyAttendancePDF", 'success');
                });
            });
        })
    });

    socket.on('DownloadMonthAttendance', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var dateList = dateListFromMonth(d);
        var headerRowHtml = '<tr>' +
            '<th width="60px">EMP. ID</th>' +
            '<th width="260px">EMP. NAME</th>' +
            '<th>P</th>' +
            '<th>A</th>' +
            '<th>L</th>' +
            '<th>W</th>' +
            '<th>H</th>' +
            '<th>IL</th>' +
            '<th>OL</th>' +
            '<th>AL</th>' +
            '<th>LA</th>' +
            '<th>PD</th>' +
            '<th>AD</th>' +
            '<th>TD</th>';
        for (var j = 0; j < dateList.length; j++) {
            headerRowHtml += '<th width="65px"><small><small>' + mthCPNames[d.getMonth()] + ' <big><big>' + dateList[j] + '</big></big></small></small></th>';
        };
        headerRowHtml += '</tr>';
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>.' +
            monthlyReportHead();
        getC.getDepartment(db, QUERY, function(depList) {
            async.each(depList, function(dep, cb_dep) {
                var empSearch = {};
                empSearch.department = dep.id;
                // empSearch.status = QUERY.status;
                empSearch.date = d;
                getC.getEmployeeMonthSummary(db, empSearch, function(empData) {
                    htmlData += '<div><table style="width:100%">' +
                        '<tr>' +
                        '<th align="left">' +
                        '<h3>' +
                        dep.name.toUpperCase() +
                        '</h3>' +
                        '</th>' +
                        '</tr>' +
                        '</table>' +
                        '<table style="width:100%">' +
                        headerRowHtml;
                    async.each(empData, function(emp, cb_emp) {
                        // htmlData+='<tr><td>Hello</td></tr>';
                        htmlData += '<tr>' +
                            '<td><b>' + emp.fp + '</b></td>' +
                            '<td><b>' + emp.name + '</b></td>' +
                            '<td align="center">' + emp.present + '</b></td>' +
                            '<td align="center">' + emp.absent + '</td>' +
                            '<td align="center">' + emp.late + '</td>' +
                            '<td align="center">' + emp.weekend + '</td>' +
                            '<td align="center">' + emp.holiday + '</td>' +
                            '<td align="center">' + emp.inLate + '</td>' +
                            '<td align="center">' + emp.outLate + '</td>' +
                            '<td align="center">' + emp.absentForLate + '</td>' +
                            '<td align="center">' + emp.leave + '</td>' +
                            '<td align="center"><b>' + emp.totalPayableDays + '</b></td>' +
                            '<td align="center">' + emp.totalDeductDays + '</td>' +
                            '<td align="center">' + emp.totalDays + '</td>';
                        for (var j = 0; j < dateList.length; j++) {
                            var Y = d.getFullYear();
                            var M = d.getMonth() + 1;
                            var D = dateList[j];
                            var YMD = Y + '-' + M + '-' + D;
                            htmlData += '<td align="center"><b>' + emp.attendance[YMD] + '</b></td>';
                        };
                        htmlData += '</tr>';
                        cb_emp();
                    }, function(err) {
                        htmlData += '</table><br /></div><br />';
                        cb_dep();
                    });
                });
            }, function(err) {
                htmlData += '</body></html>';
                var options = {
                    format: 'Letter',
                    header: {
                        height: "45mm",
                        contents: '<div style="' +
                            'color: #444;' +
                            'font-size: 15px;' +
                            'position: fixed;' +
                            'top: 15;' +
                            'right: 15;' +
                            '">' +
                            '<span>PRINT TIME: ' +
                            new Date() +
                            '</span>' +
                            '</div>' +
                            '<br />' +
                            '<h1><b>' + factoryName + '</b></h1>' +
                            '<h2><b>Monthly Attendance Report</b></h2>' +
                            '<h4><b>' +
                            monthCapitalNames[d.getMonth()] + ', ' +
                            d.getFullYear() +
                            '</b></h4>'
                    },
                    footer: {
                        height: "25mm",
                        contents: '<div style="' +
                            'color: #444;' +
                            'font-size: 15px;' +
                            'position: fixed;' +
                            'bottom: 15;' +
                            'right: 15;' +
                            '">' +
                            '<span>PAGE {{page}}</span>' +
                            ' OUT OF ' +
                            '<span>{{pages}}</span>' +
                            '</div>' +
                            '<br /><br />' +
                            '<small>' +
                            'N.B.: <i>P = PRESENT, A = ABSENT, L = LATE, W = WEEKEND, ' +
                            'H = HOLIDAY, TD = TOTAL DAYS, AL = ABSENT DUE TO LATE, ALL = LATE LEAVE ON ABSENT DAY, ' +
                            'LL = LATE LEAVE/ SHORT LEAVE, CL = CASUAL LEAVE, SL = SICK LEAVE, EL = EARN LEAVE, ' +
                            'LA = LEAVE ACCEPTED, PD = PRESENT DAYS, AD = ABSENT DAYS</i>' +
                            '</small>'
                    },
                    width: '7120px',
                    height: '4320px'
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    if (err) return console.log(err);
                    socket.emit("DownloadMonthAttendance", 'success');
                });
            });
        });
    });

    socket.on('DownloadMonthAttendanceV2', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        d.setDate(10);
        var dateList = dateListFromMonth(d);
        var rangeMArray = rangeMArrayFunc(d);
        var headerRowHtml = '<tr>' +
            '<th width="60px">EMP. ID</th>' +
            '<th width="260px">EMP. NAME</th>' +
            '<th>P</th>' +
            '<th>A</th>' +
            '<th>L</th>' +
            '<th>W</th>' +
            '<th>H</th>' +
            '<th>IL</th>' +
            '<th>OL</th>' +
            '<th>AL</th>' +
            '<th>LA</th>' +
            '<th>PD</th>' +
            '<th>AD</th>' +
            '<th>TD</th>';
        for (var j = 0; j < rangeMArray.length; j++) {
            var raD = new Date(rangeMArray[j])
            headerRowHtml += '<th width="65px"><small><small>' + mthCPNames[raD.getMonth()] + ' <big><big>' + raD.getDate() + '</big></big></small></small></th>';
        };
        headerRowHtml += '</tr>';
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>.' +
            monthlyReportHead();
        getC.getDepartment(db, QUERY, function(depList) {
            async.each(depList, function(dep, cb_dep) {
                var empSearch = {};
                empSearch.department = dep.id;
                // empSearch.status = QUERY.status;
                empSearch.date = d;
                getC.getEmployeeMonthSummaryV2(db, empSearch, function(empData) {
                    htmlData += '<div><table style="width:100%">' +
                        '<tr>' +
                        '<th align="left">' +
                        '<h3>' +
                        dep.name.toUpperCase() +
                        '</h3>' +
                        '</th>' +
                        '</tr>' +
                        '</table>' +
                        '<table style="width:100%">' +
                        headerRowHtml;
                    async.each(empData, function(emp, cb_emp) {
                        // htmlData+='<tr><td>Hello</td></tr>';
                        htmlData += '<tr>' +
                            '<td><b>' + emp.fp + '</b></td>' +
                            '<td><b>' + emp.name + '</b></td>' +
                            '<td align="center">' + emp.present + '</b></td>' +
                            '<td align="center">' + emp.absent + '</td>' +
                            '<td align="center">' + emp.late + '</td>' +
                            '<td align="center">' + emp.weekend + '</td>' +
                            '<td align="center">' + emp.holiday + '</td>' +
                            '<td align="center">' + emp.inLate + '</td>' +
                            '<td align="center">' + emp.outLate + '</td>' +
                            '<td align="center">' + emp.absentForLate + '</td>' +
                            '<td align="center">' + emp.leave + '</td>' +
                            '<td align="center"><b>' + emp.totalPayableDays + '</b></td>' +
                            '<td align="center">' + emp.totalDeductDays + '</td>' +
                            '<td align="center">' + emp.totalDays + '</td>';
                        for (var j = 0; j < rangeMArray.length; j++) {
                            var YMD = rangeMArray[j];
                            var dr = new Date(YMD);
                            var Y = dr.getFullYear();
                            var M = dr.getMonth() + 1;
                            var D = dr.getDate();
                            htmlData += '<td align="center"><b>' + emp.attendance[YMD] + '</b></td>';
                        };
                        htmlData += '</tr>';
                        cb_emp();
                    }, function(err) {
                        htmlData += '</table><br /></div><br />';
                        cb_dep();
                    });
                });
            }, function(err) {
                htmlData += '</body></html>';
                var options = {
                    format: 'Letter',
                    header: {
                        height: "45mm",
                        contents: '<div style="' +
                            'color: #444;' +
                            'font-size: 15px;' +
                            'position: fixed;' +
                            'top: 15;' +
                            'right: 15;' +
                            '">' +
                            '<span>PRINT TIME: ' +
                            new Date() +
                            '</span>' +
                            '</div>' +
                            '<br />' +
                            '<h1><b>' + factoryName + '</b></h1>' +
                            '<h2><b>Monthly Attendance Report</b></h2>' +
                            '<h4><b>' +
                            monthCapitalNames[d.getMonth()] + ', ' +
                            d.getFullYear() +
                            '</b></h4>'
                    },
                    footer: {
                        height: "25mm",
                        contents: '<div style="' +
                            'color: #444;' +
                            'font-size: 15px;' +
                            'position: fixed;' +
                            'bottom: 15;' +
                            'right: 15;' +
                            '">' +
                            '<span>PAGE {{page}}</span>' +
                            ' OUT OF ' +
                            '<span>{{pages}}</span>' +
                            '</div>' +
                            '<br /><br />' +
                            '<small>' +
                            'N.B.: <i>P = PRESENT, A = ABSENT, L = LATE, W = WEEKEND, ' +
                            'H = HOLIDAY, TD = TOTAL DAYS, AL = ABSENT DUE TO LATE, ALL = LATE LEAVE ON ABSENT DAY, ' +
                            'LL = LATE LEAVE/ SHORT LEAVE, CL = CASUAL LEAVE, SL = SICK LEAVE, EL = EARN LEAVE, ' +
                            'LA = LEAVE ACCEPTED, PD = PRESENT DAYS, AD = ABSENT DAYS</i>' +
                            '</small>'
                    },
                    width: '7120px',
                    height: '4320px'
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    if (err) return console.log(err);
                    socket.emit("DownloadMonthAttendanceV2", 'success');
                });
            });
        });
    });


    socket.on('CreateMonthlyReportPDFOLD', function(site_url, sd) {
        var ms = new Date(sd);
        var dataValues = {};
        dataValues.month = ms;
        var holiday = 0;
        var holiday_array = [];
        var adjustment = [];
        var file_name = monthNames[ms.getMonth()] + '_' + ms.getUTCFullYear() + '_Monthly_Report';
        var htmlData =
            '<!DOCTYPE html>' +
            '<html>' +
            '<body>' +
            monthlyReportHead();
        list.holiday_list(db, function(holidayList) {
            async.each(holidayList, function(holiD, cb_holiD) {
                if (holidayList.length > 0) {
                    if (holiD.date.getFullYear() == ms.getFullYear()) {
                        if (holiD.date.getMonth() == ms.getMonth()) {
                            holiday_array.push(holiD.date.getDate());
                        }
                    }
                }
                cb_holiD();
            }, function(err) {
                holiday = holiday_array.length;
                list.adjustment_list(db, function(adjustList) {
                    async.each(adjustList, function(adjD, cb_adjD) {
                        if (adjustList.length > 0) {
                            if (adjD.date.getFullYear() == ms.getFullYear()) {
                                if (adjD.date.getMonth() == ms.getMonth()) {
                                    adjustment.push(adjD.date.getDate());
                                }
                            }
                        }
                        cb_adjD();
                    }, function(err) {
                        list.department_list(db, function(depList) {
                            dataValues.holiday = holiday;
                            dataValues.holiday_array = holiday_array;
                            dataValues.adjustment = adjustment;
                            async.each(depList, function(dep, cb_dep) {
                                list.attendance_report(db, dep.id, dataValues, function(monthlyReport) {
                                    console.log(monthlyReport);
                                    var storeData = monthlyReport;
                                    var l = storeData.length;
                                    if (l > 0) {
                                        htmlData += '<div>' +
                                            '<table style="width:100%">' +
                                            '<tr>' +
                                            '<th align="left">' +
                                            '<h3>' +
                                            dep.name.toUpperCase() +
                                            '</h3>' +
                                            '</th>' +
                                            '</tr>' +
                                            '</table>' +
                                            '<table style="width:100%">' +
                                            '<tr>' +
                                            '<th>EMP. ID</th>' +
                                            '<th width="260px">EMP. NAME</th>';
                                        htmlData += '<th>P</th>' +
                                            '<th>A</th>' +
                                            '<th>L</th>' +
                                            '<th>W</th>' +
                                            '<th>H</th>' +
                                            '<th>AL</th>' +
                                            '<th>ALL</th>' +
                                            '<th>LL</th>' +
                                            '<th>LA</th>' +
                                            '<th>PD</th>' +
                                            '<th>AD</th>' +
                                            '<th>TD</th>';
                                        for (var j = 1; j < storeData[0].day_length + 1; j++) {
                                            htmlData += '<th width="65px"><small><small>' + mthCPNames[ms.getMonth()] + ' ' + j + '</small></small></th>';
                                        };
                                        htmlData += '</tr>';
                                        for (var j = 0; j < storeData.length; j++) {
                                            htmlData += '<tr>';
                                            htmlData += '<td align="left" style="width:100px"><b>';
                                            htmlData += 'JCLFFL';
                                            htmlData += addLeadingZero(4, parseInt(storeData[j].id));
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="left"><b>';
                                            htmlData += (storeData[j].first_name) ? ((storeData[j].first_name != '') ? storeData[j].first_name : '') : '';
                                            htmlData += (storeData[j].last_name) ? ((storeData[j].last_name != '') ? ' ' + storeData[j].last_name : '') : '';
                                            htmlData += '</b></td>';
                                            var tmp_TD = parseInt(storeData[j].day_length);
                                            var tmp_P = parseInt(storeData[j].present);
                                            var tmp_A = parseInt(storeData[j].absent);
                                            var tmp_L = parseInt(storeData[j].late);
                                            var tmp_W = parseInt(storeData[j].weekend);
                                            var tmp_H = parseInt(storeData[j].holidays);
                                            var tmp_LA = parseInt(storeData[j].leave);
                                            var tmp_LL = parseInt(storeData[j].late_leave);
                                            var tmp_ALL = parseInt(storeData[j].absent_late_leave);
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_P.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_A.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_L.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_W.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_H.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            var tmp_AL = parseInt(tmp_L / 3);
                                            htmlData += addLeadingZero(2, tmp_AL.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_ALL.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_LL.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_LA.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            var tmp_LLP = parseInt(tmp_L - tmp_LL);
                                            var tmp_NAL = parseInt(tmp_LLP / 3);
                                            var tmp_PD = parseInt(tmp_P + (tmp_LLP - tmp_NAL) + tmp_LL + tmp_LA + tmp_W + tmp_H + tmp_ALL);
                                            htmlData += addLeadingZero(2, tmp_PD.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            var tmp_AD = parseInt(tmp_TD - tmp_PD);
                                            htmlData += addLeadingZero(2, tmp_AD.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_TD.toString());
                                            htmlData += '</b></td>';
                                            for (var k = 1; k < storeData[0].day_length + 1; k++) {
                                                var obj_res = Object.keys(storeData[j])[18 + k];
                                                htmlData += '<td align="center"><small>' + storeData[j].days['day_' + k] + '</small></td>';
                                            };
                                            htmlData += '</tr>';
                                        };
                                        htmlData += '</table></div><br /><br />';
                                    }
                                    cb_dep();
                                });
                            }, function(err) {
                                htmlData += '</body></html>';
                                var pt = new Date();
                                var options = {
                                    format: 'Letter',
                                    header: {
                                        height: "45mm",
                                        contents: '<div style="' +
                                            'color: #444;' +
                                            'font-size: 15px;' +
                                            'position: fixed;' +
                                            'top: 15;' +
                                            'right: 15;' +
                                            '">' +
                                            '<span>PRINT TIME: ' +
                                            new Date() +
                                            '</span>' +
                                            '</div>' +
                                            '<br />' +
                                            '<h1><b>Fashion Flash Limited</b></h1>' +
                                            '<h2><b>Monthly Attendance Report</b></h2>' +
                                            '<h4><b>' +
                                            monthCapitalNames[ms.getMonth()] + ', ' +
                                            ms.getFullYear() +
                                            '</b></h4>'
                                    },
                                    footer: {
                                        height: "25mm",
                                        contents: '<div style="' +
                                            'color: #444;' +
                                            'font-size: 15px;' +
                                            'position: fixed;' +
                                            'bottom: 15;' +
                                            'right: 15;' +
                                            '">' +
                                            '<span>PAGE {{page}}</span>' +
                                            ' OUT OF ' +
                                            '<span>{{pages}}</span>' +
                                            '</div>' +
                                            '<br /><br />' +
                                            '<small>' +
                                            'N.B.: <i>P = PRESENT, A = ABSENT, L = LATE, W = WEEKEND, ' +
                                            'H = HOLIDAY, TD = TOTAL DAYS, AL = ABSENT DUE TO LATE, ALL = LATE LEAVE ON ABSENT DAY, ' +
                                            'LL = LATE LEAVE/ SHORT LEAVE, CL = CASUAL LEAVE, SL = SICK LEAVE, EL = EARN LEAVE, ' +
                                            'LA = LEAVE ACCEPTED, PD = PRESENT DAYS, AD = ABSENT DAYS</i>' +
                                            '</small>'
                                    },
                                    width: '7120px',
                                    height: '4320px'
                                };
                                pdf.create(htmlData, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                                    if (err) return console.log(err);
                                    socket.emit("CreateMonthlyReportPDFOLD", 'success');
                                });
                            });
                        })
                    })

                })

            });
        })

    });

    socket.on('CreateMonthlyReportPDF', function(site_url, sd) {
        var ms = new Date(sd);
        var dateList = dateListFromMonth(ms);
        var file_name = monthNames[ms.getMonth()] + '_' + ms.getUTCFullYear() + '_Monthly_Report';
        var htmlData =
            '<!DOCTYPE html>' +
            '<html>' +
            '<body>.' +
            monthlyReportHead();
        list.salary_statement_report(db, ms, function(depList) {
            async.each(depList, function(dep, cb_dep) {
                htmlData += '<div>' +
                    '<table style="width:100%">' +
                    '<tr>' +
                    '<th align="left">' +
                    '<h3>' +
                    dep.name.toUpperCase() +
                    '</h3>' +
                    '</th>' +
                    '</tr>' +
                    '</table>' +
                    '<table style="width:100%">' +
                    '<tr>' +
                    '<th width="60px">EMP. ID</th>' +
                    '<th width="260px">EMP. NAME</th>';
                htmlData += '<th>P</th>' +
                    '<th>A</th>' +
                    '<th>L</th>' +
                    '<th>W</th>' +
                    '<th>H</th>' +
                    '<th>LA</th>' +
                    '<th>PD</th>' +
                    '<th>AD</th>' +
                    '<th>TD</th>';
                for (var j = 0; j < dateList.length; j++) {
                    htmlData += '<th width="65px"><small><small>' + mthCPNames[ms.getMonth()] + ' <big><big>' + dateList[j] + '</big></big></small></small></th>';
                };
                htmlData += '</tr>';
                async.each(dep.employee, function(emp, cb_emp) {
                    htmlData += '<tr>' +
                        '<td>' + 'JCLFFL<b>' + addLeadingZero(4, parseInt(emp.fp)) + '</b></td>' +
                        '<td><b>' + emp.name + '</td>' +
                        '<td align="center">' + (emp.oDays - emp.Leave) + '</b></td>' +
                        '<td align="center">' + emp.aOnly + '</td>' +
                        '<td align="center">' + emp.lDays + '</td>' +
                        '<td align="center">' + emp.wDays + '</td>' +
                        '<td align="center">' + emp.hDays + '</td>' +
                        '<td align="center">' + emp.Leave + '</td>' +
                        '<td align="center"><b>' + emp.pDays + '</b></td>' +
                        '<td align="center">' + emp.aDays + '</td>' +
                        '<td align="center">' + emp.tDays + '</td>';
                    for (var j = 0; j < dateList.length; j++) {
                        htmlData += '<td align="center"><b>' + emp.attData['C' + dateList[j]] + '</b></td>';
                    };
                    htmlData += '</tr>';

                    cb_emp();
                }, function(err) {
                    htmlData += '</table></div><br /><br />';
                    cb_dep();
                })
            }, function(err) {
                htmlData += '</body></html>';
                var pt = new Date();
                var options = {
                    format: 'Letter',
                    header: {
                        height: "45mm",
                        contents: '<div style="' +
                            'color: #444;' +
                            'font-size: 15px;' +
                            'position: fixed;' +
                            'top: 15;' +
                            'right: 15;' +
                            '">' +
                            '<span>PRINT TIME: ' +
                            new Date() +
                            '</span>' +
                            '</div>' +
                            '<br />' +
                            '<h1><b>Fashion Flash Limited</b></h1>' +
                            '<h2><b>Monthly Attendance Report</b></h2>' +
                            '<h4><b>' +
                            monthCapitalNames[ms.getMonth()] + ', ' +
                            ms.getFullYear() +
                            '</b></h4>'
                    },
                    footer: {
                        height: "25mm",
                        contents: '<div style="' +
                            'color: #444;' +
                            'font-size: 15px;' +
                            'position: fixed;' +
                            'bottom: 15;' +
                            'right: 15;' +
                            '">' +
                            '<span>PAGE {{page}}</span>' +
                            ' OUT OF ' +
                            '<span>{{pages}}</span>' +
                            '</div>' +
                            '<br /><br />' +
                            '<small>' +
                            'N.B.: <i>P = PRESENT, A = ABSENT, L = LATE, W = WEEKEND, ' +
                            'H = HOLIDAY, TD = TOTAL DAYS, AL = ABSENT DUE TO LATE, ALL = LATE LEAVE ON ABSENT DAY, ' +
                            'LL = LATE LEAVE/ SHORT LEAVE, CL = CASUAL LEAVE, SL = SICK LEAVE, EL = EARN LEAVE, ' +
                            'LA = LEAVE ACCEPTED, PD = PRESENT DAYS, AD = ABSENT DAYS</i>' +
                            '</small>'
                    },
                    width: '7120px',
                    height: '4320px'
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                    if (err) return console.log(err);
                    socket.emit("CreateMonthlyReportPDF", 'success');
                });
            });
        });
    });

    socket.on('SendIndividualDayAttendance', function(data) {
        SendIndividualDayAttendance(db, data, function(m) {
            socket.emit("SendIndividualDayAttendance", m);
        });
    });

    socket.on('SendDailyAttendanceReport', function(values, vHTML) {
        if (values.mail) {
            SendDailyAttendanceReport(db, values, vHTML, function(m) {
                socket.emit("SendDailyAttendanceReport", m);
            });
        } else {
            socket.emit("SendDailyAttendanceReport", 'error');
        }
    });

    socket.on('DestroyAttendance', function(data) {
        console.log("STEP DestroyAttendance: " + JSON.stringify(data, null, 4));
        DestroyAttendance(db, data, function(data) {
            socket.emit("DestroyAttendance", data)
        });
    });

    socket.on('CreateAttendance', function(data) {
        console.log("STEP CreateAttendance: " + JSON.stringify(data, null, 4));
        CreateAttendance(db, data, function(data) {
            socket.emit("CreateAttendance", data)
        });
    });

    socket.on('CreateEmployeeManualPunch', function(data) {
        console.log("STEP CreateEmployeeManualPunch: " + JSON.stringify(data, null, 4));
        CreateEmployeeManualPunch(db, data, function(data) {
            socket.emit("CreateEmployeeManualPunch", data)
        });
    });

}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;