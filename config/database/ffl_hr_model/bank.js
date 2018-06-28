var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Bank_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
    }, {
        tableName: 'hr_bank',
        underscored: true
    });
};