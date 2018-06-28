var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Post_Office_Table', {
        name: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'hr_post_office',
        underscored: true
    });
};