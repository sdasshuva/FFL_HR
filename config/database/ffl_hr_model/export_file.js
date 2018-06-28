var paths = require('../../config/paths.js'),
    Sequelize = require(paths.node_module + 'sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Export_File_Table', {
        invoice_no: {
            type: Sequelize.STRING
        },
        buyer: {
            type: Sequelize.STRING
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
        file_no: {
            type: Sequelize.STRING
        },
        invoice_value: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        style: {
            type: Sequelize.STRING
        },
        po_no: {
            type: Sequelize.STRING
        },
        shipped_quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        rate: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        exp_no: {
            type: Sequelize.STRING
        },
        exp_date: {
            type: Sequelize.DATE
        },
        bl_no: {
            type: Sequelize.STRING
        },
        bl_date: {
            type: Sequelize.DATE
        },
        gross_weight: {
            type: Sequelize.STRING
        },
        net_weight: {
            type: Sequelize.STRING
        },
        shipped_bill_no: {
            type: Sequelize.STRING
        },
        shipped_bill_date: {
            type: Sequelize.DATE
        },
        doc_sub_date: {
            type: Sequelize.DATE
        },
        fdbc_no: {
            type: Sequelize.STRING
        },
        tenor: {
            type: Sequelize.STRING
        },
        realised_date: {
            type: Sequelize.DATE
        },
        realised_amount: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        conversion_rate: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        ait_percent: {
            type: Sequelize.FLOAT,
            defaultValue: 0.6
        },
        handling_commission: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        negociation_commission: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        post_charge: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        fdbp: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        sod: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        fbpar: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        fdr: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        packing_credit: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        erq: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        cd: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        fbar: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        central_fund_percent: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        la_commission: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        other_commission: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        cnf_bill_no: {
            type: Sequelize.STRING
        },
    }, {
        tableName: 'hr_export_file',
        underscored: true
    });
};