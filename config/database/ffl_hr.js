var Sequelize = require('sequelize');
var myLogFunc = function(msg, a) {
    console.log(msg)
        // console.log(a)
}

function connect() {
    var dbName = 'mm_college';
    var dbUser = (process.env.PWD.toUpperCase().indexOf("DROPBOX") != -1) ? 'root' : 'root';
    var dbPass = (process.env.PWD.toUpperCase().indexOf("DROPBOX") != -1) ? '1234' : 'Bi99#Bo559@mysql';
    var sequelize = new Sequelize(dbName, dbUser, dbPass, {
        host: 'localhost',
        dialect: 'mysql',
        timezone: '+06:00',
        dialectOptions: {
            useUTC: false, //for reading from database
            dateStrings: true,
            typeCast: function(field, next) { // for reading from database
                if (field.type === 'DATETIME') {
                    return field.string()
                }
                return next()
            },
        },
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        logging: (process.env.PWD.toUpperCase().indexOf("DROPBOX") != -1) ? myLogFunc : false,
        operatorsAliases: false
    });

    sequelize.authenticate().then(function(err) {
        if (!err) {
            console.log('Connection has been established successfully.')
        } else {
            console.log('Unable to connect to the database:', err)
        }
    })

    /////*******************#####  RIPS MODELER FILE INCLUDING STARTS  *#####****************/////

    this.bank = require(__dirname + '/ffl_hr_model/bank.js')(sequelize);
    this.payment_type = require(__dirname + '/ffl_hr_model/payment_type.js')(sequelize);
    this.payment_status = require(__dirname + '/ffl_hr_model/payment_status.js')(sequelize);
    this.country = require(__dirname + '/ffl_hr_model/country.js')(sequelize);
    this.buyer = require(__dirname + '/ffl_hr_model/buyer.js')(sequelize);
    this.supplier = require(__dirname + '/ffl_hr_model/supplier.js')(sequelize);
    this.holiday = require(__dirname + '/ffl_hr_model/holiday.js')(sequelize);
    this.adjustment = require(__dirname + '/ffl_hr_model/adjustment.js')(sequelize);
    this.leave_type = require(__dirname + '/ffl_hr_model/leave_type.js')(sequelize);
    this.user = require(__dirname + '/ffl_hr_model/user.js')(sequelize);
    this.police_station = require(__dirname + '/ffl_hr_model/police_station.js')(sequelize);
    this.post_office = require(__dirname + '/ffl_hr_model/post_office.js')(sequelize);
    this.referer = require(__dirname + '/ffl_hr_model/referer.js')(sequelize);
    this.religion = require(__dirname + '/ffl_hr_model/religion.js')(sequelize);
    this.blood_group = require(__dirname + '/ffl_hr_model/blood_group.js')(sequelize);
    this.department = require(__dirname + '/ffl_hr_model/department.js')(sequelize);
    this.designation = require(__dirname + '/ffl_hr_model/designation.js')(sequelize);
    this.district = require(__dirname + '/ffl_hr_model/district.js')(sequelize);
    this.duty_shift = require(__dirname + '/ffl_hr_model/duty_shift.js')(sequelize);
    this.village = require(__dirname + '/ffl_hr_model/village.js')(sequelize);
    this.working_place = require(__dirname + '/ffl_hr_model/working_place.js')(sequelize);
    this.address_type = require(__dirname + '/HR_MODEL/address_type.js')(sequelize);
    this.employee_type = require(__dirname + '/ffl_hr_model/employee_type.js')(sequelize);
    this.employee = require(__dirname + '/ffl_hr_model/employee.js')(sequelize);
    this.address = require(__dirname + '/ffl_hr_model/address.js')(sequelize);
    this.attendance = require(__dirname + '/ffl_hr_model/attendance.js')(sequelize);
    this.education = require(__dirname + '/ffl_hr_model/education.js')(sequelize);
    this.experience = require(__dirname + '/ffl_hr_model/experience.js')(sequelize);
    this.salary = require(__dirname + '/ffl_hr_model/salary.js')(sequelize);
    this.leave = require(__dirname + '/ffl_hr_model/leave.js')(sequelize);
    this.bank_account = require(__dirname + '/ffl_hr_model/bank_account.js')(sequelize);
    this.import_file = require(__dirname + '/ffl_hr_model/import_file.js')(sequelize);
    this.export_file = require(__dirname + '/ffl_hr_model/export_file.js')(sequelize);
    this.deduction = require(__dirname + '/ffl_hr_model/deduction.js')(sequelize);
    this.salary_payment = require(__dirname + '/ffl_hr_model/salary_payment.js')(sequelize);

    /////*******************#####  RIPS MODELER FILE INCLUDING ENDS  #####****************/////


    ////////////////%%%%#####  RIPS TABLE RELATIONSHIP STARTS  #####%%%%////////////////////

    this.employee
        .hasOne(this.user, {
            as: 'user'
        })
        .hasOne(this.department, {
            as: 'department'
        })
        .hasOne(this.designation, {
            as: 'designation'
        })
        .hasOne(this.working_place, {
            as: 'working_place'
        })
        .hasOne(this.employee_type, {
            as: 'employee_type'
        })
        .hasOne(this.referer, {
            as: 'referer'
        })
        .hasOne(this.religion, {
            as: 'religion'
        })
        .hasOne(this.blood_group, {
            as: 'blood_group'
        })
        .hasOne(this.duty_shift, {
            as: 'duty_shift'
        });
    this.address
        .hasOne(this.employee, {
            as: 'employee'
        })
        .hasOne(this.address_type, {
            as: 'address_type'
        })
        .hasOne(this.village, {
            as: 'village'
        })
        .hasOne(this.post_office, {
            as: 'post_office'
        })
        .hasOne(this.police_station, {
            as: 'police_station'
        })
        .hasOne(this.district, {
            as: 'district'
        });
    this.attendance.hasOne(this.employee, {
        as: 'employee'
    });
    this.education.hasOne(this.employee, {
        as: 'employee'
    });
    this.experience
        .hasOne(this.employee, {
            as: 'employee'
        })
        .hasOne(this.designation, {
            as: 'designation'
        });
    this.leave
        .hasOne(this.employee, {
            as: 'employee'
        })
        .hasOne(this.leave_type, {
            as: 'leave_type'
        });
    this.salary.hasOne(this.employee, {
        as: 'employee'
    });
    this.bank_account
        .hasOne(this.employee, {
            as: 'employee'
        })
        .hasOne(this.bank, {
            as: 'bank'
        });
    this.buyer.hasOne(this.country, {
        as: 'country'
    });
    this.import_file
        .hasOne(this.buyer, {
            as: 'buyer'
        })
        .hasOne(this.supplier, {
            as: 'supplier'
        });
    this.export_file.hasOne(this.buyer, {
        as: 'buyer'
    });
    this.deduction.hasOne(this.employee, {
        as: 'employee'
    });
    this.salary_payment
        .hasOne(this.employee, {
            as: 'employee'
        })
        .hasOne(this.payment_type, {
            as: 'payment_type'
        })
        .hasOne(this.payment_status, {
            as: 'payment_status'
        })
        .hasOne(this.user, {
            as: 'user'
        });

    this.employee
        .belongsTo(this.user, {
            foreignKey: 'user'
        })
        .belongsTo(this.department, {
            foreignKey: 'department'
        })
        .belongsTo(this.designation, {
            foreignKey: 'designation'
        })
        .belongsTo(this.working_place, {
            foreignKey: 'working_place'
        })
        .belongsTo(this.employee_type, {
            foreignKey: 'employee_type'
        })
        .belongsTo(this.referer, {
            foreignKey: 'referer'
        })
        .belongsTo(this.religion, {
            foreignKey: 'religion'
        })
        .belongsTo(this.blood_group, {
            foreignKey: 'blood_group'
        })
        .belongsTo(this.duty_shift, {
            foreignKey: 'duty_shift'
        });
    this.address
        .belongsTo(this.employee, {
            foreignKey: 'employee'
        })
        .belongsTo(this.address_type, {
            foreignKey: 'address_type'
        })
        .belongsTo(this.village, {
            foreignKey: 'village'
        })
        .belongsTo(this.post_office, {
            foreignKey: 'post_office'
        })
        .belongsTo(this.police_station, {
            foreignKey: 'police_station'
        })
        .belongsTo(this.district, {
            foreignKey: 'district'
        });
    this.attendance.belongsTo(this.employee, {
        foreignKey: 'employee'
    });
    this.education.belongsTo(this.employee, {
        foreignKey: 'employee'
    });
    this.experience
        .belongsTo(this.employee, {
            foreignKey: 'employee'
        })
        .belongsTo(this.designation, {
            foreignKey: 'designation'
        });
    this.leave
        .belongsTo(this.employee, {
            foreignKey: 'employee'
        })
        .belongsTo(this.leave_type, {
            foreignKey: 'leave_type'
        });
    this.salary.belongsTo(this.employee, {
        foreignKey: 'employee'
    });
    this.bank_account
        .belongsTo(this.employee, {
            foreignKey: 'employee'
        })
        .belongsTo(this.bank, {
            foreignKey: 'bank'
        });
    this.buyer.belongsTo(this.country, {
        foreignKey: 'country'
    });
    this.import_file
        .belongsTo(this.buyer, {
            foreignKey: 'buyer'
        })
        .belongsTo(this.supplier, {
            foreignKey: 'supplier'
        });
    this.export_file.belongsTo(this.buyer, {
        foreignKey: 'buyer'
    });
    this.deduction.belongsTo(this.employee, {
        foreignKey: 'employee'
    });
    this.salary_payment
        .belongsTo(this.employee, {
            foreignKey: 'employee'
        })
        .belongsTo(this.payment_type, {
            foreignKey: 'payment_type'
        })
        .belongsTo(this.payment_status, {
            foreignKey: 'payment_status'
        })
        .belongsTo(this.user, {
            foreignKey: 'user'
        });

    ////////////////%%%%#####  RIPS TABLE RELATIONSHIP ENDS  #####%%%%////////////////////


    /////***************************  RIPS EDITING FOR PO ORDER ENDS  ****************************/////

    sequelize
        .sync({
            force: false
        })
        .complete(function(err) {
            if (!!err) {
                console.log('An error occurred while creating the table:', err)
            } else {
                console.log('It worked!')
            }
        })
}

module.exports.connect = connect;