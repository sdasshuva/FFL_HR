function addressTypeTab() {
    if (Ext.getCmp('address_type_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("address_type_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Address Type',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            id: 'address_type_tab',
            autoScroll: true,
            items: [
                addressTypeListToolBar(),
                addressTypeListGrid()
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
                    if (Ext.getCmp('address_type_list_grid')) {
                        Ext.getCmp('address_type_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function addressTypeListGrid() {
    return Ext.create('Ext.grid.Panel', {
        id: 'address_type_list_grid',
        title: 'ADDRESS TYPE',
        columnLines: true,
        store: {
            proxy: {
                type: 'ajax',
                url: '/address_type'
            },
            autoLoad: true,
            autoSync: true,
            model: Ext.define('ADDRESS_TYPE_MODEL', {
                extend: 'Ext.data.Model',
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'name',
                    type: 'string'
                }]
            })
        },
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
            header: 'ADDRESS TYPE',
            dataIndex: 'name',
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
                    socket.emit('DestroyAddressType', rec.id).on('DestroyAddressType', function(message) {
                        if (message == "success") {
                            if (Ext.getCmp('address_type_list_grid')) {
                                Ext.getCmp('address_type_list_grid').getStore().load();
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


function addressTypeListToolBar() {
    return Ext.create('Ext.toolbar.Toolbar', {
        items: [{
            xtype: 'button',
            icon: '/uploads/icons/create.png',
            text: 'Add New',
            border: 1,
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                Ext.create('Ext.window.Window', {
                    title: 'Add New Address Type',
                    modal: true,
                    layout: 'fit',
                    items: [
                        Ext.create('Ext.form.Panel', {
                            width: '100%',
                            bodyPadding: 20,
                            border: false,
                            items: [
                                newTextField('Address Type', 'name')
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
                                    var success = false;
                                    var win = this.up('.window');
                                    var panel = this.up('form'),
                                        form = panel.getForm(),
                                        values = form.getValues();
                                    if (form.isValid()) {
                                        socket.emit('CreateAddressType', values).on('CreateAddressType', function(message) {
                                            if (message == "success") {
                                                success = true;
                                                if (Ext.getCmp('address_type_list_grid')) {
                                                    Ext.getCmp('address_type_list_grid').getStore().load();
                                                }
                                                Ext.MessageBox.alert('success', 'Successfully data inserted');
                                                win.close();
                                            } else if (message == "error") {
                                                Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                                            }
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
                                    if (success) {
                                        this.up('.window').close();
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
                }).show()
            }
        }]
    });
}



// =========================================
// =========================================
// =========================================
// =========================================

var attendance_report_model_field = [
    {
        name: 'id',
        type: 'int'
    },
    {
        name: 'first_name',
        type: 'string'
    },
    {
        name: 'last_name',
        type: 'string'
    },
    {
        name: 'department',
        type: 'string'
    },
    {
        name: 'sick_leave',
        type: 'string'
    },
    {
        name: 'casual_leave',
        type: 'string'
    },
    {
        name: 'present',
        type: 'string'
    },
    {
        name: 'absent',
        type: 'string'
    },
    {
        name: 'late',
        type: 'string'
    },
    {
        name: 'weekend',
        type: 'string'
    },
    {
        name: 'holidays',
        type: 'string'
    },
    {
        name: 'total',
        type: 'string'
    },
]
for (var i = 1; i < 32; i++) {
    var attendance_report_model_day =   {
                                            name: 'day_'+i,
                                            type: 'string',
                                            mapping: 'days.day_'+i
                                        }
    attendance_report_model_field.push(attendance_report_model_day)
};

Ext.define('ATTENDANCE_REPORT_MODEL', {
    extend: 'Ext.data.Model',
    fields: attendance_report_model_field
});
