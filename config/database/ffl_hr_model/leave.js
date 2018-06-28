var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Leave_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: "hr_employee",
            referencesKey: "id"
        },
        leave_type: {
            type: Sequelize.INTEGER,
            references: "hr_leave_type",
            referencesKey: "id"
        },
        date: {
            type: Sequelize.DATE
        }
    }, {
        tableName: 'hr_leave',
        underscored: true
    });
};