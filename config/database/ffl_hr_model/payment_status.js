var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Payment_Status_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniquePaymentStatus',
        },
    }, {
        tableName: 'hr_payment_status',
        underscored: true,
    });
};