var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Education_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: "hr_employee",
            referencesKey: "id"
        },
        exam_name: {
            type: Sequelize.STRING
        },
        major: {
            type: Sequelize.STRING
        },
        pass_year: {
            type: Sequelize.DATE
        }
    }, {
        tableName: 'hr_education',
        underscored: true
    });
};