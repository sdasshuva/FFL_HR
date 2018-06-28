var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Import_File_Table', {
        sl_no: {
            type: Sequelize.STRING
        },
        buyer: {
            type: Sequelize.INTEGER,
            references: "hr_buyer",
            referencesKey: "id"
        },
        export_lc_no: {
            type: Sequelize.STRING
        },
        export_lc_date: {
            type: Sequelize.DATE
        },
        export_lc_value: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        export_lc_expiry_date: {
            type: Sequelize.DATE
        },
        costing_file_no: {
            type: Sequelize.STRING
        },
        supplier: {
            type: Sequelize.INTEGER,
            references: "supplier",
            referencesKey: "id"
        },
        pi_no: {
            type: Sequelize.STRING
        },
        pi_date: {
            type: Sequelize.DATE
        },
        pi_amount: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        item: {
            type: Sequelize.STRING
        },
        quantity: {
            type: Sequelize.INTEGER
        },
        btb_lc_no: {
            type: Sequelize.STRING
        },
        btb_lc_date: {
            type: Sequelize.DATE
        },
        cnf: {
            type: Sequelize.STRING
        },
        insurance_premium: {
            type: Sequelize.STRING
        },
        insurance_policy: {
            type: Sequelize.STRING
        },
        bank: {
            type: Sequelize.STRING
        },
        acceptance_date: {
            type: Sequelize.DATE
        },
        acceptance_amount: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        abp_no: {
            type: Sequelize.STRING
        },
        abp_date: {
            type: Sequelize.DATE
        },
        maturity_date: {
            type: Sequelize.DATE
        },
        payment_date: {
            type: Sequelize.DATE
        },
        payment_amount_usd: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        payment_amount_bdt: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        conversion_rate: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        lc_opening: {
            type: Sequelize.STRING
        },
        total_lc: {
            type: Sequelize.STRING
        },
        acceptance_charge: {
            type: Sequelize.STRING
        },
        total_expence: {
            type: Sequelize.STRING
        },
        payment: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
    }, {
        tableName: 'hr_import_file',
        underscored: true
    });
};