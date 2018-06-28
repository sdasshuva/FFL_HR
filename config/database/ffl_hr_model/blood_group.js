var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Blood_Group_Table', {
        name: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'hr_blood_group',
        underscored: true
    });
};