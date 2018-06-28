module.exports = function() {};

var nodemailer = require('nodemailer');

var mthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var mthCPNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

var monthCapitalNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

var dayPower = ["",
    "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th",
    "th", "th", "th", "th", "th", "th", "th", "th", "th", "th",
    "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"
];


var smtpConfig = {
    host: 'mail.fashionflashltd.com',
    port: 25,
    secure: false, // use SSL
    auth: {
        user: 'no_reply',
        pass: '#Ffl*No64#'
    },
    // tls:  {
    //    rejectUnauthorized: false
    // }
};

var transporter = nodemailer.createTransport(smtpConfig);

function checkEmployeePunch(emp_id, p_date) {

}

var d1f = new Date("2016-06-07 00:00:00");
var d1t = new Date("2016-07-07 23:59:59");
var cc = new Date("2016-07-1 23:59:59");
//console.log(specialWorkTime(cc));

function specialWorkTime(d) {
    var tmp = new Date(d);
    var d1 = {};
    d1.from = new Date("2016-06-07 00:00:00");
    d1.to = new Date("2016-07-07 23:59:59");
    d1.in_h = 8;
    d1.in_m = 30;
    if (checkDateContained(d1.from, d1.to, d))
        return d1;
    return 'd1';
}

function dateFormat(d) {
    var tmp = new Date(d);
    return tmp.getUTCDate() + '/' + (tmp.getUTCMonth() + 1) + '/' + tmp.getUTCFullYear();
}

function workTime(d) {
    var tmp = new Date(d);
    var d1 = {};
    d1.in_h = 9;
    d1.in_m = 30;
    return d1;
}

function checkDateContained(f, t, c) {
    var from = new Date(f);
    var to = new Date(t);
    var check = new Date(c);
    if ((check.getTime() <= to.getTime() && check.getTime() >= from.getTime()))
        return 1;
    else
        return 0;
}

function shortNames(str) {
    var str_arr = str.split(" ");
    var returnString = '';
    for (var i = 0; i < str_arr.length; i++) {
        returnString += str_arr[i][0]
    };
    return returnString;
}

var softwarePath = require.main.filename;
var pArr = softwarePath.split("/");
var folderName = pArr[pArr.length - 2];
var factoryName = 'Not Found. Please Contact With Developer';
var factoryShort = 'NULL';

if (folderName == 'DA_HR') {
    factoryName = 'Denim Attires LTD';
    factoryShort = 'DAL';
} else if (folderName == 'FFL_FACTORY_HR') {
    factoryName = 'Fashion Flash LTD Factory';
    factoryShort = 'FFL';
} else if (folderName == 'FJL_HR') {
    factoryName = 'Fashion Jeans LTD';
    factoryShort = 'FJL';
} else if (folderName == 'JCL_WASH_HR') {
    factoryName = 'Jeans Concept LTD';
    factoryShort = 'JCL';
}

var ramadan2017 = [
    '2017-5-28', '2017-5-29', '2017-5-30', '2017-5-31',
    '2017-6-1', '2017-6-2', '2017-6-3', '2017-6-4',
    '2017-6-5', '2017-6-6', '2017-6-7', '2017-6-8',
    '2017-6-9', '2017-6-10', '2017-6-11', '2017-6-12',
    '2017-6-13', '2017-6-14', '2017-6-15', '2017-6-16',
    '2017-6-17', '2017-6-18', '2017-6-19', '2017-6-20',
    '2017-6-21', '2017-6-22', '2017-6-23', '2017-6-24',
    '2017-6-25', '2017-6-26', '2017-6-27', '2017-6-28'
];

Date.prototype.monthDays = function() {
    var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return d.getDate();
}

Number.prototype.formatMoney = function(c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

Date.prototype.formatDate = function() {
    var d = new Date(this)
    return addLeadingZero(2, d.getDate()) + '-' + mthCPNames[d.getMonth()] + '-' + d.getFullYear();
};

Date.prototype.formatFullDate = function() {
    var d = new Date(this)
    return d.getDate() + '<sup>' + dayPower[d.getDate()] + '</sup> ' + monthNames[d.getMonth()] + ', ' + d.getFullYear();
};

function dateFormatDMY(a) {
    var d = new Date(a)
    return d.getDate() + '-' + mthCPNames[d.getMonth()] + '-' + d.getFullYear();
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

function validBetweenInteger(a, b, c) {
    if (parseInt(a) >= parseInt(b) && parseInt(a) <= parseInt(c))
        return true;
    return false;
}

function getDateArray(a, b, c) {
    var r = []
    var f = new Date(a);
    var t = new Date(b);
    while (f <= t) {
        var Y = f.getFullYear();
        var M = f.getMonth() + 1;
        var D = f.getDate();
        var YMD = Y + '-' + M + '-' + D;
        r.push(YMD);
        f.setDate(f.getDate() + 1);
    }
    c(r);
}

function secDiff(a, b) {
    a = new Date(a);
    b = new Date(b);
    var c = Math.abs(b - a) / 1000; //// IN SECONDS
    return c;
}

function minDiff(a, b) {
    var c = Math.floor(secDiff(a, b) / 60); //// IN MINUTES
}

// minDiff('2017-01-01 9:50:35','2017-01-01 8:55:14');



/////////////////NEED RE AGAIN///////////////////

/////////////////NEED RE AGAIN///////////////////

function getHoliday(db, QUERY, callback) {
    var returnData = [];
    var findData = {};
    var SEARCH = {};
    if (QUERY.date) {
        var f = new Date(QUERY.date);
        f.setDate(20);
        f.setMonth(f.getMonth() - 1);
        var t = new Date(QUERY.date);
        t.setDate(10);
        t.setMonth(t.getMonth() + 1);
        SEARCH.date = {};
        SEARCH.date.between = [f, t];
    }
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'reason', 'date'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'date';
    var DIR = (QUERY.dir) ? QUERY.dir : 'DESC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.holiday.findAll(findData).complete(function(err, holiData) {
        async.each(holiData, function(holi, cb_holi) {
            var d = (holi.date) ? new Date(holi.date) : new Date();
            var Y = d.getFullYear();
            var M = d.getMonth() + 1;
            var D = d.getDate();
            var YMD = Y + '-' + M + '-' + D;
            var o = {};
            o.id = holi.id;
            o.reason = holi.reason;
            o.date = holi.date;
            o.d = YMD;
            returnData.push(o)
            cb_holi();
        }, function(err) {
            callback(returnData);
        });
    })
}

function getLeave(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee;
    if (QUERY.date) {
        var f = new Date(QUERY.date);
        f.setDate(20);
        f.setMonth(f.getMonth() - 1);
        var t = new Date(QUERY.date);
        t.setDate(10);
        t.setMonth(t.getMonth() + 1);
        SEARCH.date = {};
        SEARCH.date.between = [f, t];
    }
    findData.where = SEARCH;

    findData.attributes = [
        'id', 'employee', 'leave_type', 'date', 'status'
    ];
    findData.include = [{
        model: db.leave_type,
        attributes: [
            'id', 'name', 'amount'
        ]
    }, ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'date';
    var DIR = (QUERY.dir) ? QUERY.dir : 'DESC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.leave.findAll(findData).complete(function(err, lvData) {
        async.each(lvData, function(lv, cb_lv) {
            var d = (lv.date) ? new Date(lv.date) : new Date();
            var Y = d.getFullYear();
            var M = d.getMonth() + 1;
            var D = d.getDate();
            var YMD = Y + '-' + M + '-' + D;
            var o = {};
            o.id = lv.id;
            o.employee = lv.employee;
            o.date = lv.date;
            o.leave_type = lv.leaveTypeTable.name.toUpperCase();
            o.leave = shortNames(lv.leaveTypeTable.name);
            o.d = YMD;
            returnData.push(o)
            cb_lv();
        }, function(err) {
            callback(returnData);
        });
    })
}

function getPromotion(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    if (QUERY.employee) {
        SEARCH.employee = QUERY.employee;
        findData.where = SEARCH;
    }
    findData.attributes = [
        'id', 'employee', 'old_designation',
        'new_designation', 'month'
    ];
    findData.include = [{
        model: db.designation,
        attributes: [
            'id', 'name'
        ]
    }, ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'month';
    var DIR = (QUERY.dir) ? QUERY.dir : 'DESC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.promotion.findAll(findData).complete(function(err, promotionData) {
        async.each(promotionData, function(promt, cb_promt) {
            var e = {};
            e.id = promt.id;
            e.employee = promt.employee;
            e.old_designation = promt.old_designation;
            e.new_designation = promt.new_designation;
            e.month = promt.month;
            e.oldDesignation = {};
            e.newDesignation = {};
            var oldDesSearch = {};
            var newDesSearch = {};
            oldDesSearch.id = promt.old_designation;
            newDesSearch.id = promt.new_designation;
            getDesignation(db, oldDesSearch, function(oldDesData) {
                async.each(oldDesData, function(oldDes, cb_oldDes) {
                    e.oldDesignation.id = oldDes.id;
                    e.oldDesignation.name = oldDes.name.toUpperCase();
                    cb_oldDes();
                }, function(err) {
                    getDesignation(db, newDesSearch, function(newDesData) {
                        async.each(newDesData, function(newDes, cb_newDes) {
                            e.newDesignation.id = newDes.id;
                            e.newDesignation.name = newDes.name.toUpperCase();
                            cb_newDes();
                        }, function(err) {
                            returnData.push(e)
                            cb_promt();
                        });
                    });
                });
            });
        }, function(err) {
            if (err) {
                throw err;
            }
            callback(returnData);
        });
    })
}

function getSalary(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    findData.attributes = [
        'id', 'employee', 'amount', 'approve_date'
    ];
    if (QUERY.date) {
        var date = new Date(QUERY.date);
        date.setDate(1);
        var Y = date.getFullYear();
        var M = date.getMonth() + 2;
        var D = date.getDate();
        var YMD = Y + '-' + M + '-' + D;
        var d = new Date(YMD);
        SEARCH.approve_date = {};
        SEARCH.approve_date.lt = d;
    }
    if (QUERY.employee) {
        SEARCH.employee = QUERY.employee;
    }
    findData.where = SEARCH;
    var SORT = (QUERY.sort) ? QUERY.sort : 'approve_date';
    var DIR = (QUERY.dir) ? QUERY.dir : 'DESC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.salary.findAll(findData).complete(function(err, salData) {
        callback(d);
    })
}

function getSalaryJson(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    findData.attributes = [
        'id', 'employee', 'amount', 'approve_date'
    ];
    if (QUERY.date) {
        var date = new Date(QUERY.date);
        date.setDate(1);
        var Y = date.getFullYear();
        var M = date.getMonth() + 2;
        var D = date.getDate();
        var YMD = Y + '-' + M + '-' + D;
        var d = new Date(YMD);
        SEARCH.approve_date = {};
        SEARCH.approve_date.lt = d;
    }
    if (QUERY.employee) {
        SEARCH.employee = QUERY.employee;
    }
    findData.where = SEARCH;
    var o = {};
    o.amount = 0;
    o.branch_code = '000';
    o.account_type = '000';
    o.account_no = '0000000';
    o.account = '000-000-0000000';
    o.advanceDeduct = 0;
    o.othersDeduct = 0;
    o.aitDeduct = 0;
    db.salary.findAll(findData).complete(function(err, salData) {
        async.each(salData, function(sal, cb_sal) {
            o.employee = sal.employee;
            o.amount += sal.amount;
            o.approve_date = (o.approve_date) ? (new Date(o.approve_date) < new Date(sal.approve_date)) ? new Date(sal.approve_date) : new Date(o.approve_date) : new Date(sal.approve_date);
            cb_sal();
        }, function(err) {
            getBankAccountNo(db, QUERY, function(baData) {
                o.branch_code = (baData.branch_code) ? baData.branch_code : o.branch_code;
                o.account_type = (baData.account_type) ? baData.account_type : o.account_type;
                o.account_no = (baData.account_no) ? baData.account_no : o.account_no;
                o.account = (baData.account) ? baData.account : o.account;
                var deductSearch = {};
                deductSearch.employee = QUERY.employee;
                deductSearch.date = date;
                getDeductionJson(db, deductSearch, function(deductData) {
                    o.advanceDeduct = (deductData.advanceDeduct > 0) ? deductData.advanceDeduct : o.advanceDeduct;
                    o.othersDeduct = (deductData.othersDeduct > 0) ? deductData.othersDeduct : o.othersDeduct;
                    o.aitDeduct = (deductData.aitDeduct > 0) ? deductData.aitDeduct : o.aitDeduct;
                    callback(o);
                });
            });
        });
    })
}

function getUser(db, QUERY, callback) {
    var SEARCH = {};
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.finger_print_id)
        SEARCH.finger_print_id = QUERY.finger_print_id
    if (QUERY.first_name)
        SEARCH.first_name = QUERY.first_name
    if (QUERY.last_name)
        SEARCH.last_name = QUERY.last_name
    if (QUERY.name_bangla)
        SEARCH.name_bangla = QUERY.name_bangla
    if (QUERY.email)
        SEARCH.email = QUERY.email
    if (QUERY.access_level)
        SEARCH.access_level = QUERY.access_level
    db.user.findAll({
        attributes: [
            'id', 'finger_print_id', 'first_name',
            'last_name', 'name_bangla', 'email', 'access_level',
        ],
        order: [
            ['id', 'ASC']
        ]
    }).complete(function(err, d) {
        callback(d);
    })
}

Date.prototype.monthDays = function() {
    var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return d.getDate();
}

function sortDates(a, b) {
    return a.getTime() - b.getTime();
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

function attendance_report_test(db, DEPARTMENT_ID, DATA, callback) {
    var d = new Date();
    var search_month = new Date(d.getFullYear(), d.getMonth(), 01);
    var search_year = new Date(d.getFullYear(), 00, 01);
    var next_year = new Date(d.getFullYear() + 1, 00, 01);
    var holiday = [];
    var adjustment = [];
    if (DATA.month) {
        d = new Date(DATA.month);
        search_month = new Date(d.getFullYear(), d.getMonth(), 01);
        search_year = new Date(d.getFullYear(), 00, 01);
        next_year = new Date(d.getFullYear() + 1, 00, 01);
        holiday = DATA.holiday_array;
        adjustment = DATA.adjustment;
    }
    var dateList = dateListFromMonth(d);
    //var weekend = weekendCount(d);
    var total_days = dateList.length;
    var f = new Date(d);
    d.setMonth(d.getMonth() + 1);
    var t = new Date(d);
    var returnData = [];

    ///////////////////////////// Emp Start /////////////////////////////////
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
            model: db.designation,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            ['designation', 'ASC']
        ],
    }).complete(function(err, empData) {
        async.each(empData, function(emp, cb_emp) {

            var att = {};
            var pH = {};
            var pM = {};
            var pS = {};
            var lvj = {};
            var lva = [];

            var eD = {};
            //eD.id = emp.id;
            eD.id = (emp.designationTable) ?
                (emp.designationTable.id ?
                    emp.designationTable.id :
                    9999) :
                9999;
            eD.name = (emp.userTable) ?
                ((emp.userTable.first_name) ?
                    ((emp.userTable.last_name) ?
                        emp.userTable.first_name.toUpperCase() + ' ' + emp.userTable.last_name.toUpperCase() :
                        emp.userTable.first_name.toUpperCase()) :
                    'NOT GIVEN') :
                'NOT GIVEN';
            eD.designation = (emp.designationTable) ?
                (emp.designationTable.name.toUpperCase() ?
                    emp.designationTable.name.toUpperCase() :
                    'NOT GIVEN') :
                'NOT GIVEN';
            eD.department = (emp.departmentTable) ?
                (emp.departmentTable.name.toUpperCase() ?
                    emp.departmentTable.name.toUpperCase() :
                    'NOT GIVEN') :
                'NOT GIVEN';
            eD.date_of_join = (emp.date_of_join) ? emp.date_of_join : new Date();
            eD.payment_method = emp.payment_method;
            eD.gSalary = 0;
            eD.tDays = tDays;
            eD.pDays = 0;
            eD.aDays = 0;
            eD.lDays = 0;
            eD.wDays = 0;
            eD.hDays = 0;
            eD.oDays = 0;
            eD.basic = 0;
            eD.house_rent = 0;
            eD.medical = 0;
            eD.conveyance = 0;
            eD.abcDeduct = 0;
            eD.advDeduct = 0;
            eD.othDeduct = 0;
            eD.aitDeduct = 0;
            eD.ttlDeduct = 0;
            eD.netPayable = 0;

            eD.attData = {};
            var atdData = {};
            eD.atTime = {};
            var atTime = {};
            //eD.leave = {};

            /////////////////// HOLIDAY OR WEEKEND BETWEEN ABSENT INITIALIZING START //////////////////
            var abFlag = 0;
            //eD.abFlag = 0;
            var abDtArr = [];
            /////////////////// HOLIDAY OR WEEKEND BETWEEN ABSENT INITIALIZING START //////////////////

            ///////////////////////////// Salary Start /////////////////////////////////
            db.salary.findAll({
                where: {
                    employee: emp.id,
                },
                order: [
                    ['approve_date', 'ASC']
                ]
            }).complete(function(err, salData) {
                async.each(salData, function(sal, cb_sal) {
                    eD.gSalary += sal.amount;
                    cb_sal();
                }, function(err) {
                    eD.basic = eD.gSalary / 100 * 60;
                    eD.house_rent = eD.gSalary / 100 * 30;
                    eD.medical = eD.gSalary / 100 * 5;
                    eD.conveyance = eD.gSalary / 100 * 5;
                    eD.branch_code = '000';
                    eD.account_type = '000';
                    eD.account_no = '0000000';
                    eD.account = '' + eD.branch_code + eD.account_type + eD.account_no;

                    db.bank_account.findAll({
                        where: {
                            employee: emp.id,
                        }
                    }).complete(function(err, bankAData) {
                        async.each(bankAData, function(bankA, cb_bankA) {
                            eD.branch_code = (bankA.branch_code) ? addLeadingZero(3, bankA.branch_code) : '000';
                            eD.account_type = (bankA.account_type) ? addLeadingZero(3, bankA.account_type) : '000';
                            eD.account_no = (bankA.account_no) ? addLeadingZero(7, bankA.account_no) : '000000';
                            eD.account = '' + eD.branch_code + eD.account_type + eD.account_no;
                            cb_bankA();
                        }, function(err) {

                            ////////// Deduction Start /////////
                            db.deduction.findAll({
                                where: {
                                    employee: emp.id,
                                    month: {
                                        between: [ef, et]
                                    }
                                },
                                attributes: ['id', 'month', 'advance', 'ait', 'others'],
                            }).complete(function(err, deductData) {
                                async.each(deductData, function(deduct, cb_deduct) {
                                    eD.advDeduct += (deduct.advance) ? parseFloat(deduct.advance) : 0;
                                    eD.othDeduct += (deduct.others) ? parseFloat(deduct.others) : 0;
                                    eD.aitDeduct += (deduct.ait) ? parseFloat(deduct.ait) : 0;
                                    cb_deduct();
                                }, function(err) {

                                    ///////// Leave Start ////////
                                    db.leave.findAll({
                                        where: {
                                            employee: emp.id,
                                            date: {
                                                between: [f, t]
                                            }
                                        },
                                        attributes: ['id', 'date'],
                                        include: [{
                                            model: db.leave_type,
                                            attributes: ['id', 'name']
                                        }, ]
                                    }).complete(function(err, lvData) {
                                        async.each(lvData, function(lv, cb_lv) {
                                            if (lv.date.getMonth() == prM) {
                                                lva.push('P' + lv.date.getDate());
                                                lvj['P' + lv.date.getDate()] = (lv.leaveTypeTable.name) ? shortNames(lv.leaveTypeTable.name) : 'A';
                                            } else if (lv.date.getMonth() == nxM) {
                                                lva.push('N' + lv.date.getDate());
                                                lvj['N' + lv.date.getDate()] = (lv.leaveTypeTable.name) ? shortNames(lv.leaveTypeTable.name) : 'A';
                                            } else {
                                                lva.push('C' + lv.date.getDate());
                                                lvj['C' + lv.date.getDate()] = (lv.leaveTypeTable.name) ? shortNames(lv.leaveTypeTable.name) : 'A';
                                            }

                                            //eD.leave[shortNames(lv.leaveTypeTable.name)] = 0;
                                            cb_lv();
                                        }, function(err) {

                                            ///////////////////////////// DateList Start /////////////////////////////////
                                            async.each(dateList, function(dL, cb_dL) {
                                                var tmpDate1 = new Date(SD);
                                                var tdL = (dL[2]) ? dL[1] + dL[2] : dL[1];

                                                tmpDate1.setDate(parseInt(tdL));
                                                if (dL[0] == 'C') {
                                                    tmpDate1.setMonth(SD.getMonth());
                                                } else if (dL[0] == 'P') {
                                                    tmpDate1.setMonth(SD.getMonth() - 1);
                                                    if (SD.getMonth() == 0) {
                                                        tmpDate1.setFullYear(SD.getFullYear() - 1);
                                                    }
                                                } else {
                                                    tmpDate1.setMonth(SD.getMonth() + 1);
                                                    if (SD.getMonth() == 11) {
                                                        tmpDate1.setFullYear(SD.getFullYear() + 1);
                                                    }
                                                }

                                                pH[dL] = 24;
                                                pM[dL] = 60;
                                                pS[dL] = 60;
                                                eD.atTime[dL] = pH[dL] + ':' + pM[dL] + ':' + pS[dL];
                                                atTime[dL] = pH[dL] + ':' + pM[dL] + ':' + pS[dL];

                                                /////////////////////////////// INITIALIZING DAYS /////////////////////////////
                                                eD.attData[dL] = 'A';
                                                atdData[dL] = 'A';

                                                /////////////////////////////// CHECKING WEEKENDS /////////////////////////////
                                                if (tmpDate1.getDay() == 5) {
                                                    eD.attData[dL] = 'W';
                                                    atdData[dL] = 'W';
                                                }

                                                /////////////////////////////// CHECKING HOLIDAYS /////////////////////////////
                                                if (holiday.indexOf(dL) != -1) {
                                                    eD.attData[dL] = 'H';
                                                    atdData[dL] = 'H';
                                                }

                                                ///////// INITIALIZING ADJUSTMENT DAYS //////////
                                                if (adjustment.indexOf(dL) != -1) {
                                                    eD.attData[dL] = 'A';
                                                    atdData[dL] = 'A';
                                                }

                                                cb_dL();
                                            }, function(err) {

                                                ///////// Attendance Start /////////
                                                db.attendance.findAll({
                                                    where: {
                                                        punch_time: {
                                                            between: [f, t]
                                                        },
                                                        employee: emp.id
                                                    },
                                                    attributes: ['id', 'punch_time'],
                                                    order: [
                                                        ['id', 'ASC']
                                                    ],
                                                }).complete(function(err, attData) {
                                                    async.each(attData, function(atd, cb_atd) {
                                                        var pT = atd.punch_time;
                                                        var pD = 'C' + pT.getUTCDate();
                                                        if (pT.getUTCMonth() == prM) {
                                                            pD = 'P' + pT.getUTCDate();
                                                        } else if (pT.getUTCMonth() == nxM) {
                                                            pD = 'N' + pT.getUTCDate();
                                                        } else {
                                                            pD = 'C' + pT.getUTCDate();
                                                        }
                                                        //var pD = pT.getUTCDate();

                                                        //////////////////////// INTIME INITIALIZE START //////////////////////////
                                                        var InTimeH = pT.getUTCHours();
                                                        var InTimeM = pT.getUTCMinutes();
                                                        var InTimeS = pT.getUTCSeconds();

                                                        if (InTimeH < pH[pD]) {
                                                            pH[pD] = InTimeH;
                                                            pM[pD] = InTimeM;
                                                            pS[pD] = InTimeS;
                                                        }
                                                        if (InTimeH == pH[pD]) {
                                                            if (InTimeM < pM[pD]) {
                                                                pM[pD] = InTimeM;
                                                                pS[pD] = InTimeS;
                                                            }
                                                        }
                                                        //////////////////////// INTIME INITIALIZE END //////////////////////////

                                                        eD.atTime[pD] = pH[pD] + ':' + pM[pD] + ':' + pS[pD];
                                                        atTime[pD] = pH[pD] + ':' + pM[pD] + ':' + pS[pD];

                                                        cb_atd();
                                                    }, function(err) {
                                                        var tmpAbDtArr = [];

                                                        async.each(dateList, function(dL2, cb_dL2) {
                                                            ///////////////////////////////// TIME ZONE 9:30 START ///////////////////////////////
                                                            if (atdData[dL2] == 'A') {
                                                                if (pH[dL2] < 24) {
                                                                    if (pH[dL2] <= 9) {
                                                                        if (pH[dL2] == 9 && pM[dL2] > 30) {
                                                                            atdData[dL2] = 'L';
                                                                            eD.attData[dL2] = 'L';
                                                                        } else {
                                                                            eD.attData[dL2] = 'P';
                                                                            atdData[dL2] = 'P';
                                                                        }
                                                                    } else {
                                                                        atdData[dL2] = 'L';
                                                                        eD.attData[dL2] = 'L';
                                                                    }
                                                                }
                                                            }
                                                            ///////////////////////////////// TIME ZONE 9:30 END ///////////////////////////////

                                                            if (atdData[dL2] == 'A' || atdData[dL2] == 'H' || atdData[dL2] == 'W') {
                                                                if (atdData[dL2] == 'A') {
                                                                    if (abFlag == 1) {
                                                                        abDtArr = abDtArr.concat(tmpAbDtArr);
                                                                        tmpAbDtArr = [];
                                                                    }
                                                                    abFlag = 1;
                                                                } else {
                                                                    if (abFlag == 1) {
                                                                        tmpAbDtArr.push(dL2);
                                                                    }
                                                                }
                                                            } else {
                                                                if (abFlag == 1) {
                                                                    abFlag = 0;
                                                                    tmpAbDtArr = [];
                                                                }
                                                            }

                                                            cb_dL2();
                                                        }, function(err) {
                                                            async.each(dateList, function(dL3, cb_dL3) {

                                                                ///////////////////////////////// APPLYING ABSENT BETWEEN ABSENT START ///////////////////////////////
                                                                if (abDtArr.indexOf(dL3) != -1) {
                                                                    atdData[dL3] = 'A';
                                                                }
                                                                ///////////////////////////////// APPLYING ABSENT BETWEEN ABSENT END ///////////////////////////////

                                                                ///////////////////////////////// APPLYING LEAVE START ///////////////////////////////
                                                                if (lva.indexOf(dL3) != -1) {
                                                                    atdData[dL3] = lvj[dL3];
                                                                    eD.attData[dL3] = lvj[dL3];
                                                                }
                                                                ///////////////////////////////// APPLYING LEAVE END ///////////////////////////////

                                                                if (dL3[0] == 'C') {
                                                                    if (atdData[dL3] == 'A') {
                                                                        eD.aDays++;
                                                                    } else if (atdData[dL3] == 'H') {
                                                                        eD.hDays++;
                                                                    } else if (atdData[dL3] == 'W') {
                                                                        eD.wDays++;
                                                                    } else if (atdData[dL3] == 'L') {
                                                                        eD.lDays++;
                                                                    } else {
                                                                        eD.oDays++;
                                                                    }
                                                                    //atTime[dL3] = atdData[dL3]
                                                                    //eD.atTime[dL3] = eD.attData[dL3]+'-'+atTime[dL3]
                                                                }
                                                                cb_dL3();
                                                            }, function(err) {
                                                                var tLDays = eD.lDays - parseInt(eD.lDays / 3)
                                                                eD.pDays = eD.oDays + eD.wDays + eD.hDays + tLDays;
                                                                eD.aDays += parseInt(eD.lDays / 3);
                                                                eD.abcDeduct = Math.round((eD.gSalary / eD.tDays) * eD.aDays);
                                                                eD.ttlDeduct = eD.abcDeduct + eD.advDeduct + eD.othDeduct + eD.aitDeduct;
                                                                eD.netPayable = eD.gSalary - eD.ttlDeduct;
                                                                returnData.push(eD);
                                                            });
                                                        });

                                                    });

                                                });
                                                ///////////////////////////// Attendance End /////////////////////////////////

                                            });
                                            ///////////////////////////// DateList End /////////////////////////////////

                                        });
                                    });
                                    ///////////////////////////// Leave End /////////////////////////////////
                                });
                            });
                        })
                    })
                });
            });
            ///////////////////////////// Salary End /////////////////////////////////

        }, function(err) {
            returnData.sort(function(a, b) {
                return parseFloat(a.id) - parseFloat(b.id);
            });
            returnData.push(dD);
            cb_dep();
        });

    });
}

function dArray3Month(a) {
    var cM = new Date(a); ///// Current Month
    var pM = new Date(cM); ///// Previous Month
    pM.setMonth(pM.getMonth() - 1);
    var cMC = cM.monthDays(); ///// Current Month Count
    var pMC = pM.monthDays(); ///// Previous Month Count

    var TpMC = 20;
    var TnMC = 1;
    var TcMC = 1;

    var r_array = [];
    while (TpMC <= pMC) {
        r_array.push('P' + TpMC);
        TpMC++;
    }
    while (TcMC <= cMC) {
        r_array.push('C' + TcMC);
        TcMC++;
    }
    while (TnMC < 10) {
        r_array.push('N' + TnMC);
        TnMC++;
    }
    return r_array;
}

function shortNames(str) {
    var str_arr = str.split(" ");
    var returnString = '';
    for (var i = 0; i < str_arr.length; i++) {
        returnString += str_arr[i][0]
    };
    return returnString;
}








function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR


}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR


}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;