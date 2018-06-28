var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Payment_Type_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniquePaymentType',
        },
        percent: {
            type: Sequelize.INTEGER,
            defaultValue: 100,
            allowNull: false,
        },
    }, {
        tableName: 'hr_payment_type',
        underscored: true,
    });
};