var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Salary_Payment_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: "hr_employee",
            referencesKey: "id",
            allowNull: false,
            unique: 'uniqueSalaryPayment',
        },
        year: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: 'uniqueSalaryPayment',
        },
        month: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: 'uniqueSalaryPayment',
        },
        payment_type: {
            type: Sequelize.INTEGER,
            references: "hr_payment_type",
            referencesKey: "id",
            allowNull: false,
            unique: 'uniqueSalaryPayment',
        },
        salary_amount: {
            type: Sequelize.FLOAT
        },
        deduct_amount: {
            type: Sequelize.FLOAT
        },
        paid_amount: {
            type: Sequelize.FLOAT
        },
        payment_status: {
            type: Sequelize.INTEGER,
            references: "hr_payment_status",
            referencesKey: "id",
        },
        user: {
            type: Sequelize.INTEGER,
            references: "user",
            referencesKey: "id",
        },
    }, {
        tableName: 'hr_salary_payment',
        underscored: true,
    });
};