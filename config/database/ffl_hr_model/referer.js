var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Referer_Table', {
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        contact_no: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'hr_referer',
        underscored: true
    });
};