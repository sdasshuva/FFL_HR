module.exports = function() {};


function weekendCount(d) {
    var fdate = new Date(d.getFullYear(), d.getMonth(), 01, 00, 00, 00, 00);
    var count = 0;
    while (d.getMonth() == fdate.getMonth()) {
        if (fdate.getDay() == 5) {
            count++;
        }
        fdate.setDate(fdate.getDate() + 1)
    }
    return count;
}

function weekendList(d) {
    var fdate = new Date(d.getFullYear(), d.getMonth(), 01, 00, 00, 00, 00);
    var returnArray = [];
    while (d.getMonth() == fdate.getMonth()) {
        if (fdate.getDay() == 5) {
            returnArray.push(fdate.getDate());
        }
        fdate.setDate(fdate.getDate() + 1)
    }
    return returnArray;
}

function employee_list(db, DATA, callback) {
    var d = new Date();
    var f = d.getFullYear() + '-' + 00 + '-' + 01;
    var t = (d.getFullYear() + 1) + '-' + 00 + '-' + 01;
    var returnData = [];
    var param = {};
    if (DATA.employee)
        param.id = DATA.employee;
    else if (DATA.department)
        param.department = DATA.department;
    else if (DATA.status)
        param.status = (DATA.status == 2) ? 0 : 1;
    else
        param.status = 0;
    db.employee.findAll({
        where: param,
        include: [{
            model: db.user,
            attributes: [
                'id', 'card_no', 'finger_print_id',
                'first_name', 'last_name', 'email', 'access_level'
            ]
        }, {
            model: db.designation,
            attributes: ['name']
        }, {
            model: db.department,
            attributes: ['name']
        }, {
            model: db.working_place,
            attributes: ['name']
        }, {
            model: db.employee_type,
            attributes: ['name']
        }, {
            model: db.referer,
            attributes: ['name', 'address', 'contact_no']
        }, {
            model: db.religion,
            attributes: ['name']
        }, {
            model: db.blood_group,
            attributes: ['name']
        }, {
            model: db.duty_shift,
            attributes: ['name']
        }],
        order: [
            ['id', 'ASC']
        ]
    }).complete(function(err, employee_data) {
        async.each(employee_data, function(employee, cb_employee_data) {
            var emp = {};
            emp.employee = employee;
            var cl = 0;
            var sl = 0;
            db.leave.findAll({
                where: {
                    employee: employee.id,
                    date: {
                        between: [f, t]
                    },
                },
                include: [{
                    model: db.leave_type,
                    attributes: ['id', 'name']
                }, ]
            }).complete(function(err, leaves) {
                if (leaves.length > 0) {
                    for (var i = 0; i < leaves.length; i++) {
                        if (leaves[i].leave_type == 1) {
                            sl += 1;
                        } else if (leaves[i].leave_type == 2) {
                            cl += 1;
                        }
                    };
                }
                emp.sl = sl;
                emp.cl = cl;
                returnData.push(emp)
                cb_employee_data();
            })
        }, function(err) {
            if (err) {
                throw err;
            }
            callback(returnData);
        });
    })
}


function getEmployee(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.user)
        SEARCH.user = QUERY.user
    if (QUERY.designation)
        SEARCH.designation = QUERY.designation
    if (QUERY.department)
        SEARCH.department = QUERY.department
    if (QUERY.date_of_birth)
        SEARCH.date_of_birth = QUERY.date_of_birth
    if (QUERY.date_of_join)
        SEARCH.date_of_join = QUERY.date_of_join
    if (QUERY.date_of_release)
        SEARCH.date_of_release = QUERY.date_of_release
    if (QUERY.referer)
        SEARCH.referer = QUERY.referer
    if (QUERY.national_id)
        SEARCH.national_id = QUERY.national_id
    if (QUERY.religion)
        SEARCH.religion = QUERY.religion
    if (QUERY.marital_status)
        SEARCH.marital_status = QUERY.marital_status
    if (QUERY.contact_no)
        SEARCH.contact_no = QUERY.contact_no
    if (QUERY.blood_group)
        SEARCH.blood_group = QUERY.blood_group
    if (QUERY.duty_shift)
        SEARCH.duty_shift = QUERY.duty_shift
        // if(QUERY.work_time)
        //   SEARCH.work_time = QUERY.work_time
    if (QUERY.payment_method)
        SEARCH.payment_method = QUERY.payment_method
    SEARCH.status = (QUERY.status) ? QUERY.status : 0;
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'user', 'photo', 'designation',
        'department', 'date_of_birth',
        'date_of_join', 'date_of_release', 'referer',
        'national_id', 'religion', 'marital_status', 'contact_no',
        'blood_group', 'remarks', 'duty_shift',
        'payment_method', 'status'
    ];
    findData.include = [{
        model: db.user,
        attributes: [
            'id', 'first_name', 'last_name'
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
    }];
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.employee.findAll(findData).complete(function(err, empData) {
        async.each(empData, function(emp, cb_emp) {
            var e = {};
            e.id = emp.id;
            e.name = (emp.userTable) ?
                ((emp.userTable.first_name) ?
                    ((emp.userTable.last_name) ?
                        emp.userTable.first_name.toUpperCase() + ' ' + emp.userTable.last_name.toUpperCase() :
                        emp.userTable.first_name.toUpperCase()) :
                    'NOT GIVEN') :
                'NOT GIVEN';
            e.designation = emp.designation;
            e.designationName = (emp.designationTable) ?
                (emp.designationTable.name.toUpperCase() ?
                    emp.designationTable.name.toUpperCase() :
                    'NOT GIVEN') :
                'NOT GIVEN';
            e.department = emp.department;
            e.departmentName = (emp.departmentTable) ?
                (emp.departmentTable.name.toUpperCase() ?
                    emp.departmentTable.name.toUpperCase() :
                    'NOT GIVEN') :
                'NOT GIVEN';
            e.workInTime = '09:30:00';
            e.workOutTime = '18:30:00';
            e.date_of_birth = (emp.date_of_birth) ? new Date(emp.date_of_birth) : new Date();
            e.date_of_join = (emp.date_of_join) ? new Date(emp.date_of_join) : new Date(emp.date_of_join);
            e.date_of_release = new Date(emp.date_of_release);
            e.payment_method = emp.payment_method;
            e.status = emp.status;
            e.statusName = (e.status == 1) ? 'DISAPPOINTED' : 'REGULAR';
            returnData.push(e)
            cb_emp();
        }, function(err) {
            if (err) {
                throw err;
            }
            callback(returnData);
        });
    })
}


function employee_user_list(db, UID, callback) {
    db.employee.findAll({
        where: {
            user: UID
        },
        include: [{
            model: db.user,
            attributes: [
                'id', 'card_no', 'finger_print_id',
                'first_name', 'last_name', 'email'
            ]
        }, {
            model: db.designation,
            attributes: ['name']
        }, {
            model: db.department,
            attributes: ['name']
        }, {
            model: db.working_place,
            attributes: ['name']
        }, {
            model: db.employee_type,
            attributes: ['name']
        }, {
            model: db.referer,
            attributes: ['name', 'address', 'contact_no']
        }, {
            model: db.religion,
            attributes: ['name']
        }, {
            model: db.blood_group,
            attributes: ['name']
        }, {
            model: db.duty_shift,
            attributes: ['name']
        }],
    }).complete(function(err, data) {
        callback(data);
    })
}

function employee_salary(db, callback)
} {
    var returnData = [];
    db.employee.findAll({
        where: {
            status: 0
        },
        include: [{
            model: db.user,
            attributes: [
                'first_name', 'last_name'
            ]
        }],
        attributes: ['id', 'payment_method'],
    }).complete(function(err, employee_data) {
        async.each(employee_data, function(employee, cb_employee_data) {
            var emp = {};
            emp.id = employee.id;
            emp.name = employee.userTable.first_name;
            emp.payment_method = employee.payment_method;
            emp.salary = 0;
            emp.approve_date = '00-00-0000';
            emp.account_no = '000-000-0000000';
            if (employee.userTable.last_name) {
                emp.name += ' ' + employee.userTable.last_name;
            }
            db.salary.findAll({
                where: {
                    employee: employee.id,
                },
            }).complete(function(err, salary) {
                async.each(salary, function(sal, cb_sal) {
                    emp.salary += sal.amount;
                    emp.approve_date = sal.approve_date;
                    cb_sal();
                }, function(err) {
                    db.bank_account.findAll({
                        where: {
                            employee: employee.id,
                        },
                        attributes: [
                            'id', 'branch_code', 'account_type', 'account_no'
                        ],
                        limit: 1,
                        order: [
                            ['created_at', 'DESC']
                        ]
                    }).complete(function(err, bank_account) {
                        var bank_account_s = JSON.stringify(bank_account);
                        var ba_data = JSON.parse(bank_account_s);
                        if (bank_account[0]) {
                            emp.account_no = addLeadingZero(3, ba_data[0].branch_code) +
                                '-' + addLeadingZero(3, ba_data[0].account_type) +
                                '-' + addLeadingZero(7, ba_data[0].account_no);
                        }
                        returnData.push(emp)
                        cb_employee_data();
                    })
                });
            })
        }, function(err) {
            callback(returnData);
        });
    })

    function getEmployeeDetails(db, QUERY, callback) {
        var returnData = [];
        var SEARCH = {};
        var findData = {};
        var SDate = new Date();
        if (QUERY.date)
            SDate = new Date(QUERY.date);
        if (QUERY.month)
            SDate = new Date(QUERY.month);
        if (QUERY.id)
            SEARCH.id = QUERY.id
        if (QUERY.user)
            SEARCH.user = QUERY.user
        if (QUERY.designation)
            SEARCH.designation = QUERY.designation
        if (QUERY.department)
            SEARCH.department = QUERY.department
        if (QUERY.date_of_birth)
            SEARCH.date_of_birth = QUERY.date_of_birth
        if (QUERY.date_of_join)
            SEARCH.date_of_join = QUERY.date_of_join
        if (QUERY.date_of_release)
            SEARCH.date_of_release = QUERY.date_of_release
        if (QUERY.referer)
            SEARCH.referer = QUERY.referer
        if (QUERY.national_id)
            SEARCH.national_id = QUERY.national_id
        if (QUERY.religion)
            SEARCH.religion = QUERY.religion
        if (QUERY.marital_status)
            SEARCH.marital_status = QUERY.marital_status
        if (QUERY.contact_no)
            SEARCH.contact_no = QUERY.contact_no
        if (QUERY.blood_group)
            SEARCH.blood_group = QUERY.blood_group
        if (QUERY.duty_shift)
            SEARCH.duty_shift = QUERY.duty_shift
            // if(QUERY.work_time)
            //   SEARCH.work_time = QUERY.work_time
        if (QUERY.payment_method)
            SEARCH.payment_method = QUERY.payment_method
        SEARCH.status = (QUERY.status) ? QUERY.status : 0;
        findData.where = SEARCH;
        findData.attributes = [
            'id', 'user', 'photo', 'designation',
            'department', 'date_of_birth',
            'date_of_join', 'date_of_release', 'referer',
            'national_id', 'religion', 'marital_status', 'contact_no',
            'blood_group', 'remarks', 'duty_shift',
            'payment_method', 'status'
        ];
        findData.include = [{
            model: db.user,
            attributes: [
                'id', 'first_name', 'last_name'
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
        }];
        var SORT = (QUERY.sort) ? QUERY.sort : 'id';
        var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
        findData.order = [
            [SORT, DIR]
        ];
        if (QUERY.start)
            findData.offset = QUERY.start;
        if (QUERY.limit)
            findData.limit = QUERY.limit;
        db.employee.findAll(findData).complete(function(err, empData) {
            async.each(empData, function(emp, cb_emp) {
                var e = {};
                e.id = emp.id;
                e.name = (emp.userTable) ?
                    ((emp.userTable.first_name) ?
                        ((emp.userTable.last_name) ?
                            emp.userTable.first_name.toUpperCase() + ' ' + emp.userTable.last_name.toUpperCase() :
                            emp.userTable.first_name.toUpperCase()) :
                        'NOT GIVEN') :
                    'NOT GIVEN';
                e.designation = emp.designation;
                e.designationName = (emp.designationTable) ?
                    (emp.designationTable.name.toUpperCase() ?
                        emp.designationTable.name.toUpperCase() :
                        'NOT GIVEN') :
                    'NOT GIVEN';
                e.department = emp.department;
                e.departmentName = (emp.departmentTable) ?
                    (emp.departmentTable.name.toUpperCase() ?
                        emp.departmentTable.name.toUpperCase() :
                        'NOT GIVEN') :
                    'NOT GIVEN';
                e.workInTime = '09:30:00';
                e.workOutTime = '18:30:00';
                e.date_of_birth = (emp.date_of_birth) ? new Date(emp.date_of_birth) : new Date();
                e.date_of_join = (emp.date_of_join) ? new Date(emp.date_of_join) : new Date(emp.date_of_join);
                e.date_of_release = new Date(emp.date_of_release);
                e.payment_method = emp.payment_method;
                e.status = emp.status;
                e.statusName = (e.status == 1) ? 'DISAPPOINTED' : 'REGULAR';
                var salSearch = {};
                salSearch.employee = emp.id;
                salSearch.date = SDate;
                getSalaryJson(db, salSearch, function(salData) {
                    e.salary = (salData.amount > 0) ? salData.amount : e.salary;
                    e.approve_date = salData.approve_date;
                    e.basic = e.salary / 100 * 60;
                    e.house_rent = e.salary / 100 * 30;
                    e.medical = e.salary / 100 * 5;
                    e.conveyance = e.salary / 100 * 5;
                    e.advanceDeduct = (salData.advanceDeduct > 0) ? salData.advanceDeduct : e.advanceDeduct;
                    e.aitDeduct = (salData.aitDeduct > 0) ? salData.aitDeduct : e.aitDeduct;
                    e.othersDeduct = (salData.othersDeduct > 0) ? salData.othersDeduct : e.othersDeduct;
                    e.branch_code = (salData.branch_code) ? salData.branch_code : e.branch_code;
                    e.account_type = (salData.account_type) ? salData.account_type : e.account_type;
                    e.account_no = (salData.account_no) ? salData.account_no : e.account_no;
                    e.account = (salData.account) ? salData.account : e.account;
                    returnData.push(e);
                    cb_emp();
                });
            }, function(err) {
                if (err) {
                    throw err;
                }
                returnData.sort(function(a, b) {
                    var o1 = a.departmentName;
                    var o2 = b.departmentName;

                    var m1 = a.designation;
                    var m2 = b.designation;

                    var p1 = a.id;
                    var p2 = b.id;

                    if (o1 < o2) return -1;
                    if (o1 > o2) return 1;
                    if (m1 < m2) return -1;
                    if (m1 > m2) return 1;
                    if (p1 < p2) return -1;
                    if (p1 > p2) return 1;
                    return 0;
                });
                callback(returnData);
            });
        })
    }


    function getEmployeeID(db, QUERY, callback) {
        var returnData = [];
        var SEARCH = {};
        var findData = {};
        if (QUERY.id)
            SEARCH.id = QUERY.id
        if (QUERY.user)
            SEARCH.user = QUERY.user
        if (QUERY.designation)
            SEARCH.designation = QUERY.designation
        if (QUERY.department)
            SEARCH.department = QUERY.department
        if (QUERY.date_of_birth)
            SEARCH.date_of_birth = QUERY.date_of_birth
        if (QUERY.date_of_join)
            SEARCH.date_of_join = QUERY.date_of_join
        if (QUERY.date_of_release)
            SEARCH.date_of_release = QUERY.date_of_release
        if (QUERY.referer)
            SEARCH.referer = QUERY.referer
        if (QUERY.national_id)
            SEARCH.national_id = QUERY.national_id
        if (QUERY.religion)
            SEARCH.religion = QUERY.religion
        if (QUERY.marital_status)
            SEARCH.marital_status = QUERY.marital_status
        if (QUERY.contact_no)
            SEARCH.contact_no = QUERY.contact_no
        if (QUERY.blood_group)
            SEARCH.blood_group = QUERY.blood_group
        if (QUERY.duty_shift)
            SEARCH.duty_shift = QUERY.duty_shift
        if (QUERY.payment_method)
            SEARCH.payment_method = QUERY.payment_method
        SEARCH.status = (QUERY.status) ? QUERY.status : 0;
        findData.where = SEARCH;
        findData.attributes = [
            'id'
        ];
        var SORT = (QUERY.sort) ? QUERY.sort : 'id';
        var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
        findData.order = [
            [SORT, DIR]
        ];
        if (QUERY.start)
            findData.offset = QUERY.start;
        if (QUERY.limit)
            findData.limit = QUERY.limit;
        db.employee.findAll(findData).complete(function(err, empData) {
            async.each(empData, function(emp, cb_emp) {
                var e = {};
                e.id = emp.id;
                returnData.push(e)
                cb_emp();
            }, function(err) {
                if (err) {
                    throw err;
                }
                callback(returnData);
            });
        })
    }

    function salary_bank_account(db, SEARCH_DATA, callback) {
        var returnData = [];
        var holiday = 0
        var holiday_array = [];
        var adjustment = [];
        var d = new Date();
        if (SEARCH_DATA.month) {
            d = new Date(SEARCH_DATA.month);
            holiday = SEARCH_DATA.holiday;
            for (var i = 0; i < SEARCH_DATA.holiday_array.length; i++) {
                if (parseInt(SEARCH_DATA.holiday_array[i]) == 0 || parseInt(SEARCH_DATA.holiday_array[i]) == 32) {} else {
                    holiday_array.push(parseInt(SEARCH_DATA.holiday_array[i]))
                }
            };
            for (var i = 0; i < SEARCH_DATA.adjustment.length; i++) {
                if (parseInt(SEARCH_DATA.adjustment[i]) == 0 || parseInt(SEARCH_DATA.adjustment[i]) == 32) {} else {
                    adjustment.push(parseInt(SEARCH_DATA.adjustment[i]))
                }
            };
        }
        var f = new Date(d.getFullYear(), d.getMonth(), 01, 6, 30);
        var t = new Date(d.getFullYear(), d.getMonth() + 1, 00, 28, 30);
        var weekend_array = weekendList(d);
        var dateList = dateListFromMonth(d);

        db.employee.findAll({
            where: {
                status: 0
            },
            include: [{
                model: db.user,
                attributes: [
                    'first_name', 'last_name'
                ]
            }],
            attributes: ['id'],
        }).complete(function(err, employee_data) {
            async.each(employee_data, function(employee, cb_employee_data) {
                var leave_arr = [];
                var emp = {};
                emp.id = employee.id;
                emp.name = employee.userTable.first_name;
                emp.salary = 0.00;
                emp.account_no = '000-000-0000000';
                if (employee.userTable.last_name) {
                    emp.name += ' ' + employee.userTable.last_name;
                }
                db.bank_account.findAll({
                    where: {
                        employee: employee.id,
                    },
                    attributes: [
                        'id', 'branch_code', 'account_type', 'account_no'
                    ],
                    limit: 1,
                    order: [
                        ['created_at', 'DESC']
                    ]
                }).complete(function(err, bank_account) {
                    var bank_account_s = JSON.stringify(bank_account);
                    var ba_data = JSON.parse(bank_account_s);
                    if (bank_account[0]) {
                        emp.account_no = addLeadingZero(3, ba_data[0].branch_code) +
                            '-' + addLeadingZero(3, ba_data[0].account_type) +
                            '-' + addLeadingZero(7, ba_data[0].account_no);
                    }
                    db.leave.findAll({
                        where: {
                            employee: employee.id,
                            date: {
                                between: [f, t]
                            },
                        },
                        attributes: [
                            'id', 'leave_type', 'date'
                        ]
                    }).complete(function(err, leaves) {
                        var leave_s = JSON.stringify(leaves);
                        var leave_data = JSON.parse(leave_s);
                        for (var i = leave_data.length - 1; i >= 0; i--) {
                            var ld_dt = leave_data[i].date.split("T");
                            var ld_d = ld_dt[0].split("-");
                            leave_arr.push(parseInt(ld_d[2]));
                        }
                        db.attendance.findAll({
                            where: {
                                punch_time: {
                                    between: [f, t]
                                },
                                employee: employee.id
                            },
                            attributes: [
                                'id', 'punch_time'
                            ],
                            order: [
                                ['id', 'DESC']
                            ],
                        }).complete(function(err, attendances) {
                            var punch_present_arr = [];
                            var punch_late_arr = [];
                            var attendance_s = JSON.stringify(attendances);
                            var attendance_data = JSON.parse(attendance_s);
                            for (var i = 0; i < attendance_data.length; i++) {
                                var ad_dt = attendance_data[i].punch_time.split("T");
                                var ad_d = ad_dt[0].split("-");
                                var ad_t = ad_dt[1].split(":");
                                var ad_date = new Date(ad_dt[0]);
                                var p_h = parseInt(ad_t[0]);
                                var p_m = parseInt(ad_t[1]);
                                var p_dd = parseInt(ad_d[2]);
                                var p_dm = parseInt(ad_d[1]);
                                var p_dy = parseInt(ad_d[0]);
                                if (p_h < 10) {
                                    if (p_h == 9) {
                                        if (p_m <= 30) {
                                            if (punch_present_arr.indexOf(p_dd) == -1) {
                                                punch_present_arr.push(p_dd);
                                            }
                                        } else {
                                            if (punch_present_arr.indexOf(p_dd) == -1 && punch_late_arr.indexOf(p_dd) == -1) {
                                                punch_late_arr.push(p_dd);
                                            }
                                        }
                                    } else {
                                        if (punch_present_arr.indexOf(p_dd) == -1) {
                                            punch_present_arr.push(p_dd);
                                        }
                                    }
                                } else {
                                    if (punch_present_arr.indexOf(p_dd) == -1 && punch_late_arr.indexOf(p_dd) == -1) {
                                        punch_late_arr.push(p_dd);
                                    }
                                }
                            };
                            for (var i = weekend_array.length - 1; i >= 0; i--) {
                                if (adjustment.indexOf(weekend_array[i]) != -1) {
                                    weekend_array.splice(i, 1);
                                }
                            }
                            for (var i = punch_late_arr.length - 1; i >= 0; i--) {
                                if (punch_present_arr.indexOf(punch_late_arr[i]) != -1) {
                                    punch_late_arr.splice(i, 1);
                                }
                            }
                            for (var i = punch_late_arr.length - 1; i >= 0; i--) {
                                if (leave_arr.indexOf(punch_late_arr[i]) != -1) {
                                    punch_late_arr.splice(i, 1);
                                }
                            }
                            returnData.push(emp)
                            cb_employee_data();
                        })
                    })
                })
            }, function(err) {
                callback(returnData);
            });
        })
    }


    function getEmployeeDayAttendance(db, QUERY, callback) {
        var returnData = [];
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var Y = d.getFullYear();
        var M = d.getMonth() + 1;
        var D = d.getDate();
        var YMD = Y + '-' + M + '-' + D;
        QUERY.date = YMD;
        getEmployee(db, QUERY, function(empData) {
            async.each(empData, function(emp, cb_emp) {
                var o = {};
                QUERY.employee = emp.id;
                o = emp;
                getEmployeeDayPunch(db, QUERY, function(attData) {
                    o.attendanceStatus = attData[YMD].status;
                    o.lastDayOut = attData[YMD].lastDayOut;
                    o.officeIn = attData[YMD].officeIn;
                    o.officeOut = attData[YMD].officeOut;
                    if (QUERY.attendance_type) {
                        if (QUERY.attendance_type == 'PRESENT') {
                            if (o.attendanceStatus != 'A') {
                                returnData.push(o)
                            }
                        }
                        if (QUERY.attendance_type == 'ABSENT') {
                            if (o.attendanceStatus == 'A') {
                                returnData.push(o)
                            }
                        }
                    } else {
                        returnData.push(o)
                    }
                    cb_emp();
                })
            }, function(err) {
                callback(returnData);
            });
        })
    }

    function getEmployeeDayPunch(db, QUERY, callback) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var Y = d.getFullYear();
        var M = d.getMonth() + 1;
        var D = d.getDate();
        var YMD = Y + '-' + M + '-' + D;
        QUERY.date = YMD;
        var o = {};
        o[YMD] = {};

        o[YMD].day = D;
        o[YMD].date = YMD;
        o[YMD].dateTime = new Date(Date.UTC(Y, M, D));
        o[YMD].status = 'A';

        o[YMD].lastDayOut = {};
        o[YMD].officeIn = {};
        o[YMD].officeOut = {};

        o[YMD].lastDayOut.flag = 0;
        o[YMD].officeIn.flag = 0;
        o[YMD].officeOut.flag = 0;

        o[YMD].lastDayOut.h = 0;
        o[YMD].officeIn.h = 0;
        o[YMD].officeOut.h = 0;

        o[YMD].lastDayOut.m = 0;
        o[YMD].officeIn.m = 0;
        o[YMD].officeOut.m = 0;

        o[YMD].lastDayOut.time = '00:00 NN';
        o[YMD].officeIn.time = '00:00 NN';
        o[YMD].officeOut.time = '00:00 NN';

        getAttendance(db, QUERY, function(attData) {
            async.each(attData, function(att, cb_att) {
                var dt = new Date(att.punch_time);
                dt.setHours(dt.getHours() - 12);
                var HR = parseInt(dt.getHours()) + 6;
                var MT = parseInt(dt.getMinutes());
                if (D == 1) {
                    if ((dt.getMonth() + 2) == M) {
                        if (dt.monthDays() == dt.getDate()) {
                            ////////////// Last Day Out Punch //////////////
                            if (validBetweenInteger(HR, 16, 29)) {
                                if (!o[YMD].lastDayOut.flag) {
                                    o[YMD].lastDayOut.h = HR;
                                    o[YMD].lastDayOut.m = MT;
                                    o[YMD].lastDayOut.flag = 1;
                                } else {
                                    if (HR >= o[YMD].lastDayOut.h) {
                                        if (HR == o[YMD].lastDayOut.h) {
                                            if (MT > o[YMD].lastDayOut.m) {
                                                o[YMD].lastDayOut.h = HR;
                                                o[YMD].lastDayOut.m = MT;
                                            }
                                        } else {
                                            o[YMD].lastDayOut.h = HR;
                                            o[YMD].lastDayOut.m = MT;
                                        }
                                    }
                                }
                                var tmpH = o[YMD].lastDayOut.h - 12;
                                var tmpM = o[YMD].lastDayOut.m;
                                var tmpA = '';
                                var tmpAH = 0;
                                var tmpAM = 0;
                                if (o[YMD].lastDayOut.h > 23) {
                                    tmpH = 12;
                                    tmpM = 0;
                                    tmpAH = o[YMD].lastDayOut.h - 24;
                                    tmpAM = o[YMD].lastDayOut.m;
                                    tmpA = ' + (' + addLeadingZero(2, tmpAH) + ':' + addLeadingZero(2, tmpAM) + ')'
                                }
                                o[YMD].lastDayOut.time = addLeadingZero(2, tmpH) + ':' + addLeadingZero(2, tmpM) + ' PM' + tmpA;
                            }
                        }
                    }
                } else {
                    if (D == (dt.getDate() + 1)) {
                        ////////////// Last Day Out Punch //////////////
                        if (validBetweenInteger(HR, 16, 29)) {
                            if (!o[YMD].lastDayOut.flag) {
                                o[YMD].lastDayOut.h = HR;
                                o[YMD].lastDayOut.m = MT;
                                o[YMD].lastDayOut.flag = 1;
                            } else {
                                if (HR >= o[YMD].lastDayOut.h) {
                                    if (HR == o[YMD].lastDayOut.h) {
                                        if (MT > o[YMD].lastDayOut.m) {
                                            o[YMD].lastDayOut.h = HR;
                                            o[YMD].lastDayOut.m = MT;
                                        }
                                    } else {
                                        o[YMD].lastDayOut.h = HR;
                                        o[YMD].lastDayOut.m = MT;
                                    }
                                }
                            }
                            var tmpH = o[YMD].lastDayOut.h - 12;
                            var tmpM = o[YMD].lastDayOut.m;
                            var tmpA = '';
                            var tmpAH = 0;
                            var tmpAM = 0;
                            if (o[YMD].lastDayOut.h > 23) {
                                tmpH = 12;
                                tmpM = 0;
                                tmpAH = o[YMD].lastDayOut.h - 24;
                                tmpAM = o[YMD].lastDayOut.m;
                                tmpA = ' + (' + addLeadingZero(2, tmpAH) + ':' + addLeadingZero(2, tmpAM) + ')'
                            }
                            o[YMD].lastDayOut.time = addLeadingZero(2, tmpH) + ':' + addLeadingZero(2, tmpM) + ' PM' + tmpA;
                        }
                    }
                }

                if (dt.getDate() == D) {
                    ////////////// Office In Punch //////////////
                    if (validBetweenInteger(HR, 6, 12)) {
                        if (!o[YMD].officeIn.flag) {
                            o[YMD].officeIn.h = HR;
                            o[YMD].officeIn.m = MT;
                            o[YMD].officeIn.flag = 1;
                        } else {
                            if (HR <= o[YMD].officeIn.h) {
                                if (HR == o[YMD].officeIn.h) {
                                    if (MT < o[YMD].officeIn.m) {
                                        o[YMD].officeIn.h = HR;
                                        o[YMD].officeIn.m = MT;
                                    }
                                } else {
                                    o[YMD].officeIn.h = HR;
                                    o[YMD].officeIn.m = MT;
                                }
                            }
                        }
                        o[YMD].officeIn.time = addLeadingZero(2, o[YMD].officeIn.h) + ':' + addLeadingZero(2, o[YMD].officeIn.m) + ' AM';
                    }
                    ////////////// Office Out Punch //////////////
                    if (validBetweenInteger(HR, 12, 29)) {
                        if (!o[YMD].officeOut.flag) {
                            o[YMD].officeOut.h = HR;
                            o[YMD].officeOut.m = MT;
                            o[YMD].officeOut.flag = 1;
                        } else {
                            if (HR >= o[YMD].officeOut.h) {
                                if (HR == o[YMD].officeOut.h) {
                                    if (MT > o[YMD].officeOut.m) {
                                        o[YMD].officeOut.h = HR;
                                        o[YMD].officeOut.m = MT;
                                    }
                                } else {
                                    o[YMD].officeOut.h = HR;
                                    o[YMD].officeOut.m = MT;
                                }
                            }
                        }
                        var tmpH = o[YMD].officeOut.h - 12;
                        var tmpM = o[YMD].officeOut.m;
                        var tmpA = '';
                        var tmpAH = 0;
                        var tmpAM = 0;
                        if (o[YMD].officeOut.h > 23) {
                            tmpH = 12;
                            tmpM = 0;
                            tmpAH = o[YMD].officeOut.h - 24;
                            tmpAM = o[YMD].officeOut.m;
                            tmpA = ' + (' + addLeadingZero(2, tmpAH) + ':' + addLeadingZero(2, tmpAM) + ')'
                        }
                        o[YMD].officeOut.time = addLeadingZero(2, tmpH) + ':' + addLeadingZero(2, tmpM) + ' PM' + tmpA;
                    }

                    if (o[YMD].officeIn.flag || o[YMD].officeOut.flag)
                        o[YMD].status = 'P';

                }
                cb_att();
            }, function(err) {
                callback(o);
            });
        });
    }

    function getEmployeeMonthAttendance(db, QUERY, callback) {
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

    function getEmployeeMonthPunch(db, QUERY, callback) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        d.setDate(1);
        var dayArray = dayArrayFunc(d.monthDays());
        var o = {};
        async.each(dayArray, function(day, cb_day) {
            d.setDate(day);
            var Y = d.getFullYear();
            var M = d.getMonth() + 1;
            var D = d.getDate();
            var YMD = Y + '-' + M + '-' + D;
            QUERY.date = YMD;
            getEmployeeDayPunch(db, QUERY, function(attData) {
                var dt = new Date(YMD);
                o[YMD] = {};
                o[YMD].day = attData[YMD].day;
                o[YMD].date = attData[YMD].date;
                o[YMD].dateTime = attData[YMD].dateTime;
                o[YMD].status = attData[YMD].status;
                o[YMD].leave = false;
                o[YMD].leaveName = '';
                o[YMD].leaveType = '';
                o[YMD].payable = (dt.getDay() == 5) ? true : false;
                o[YMD].attend = (attData[YMD].status == 'P') ? true : false;
                o[YMD].adjust = false;
                o[YMD].holiday = false;
                o[YMD].weekend = (dt.getDay() == 5) ? true : false;
                o[YMD].officeIn = attData[YMD].officeIn;
                o[YMD].officeOut = attData[YMD].officeOut;
                cb_day();
            })
        }, function(err) {
            callback(o);
        });
    }





    function DestroyEmployee(db, DATA, callback) {
        db.employee.destroy({
            where: {
                id: DATA
            }
        }).then(function(state) {
            callback("success")
        }).catch(e => {
            callback("error")
        })
    }

    function UpdateEmployee(db, DATA, callback) {
        db.employee.find({
            where: {
                id: DATA.id
            }
        }).then(u => {
            u.updateAttributes(DATA.data).then(s => {
                callback('success')
            }).catch(e => {
                callback('error')
            })
        }).catch(e => {
            callback('error')
        })
    }

    function CreateEmployee(db, DATA, callback) {
        db.employee.create({
            name: DATA.name,
            designation: DATA.designation,
            department: DATA.department,
            photo: DATA.photo,
            working_place: DATA.working_place,
            employee_type: DATA.employee_type,
            date_of_birth: DATA.date_of_birth,
            date_of_join: DATA.date_of_join,
            date_of_release: DATA.date_of_release
        }).complete(function(err, employee) {
            if (err) {
                callback("error");
                //throw err;
            } else {
                callback("success")
            }
        })
    }


    function daily_report(db, DEPARTMENT_ID, DATA, callback) {
        var d = new Date();
        if (DATA) {
            d = new Date(DATA)
        }
        var f = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        d.setDate(d.getDate() + 1);
        var t = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate());
        var absent = 0;
        var present = 0;
        var late = 0;
        var total = 0;
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
                emp.punches = [];
                emp.out_time = '00:00:00';
                emp.attendance = 'A';
                emp.punch_hour = 24;
                emp.punch_min = 60;
                emp.punch_sec = 60;
                emp.id = employee.id;
                emp.first_name = employee.userTable.first_name;
                emp.last_name = employee.userTable.last_name;
                emp.department = employee.departmentTable.name;
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
                    if (attendance_data.length > 0) {
                        for (var i = 0; i < attendance_data.length; i++) {
                            emp.attendance = 'P'
                            emp.punches.push(attendance_data[i].punch_time);
                            if (attendance_data[i].punch_time.getUTCHours() < emp.punch_hour) {
                                emp.punch_hour = attendance_data[i].punch_time.getUTCHours();
                                if (attendance_data[i].punch_time.getUTCMinutes() < emp.punch_min) {
                                    emp.punch_min = attendance_data[i].punch_time.getUTCMinutes();
                                    emp.punch_sec = attendance_data[i].punch_time.getUTCSeconds();
                                }
                            }
                        };
                    }
                    if (emp.attendance == 'P') {
                        if (emp.punch_hour < 10) {
                            if (emp.punch_hour == 9) {
                                if (emp.punch_min > 29) {
                                    emp.attendance = 'L';
                                }
                            }
                        } else {
                            emp.attendance = 'L';
                        }
                    }
                    if (emp.attendance == 'A') {
                        emp.in_time = '00:00:00';
                        absent++;
                        total++;
                    } else {
                        if (emp.attendance == 'P') {
                            present++;
                            total++;
                        }
                        if (emp.attendance == 'L') {
                            late++;
                            total++;
                        }
                        emp.in_time = addLeadingZero(2, emp.punch_hour) + ':' +
                            addLeadingZero(2, emp.punch_min) + ':' +
                            addLeadingZero(2, emp.punch_sec);
                    }
                    if (emp.punches.length > 1) {
                        var sorted = emp.punches.sort(sortDates);
                        var minDate = sorted[0];
                        var maxDate = sorted[sorted.length - 1];
                        emp.out_time = addLeadingZero(2, maxDate.getUTCHours()) + ':' +
                            addLeadingZero(2, maxDate.getUTCMinutes()) + ':' +
                            addLeadingZero(2, maxDate.getUTCSeconds());
                    }

                    emp.present = present;
                    emp.absent = absent;
                    emp.late = late;
                    emp.total = total;
                    returnData.push(emp)
                    cb_employee_data();
                })
            }, function(err) {
                if (err) {
                    throw err;
                }
                callback(returnData);
            });
        })
    }

    function daily_report_list(db, DATA, callback) {
        var d = new Date();
        if (DATA.form_date) {
            d = new Date(DATA.form_date)
        }
        var f = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        var t = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() + 1);

        db.employee.findAll({
            where: {
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
            }, {
                model: db.designation,
                attributes: [
                    'id', 'name'
                ]
            }],
            order: [
                ['department', 'ASC']
            ],
        }).complete(function(err, data) {
            callback(data);
        })
    }


    function UpdateEmployeeDesignation(db, DATA, callback) {
        db.employee.update({
            designation: DATA.designation
        }, {
            id: DATA.id
        }).complete(function(err, break_down) {
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

    function UpdateEmployeeDepartment(db, DATA, callback) {
        db.employee.update({
            department: DATA.department
        }, {
            id: DATA.id
        }).complete(function(err, break_down) {
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

    function UpdateEmployeeDateOfBirth(db, DATA, callback) {
        db.employee.update({
            date_of_birth: DATA.date_of_birth
        }, {
            id: DATA.id
        }).complete(function(err, break_down) {
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

    function UpdateEmployeeDateOfJoin(db, DATA, callback) {
        db.employee.update({
            date_of_join: DATA.date_of_join
        }, {
            id: DATA.id
        }).complete(function(err, break_down) {
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

    function UpdateEmployeeWorkingPlace(db, DATA, callback) {
        db.employee.update({
            working_place: DATA.working_place
        }, {
            id: DATA.id
        }).complete(function(err, break_down) {
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

    function UpdateEmployeeStatus(db, DATA, callback) {
        db.employee.update({
            status: DATA.status
        }, {
            id: DATA.id
        }).complete(function(err, break_down) {
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

    function ChangeProfilePicture(db, DATA, callback) {
        db.employee.update({
            photo: DATA.photo
        }, {
            id: DATA.id
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




    function routerInit(app, dbFull) {
        var db = dbFull.FFL_HR

        app.get('/employee', function(req, res) {
            employee_list(db, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            })
        });

        app.get('/employee/:UID', /*isAuthenticated,*/ function(req, res) {
            var UID = req.params.UID;
            employee_user_list(db, UID, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            })
        });

        app.get('/getEmployee', function(req, res) {
            QUERY = {};
            QUERY.employee = 89;
            getEmployee(db, QUERY, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            });
        });

        app.get('/employee_salary', /*isAuthenticated,*/ function(req, res) {
            employee_salary(db, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            });
        });

        app.get('/getEmployeeDetails', function(req, res) {
            QUERY = {};
            QUERY.employee = 89;
            getEmployeeDetails(db, QUERY, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            });
        });

        app.get('/getEmployeeID', function(req, res) {
            QUERY = {};
            QUERY.employee = 89;
            getEmployeeID(db, QUERY, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            });
        });

        app.get('/getEmployeeDayAttendance', function(req, res) {
            QUERY = {};
            QUERY.employee = 89;
            getEmployeeDayAttendance(db, QUERY, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            });
        });

        app.get('/getEmployeeDayPunch', function(req, res) {
            QUERY = {};
            QUERY.employee = 117;
            getEmployeeDayPunch(db, QUERY, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            });
        });

        app.get('/getEmployeeMonthAttendance', function(req, res) {
            QUERY = {};
            QUERY.id = 117;
            QUERY.employee = 117;
            QUERY.date = new Date('2017-7-1');
            getEmployeeMonthAttendance(db, QUERY, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            });
        });

        app.get('/salary_bank_account', /*isAuthenticated,*/ function(req, res) {
            salary_bank_account(db, req.query, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            });
        });

        app.get('/getEmployeeMonthPunch', function(req, res) {
            QUERY = {};
            QUERY.id = 89;
            QUERY.employee = 89;
            QUERY.date = new Date('2017-1-1');
            getEmployeeMonthPunch(db, QUERY, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            });
        });

        app.get('/getEmployeeMonthSummary', function(req, res) {
            QUERY = {};
            // QUERY.id = 89;
            // QUERY.employee = 89;
            QUERY.date = new Date('2017-1-1');
            getEmployeeMonthSummary(db, QUERY, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            });
        });

        app.get('/daily_report/:DEPARTMENT_ID', /*isAuthenticated,*/ function(req, res) {
            var DEPARTMENT_ID = req.params.DEPARTMENT_ID;
            daily_report(db, DEPARTMENT_ID, req.query, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            })
        });



        app.get('/daily_report', /*isAuthenticated,*/ function(req, res) {
            daily_report_list(db, req.query, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            })
        });

        app.post('/CreateEmployee', function(req, res) {
            var data = {};
            data.name = req.body.name;
            data.department = req.body.department;
            data.designation = req.body.designation;
            if (parseInt(req.body.employee_type) > 0)
                data.employee_type = req.body.employee_type;
            else
                data.employee_type = null;
            if (parseInt(req.body.working_place) > 0)
                data.working_place = req.body.working_place;
            else
                data.working_place = null;
            data.date_of_birth = req.body.date_of_birth;
            data.date_of_join = req.body.date_of_join;
            data.date_of_release = req.body.date_of_release;
            data.photo = req.files.photo.name;
            input.CreateEmployee(db, data, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            });
        });

        app.post('/ChangeProfilePicture', function(req, res) {
            var data = {};
            data.id = req.body.id;
            data.photo = req.files.profile_picture.name;
            update.ChangeProfilePicture(db, data, function(d) {
                res.write(d);
                res.end();
            });
        });
    }









    function socketInit(dbFull, socket) {
        var db = dbFull.FFL_HR

        socket.on('CreateEmployee', function(data) {
            CreateEmployee(db, data, function(r) {
                socket.emit("CreateEmployeeSMS", r)
            });
        });


        socket.on('UpdateEmployee', function(data) {
            UpdateEmployee(db, data, function(r) {
                socket.emit("UpdateEmployeeSMS", r)
            });
        });

        socket.on('UpdateEmployeeDesignation', function(data) {
            UpdateEmployeeDesignation(db, data, function(data) {
                socket.emit("UpdateEmployeeDesignation", data)
            });
        });

        socket.on('UpdateEmployeeDepartment', function(data) {
            UpdateEmployeeDepartment(db, data, function(data) {
                socket.emit("UpdateEmployeeDepartment", data)
            });
        });

        socket.on('UpdateEmployeeWorkingPlace', function(data) {
            UpdateEmployeeWorkingPlace(db, data, function(data) {
                socket.emit("UpdateEmployeeWorkingPlace", data)
            });
        });

        socket.on('UpdateEmployeeDateOfBirth', function(data) {
            UpdateEmployeeDateOfBirth(db, data, function(data) {
                socket.emit("UpdateEmployeeDateOfBirth", data)
            });
        });

        socket.on('UpdateEmployeeDateOfJoin', function(data) {
            UpdateEmployeeDateOfJoin(db, data, function(data) {
                socket.emit("UpdateEmployeeDateOfJoin", data)
            });
        });

        socket.on('UpdateEmployeeStatus', function(data) {
            UpdateEmployeeStatus(db, data, function(data) {
                socket.emit("UpdateEmployeeStatus", data)
            });
        });


        socket.on('DestroyEmployee', function(data) {
            DestroyEmployee(db, data, function(r) {
                socket.emit("DestroyEmployeeSMS", r)
            });
        });
    }

    module.exports.routerInit = routerInit;
    module.exports.socketInit = socketInit;