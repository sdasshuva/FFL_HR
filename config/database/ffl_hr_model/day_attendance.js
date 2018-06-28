var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Attendance_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: "hr_employee",
            referencesKey: "id"
        },
        date: {
            type: Sequelize.DATE
        },
        office_in: {
            type: Sequelize.DATE
        },
        office_in_time: {
            type: Sequelize.DATE
        },
        office_in_status: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        office_in_late_min: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        lunch_out: {
            type: Sequelize.DATE
        },
        lunch_out_time: {
            type: Sequelize.DATE
        },
        lunch_out_status: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        lunch_out_early_min: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        lunch_in: {
            type: Sequelize.DATE
        },
        lunch_in_time: {
            type: Sequelize.DATE
        },
        lunch_in_status: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        lunch_in_late_min: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        office_out: {
            type: Sequelize.DATE
        },
        office_out_time: {
            type: Sequelize.DATE
        },
        office_out_status: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        office_out_early_min: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
    }, {
        tableName: 'hr_day_attendance',
        underscored: true
    });
};