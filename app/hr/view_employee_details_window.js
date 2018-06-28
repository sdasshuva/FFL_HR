function viewEmployeeDetailsWindow(data) {
    return Ext.create('Ext.window.Window', {
        title: 'Employee Profile',
        modal: true,
        id: 'viewEmployeeDetailsWindow' + data.id,
        layout: 'fit',
        items: [
            Ext.create('Ext.panel.Panel', {
                id: 'viewEmployeeDetailsPanel' + data.id,
                width: '80%',
                height: 500,
                layout: 'fit',
                border: false,
                autoScroll: true,
                items: [
                    Ext.create('Ext.panel.Panel', {
                        id: 'viewEmployeePersonalDetailsPanel' + data.id,
                        html: '<p style="text-align: center;margin-top: 0;padding-top:0;margin-bottom: 0;padding-bottom:0;"><img width="250" alt="" src="/uploads/images/logo.png" style="float: center;" /></p>' +
                            '<h3 style="text-align: center;margin-top: 0;padding-top:0;margin-bottom: 0;padding-bottom:0;"><u>EMPLOYEE PROFILE</u></h3>' +
                            '<table><col width="120"><col width="350"><col width="200">' +
                            '<tbody>' +
                            '<tr>' +
                            '<td style="text-align: right;">' +
                            '<p><b>Card No: </b></p>' +
                            '</td>' +
                            '<td>' +
                            '<p><span style="font-weight: 400;">' +
                            data.card_no +
                            '</span></p>' +
                            '</td>' +
                            '<td>' +
                            '<p><b>Status: </b>Active</p>' +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="text-align: right;">' +
                            '<p><b>Name: </b></p>' +
                            '</td>' +
                            '<td>' +
                            '<p><span style="font-weight: 400;">' +
                            data.name +
                            '</span></p>' +
                            '</td>' +
                            '<td rowspan="5"><img width="200" alt="" src="/uploads/images/profile/' +
                            data.photo +
                            '" style="float: left;" /></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="text-align: right;">' +
                            '<p><b>Designation: </b></p>' +
                            '</td>' +
                            '<td>' +
                            '<p><span style="font-weight: 400;">' +
                            data.designationTable.name +
                            '</span></p>' +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="text-align: right;">' +
                            '<p><b>Department: </b></p>' +
                            '</td>' +
                            '<td>' +
                            '<p><span style="font-weight: 400;">' +
                            data.departmentTable.name +
                            '</span></p>' +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="text-align: right;">' +
                            '<p><b>Working Place: </b></p>' +
                            '</td>' +
                            '<td>' +
                            '<p><span style="font-weight: 400;">' +
                            data.workingPlaceTable.name +
                            '</span></p>' +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="text-align: right;">' +
                            '<p><b>Employee Type: </b></p>' +
                            '</td>' +
                            '<td>' +
                            '<p><span style="font-weight: 400;">' +
                            data.employeeTypeTable.name +
                            '</span></p>' +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="text-align: right;">' +
                            '<p><b>Date of Birth: </b></p>' +
                            '</td>' +
                            '<td>' +
                            '<p><span style="font-weight: 400;">' +
                            new Date(data.date_of_birth).getDate() + '/' + new Date(data.date_of_birth).getMonth() + '/' + new Date(data.date_of_birth).getFullYear() +
                            '</span></p>' +
                            '</td>' +
                            '<td>' +
                            '<p><b>Age: </b></p>' +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="text-align: right;">' +
                            '<p><b>Date of Join: </b></p>' +
                            '</td>' +
                            '<td>' +
                            '<p><span style="font-weight: 400;">' +
                            new Date(data.date_of_join).getDate() + '/' + new Date(data.date_of_join).getMonth() + '/' + new Date(data.date_of_join).getFullYear() +
                            '</span></p>' +
                            '</td>' +
                            '<td>&nbsp;</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="text-align: right;">' +
                            '<p><b>Date of Release: </b></p>' +
                            '</td>' +
                            '<td>' +
                            '<p><span style="font-weight: 400;">' +
                            //(data.date_of_release==null) ? "Too young":"Old enough"+
                            '</span></p>' +
                            '</td>' +
                            '<td>&nbsp;</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>'
                            /*items: [
                              //brandToolBar(),
                              //brandGrid()
                            ]*/
                    })
                ]
            })
        ],
        buttons: [{
            text: 'Close',
            handler: function() {
                this.up('.window').close();
            }
        }],
    }).show();
}