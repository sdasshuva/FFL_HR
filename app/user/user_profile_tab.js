function userProfileTab() {
    if (Ext.getCmp('user_profile_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("user_profile_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'User Profile',
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start',
            },
            closable: true,
            id: 'user_profile_tab',
            autoScroll: true,
            items: [
                basicInformationPanel(),
                personalInformationPanel(),
            ],
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function basicInformationPanel() {
    var employeeData = employeeStore.getRange()[0].data;
    var photo = 'no-profile-image.png';
    var date_of_birth = '<i style="color:red;">Not Defined</i>'
    var date_of_join = '<i style="color:red;">Not Defined</i>'
    var blood_group = '<i style="color:red;">Not Defined</i>'
    var department = '<i style="color:red;">Not Defined</i>'
    var emp_id = 'JCLFFL' + addLeadingZero(4, employeeData.id);
    if (employeeData.departmentTable) {
        department = employeeData.departmentTable.name
    }
    var designation = '<i style="color:red;">Not Defined</i>'
    if (employeeData.designationTable) {
        designation = employeeData.designationTable.name
    }
    if (employeeData.photo) {
        photo = employeeData.photo;
    }
    if (employeeData.blood_group) {
        blood_group = employeeData.blood_group;
    }
    if (employeeData.date_of_join) {
        var dob = new Date(employeeData.date_of_join);
        date_of_join = dob.getDate() +
            '<sup>' +
            dayPower[dob.getDate()] +
            '</sup> ' +
            monthCapitalNames[dob.getMonth()] + ', ' +
            dob.getUTCFullYear()
    }
    if (employeeData.date_of_birth) {
        var dob = new Date(employeeData.date_of_birth);
        date_of_birth = dob.getDate() +
            '<sup>' +
            dayPower[dob.getDate()] +
            '</sup> ' +
            monthCapitalNames[dob.getMonth()] + ', ' +
            dob.getUTCFullYear()
    }
    return Ext.create('Ext.panel.Panel', {
        title: 'Basic Information',
        height: 250,
        bodyStyle: {
            "background-color": "#DEECFD"
        },
        layout: {
            type: 'hbox',
            align: 'stretch',
            pack: 'start',
        },
        //collapsible: true,
        items: [{
            flex: 1,
            bodyStyle: {
                "background-color": "#DEECFD"
            },
            bodyPadding: 20,
            html: '<h1>' + user.first_name.toUpperCase() + ' ' + user.last_name.toUpperCase() + '</h1>' +
                '<h3>Employee ID: <i style="color:#555555;">' + emp_id + '</i></h3>' +
                '<h3>Department: <i style="color:#555555;">' + department + '</i></h3>' +
                '<h3>Designation: <i style="color:#555555;">' + designation + '</i></h3>' +
                '<h3>Date Of Join: <i style="color:#555555;">' + date_of_join + '</i></h3>'
        }, {
            width: 200,
            bodyStyle: {
                "background-color": "#DDDDDD"
            },
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                Ext.create('Ext.Img', {
                    src: '/uploads/images/profile/' + photo,
                    id: 'profile_image_panel',
                    height: 180,
                    width: 180,
                    align: 'center',
                    border: false,
                    margins: 4
                }),
                Ext.create('Ext.Button', {
                    text: '<b>Change Profile Picture</b>',
                    width: 200,
                    height: 30,
                    style: {
                        "border": "2px solid #99bcff"
                    },
                    handler: function() {
                        photoUploadWindow(employeeStore.getRange()[0].data);
                    }
                })
            ]
        }, ]
    })
}


function personalInformationPanel() {
    var employeeData = employeeStore.getRange()[0].data;
    var date_of_birth = '<i style="color:red;">Not Defined</i>'
    var blood_group = '<i style="color:red;">Not Defined</i>'
    if (employeeData.blood_group) {
        blood_group = employeeData.blood_group;
    }
    if (employeeData.date_of_birth) {
        var dob = new Date(employeeData.date_of_birth);
        date_of_birth = dob.getDate() +
            '<sup>' +
            dayPower[dob.getDate()] +
            '</sup> ' +
            monthCapitalNames[dob.getMonth()] + ', ' +
            dob.getUTCFullYear()
    }
    return Ext.create('Ext.panel.Panel', {
        title: 'Personal Information',
        height: 250,
        bodyStyle: {
            "background-color": "#DEECFD"
        },
        layout: {
            type: 'hbox',
            align: 'stretch',
        },
        //collapsible: true,
        items: [{
            flex: 1,
            bodyStyle: {
                "background-color": "#DEECFD"
            },
            bodyPadding: 20,
            html: '<h3>Date Of Birth: <i style="color:#555555;">' + date_of_birth + '</i></h3>' +
                '<h3>Blood Group: <i style="color:#555555;">' + blood_group + '</i></h3>'
        }, ]
    })
}


function photoUploadWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: 'Upload Profile Picture',
        modal: true,
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                width: '100%',
                bodyPadding: 20,
                border: false,
                layout: {
                    type: 'vbox',
                    align: 'stretch' // Child items are stretched to full width
                },
                items: [
                    Ext.create('Ext.form.field.Text', {
                        name: 'id',
                        value: rec.id,
                        hidden: true,
                    }),
                    Ext.create('Ext.form.field.File', {
                        name: 'profile_picture',
                        filedAlign: 'top',
                        allowBlank: false,
                        fieldLabel: 'Profile Picture',
                        width: 300,
                        labelWidth: 80,
                        labelAlign: 'left',
                        labelStyle: 'text-align:left;border solid 1px white;',
                        labelSeparator: '',
                        emptyText: 'Upload Profile Picture...',
                        clearOnSubmit: false,
                        labelClsExtra: 'some-class',
                        fieldStyle: 'text-align: left;font-size: 12px;',
                        icon: '/uploads/icons/upload.png',
                        autoScroll: true
                    })
                ],
                buttons: [{
                    text: 'Reset',
                    handler: function() {
                        this.up('form').getForm().reset();
                    }
                }, {
                    text: 'Submit',
                    formBind: true,
                    handler: function() {
                        var win = this.up('.window');
                        var panel = this.up('form'),
                            filefield = panel.query('filefield')[0],
                            form = panel.getForm(),
                            values = form.getValues();
                        if (form.isValid()) {
                            form.submit({
                                url: '/ChangeProfilePicture',
                                waitMsg: 'Uploading your photo...',
                                success: function(fp, o) {
                                    employeeStore.load();
                                    var my_photo = employeeStore.getRange()[0].data.photo;
                                    Ext.getCmp('profile_image_panel').setSrc('/uploads/images/profile/' + my_photo);
                                    win.close();
                                    Ext.MessageBox.alert('success', 'Processed file "' + o.result.file + '" on the server');
                                },
                                failure: function(fp, o) {
                                    win.close();
                                    Ext.MessageBox.alert('success', 'Processed file "' + o + '" on the server');
                                    Ext.getCmp('user_profile_tab').removeAll();
                                    Ext.getStore('employeeStore').load({
                                        callback: function(records, operation, success) {
                                            if (success) {
                                                Ext.getCmp('user_profile_tab').add(basicInformationPanel());
                                                Ext.getCmp('user_profile_tab').add(personalInformationPanel());
                                            } else {
                                                console.log('error');
                                            }
                                        }
                                    })
                                },
                            });
                        } else {
                            fieldNames = [];
                            fields = panel.getInvalidFields();
                            for (var i = 0; i < fields.length; i++) {
                                field = fields[i];
                                fieldNames.push(field.getName());
                            }
                            console.debug(fieldNames);
                            Ext.MessageBox.alert('Invalid Fields', 'The following fields are invalid: ' + fieldNames.join(', '));
                        }
                    }
                }, {
                    text: 'Close',
                    handler: function() {
                        this.up('.window').close();
                    }
                }],
                getInvalidFields: function() {
                    var invalidFields = [];
                    Ext.suspendLayouts();
                    this.form.getFields().filterBy(function(field) {
                        if (field.validate()) return;
                        invalidFields.push(field);
                    });
                    Ext.resumeLayouts(true);
                    return invalidFields;
                }
            })
        ]
    }).show();
}