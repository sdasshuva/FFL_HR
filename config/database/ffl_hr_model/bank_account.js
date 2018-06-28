var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Bank_Account_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: "hr_employee",
            referencesKey: "id",
            defaultValue: 1,
            unique: true
        },
        bank: {
            type: Sequelize.INTEGER,
            references: "hr_bank",
            referencesKey: "id",
            unique: true
        },
        branch_code: {
            type: Sequelize.INTEGER
        },
        account_type: {
            type: Sequelize.INTEGER
        },
        account_no: {
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: 1,
            allowNull: false,
        },
    }, {
        tableName: 'hr_bank_account',
        underscored: true
    });
};