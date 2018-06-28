var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Duty_Shift_Table', {
        name: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'hr_duty_shift',
        underscored: true
    });
};