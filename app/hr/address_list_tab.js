function addressListTab() {
    if (Ext.getCmp('address_list_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("address_list_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Address',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            id: 'address_list_tab',
            autoScroll: true,
            items: [
                addressListToolBar(),
                addressListGrid()
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
                    if (Ext.getCmp('address_list_grid')) {
                        Ext.getCmp('address_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function addressListGrid() {
    return Ext.create('Ext.grid.Panel', {
        id: 'address_list_grid',
        title: 'ADDRESS',
        columnLines: true,
        store: {
            proxy: {
                type: 'ajax',
                url: '/address'
            },
            autoLoad: true,
            autoSync: true,
            model: Ext.define('ADDRESS_MODEL', {
                extend: 'Ext.data.Model',
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'employee',
                    type: 'string',
                    mapping: 'employeeTable.name'
                }, {
                    name: 'address_type',
                    type: 'string',
                    mapping: 'addressTypeTable.name'
                }, {
                    name: 'village',
                    type: 'string',
                    mapping: 'villageTable.name'
                }, {
                    name: 'post_office',
                    type: 'string',
                    mapping: 'postOfficeTable.name'
                }, {
                    name: 'police_station',
                    type: 'string',
                    mapping: 'policeStationTable.name'
                }, {
                    name: 'district',
                    type: 'string',
                    mapping: 'districtTable.name'
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
            header: 'EMPLOYEE NAME',
            dataIndex: 'employee',
            align: 'center',
            flex: 1
        }, {
            header: 'ADDRESS TYPE',
            dataIndex: 'address_type',
            align: 'center',
            flex: 1
        }, {
            header: 'VILLAGE',
            dataIndex: 'village',
            align: 'center',
            flex: 1
        }, {
            header: 'POST OFFICE',
            dataIndex: 'post_office',
            align: 'center',
            flex: 1
        }, {
            header: 'POLICE STATION',
            dataIndex: 'police_station',
            align: 'center',
            flex: 1
        }, {
            header: 'DISTRICT',
            dataIndex: 'district',
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
                    socket.emit('DestroyAddress', rec.id).on('DestroyAddress', function(message) {
                        if (message == "success") {
                            if (Ext.getCmp('address_list_grid')) {
                                Ext.getCmp('address_list_grid').getStore().load();
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
        }, {
            xtype: 'actioncolumn',
            header: ' ',
            width: 25,
            align: 'center'
        }]
    });
}

function addressListToolBar() {
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
                    title: 'Add New Address',
                    modal: true,
                    id: 'addressInputFormWindow',
                    layout: 'fit',
                    items: [
                        Ext.create('Ext.form.Panel', {
                            id: 'addressInputForm',
                            width: '100%',
                            bodyPadding: 20,
                            border: false,
                            layout: {
                                type: 'vbox',
                                align: 'stretch' // Child items are stretched to full width
                            },
                            items: [
                                //employeeNameTextField()
                            ],
                            buttons: [{
                                text: 'Reset',
                                handler: function() {
                                    this.up('form').getForm().reset();
                                }
                            }, {
                                text: 'Submit',
                                id: 'addressInputFormSubmitButton',
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
                }).show()
            }
        }]
    });
}