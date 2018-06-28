var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Buyer_Table', {
        name: {
            type: Sequelize.STRING
        },
        country: {
            type: Sequelize.INTEGER,
            references: "country",
            referencesKey: "id"
        },
    }, {
        tableName: 'hr_buyer',
        underscored: true
    });
};