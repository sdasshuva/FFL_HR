var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('User_Table', {
        card_no: Sequelize.INTEGER,
        finger_print_id: Sequelize.INTEGER,
        first_name: Sequelize.TEXT,
        last_name: Sequelize.TEXT,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        access_level: Sequelize.INTEGER
    }, {
        tableName: 'user',
        underscored: true
    });
};