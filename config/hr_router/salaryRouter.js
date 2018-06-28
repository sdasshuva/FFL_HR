module.exports = function() {};

function salary_list(db, callback) {
    db.salary.findAll({
        include: [{
            model: db.employee,
            attributes: ['name']
        }],
        order: [
            ['id', 'DESC']
        ]
    }).complete(function(err, data) {
        callback(data);
    })
}

function salary_details_list(db, ID, callback) {
    db.salary.findAll({
        where: {
            employee: ID
        }
    }).complete(function(err, data) {
        callback(data);
    })
}

function salary_statement_report(db, searchM, callback) {
    var SD = (searchM) ? new Date(searchM) : new Date();
    //var SD = new Date('9/9/2016');
    var ef = new Date(SD);
    var et = new Date(SD);
    ef.setDate(1);
    et.setMonth(et.getMonth() + 1);
    et.setDate(0);

    var f = new Date(SD);
    var t = new Date(SD);
    f.setMonth(f.getMonth() - 1);
    f.setDate(20);
    t.setMonth(t.getMonth() + 1);
    t.setDate(10);

    var prM = f.getMonth();
    var nxM = t.getMonth();

    var returnData = [];
    var holiday = [];
    var adjustment = [];
    var dateList = dArray3Month(SD);
    var tDays = SD.monthDays(); // Month Days Count

    ////// Holiday Start ///////
    db.holiday.findAll({
            attributes: ['id', 'date'],
            where: {
                date: {
                    between: [f, t]
                }
            },
        }).complete(function(err, hData) {
            async.each(hData, function(holid, cb_holid) {
                if (holid.date) {
                    if (holid.date.getMonth() == prM)
                        holiday.push('P' + holid.date.getDate());
                    else if (holid.date.getMonth() == nxM)
                        holiday.push('N' + holid.date.getDate());
                    else
                        holiday.push('C' + holid.date.getDate());
                }
                cb_holid();
            }, function(err) {
                ////// Adjustment Start ///////
                db.adjustment.findAll({
                        attributes: ['id', 'date'],
                        where: {
                            date: {
                                between: [f, t]
                            }
                        },
                    }).complete(function(err, aData) {
                        async.each(aData, function(adj, cb_adj) {
                            if (adj.date) {
                                if (adj.date.getMonth() == prM)
                                    adjustment.push('P' + adj.date.getDate());
                                else if (adj.date.getMonth() == nxM)
                                    adjustment.push('N' + adj.date.getDate());
                                else
                                    adjustment.push('C' + adj.date.getDate());
                            }
                            cb_adj();
                        }, function(err) {

                            /////// Dep Start ///////////
                            db.department.findAll({
                                where: {
                                    status: 1
                                },
                                attributes: ['id', 'name']
                            }).complete(function(err, depData) {
                                async.each(depData, function(dep, cb_dep) {
                                    var dD = {};
                                    dD.id = dep.id;
                                    dD.name = dep.name.toUpperCase();
                                    dD.employee = [];

                                    /////// Emp Start ////////
                                    db.employee.findAll({
                                        where: {
                                            department: dep.id,
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
                                            eD.fp = emp.id;
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
                                            eD.aOnly = 0;
                                            //eD.inLate = 0;
                                            //eD.outLate = 0;
                                            eD.Leave = 0;
                                            //eD.lLeave = 0;
                                            //eD.sLeave = 0;
                                            //eD.cLeave = 0;
                                            //eD.alLeave = 0;
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

                                            //////// HOLIDAY OR WEEKEND BETWEEN ABSENT INITIALIZING START ////////
                                            var abFlag = 0;
                                            //eD.abFlag = 0;
                                            var abDtArr = [];
                                            /////// HOLIDAY OR WEEKEND BETWEEN ABSENT INITIALIZING START ////////

                                            ///////// Salary Start ///////////
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

                                                                    if (emp.payment_method == 1) {
                                                                        eD.othDeduct += 10;
                                                                    }
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
                                                                            //////// DateList Start /////////
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

                                                                                ////// INITIALIZING DAYS ///////////
                                                                                eD.attData[dL] = 'A';
                                                                                atdData[dL] = 'A';

                                                                                /////// CHECKING WEEKENDS //////////
                                                                                if (tmpDate1.getDay() == 5) {
                                                                                    eD.attData[dL] = 'W';
                                                                                    atdData[dL] = 'W';
                                                                                }

                                                                                //////// CHECKING HOLIDAYS ///////
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

                                                                                        ////// INTIME INITIALIZE START ////////
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
                                                                                        /////////// INTIME INITIALIZE END //////////

                                                                                        eD.atTime[pD] = pH[pD] + ':' + pM[pD] + ':' + pS[pD];
                                                                                        atTime[pD] = pH[pD] + ':' + pM[pD] + ':' + pS[pD];

                                                                                        cb_atd();
                                                                                    }, function(err) {
                                                                                        var tmpAbDtArr = [];

                                                                                        async.each(dateList, function(dL2, cb_dL2) {
                                                                                            /////////// TIME ZONE 9:30 START ////////////
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
                                                                                            ////////// TIME ZONE 9:30 END ///////////

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

                                                                                                ///////// APPLYING ABSENT BETWEEN ABSENT START /////////
                                                                                                if (abDtArr.indexOf(dL3) != -1) {
                                                                                                    atdData[dL3] = 'A';
                                                                                                    eD.attData[dL3] = 'A';
                                                                                                }
                                                                                                ////////// APPLYING ABSENT BETWEEN ABSENT END ////////

                                                                                                //////// APPLYING LEAVE START ////////////
                                                                                                if (lva.indexOf(dL3) != -1) {
                                                                                                    atdData[dL3] = lvj[dL3];
                                                                                                    eD.attData[dL3] = lvj[dL3];
                                                                                                }
                                                                                                ////////// APPLYING LEAVE END /////////

                                                                                                if (dL3[0] == 'C') {
                                                                                                    if (atdData[dL3] == 'A') {
                                                                                                        eD.aOnly++;
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
                                                                                                    if (lva.indexOf(dL3) != -1) {
                                                                                                        eD.Leave++;
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
                                                                                                dD.employee.push(eD);
                                                                                                cb_emp()
                                                                                            });
                                                                                        });

                                                                                    });

                                                                                });
                                                                                /////// Attendance End ////////

                                                                            });
                                                                            /////////// DateList End //////////

                                                                        });
                                                                    });
                                                                    ///////// Leave End /////////


                                                                });
                                                            });
                                                        })
                                                    })
                                                });
                                            });
                                            /////// Salary End ////////

                                        }, function(err) {
                                            dD.employee.sort(function(a, b) {
                                                return parseFloat(a.id) - parseFloat(b.id);
                                            });
                                            returnData.push(dD);
                                            cb_dep();
                                        });

                                    });
                                    ///////// Emp End /////////


                                }, function(err) {
                                    callback(returnData);
                                });
                            });
                            ///////// Dep End /////////


                        });
                    })
                    /////// Adjustment End ////////

            });
        })
        ///////// Holiday End ////////
}

function salary_statement_report_old(db, searchM, callback) {
    var SD = (searchM) ? new Date(searchM) : new Date('8/8/2016');
    //var SD = new Date('9/9/2016');

    var ef = new Date(SD);
    var et = new Date(SD);
    ef.setDate(1);
    et.setMonth(et.getMonth() + 1);
    et.setDate(0);

    var f = new Date(SD);
    var t = new Date(SD);
    f.setMonth(f.getMonth() - 1);
    f.setDate(20);
    t.setMonth(t.getMonth() + 1);
    t.setDate(10);

    var prM = f.getMonth();
    var nxM = t.getMonth();

    var returnData = [];
    var holiday = [];
    var adjustment = [];
    var dateList = dArray3Month(SD);
    var tDays = SD.monthDays(); // Month Days Count

    ///////////////////////////// Holiday Start /////////////////////////////////
    db.holiday.findAll({
            attributes: ['id', 'date'],
            where: {
                date: {
                    between: [f, t]
                }
            },
        }).complete(function(err, hData) {
            async.each(hData, function(holid, cb_holid) {
                if (holid.date) {
                    if (holid.date.getMonth() == prM)
                        holiday.push('P' + holid.date.getDate());
                    else if (holid.date.getMonth() == nxM)
                        holiday.push('N' + holid.date.getDate());
                    else
                        holiday.push('C' + holid.date.getDate());
                }
                cb_holid();
            }, function(err) {

                ///////////////////////////// Adjustment Start /////////////////////////////////
                db.adjustment.findAll({
                        attributes: ['id', 'date'],
                        where: {
                            date: {
                                between: [f, t]
                            }
                        },
                    }).complete(function(err, aData) {
                        async.each(aData, function(adj, cb_adj) {
                            if (adj.date) {
                                if (adj.date.getMonth() == prM)
                                    adjustment.push('P' + adj.date.getDate());
                                else if (adj.date.getMonth() == nxM)
                                    adjustment.push('N' + adj.date.getDate());
                                else
                                    adjustment.push('C' + adj.date.getDate());
                            }
                            cb_adj();
                        }, function(err) {

                            ///////////////////////////// Dep Start /////////////////////////////////
                            db.department.findAll({
                                where: {
                                    status: 1
                                },
                                attributes: ['id', 'name']
                            }).complete(function(err, depData) {
                                async.each(depData, function(dep, cb_dep) {
                                    var dD = {};
                                    dD.id = dep.id;
                                    dD.name = dep.name.toUpperCase();
                                    dD.employee = [];

                                    ///////////////////////////// Emp Start /////////////////////////////////
                                    db.employee.findAll({
                                        where: {
                                            department: dep.id,
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
                                                                                                dD.employee.push(eD);
                                                                                                cb_emp()
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
                                            dD.employee.sort(function(a, b) {
                                                return parseFloat(a.id) - parseFloat(b.id);
                                            });
                                            returnData.push(dD);
                                            cb_dep();
                                        });

                                    });
                                    ///////////////////////////// Emp End /////////////////////////////////


                                }, function(err) {
                                    callback(returnData);
                                });
                            });
                            ///////////////////////////// Dep End /////////////////////////////////


                        });
                    })
                    ///////////////////////////// Adjustment End /////////////////////////////////

            });
        })
        ///////////////////////////// Holiday End /////////////////////////////////
}

function salaryStatementHeader(ms) {
    var sSH = '<div style="' +
        'color: #444;' +
        'font-size: 8px;' +
        'position: fixed;' +
        'top: 15;' +
        'right: 15;' +
        '">' +
        '<span>PRINT TIME: ' +
        new Date() +
        '</span>' +
        '</div>' +
        '<br />' +
        '<h1 style="line-height: 0.5;font-size: 80%;">' +
        factoryName +
        '</h1>' +
        '<h2 style="line-height: 0.5;font-size: 65%;">' +
        'SALARY STATEMENT' +
        '</h2>' +
        '<h3 style="line-height: 0.5;font-size: 55%;">' +
        'FOR THE MONTH OF ' +
        // monthCapitalNames[ms.getMonth()-1]+'-'+
        monthCapitalNames[ms.getMonth()] + ', ' +
        ms.getUTCFullYear() +
        '</h3>';
    return sSH;
}


function footerSContents() {
    var fC = '<div style="' +
        'color: #444;' +
        'font-size: 9px;' +
        'position: fixed;' +
        'bottom: 15;' +
        'right: 15;' +
        '">' +
        '<span>PAGE {{page}}</span>' +
        ' OF ' +
        '<span>{{pages}}</span>' +
        '</div>';
    fC += '<br />';
    fC += '<table style="width:100%;border: 0px solid white;">';
    fC += '<tr style="border: 0px solid white;">';
    fC += '<td style="border: 0px solid white;" align="left"><small>Sr. Executive (F&A)</small></td>';
    fC += '<td style="border: 0px solid white;" align="center"><small>Manager (F&A)</small></td>';
    fC += '<td style="border: 0px solid white;" align="right"><small>Managing Director</small></td>';
    fC += '</tr>';
    fC += '</table>';
    return fC;
}

function salaryStatementReportHeadHTML() {
    var r = '<tr>' +
        '<th rowspan="2">#</th>' +
        '<th rowspan="2">EMPLOYEE NAME</th>' +
        '<th rowspan="2">DESIGNATION</th>' +
        '<th rowspan="2"><small>DATE OF JOIN</small></th>' +
        '<th rowspan="2"><small>T.D.</small></th>' +
        '<th rowspan="2"><small>P.D.</small></th>' +
        '<th rowspan="2"><small>A.D.</small></th>' +
        '<th rowspan="2">BASIC</th>' +
        '<th colspan="3">ALLOWANCES</th>' +
        '<th rowspan="2">GROSS<br />SALARY</th>' +
        '<th colspan="4">DEDUCTIONS</th>' +
        '<th rowspan="2">TOTAL<br />DEDUCT.</th>' +
        '<th rowspan="2">NET<br />PAYABLE</th>' +
        '<th rowspan="2">PAY.<br />MODE</th>' +
        '<th rowspan="2">SIGNATURE</th>' +
        '</tr>' +
        '<tr>' +
        '<th><small>House Rent</small></th>' +
        '<th><small>Medical</small></th>' +
        '<th><small>Conveyance</small></th>' +
        '<th><small>Absent</small></th>' +
        '<th><small>Advance</small></th>' +
        '<th><small>Others</small></th>' +
        '<th><small>AIT</small></th>' +
        '</tr>';
    return r;
}


function DestroySalary(db, DATA, callback) {
    db.salary.destroy({
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

function UpdateSalaryApproveDate(db, DATA, callback) {
    var app_date = new Date(DATA.approve_date);
    app_date.setDate(1);
    app_date.setHours(8);
    db.salary.update({
        approve_date: app_date
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

function UpdateSalaryPaymentMethod(db, DATA, callback) {
    db.employee.update({
        payment_method: DATA.payment_method
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

function UpdateSalaryAmount(db, DATA, callback) {
    db.salary.update({
        amount: DATA.amount
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

function CreateSalary(db, DATA, callback) {
    if (DATA.input_salary) {
        db.salary.create({
            employee: DATA.employee,
            amount: DATA.amount,
            approve_date: DATA.approve_date,
        }).complete(function(err, employee) {
            if (err) {
                callback("error");
            } else {
                db.employee.update({
                    payment_method: DATA.payment_method
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
                        db.bank_account.findAll({
                            where: {
                                employee: DATA.employee,
                                bank: DATA.bank
                            },
                        }).complete(function(err, bank_account) {
                            if (bank_account.length > 0) {
                                db.bank_account.update({
                                    is_active: 0,
                                }, {
                                    employee: DATA.employee
                                }).complete(function(err, r) {
                                    db.bank_account.update({
                                        branch_code: DATA.branch_code,
                                        account_type: DATA.account_type,
                                        account_no: DATA.account_no,
                                        is_active: DATA.is_active,
                                    }, {
                                        employee: DATA.employee,
                                        bank: DATA.bank
                                    }).complete(function(err, bank_account) {
                                        if (err) {
                                            callback("error");
                                        } else {
                                            callback("success");
                                        }
                                    })
                                })
                            } else {
                                db.bank_account.update({
                                    is_active: 0,
                                }, {
                                    employee: DATA.employee
                                }).complete(function(err, r) {
                                    db.bank_account.create({
                                        employee: DATA.employee,
                                        bank: DATA.bank,
                                        branch_code: DATA.branch_code,
                                        account_type: DATA.account_type,
                                        account_no: DATA.account_no,
                                        is_active: DATA.is_active
                                    }).complete(function(err, bank_account) {
                                        if (err) {
                                            callback("error");
                                        } else {
                                            callback("success");
                                        }
                                    })
                                })
                            }
                        })
                    }
                })
            }
        })
    } else {
        db.employee.update({
            payment_method: DATA.payment_method
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
                db.bank_account.findAll({
                    where: {
                        employee: DATA.employee,
                        bank: DATA.bank
                    },
                }).complete(function(err, bank_account) {
                    if (bank_account.length > 0) {
                        db.bank_account.update({
                            is_active: 0,
                        }, {
                            employee: DATA.employee
                        }).complete(function(err, r) {
                            db.bank_account.update({
                                branch_code: DATA.branch_code,
                                account_type: DATA.account_type,
                                account_no: DATA.account_no,
                                is_active: DATA.is_active,
                            }, {
                                employee: DATA.employee,
                                bank: DATA.bank
                            }).complete(function(err, bank_account) {
                                if (err) {
                                    callback("error");
                                } else {
                                    callback("success");
                                }
                            })
                        })
                    } else {
                        db.bank_account.update({
                            is_active: 0,
                        }, {
                            employee: DATA.employee
                        }).complete(function(err, r) {
                            db.bank_account.create({
                                employee: DATA.employee,
                                bank: DATA.bank,
                                branch_code: DATA.branch_code,
                                account_type: DATA.account_type,
                                account_no: DATA.account_no,
                                is_active: DATA.is_active
                            }).complete(function(err, bank_account) {
                                if (err) {
                                    callback("error");
                                } else {
                                    callback("success");
                                }
                            })
                        })
                    }
                })
            }
        })
    }
}

function salaryStatementReportHead() {
    var sSRH = '<head>' +
        '<style>' +
        'table, th, td {' +
        'border: 1px solid black;' +
        'border-collapse: collapse;' +
        '}' +
        'th, td {' +
        'padding: 5px;' +
        'line-height: 1;' +
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
        '</style>' +
        '</head>';
    return sSRH;
}


function getEmployeeMonthSummaryV2(db, QUERY, callback) {
    var returnData = [];
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    var dayArray = dayArrayFunc(d.monthDays());
    var rangeMArray = rangeMArrayFunc(d);
    getEmployeeMonthAttendanceV2(db, QUERY, function(empData) {
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

function bonusStatementHeader(ms, t) {
    var d = new Date(ms)
    var sSH = '<br />' +
        '<h1 style="line-height: 0.5;font-size: 80%;">' +
        factoryName +
        '</h1>' +
        '<h2 style="line-height: 0.5;font-size: 65%;">' +
        'FESTIVAL BONUS STATEMENT' +
        '</h2>' +
        '<h3 style="line-height: 0.5;font-size: 55%;">' +
        'FOR THE FESTIVAL OF ' + t + ', ' +
        d.getUTCFullYear() +
        '</h3>';
    return sSH;
}

function bankStatementReportHead() {
    var sSRH = '<head>' +
        '<style>' +
        'table, th, td {' +
        'border: 1px solid black;' +
        'border-collapse: collapse;' +
        '}' +
        'th, td {' +
        'padding: 5px;' +
        'line-height: 1;' +
        'align: center;' +
        '}' +
        'h1, h2, h3, h4, h5, h6 {' +
        'line-height: 0;' +
        'text-align: center;' +
        '}' +
        '#pageBody {' +
        'font-size: 9px;' +
        'padding: 0px 20px 0px 20px;' +
        //'page-break-after: always;'+
        '}' +
        '#pageBody:last-child {' +
        //'page-break-after: avoid;'+
        '}' +
        '</style>' +
        '</head>';
    return sSRH;
}

function footerContents() {
    var fC = '<div style="' +
        'color: #444;' +
        'font-size: 9px;' +
        'position: fixed;' +
        'bottom: 15;' +
        'right: 15;' +
        '">' +
        '<span>PAGE {{page}}</span>' +
        ' OF ' +
        '<span>{{pages}}</span>' +
        '</div>';
    return fC;
}


function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/salary', /*isAuthenticated,*/ function(req, res) {
        salary_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/salary/:EID', /*isAuthenticated,*/ function(req, res) {
        var EID = req.params.EID;
        salary_details_list(db, EID, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/salary_statement_report/:DEPARTMENT_ID', /*isAuthenticated,*/ function(req, res) {
        var DEPARTMENT_ID = req.params.DEPARTMENT_ID;
        salary_statement_report(db, /*DEPARTMENT_ID, */ req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/salary_statement_report', /*isAuthenticated,*/ function(req, res) {
        var sM = new Date('2017-1-1');
        salary_statement_report(db, sM, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

}


function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('DestroySalary', function(data) {
        DestroySalary(db, data, function(data) {
            socket.emit("DestroySalary", data)
        });
    });



    socket.on('UpdateSalaryApproveDate', function(data) {
        UpdateSalaryApproveDate(db, data, function(data) {
            socket.emit("UpdateSalaryApproveDate", data)
        });
    });

    socket.on('UpdateSalaryPaymentMethod', function(data) {
        UpdateSalaryPaymentMethod(db, data, function(data) {
            socket.emit("UpdateSalaryPaymentMethod", data)
        });
    });

    socket.on('UpdateSalaryAmount', function(data) {
        UpdateSalaryAmount(db, data, function(data) {
            socket.emit("UpdateSalaryAmount", data)
        });
    });

    socket.on('CreateSalary', function(data) {
        CreateSalary(db, data, function(data) {
            socket.emit("CreateSalary", data)
        });
    });

    socket.on('DownloadSalaryStatementReport', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>.' +
            salaryStatementReportHead();
        getC.getDepartment(db, QUERY, function(depList) {
            depList.sort(function(a, b) {
                var p1 = a.id;
                var p2 = b.id;

                if (p1 < p2) return -1;
                if (p1 > p2) return 1;
                return 0;
            });
            async.each(depList, function(dep, cb_dep) {
                var empSearch = {};
                empSearch.department = dep.id;
                empSearch.date = d;
                getC.getEmployeeMonthSummary(db, empSearch, function(empData) {
                    empData.sort(function(a, b) {
                        var o1 = a.designationID;
                        var o2 = b.designationID;

                        var p1 = a.id;
                        var p2 = b.id;

                        if (o1 < o2) return -1;
                        if (o1 > o2) return 1;
                        if (p1 < p2) return -1;
                        if (p1 > p2) return 1;
                        return 0;
                    });
                    var r = 0,
                        basic = 0;
                    house_rent = 0;
                    medical = 0;
                    conveyance = 0;
                    salary = 0;
                    absentDeduct = 0;
                    advanceDeduct = 0;
                    aitDeduct = 0;
                    othersDeduct = 0;
                    totalDeduct = 0;
                    tNetPayable = 0;
                    htmlData += '<div id="pageBody">' +
                        '<b style="line-height:2"><big>' +
                        dep.name.toUpperCase() +
                        ':- </big></b>' +
                        '<table style="width:100%;">' +
                        salaryStatementReportHeadHTML();
                    async.each(empData, function(emp, cb_emp) {
                        basic += emp.basic;
                        house_rent += emp.house_rent;
                        medical += emp.medical;
                        conveyance += emp.conveyance;
                        salary += emp.salary;
                        absentDeduct += emp.absentDeduct;
                        advanceDeduct += emp.advanceDeduct;
                        aitDeduct += emp.aitDeduct;
                        othersDeduct += emp.othersDeduct;
                        totalDeduct += emp.totalDeduct;
                        tNetPayable += emp.netPayable;
                        r++;
                        htmlData += '<tr>' +
                            '<td height="10">' + r + '</td>' +
                            '<td height="60">' + emp.name + '</td>' +
                            '<td>' + emp.designation + '</td>' +
                            '<td>' + emp.date_of_join + '</td>' +
                            '<td align="right">' + emp.totalDays + '</td>' +
                            '<td align="right">' + emp.totalPayableDays + '</td>' +
                            '<td align="right">' + emp.totalDeductDays + '</td>' +
                            '<td align="right">' + emp.basic.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.house_rent.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.medical.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.conveyance.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.salary.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.othersDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.aitDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.totalDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.netPayable.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="center">' + ((emp.payment_method == 1) ? 'CASH' : 'BANK') + '</td>' +
                            '<td></td>' +
                            '</tr>';
                        cb_emp();
                    }, function(err) {
                        // htmlData+='</table></div>';
                        htmlData += '<tr>' +
                            '<td colspan="7"><b>TOTAL</b></td>' +
                            '<td align="right"><b>' + basic.formatMoney(2, '.', ',') + '</b></td>' +
                            '<td align="right">' + house_rent.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + medical.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + conveyance.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + salary.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + othersDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + aitDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right"><b>' + totalDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                            '<td align="right"><b>' + tNetPayable.formatMoney(2, '.', ',') + '</b></td>' +
                            '<td colspan="2"></td>' +
                            '</tr>' +
                            '</table></div>';
                        cb_dep();
                    });
                });
            }, function(err) {
                htmlData += '</body></html>';
                var options = {
                    format: 'Legal',
                    orientation: "landscape",
                    header: {
                        height: "20mm",
                        contents: salaryStatementHeader(d)
                    },
                    footer: {
                        height: "25mm",
                        contents: footerSContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    //if (err) return console.log(err);
                    socket.emit("DownloadSalaryStatementReport", 'success');
                });
            });
        });
    });


    socket.on('DownloadBonusStatementReport', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var htmlData = '<!DOCTYPE html>' +
            '<body>' +
            salaryStatementReportHead();
        getC.getDepartment(db, QUERY, function(depList) {
            depList.sort(function(a, b) {
                var o1 = a.name;
                var o2 = b.name;
                if (o1 < o2) return -1;
                if (o1 > o2) return 1;
                return 0;
            });
            async.each(depList, function(dep, cb_dep) {
                var empSearch = {};
                empSearch.department = dep.id;
                empSearch.date = d;
                getC.getEmployeeDetails(db, empSearch, function(empData) {
                    var r = 0,
                        netPayment = 0;
                    salary = 0;
                    tStamp = 0;
                    htmlData += '<div id="pageBody">' +
                        '<b style="line-height:2"><big>' +
                        dep.name.toUpperCase() +
                        ':- </big></b>' +
                        '<table style="width:100%;">' +
                        '<tr>' +
                        '<th>#</th>' +
                        '<th>EMPLOYEE NAME</th>' +
                        '<th>DESIGNATION</th>' +
                        '<th><small>DATE OF JOIN</small></th>' +
                        '<th>SALARY</th>' +
                        '<th><small>STAMP</small></th>' +
                        '<th>PAYABLE<br />AMOUNT</th>' +
                        '<th>PAY.<br />MODE</th>' +
                        '<th>SIGNATURE</th>' +
                        '</tr>';
                    async.each(empData, function(emp, cb_emp) {
                        var empDOJ = new Date(emp.date_of_join);
                        var tmpSD = new Date(QUERY.date);
                        tmpSD.setDate(1);
                        tmpSD.setMonth(tmpSD.getMonth() + 1);
                        tmpSD.setFullYear(tmpSD.getFullYear() - 1);
                        if (empDOJ <= tmpSD) {
                            var payment_method = (emp.payment_method == 1) ? 'CASH' : 'BANK';
                            var stamp = (emp.payment_method == 1 && parseInt(emp.salary) > 0) ? 10 : 0;
                            var payAmount = (QUERY.bonus_type == 'BASIC') ? Math.round(emp.basic) - stamp : Math.round(emp.salary / 2) - stamp;
                            netPayment += payAmount;
                            salary += parseFloat(emp.salary);
                            tStamp += stamp;
                            r++;
                            console.log(emp);
                            htmlData += '<tr>' +
                                '<td height="10">' + r + '</td>' +
                                '<td height="60">' + emp.name + '</td>' +
                                '<td>' + emp.designationName + '</td>' +
                                '<td>' + emp.date_of_join.formatDate() + '</td>' +
                                '<td align="right">' + parseFloat(emp.salary).formatMoney(2, '.', ',') + '</td>' +
                                '<td align="right">' + stamp.formatMoney(2, '.', ',') + '</td>' +
                                '<td align="right">' + payAmount.formatMoney(2, '.', ',') + '</td>' +
                                '<td align="center">' + payment_method + '</td>' +
                                '<td></td>' +
                                '</tr>';
                        }
                        cb_emp();
                    }, function(err) {
                        htmlData += '<tr>' +
                            '<td colspan="4"><b>TOTAL</b></td>' +
                            '<td align="right">' + salary.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + tStamp.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right"><b>' + netPayment.formatMoney(2, '.', ',') + '</b></td>' +
                            '<td colspan="2"></td>' +
                            '</tr>' +
                            '</table></div>';
                        cb_dep();
                    });
                });
            }, function(err) {
                htmlData += '</body></html>';
                var options = {
                    format: 'A4',
                    orientation: "portrait",
                    header: {
                        height: "20mm",
                        contents: bonusStatementHeader(d, QUERY.festive_type)
                    },
                    footer: {
                        height: "25mm",
                        contents: footerSContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadBonusStatementReport", 'success');
                });
            });
        });
    });


    socket.on('DownloadEmployeeSalaryDetails', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var htmlData = '<!DOCTYPE html>' +
            '<body>' +
            salaryStatementReportHead();
        getC.getDepartment(db, QUERY, function(depList) {
            depList.sort(function(a, b) {
                var o1 = a.name;
                var o2 = b.name;
                if (o1 < o2) return -1;
                if (o1 > o2) return 1;
                return 0;
            });
            async.each(depList, function(dep, cb_dep) {
                var empSearch = {};
                empSearch.department = dep.id;
                empSearch.date = d;
                getC.getEmployeeDetails(db, empSearch, function(empData) {
                    var r = 0,
                        salary = 0;
                    htmlData += '<div id="pageBody">' +
                        '<b style="line-height:2"><big>' +
                        dep.name.toUpperCase() +
                        ':- </big></b>' +
                        '<table style="width:100%;">' +
                        '<tr>' +
                        '<th>EMP ID</th>' +
                        '<th>EMPLOYEE NAME</th>' +
                        '<th>DESIGNATION</th>' +
                        '<th><small>DATE OF JOIN</small></th>' +
                        '<th><small>APPROVE DATE</small></th>' +
                        '<th>SALARY</th>' +
                        '<th>ACCOUNT<br />NUMBER</th>' +
                        '<th>PAY.<br />MODE</th>' +
                        '</tr>';
                    async.each(empData, function(emp, cb_emp) {
                        var empDOJ = new Date(emp.date_of_join);
                        var tmpSD = new Date(QUERY.date);
                        tmpSD.setDate(1);
                        tmpSD.setMonth(tmpSD.getMonth() + 1);
                        tmpSD.setFullYear(tmpSD.getFullYear() - 1);
                        if (empDOJ <= tmpSD) {
                            var payment_method = (emp.payment_method == 1) ? 'CASH' : 'BANK';
                            salary += emp.salary;
                            r++;
                            htmlData += '<tr>' +
                                '<td>' + addLeadingZero(4, parseInt(emp.id)) + '</td>' +
                                '<td>' + emp.name + '</td>' +
                                '<td>' + emp.designationName + '</td>' +
                                '<td>' + emp.date_of_join.formatDate() + '</td>' +
                                '<td align="right">' + emp.approve_date.formatDate() + '</td>' +
                                '<td align="right">' + emp.salary.formatMoney(2, '.', ',') + '</td>' +
                                '<td align="center">' + emp.account + '</td>' +
                                '<td align="center">' + payment_method + '</td>' +
                                '</tr>';
                        }
                        cb_emp();
                    }, function(err) {
                        htmlData += '<tr>' +
                            '<td colspan="5"><b>TOTAL</b></td>' +
                            '<td align="right">' + salary.formatMoney(2, '.', ',') + '</td>' +
                            '<td colspan="2"></td>' +
                            '</tr>' +
                            '</table></div>';
                        cb_dep();
                    });
                });
            }, function(err) {
                htmlData += '</body></html>';
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header: {
                        height: "20mm",
                        contents: bonusStatementHeader(d, QUERY.festive_type)
                    },
                    footer: {
                        height: "25mm",
                        contents: footerSContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadEmployeeSalaryDetails", 'success');
                });
            });
        });
    });


    socket.on('DownloadSalaryBankStatement', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
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
            '<td align="right">140,000.00</td>' +
            '<td align="center">117-103-044148</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="center">2</td>' +
            '<td>HELAL UDDIN AHMAD</td>' +
            '<td align="center">117</td>' +
            '<td align="center">103</td>' +
            '<td align="center">044136</td>' +
            '<td align="right">140,000.00</td>' +
            '<td align="center">117-103-044136</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="center">3</td>' +
            '<td>MD. MIZANUR RAHMAN</td>' +
            '<td align="center">117</td>' +
            '<td align="center">103</td>' +
            '<td align="center">044150</td>' +
            '<td align="right">112,500.00</td>' +
            '<td align="center">117-103-044150</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="center">4</td>' +
            '<td>NASREEN SULTANA MITA</td>' +
            '<td align="center">117</td>' +
            '<td align="center">103</td>' +
            '<td align="center">195963</td>' +
            '<td align="right">50,000.00</td>' +
            '<td align="center">117-103-195963</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="center">5</td>' +
            '<td>MD. FAKHAR UDDIN</td>' +
            '<td align="center">117</td>' +
            '<td align="center">103</td>' +
            '<td align="center">037037</td>' +
            '<td align="right">7,500.00</td>' +
            '<td align="center">117-103-037037</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="center">6</td>' +
            '<td>UMMAY HABIBA</td>' +
            '<td align="center">117</td>' +
            '<td align="center">103</td>' +
            '<td align="center">195958</td>' +
            '<td align="right">50,000.00</td>' +
            '<td align="center">117-103-195958</td>' +
            '</tr>';
        var i = 6;
        var netPayable = 500000;
        getC.getDepartment(db, QUERY, function(depList) {
            depList.sort(function(a, b) {
                var p1 = a.id;
                var p2 = b.id;
                if (p1 < p2) return -1;
                if (p1 > p2) return 1;
                return 0;
            });
            async.each(depList, function(dep, cb_dep) {
                var empSearch = {};
                empSearch.department = dep.id;
                empSearch.date = d;
                getC.getEmployeeMonthSummaryV2(db, empSearch, function(empData) {
                    empData.sort(function(a, b) {
                        var o1 = a.designationID;
                        var o2 = b.designationID;

                        var p1 = a.id;
                        var p2 = b.id;

                        if (o1 < o2) return -1;
                        if (o1 > o2) return 1;
                        if (p1 < p2) return -1;
                        if (p1 > p2) return 1;
                        return 0;
                    });
                    async.each(empData, function(emp, cb_emp) {
                        if (emp.payment_method == 2) {
                            netPayable += emp.netPayable;
                            i++;
                            htmlData += '<tr>' +
                                '<td align="center">' + i + '</td>' +
                                '<td>' + emp.name + '</td>' +
                                '<td align="center">' + emp.branch_code + '</td>' +
                                '<td align="center">' + emp.account_type + '</td>' +
                                '<td align="center">' + emp.account_no + '</td>' +
                                '<td align="right">' + emp.netPayable.formatMoney(2, '.', ',') + '</td>' +
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
                        contents: salaryStatementHeader(d)
                    },
                    footer: {
                        height: "30mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    if (err) return console.log(err);
                    socket.emit("DownloadSalaryBankStatement", 'success');
                });
            });
        });
    });

    socket.on('CreateSalaryBankStatementReport', function(site_url, sd, file_name) {
        var ms = new Date(sd);
        var GPayable = 500000;
        var htmlData =
            '<!DOCTYPE html>' +
            '<html>' +
            '<body>' +
            bankStatementReportHead();
        htmlData += '<div id="pageBody">' +
            //'<big><big><b><u>'+
            //    depList.name+
            //':- </u></b></big></big>'+
            '<table style="width:100%">' +
            '<tr>' +
            '<th>EMPLOYEE NAME</th>' +
            '<th colspan="3">ACCOUNT NUMBER</th>' +
            '<th style="width:12%">AMOUNT IN TAKA</th>' +
            '<th>ACCOUNT NUMBER</th>' +
            '</tr>' +
            '<tr>' +
            '<td>GAZI AHMAD HASAN</td>' +
            '<td align="center">117</td>' +
            '<td align="center">103</td>' +
            '<td align="center">044148</td>' +
            '<td align="right">140,000.00</td>' +
            '<td align="center">117-103-044148</td>' +
            '</tr>' +
            '<tr>' +
            '<td>HELAL UDDIN AHMAD</td>' +
            '<td align="center">117</td>' +
            '<td align="center">103</td>' +
            '<td align="center">044136</td>' +
            '<td align="right">140,000.00</td>' +
            '<td align="center">117-103-044136</td>' +
            '</tr>' +
            '<tr>' +
            '<td>MD. MIZANUR RAHMAN</td>' +
            '<td align="center">117</td>' +
            '<td align="center">103</td>' +
            '<td align="center">044150</td>' +
            '<td align="right">112,500.00</td>' +
            '<td align="center">117-103-044150</td>' +
            '</tr>' +
            '<tr>' +
            '<td>NASREEN SULTANA MITA</td>' +
            '<td align="center">117</td>' +
            '<td align="center">103</td>' +
            '<td align="center">195963</td>' +
            '<td align="right">50,000.00</td>' +
            '<td align="center">117-103-195963</td>' +
            '</tr>' +
            '<tr>' +
            '<td>MD. FAKHAR UDDIN</td>' +
            '<td align="center">117</td>' +
            '<td align="center">103</td>' +
            '<td align="center">037037</td>' +
            '<td align="right">7,500.00</td>' +
            '<td align="center">117-103-037037</td>' +
            '</tr>' +
            '<tr>' +
            '<td>UMMAY HABIBA</td>' +
            '<td align="center">117</td>' +
            '<td align="center">103</td>' +
            '<td align="center">195958</td>' +
            '<td align="right">50,000.00</td>' +
            '<td align="center">117-103-195958</td>' +
            '</tr>';
        list.salary_statement_report(db, sd, function(ssList) {
            async.each(ssList, function(depList, cb_dep) {
                var gNetPayable = 0;
                async.each(depList.employee, function(emp, cb_emp) {
                    var payment_method = emp.payment_method;
                    if (payment_method == 2) {
                        var dj = new Date(emp.date_of_join);
                        gNetPayable += emp.netPayable;
                        htmlData += '<tr>' +
                            '<td>' + emp.name + '</td>' +
                            '<td align="center">' + emp.branch_code + '</td>' +
                            '<td align="center">' + emp.account_type + '</td>' +
                            '<td align="center">' + emp.account_no + '</td>' +
                            '<td align="right">' + emp.netPayable.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="center">' + emp.account + '</td>' +
                            '</tr>';
                    }
                    cb_emp();
                }, function(err) {
                    GPayable += gNetPayable;
                    cb_dep();
                });
            }, function(err) {
                htmlData += '<tr>' +
                    '<td colspan="4"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + GPayable.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"></td>' +
                    '</tr>' +
                    '</table></div>';
                htmlData += '</body></html>';
                var pt = new Date();
                var options = {
                    format: 'A4',
                    orientation: "portrait",
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: salaryStatementHeader(ms)
                    },
                    footer: {
                        height: "30mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                    if (err) return console.log(err);
                    socket.emit("CreateSalaryBankStatementReport", 'success');
                });
            });
        })
    });


    socket.on('CreateSalaryStatementReport', function(site_url, sd, file_name) {
        var ms = new Date(sd);
        var htmlData =
            '<!DOCTYPE html>' +
            '<html>' +
            '<body>' +
            salaryStatementReportHead();
        list.salary_statement_report(db, sd, function(ssList) {
            async.each(ssList, function(depList, cb_dep) {
                htmlData += '<div id="pageBody">' +
                    '<b style="line-height:2">' +
                    depList.name +
                    ':- </b>' +
                    '<table style="width:100%;">' +
                    '<tr>' +
                    '<th rowspan="2">#</th>' +
                    '<th rowspan="2">EMPLOYEE NAME</th>' +
                    '<th rowspan="2">DESIGNATION</th>' +
                    '<th rowspan="2"><small>DATE OF JOIN</small></th>' +
                    '<th rowspan="2"><small>T.D.</small></th>' +
                    '<th rowspan="2"><small>P.D.</small></th>' +
                    '<th rowspan="2"><small>A.D.</small></th>' +
                    '<th rowspan="2">BASIC</th>' +
                    '<th colspan="3">ALLOWANCES</th>' +
                    '<th rowspan="2">GROSS<br />SALARY</th>' +
                    '<th colspan="4">DEDUCTIONS</th>' +
                    '<th rowspan="2">TOTAL<br />DEDUCT.</th>' +
                    '<th rowspan="2">NET<br />PAYABLE</th>' +
                    '<th rowspan="2">PAY.<br />MODE</th>' +
                    '<th rowspan="2">SIGNATURE</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th><small>House Rent</small></th>' +
                    '<th><small>Medical</small></th>' +
                    '<th><small>Conveyance</small></th>' +
                    '<th><small>Absent</small></th>' +
                    '<th><small>Advance</small></th>' +
                    '<th><small>Others</small></th>' +
                    '<th><small>AIT</small></th>' +
                    '</tr>';
                var r = 0,
                    basic = 0,
                    house_rent = 0,
                    medical = 0,
                    conveyance = 0,
                    gSalary = 0,
                    abcDeduct = 0,
                    advDeduct = 0,
                    othDeduct = 0,
                    aitDeduct = 0,
                    ttlDeduct = 0,
                    netPayable = 0;
                async.each(depList.employee, function(emp, cb_emp) {
                    r++;
                    var dj = new Date(emp.date_of_join);
                    var payment_method = (emp.payment_method == 1) ? 'CASH' : 'BANK';
                    basic += emp.basic;
                    house_rent += emp.house_rent;
                    medical += emp.medical;
                    conveyance += emp.conveyance;
                    gSalary += emp.gSalary;
                    abcDeduct += emp.abcDeduct;
                    advDeduct += emp.advDeduct;
                    othDeduct += emp.othDeduct;
                    aitDeduct += emp.aitDeduct;
                    ttlDeduct += emp.ttlDeduct;
                    netPayable += emp.netPayable;
                    htmlData += '<tr>' +
                        '<td height="10">' + r + '</td>' +
                        '<td height="60">' + emp.name + '</td>' +
                        '<td>' + emp.designation + '</td>' +
                        '<td>' + dj.formatDate() + '</td>' +
                        '<td align="right">' + emp.tDays + '</td>' +
                        '<td align="right">' + emp.pDays + '</td>' +
                        '<td align="right">' + emp.aDays + '</td>' +
                        '<td align="right">' + emp.basic.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.house_rent.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.medical.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.conveyance.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.gSalary.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.abcDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.advDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.othDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.aitDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.ttlDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.netPayable.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="center">' + payment_method + '</td>' +
                        '<td></td>' +
                        '</tr>';
                    cb_emp();
                }, function(err) {
                    htmlData += '<tr>' +
                        '<td colspan="7"><b>TOTAL</b></td>' +
                        '<td align="right"><b>' + basic.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + house_rent.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + medical.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + conveyance.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + gSalary.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + abcDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + advDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + othDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + aitDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + ttlDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + netPayable.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td colspan="2"></td>' +
                        '</tr>' +
                        '</table></div>';
                    cb_dep();
                });
            }, function(err) {
                htmlData += '</body></html>';
                var pt = new Date();
                var options = {
                    format: 'Legal',
                    orientation: "landscape",
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: salaryStatementHeader(ms)
                    },
                    footer: {
                        height: "25mm",
                        contents: footerSContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                    if (err) return console.log(err);
                    socket.emit("CreateSalaryStatementReport", 'success');
                });
            });
        })
    });


    socket.on('DownloadSalaryStatementReportV2', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>.' +
            salaryStatementReportHead();
        getC.getDepartment(db, QUERY, function(depList) {
            depList.sort(function(a, b) {
                var p1 = a.id;
                var p2 = b.id;

                if (p1 < p2) return -1;
                if (p1 > p2) return 1;
                return 0;
            });
            async.each(depList, function(dep, cb_dep) {
                var empSearch = {};
                empSearch.department = dep.id;
                empSearch.date = d;
                getC.getEmployeeMonthSummaryV2(db, empSearch, function(empData) {
                    empData.sort(function(a, b) {
                        var o1 = a.designationID;
                        var o2 = b.designationID;

                        var p1 = a.id;
                        var p2 = b.id;

                        if (o1 < o2) return -1;
                        if (o1 > o2) return 1;
                        if (p1 < p2) return -1;
                        if (p1 > p2) return 1;
                        return 0;
                    });
                    var r = 0,
                        basic = 0;
                    house_rent = 0;
                    medical = 0;
                    conveyance = 0;
                    salary = 0;
                    absentDeduct = 0;
                    advanceDeduct = 0;
                    aitDeduct = 0;
                    othersDeduct = 0;
                    totalDeduct = 0;
                    tNetPayable = 0;
                    htmlData += '<div id="pageBody">' +
                        '<b style="line-height:2"><big>' +
                        dep.name.toUpperCase() +
                        ':- </big></b>' +
                        '<table style="width:100%;">' +
                        salaryStatementReportHeadHTML();
                    async.each(empData, function(emp, cb_emp) {
                        basic += emp.basic;
                        house_rent += emp.house_rent;
                        medical += emp.medical;
                        conveyance += emp.conveyance;
                        salary += emp.salary;
                        absentDeduct += emp.absentDeduct;
                        advanceDeduct += emp.advanceDeduct;
                        aitDeduct += emp.aitDeduct;
                        othersDeduct += emp.othersDeduct;
                        totalDeduct += emp.totalDeduct;
                        tNetPayable += emp.netPayable;
                        r++;
                        htmlData += '<tr>' +
                            '<td height="10">' + r + '</td>' +
                            '<td height="60">' + emp.name + '</td>' +
                            '<td>' + emp.designation + '</td>' +
                            '<td>' + emp.date_of_join + '</td>' +
                            '<td align="right">' + emp.totalDays + '</td>' +
                            '<td align="right">' + emp.totalPayableDays + '</td>' +
                            '<td align="right">' + emp.totalDeductDays + '</td>' +
                            '<td align="right">' + emp.basic.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.house_rent.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.medical.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.conveyance.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.salary.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.othersDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.aitDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.totalDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + emp.netPayable.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="center">' + ((emp.payment_method == 1) ? 'CASH' : 'BANK') + '</td>' +
                            '<td></td>' +
                            '</tr>';
                        cb_emp();
                    }, function(err) {
                        // htmlData+='</table></div>';
                        htmlData += '<tr>' +
                            '<td colspan="7"><b>TOTAL</b></td>' +
                            '<td align="right"><b>' + basic.formatMoney(2, '.', ',') + '</b></td>' +
                            '<td align="right">' + house_rent.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + medical.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + conveyance.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + salary.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + othersDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right">' + aitDeduct.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right"><b>' + totalDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                            '<td align="right"><b>' + tNetPayable.formatMoney(2, '.', ',') + '</b></td>' +
                            '<td colspan="2"></td>' +
                            '</tr>' +
                            '</table></div>';
                        cb_dep();
                    });
                });
            }, function(err) {
                htmlData += '</body></html>';
                // var m = 150;
                // var h = 8.5*m;
                // var w = 14*m;
                // var options = {
                //   format: 'Legal',
                //   //width: '7120px', 
                //   //height: '4320px',
                //   header: {
                //     height: "20mm",
                //     contents: salaryStatementHeader(d)
                //   },
                //   footer: {
                //     height: "20mm",
                //     contents: footerSContents()
                //   },
                //   width: w+'px', 
                //   height: h+'px'
                // };
                var options = {
                    format: 'Legal',
                    orientation: "landscape",
                    header: {
                        height: "20mm",
                        contents: salaryStatementHeader(d)
                    },
                    footer: {
                        height: "25mm",
                        contents: footerSContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    //if (err) return console.log(err);
                    socket.emit("DownloadSalaryStatementReportV2", 'success');
                });
            });
        });
    });

}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;