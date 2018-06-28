function employeeTypeTab() {
    if (Ext.getCmp('employee_type_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("employee_type_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Employee Type',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            id: 'employee_type_tab',
            autoScroll: true,
            items: [
                employeeTypeListToolBar(),
                employeeTypeListGrid()
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
                    if (Ext.getCmp('employee_type_list_grid')) {
                        Ext.getCmp('employee_type_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}


function employeeTypeListToolBar() {
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
                    title: 'Add New Employee Type',
                    modal: true,
                    layout: 'fit',
                    items: [
                        Ext.create('Ext.form.Panel', {
                            width: '100%',
                            bodyPadding: 20,
                            border: false,
                            items: [
                                newTextField('Employee Type', 'name')
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
                                        socket.emit('CreateEmployeeType', values).on('CreateEmployeeType', function(message) {
                                            if (message == "success") {
                                                success = true;
                                                if (Ext.getCmp('employee_type_list_grid')) {
                                                    Ext.getCmp('employee_type_list_grid').getStore().load();
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


function employeeTypeListGrid() {
    return Ext.create('Ext.grid.Panel', {
        id: 'employee_type_list_grid',
        title: 'EMPLOYEE TYPE',
        columnLines: true,
        store: {
            proxy: {
                type: 'ajax',
                url: '/employee_type'
            },
            autoLoad: true,
            autoSync: true,
            model: Ext.define('EMPLOYEE_TYPE_MODEL', {
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
            header: 'NAME',
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
                    socket.emit('DestroyEmployeeType', rec.id).on('DestroyEmployeeType', function(message) {
                        if (message == "success") {
                            if (Ext.getCmp('employee_type_list_grid')) {
                                Ext.getCmp('employee_type_list_grid').getStore().load();
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