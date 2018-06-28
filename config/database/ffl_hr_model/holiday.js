var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Holiday_Table', {
        reason: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.INTEGER
        },
        date: {
            type: Sequelize.DATE
        }
    }, {
        tableName: 'hr_holiday',
        underscored: true
    });
};