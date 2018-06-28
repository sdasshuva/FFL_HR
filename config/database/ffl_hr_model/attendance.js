var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Attendance_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: "hr_employee",
            referencesKey: "id"
        },
        punch_time: {
            type: Sequelize.DATE
        },
        type: {
            type: Sequelize.INTEGER
        }
    }, {
        tableName: 'hr_attendance',
        underscored: true
    });
};