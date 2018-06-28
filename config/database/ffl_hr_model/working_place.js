var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Working_Place_Table', {
        name: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'hr_working_place',
        underscored: true
    });
};