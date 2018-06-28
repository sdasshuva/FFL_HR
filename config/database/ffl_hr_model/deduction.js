var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Deduction_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: "hr_employee",
            referencesKey: "id"
        },
        month: {
            type: Sequelize.DATE
        },
        advance: {
            type: Sequelize.FLOAT
        },
        ait: {
            type: Sequelize.FLOAT
        },
        others: {
            type: Sequelize.FLOAT
        },
    }, {
        tableName: 'hr_deduction',
        underscored: true
    });
};