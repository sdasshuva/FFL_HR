var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Employee_Table', {
        user: {
            type: Sequelize.INTEGER,
            references: "user",
            referencesKey: "id"
        },
        photo: {
            type: Sequelize.STRING
        },
        designation: {
            type: Sequelize.INTEGER,
            references: "hr_designation",
            referencesKey: "id"
        },
        department: {
            type: Sequelize.INTEGER,
            references: "hr_department",
            referencesKey: "id"
        },
        working_place: {
            type: Sequelize.INTEGER,
            references: "hr_working_place",
            referencesKey: "id"
        },
        employee_type: {
            type: Sequelize.INTEGER,
            references: "hr_employee_type",
            referencesKey: "id"
        },
        date_of_birth: {
            type: Sequelize.DATE
        },
        date_of_join: {
            type: Sequelize.DATE
        },
        date_of_release: {
            type: Sequelize.DATE
        },
        referer: {
            type: Sequelize.INTEGER,
            references: "hr_referer",
            referencesKey: "id"
        },
        national_id: {
            type: Sequelize.STRING
        },
        religion: {
            type: Sequelize.INTEGER,
            references: "hr_religion",
            referencesKey: "id"
        },
        marital_status: {
            type: Sequelize.INTEGER
        },
        contact_no: {
            type: Sequelize.STRING
        },
        blood_group: {
            type: Sequelize.INTEGER,
            references: "hr_blood_group",
            referencesKey: "id"
        },
        remarks: {
            type: Sequelize.STRING
        },
        duty_shift: {
            type: Sequelize.INTEGER,
            references: "hr_duty_shift",
            referencesKey: "id"
        },
        payment_method: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        status: {
            type: Sequelize.INTEGER
        }
    }, {
        tableName: 'hr_employee',
        underscored: true
    });
};