var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Salary_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: "hr_employee",
            referencesKey: "id"
        },
        amount: {
            type: Sequelize.FLOAT
        },
        approve_date: {
            type: Sequelize.DATE
        }
    }, {
        tableName: 'hr_salary',
        underscored: true
    });
};