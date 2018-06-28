function employeeProfileTab(data) {
    if (Ext.getCmp('employee_profile_tab' + data.id)) {
        tab_panel.setActiveTab(Ext.getCmp("employee_profile_tab" + data.id));
    } else {
        var new_tab = tab_panel.add({
            title: data.name,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            id: 'employee_profile_tab' + data.id,
            autoScroll: true,
            items: [
                employeeBasicDetailsPanel(data),
                employeeEducationListGrid(data),
                employeeExperienceListGrid(data),
                employeeRefererInfoPanel(data),
                employeePresentAddressPanel(data),
                employeePermanentAddressPanel(data),
            ],
            bbar: [{
                xtype: 'button',
                text: 'Reload',
                icon: '/uploads/icons/refresh.png',
                iconCls: 'add',
                name: 'reload',
                tooltip: 'Reload',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    if (Ext.getCmp('employee_list_grid')) {
                        Ext.getCmp('employee_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}


function employeeEducationListGrid(data) {
    return Ext.create('Ext.grid.Panel', {
        id: 'employee_education_list_grid' + data.id,
        title: 'EDUCATION',
        columnLines: true,
        store: {
            proxy: {
                type: 'ajax',
                url: '/education/' + data.id
            },
            autoLoad: true,
            autoSync: true,
            model: Ext.define('EDUCATION_MODEL', {
                extend: 'Ext.data.Model',
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'employee',
                    type: 'string',
                    mapping: 'employeeTable.name'
                }, {
                    name: 'exam_name',
                    type: 'string'
                }, {
                    name: 'major',
                    type: 'string'
                }, {
                    name: 'pass_year',
                    type: 'date'
                }, ]
            })
        },
        tools: [{
            xtype: 'button',
            text: 'Add',
            icon: '/uploads/icons/create.png',
            handler: function(event, toolEl, panel) {
                employeeEducationInputFormWindow(data);
            }
        }],
        loadMask: true,
        viewConfig: {
            emptyText: 'No records',
            autoDestroy: false
        },
        listeners: {
            rowclick: function(grid, row, e) {
                var data = row.data;
                //employeeProfileTab(data);
            }
        },
        autoScroll: true,
        columns: [{
            header: 'EXAM NAME',
            dataIndex: 'exam_name',
            align: 'center',
            flex: 1
        }, {
            header: 'MAJOR',
            dataIndex: 'major',
            align: 'center',
            flex: 1
        }, {
            header: 'PASS YEAR',
            dataIndex: 'pass_year',
            renderer: Ext.util.Format.dateRenderer('Y'),
            align: 'center',
            flex: 1
        }, {
            xtype: 'actioncolumn',
            header: ' ',
            width: 25,
            align: 'center',
            items: [{
                icon: '/uploads/icons/delete.png',
                tooltip: 'Delete',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    socket.emit('DestroyEmployeeEducation', rec.id).on('DestroyEmployeeEducation', function(message) {
                        if (message == "success") {
                            if (Ext.getCmp('employee_education_list_grid' + data.id)) {
                                Ext.getCmp('employee_education_list_grid' + data.id).getStore().load();
                            }
                            Ext.MessageBox.alert('success', 'Successfully data deleted');
                        } else if (message == "error") {
                            Ext.MessageBox.alert('Error',
                                'Please contact with the developer');
                        } else {
                            Ext.MessageBox.alert('Unauthorized',
                                'You are not authorized to perform this task. ' +
                                'Repeatedly doing this might block your ID');
                        }
                    });
                }
            }]
        }]
    });
}

function employeeEducationInputFormWindow(data) {
    return Ext.create('Ext.window.Window', {
        title: 'Add Education Details',
        modal: true,
        id: 'employeeEducationInputForm' + data.id,
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                id: 'employeeEducationInputForm_' + data.id,
                width: '100%',
                bodyPadding: 20,
                border: false,
                layout: {
                    type: 'vbox',
                    align: 'stretch' // Child items are stretched to full width
                },
                items: [],
                buttons: [{
                    text: 'Reset',
                    handler: function() {
                        this.up('form').getForm().reset();
                    }
                }, {
                    text: 'Submit',
                    id: 'employeeEducationInputFormSubmitButton',
                    handler: function() {

                        var panel = this.up('form'),
                            form = panel.getForm(),
                            filefield = panel.query('filefield')[0],
                            values = form.getValues();
                        if (form.isValid()) {


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

function employeeBasicDetailsPanel(data) {
    return Ext.create('Ext.panel.Panel', {
        title: 'BASIC INFO',
        width: 600,
        layout: {
            type: 'table',
            // The total column count must be specified here
            columns: 4
        },
        tools: [{
            xtype: 'button',
            text: 'Edit',
            icon: '/uploads/icons/edit_s.png',
            handler: function(event, toolEl, panel) {
                console.log(panel);
            }
        }],
        bodyStyle: 'padding-left:30px; padding-right:30px;padding-top:20px;padding-bottom:0px;',
        id: 'employeeBasicDetailsPanel' + data.id,
        defaults: {
            // applied to each contained panel
            bodyStyle: 'padding-left:8px;padding-right:8px;',
            border: false
        },
        items: [
            /*
      {
        html: '<h2>'+data.name+'`s Profile</h2>',
        bodyStyle: 'text-align: center',
        style:{
          textAlign:'center',
        },
        colspan: 4
      },

      {
        html: '<h3><u>Basic Info:</u></h3>',
        bodyStyle: 'text-align: left',
        colspan: 4
      },
*/
            {
                html: '<b>ID No. : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 150,
                flex: 1
            }, {
                html: data.id,
                height: 30,
                width: 280
            }, {
                html: '<b>Status : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 100,
                flex: 0.5
            }, {
                html: '',
                height: 30,
            },

            {
                html: '<b>Card No. : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 150,
                flex: 1
            }, {
                html: data.card_no,
                height: 30,
                flex: 3
            }, {
                html: '<b>Photo : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 100,
                flex: 0.5
            }, {
                html: '<img width="160" alt="" src="/uploads/images/profile/' + data.photo + '" />',
                height: 30 * 6,
                rowspan: 6
            },

            {
                html: '<b>Name : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 150,
                flex: 1
            }, {
                html: data.name,
                height: 30,
                flex: 3
            }, {
                html: '',
                height: 30 * 5,
                flex: 0.5,
                rowspan: 5
            },

            {
                html: '<b>Designation : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.designation,
                height: 30,
                flex: 3
            }, {
                html: '<b>Department : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.department,
                height: 30,
                flex: 3
            }, {
                html: '<b>Working Place : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.working_place,
                height: 30,
                flex: 3
            }, {
                html: '<b>Employee Type : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.employee_type,
                height: 30,
                flex: 3
            },

            {
                html: '<b>Date of Birth : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.date_of_birth,
                height: 30,
                flex: 3
            }, {
                html: '<b>Age : </b>',
                height: 30,
                width: 100,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: '',
                height: 30,
                flex: 3
            },

            {
                html: '<b>Date of Join : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.date_of_join,
                height: 30,
                flex: 3
            }, {
                html: '<b>Religion : </b>',
                height: 30,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.religion,
                height: 30,
                flex: 3
            },

            {
                html: '<b>Date of Release : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.date_of_release,
                height: 30,
                flex: 3
            }, {
                html: '<b>Marital Status : </b>',
                height: 30,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: (data.marital_status == 1) ? 'Married' : 'Unmarried',
                height: 30,
                flex: 3
            },

            {
                html: '<b>National ID No. : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.national_id,
                height: 30,
                flex: 3
            }, {
                html: '<b>Contact No. : </b>',
                height: 30,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.contact_no,
                height: 30,
                flex: 3
            },

            {
                html: '<b>Blood Group : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.blood_group,
                height: 30,
                flex: 3
            }, {
                html: '<b>Duty Shift : </b>',
                height: 30,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.duty_shift,
                height: 30,
                flex: 3
            },

            {
                html: '<b>Remarks : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.remarks,
                height: 30,
                flex: 3,
                colspan: 4
            },

            /*
                  {
                    html: '<h3><u>Education:</u></h3>',
                    bodyStyle: 'text-align: left',
                    colspan: 4
                  },
            */
        ],
        renderTo: Ext.getBody()
    });
}


function employeeExperienceListGrid(data) {
    return Ext.create('Ext.grid.Panel', {
        id: 'employee_experience_list_grid' + data.id,
        title: 'EXPERIENCE',
        columnLines: true,
        store: {
            proxy: {
                type: 'ajax',
                url: '/experience/' + data.id
            },
            autoLoad: true,
            autoSync: true,
            model: Ext.define('EXPERIENCE_MODEL', {
                extend: 'Ext.data.Model',
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'employee',
                    type: 'string',
                    mapping: 'employeeTable.name'
                }, {
                    name: 'organization',
                    type: 'string'
                }, {
                    name: 'designation',
                    type: 'string',
                    mapping: 'designationTable.name'
                }, {
                    name: 'start_date',
                    type: 'date'
                }, {
                    name: 'end_date',
                    type: 'date'
                }, ]
            })
        },
        tools: [{
            xtype: 'button',
            text: 'Edit',
            icon: '/uploads/icons/edit_s.png',
            handler: function(event, toolEl, panel) {
                console.log(panel);
            }
        }],
        loadMask: true,
        viewConfig: {
            emptyText: 'No records',
            autoDestroy: false
        },
        listeners: {
            rowclick: function(grid, row, e) {
                var data = row.data;
                //employeeProfileTab(data);
            }
        },
        autoScroll: true,
        columns: [{
            header: 'ORGANIZATION NAME',
            dataIndex: 'organization',
            align: 'center',
            flex: 1
        }, {
            header: 'DESIGNATION',
            dataIndex: 'designation',
            align: 'center',
            flex: 1
        }, {
            header: 'START DATE',
            dataIndex: 'start_date',
            renderer: Ext.util.Format.dateRenderer('d-M-Y'),
            align: 'center',
            flex: 1
        }, {
            header: 'END DATE',
            dataIndex: 'end_date',
            renderer: Ext.util.Format.dateRenderer('d-M-Y'),
            align: 'center',
            flex: 1
        }, {
            xtype: 'actioncolumn',
            header: ' ',
            width: 25,
            align: 'center',
            items: [{
                icon: '/uploads/icons/delete.png',
                tooltip: 'Delete',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    socket.emit('DestroyEmployeeExperience', rec.id).on('DestroyEmployeeExperience', function(message) {
                        if (message == "success") {
                            if (Ext.getCmp('employee_experience_list_grid' + data.id)) {
                                Ext.getCmp('employee_experience_list_grid' + data.id).getStore().load();
                            }
                            Ext.MessageBox.alert('success', 'Successfully data deleted');
                        } else if (message == "error") {
                            Ext.MessageBox.alert('Error',
                                'Please contact with the developer');
                        } else {
                            Ext.MessageBox.alert('Unauthorized',
                                'You are not authorized to perform this task. ' +
                                'Repeatedly doing this might block your ID');
                        }
                    });
                }
            }]
        }]
    });
}

function employeeRefererInfoPanel(data) {
    return Ext.create('Ext.panel.Panel', {
        title: 'REFERER INFO',
        width: 600,
        layout: {
            type: 'table',
            // The total column count must be specified here
            columns: 4
        },
        tools: [{
            xtype: 'button',
            text: 'Edit',
            icon: '/uploads/icons/edit_s.png',
            handler: function(event, toolEl, panel) {
                console.log(panel);
            }
        }],
        bodyStyle: 'padding-left:30px; padding-right:30px;padding-top:20px;padding-bottom:0px;',
        id: 'employeeRefererInfoPanel' + data.id,
        defaults: {
            // applied to each contained panel
            bodyStyle: 'padding-left:8px;padding-right:8px;',
            border: false
        },
        items: [{
                html: '<b>Referer Name. : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 150,
                flex: 1
            }, {
                html: data.referer,
                height: 30,
                width: 280
            }, {
                html: '<b>Contact No. : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 100,
                flex: 0.5
            }, {
                html: data.referer_contact_no,
                height: 30,
                width: 100
            },

            {
                html: '<b>Address : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 150,
                flex: 1
            }, {
                html: data.address,
                height: 30,
                width: 280,
                colspan: 3
            }

        ],
        renderTo: Ext.getBody()
    });
}


function employeePresentAddressPanel(data) {
    var PresentAddressItems = addressStore.getData().items;
    var PresentAddress = {};
    for (var i = PresentAddressItems.length - 1; i >= 0; i--) {
        if (PresentAddressItems[i].data.employeeTable.id == data.id && PresentAddressItems[i].data.address_type == "Present Address") {
            PresentAddress = PresentAddressItems[i].data;
        }
    };
    return Ext.create('Ext.panel.Panel', {
        title: 'PRESENT ADDRESS',
        width: 600,
        layout: {
            type: 'table',
            columns: 4
        },
        tools: [{
            xtype: 'button',
            text: 'Edit',
            icon: '/uploads/icons/edit_s.png',
            handler: function(event, toolEl, panel) {
                console.log(panel);
            }
        }],
        bodyStyle: 'padding-left:30px; padding-right:30px;padding-top:20px;padding-bottom:0px;',
        id: 'employeePresentAddressPanel' + data.id,
        defaults: {
            bodyStyle: 'padding-left:8px;padding-right:8px;',
            border: false
        },
        items: [{
                html: '<b>Vill. : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 150,
                flex: 1
            }, {
                html: PresentAddress.village,
                height: 30,
                width: 280
            }, {
                html: '<b>P.O. : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 100,
                flex: 0.5
            }, {
                html: PresentAddress.post_office,
                height: 30,
            },

            {
                html: '<b>P.S. : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 150,
                flex: 1
            }, {
                html: PresentAddress.village,
                height: 30,
                width: 280
            }, {
                html: '<b>Dist : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 100,
                flex: 0.5
            }, {
                html: PresentAddress.district,
                height: 30,
            },
        ],
        renderTo: Ext.getBody()
    });
}


function employeePermanentAddressPanel(data) {
    var PermanentAddressItems = addressStore.getData().items;
    var PermanentAddress = {};
    for (var i = PermanentAddressItems.length - 1; i >= 0; i--) {
        if (PermanentAddressItems[i].data.employeeTable.id == data.id && PermanentAddressItems[i].data.address_type == "Permanent Address") {
            PermanentAddress = PermanentAddressItems[i].data;
        }
    };
    return Ext.create('Ext.panel.Panel', {
        title: 'PERMANENT ADDRESS',
        width: 600,
        layout: {
            type: 'table',
            columns: 4
        },
        tools: [{
            xtype: 'button',
            text: 'Edit',
            icon: '/uploads/icons/edit_s.png',
            handler: function(event, toolEl, panel) {
                console.log(panel);
            }
        }],
        bodyStyle: 'padding-left:30px; padding-right:30px;padding-top:20px;padding-bottom:0px;',
        id: 'employeePermanentAddressPanel' + data.id,
        defaults: {
            bodyStyle: 'padding-left:8px;padding-right:8px;',
            border: false
        },
        items: [{
                html: '<b>Vill. : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 150,
                flex: 1
            }, {
                html: PermanentAddress.village,
                height: 30,
                width: 280
            }, {
                html: '<b>P.O. : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 100,
                flex: 0.5
            }, {
                html: PermanentAddress.post_office,
                height: 30,
            },

            {
                html: '<b>P.S. : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 150,
                flex: 1
            }, {
                html: PermanentAddress.village,
                height: 30,
                width: 280
            }, {
                html: '<b>Dist : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 100,
                flex: 0.5
            }, {
                html: PermanentAddress.district,
                height: 30,
            },
        ],
        renderTo: Ext.getBody()
    });
}