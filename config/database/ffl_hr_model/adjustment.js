var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Adjustment_Table', {
        reason: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.DATE
        }
    }, {
        tableName: 'hr_adjustment',
        underscored: true
    });
};