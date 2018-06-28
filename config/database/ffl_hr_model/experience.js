var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Experience_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: "hr_employee",
            referencesKey: "id"
        },
        organization: {
            type: Sequelize.STRING
        },
        designation: {
            type: Sequelize.INTEGER,
            references: "hr_designation",
            referencesKey: "id"
        },
        start_date: {
            type: Sequelize.DATE
        },
        end_date: {
            type: Sequelize.DATE
        }
    }, {
        tableName: 'hr_experience',
        underscored: true
    });
};