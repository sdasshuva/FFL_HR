var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Leave_Type_Table', {
        name: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.FLOAT
        }
    }, {
        tableName: 'hr_leave_type',
        underscored: true
    });
};