var paths=require('../../config/paths.js'),
    Sequelize = require(paths.node_module+'sequelize');

module.exports = function(sequelize){
    return sequelize.define('Address_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: "hr_employee",
            referencesKey: "id"
        },
        address_type: {
            type: Sequelize.INTEGER,
            references: "hr_address_type",
            referencesKey: "id"
        },
        village: {
            type: Sequelize.INTEGER,
            references: "hr_village",
            referencesKey: "id"
        },
        post_office: {
            type: Sequelize.INTEGER,
            references: "hr_post_office",
            referencesKey: "id"
        },
        police_station: {
            type: Sequelize.INTEGER,
            references: "hr_police_station",
            referencesKey: "id"
        },
        district: {
            type: Sequelize.INTEGER,
            references: "hr_district",
            referencesKey: "id"
        }
    },{
        tableName: 'hr_address',
        underscored: true
    });
};
