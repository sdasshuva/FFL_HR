function inputListTab() {
    if (Ext.getCmp('input_list_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("input_list_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Input List',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            autoScroll: true,
            id: 'input_list_tab',
            items: [
                //inputListTopTabPanel(),
                Ext.create('Ext.panel.Panel', {
                    id: 'inputListBottomTabPanel',
                    width: '100%',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    border: false,
                    autoScroll: true,
                    items: [
                        Ext.create('Ext.panel.Panel', {
                            id: 'countryPanel',
                            title: 'Country',
                            width: '20%',
                            height: 270,
                            layout: 'fit',
                            autoScroll: true,
                            tbar: [{
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
                                        title: 'Add New Country',
                                        modal: true,
                                        layout: 'fit',
                                        items: [
                                            Ext.create('Ext.form.Panel', {
                                                width: '35%',
                                                bodyPadding: 20,
                                                border: true,
                                                items: [{
                                                    xtype: 'textfield',
                                                    name: 'name',
                                                    fieldLabel: 'Country Name',
                                                    filedAlign: 'top',
                                                    allowBlank: false,
                                                    width: 300,
                                                    labelWidth: 80,
                                                    labelAlign: 'left',
                                                    labelStyle: 'text-align:left;border solid 1px white;',
                                                    labelSeparator: '',
                                                    emptyText: 'Give Country Name...',
                                                    labelClsExtra: 'some-class',
                                                    fieldStyle: 'text-align: left;font-size: 12px;',
                                                    autoScroll: true
                                                }],
                                                buttons: [{
                                                    text: 'Reset',
                                                    handler: function() {
                                                        this.up('form').getForm().reset();
                                                    }
                                                }, {
                                                    text: 'Submit',
                                                    formBind: true,
                                                    handler: function() {
                                                        var panel = this.up('form');
                                                        var form = panel.getForm();
                                                        if (form.isValid()) {
                                                            socket.emit('CreateCountry', form.getValues()).on('CreateCountry', function(message) {
                                                                if (message == "success") {
                                                                    if (Ext.getCmp('country')) {
                                                                        Ext.getCmp('country').getStore().load();
                                                                    }
                                                                    if (Ext.getCmp('country_grid')) {
                                                                        Ext.getCmp('country_grid').getStore().load();
                                                                    }
                                                                    Ext.MessageBox.alert('success', 'Successfully data inserted');
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
                                                        this.up('.window').close();
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
                            }],
                            items: [
                                Ext.create('Ext.grid.Panel', {
                                    border: false,
                                    id: 'country_grid',
                                    autoScroll: true,
                                    store: {
                                        proxy: {
                                            type: 'ajax',
                                            url: '/country'
                                        },
                                        autoLoad: true,
                                        autoSync: false,
                                        model: Ext.define('COUNTRY_MODEL', {
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
                                    autoScroll: true,
                                    loadMask: true,
                                    viewConfig: {
                                        emptyText: 'No records'
                                    },
                                    columns: [{
                                        header: 'COUNTRY NAME',
                                        dataIndex: 'name',
                                        align: 'center',
                                        flex: 1
                                    }, {
                                        xtype: 'actioncolumn',
                                        header: ' ',
                                        width: 25,
                                        align: 'center',
                                        items: [{
                                            icon: '/uploads/icons/edit.png',
                                            tooltip: 'Edit',
                                            handler: function(grid, rowIndex, colIndex) {
                                                var rec = grid.getStore().getAt(rowIndex);
                                                Ext.MessageBox.alert('Unauthorized',
                                                    'You are not authorized to perform this task. ' +
                                                    'Repeatedly doing this might block your ID');
                                            }
                                        }]
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
                                                socket.emit('DestroyCountry', rec.id).on('DestroyCountry', function(message) {
                                                    if (message == "success") {
                                                        if (Ext.getCmp('country_grid')) {
                                                            Ext.getCmp('country_grid').getStore().load();
                                                        }
                                                        Ext.MessageBox.alert('success', 'Successfully data inserted');
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
                                })
                            ]
                        }),
                        Ext.create('Ext.panel.Panel', {
                            id: 'buyerPanel',
                            title: 'Buyer',
                            width: '20%',
                            height: 270,
                            layout: 'fit',
                            autoScroll: true,
                            tbar: [{
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
                                        title: 'Add New Buyer',
                                        modal: true,
                                        layout: 'fit',
                                        items: [
                                            Ext.create('Ext.form.Panel', {
                                                width: '35%',
                                                bodyPadding: 20,
                                                border: true,
                                                items: [{
                                                        xtype: 'textfield',
                                                        name: 'name',
                                                        fieldLabel: 'Buyer Name',
                                                        filedAlign: 'top',
                                                        allowBlank: false,
                                                        labelAlign: 'left',
                                                        labelStyle: 'text-align:left;border solid 1px white;',
                                                        labelSeparator: '',
                                                        emptyText: 'Give Buyer Name...',
                                                        labelClsExtra: 'some-class',
                                                        fieldStyle: 'text-align: left;font-size: 12px;',
                                                        autoScroll: true
                                                    },
                                                    newCombo('Country', 'country', 'country_combo')
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
                                                        var panel = this.up('form');
                                                        var form = panel.getForm();
                                                        if (form.isValid()) {
                                                            socket.emit('CreateBuyer', form.getValues()).on('CreateBuyer', function(message) {
                                                                if (message == "success") {
                                                                    if (Ext.getCmp('buyer')) {
                                                                        Ext.getCmp('buyer').getStore().load();
                                                                    }
                                                                    if (Ext.getCmp('buyer_grid')) {
                                                                        Ext.getCmp('buyer_grid').getStore().load();
                                                                    }
                                                                    Ext.MessageBox.alert('success', 'Successfully data inserted');
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
                                                        this.up('.window').close();
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
                            }],
                            items: [
                                Ext.create('Ext.grid.Panel', {
                                    border: false,
                                    id: 'buyer_grid',
                                    autoScroll: true,
                                    store: {
                                        proxy: {
                                            type: 'ajax',
                                            url: '/buyer'
                                        },
                                        autoLoad: true,
                                        autoSync: false,
                                        model: Ext.define('BUYER_MODEL', {
                                            extend: 'Ext.data.Model',
                                            fields: [{
                                                name: 'id',
                                                type: 'int'
                                            }, {
                                                name: 'country',
                                                type: 'string',
                                                mapping: 'countryTable.name'
                                            }, {
                                                name: 'name',
                                                type: 'string'
                                            }]
                                        })
                                    },
                                    autoScroll: true,
                                    loadMask: true,
                                    viewConfig: {
                                        emptyText: 'No records'
                                    },
                                    columns: [{
                                        header: 'BUYER NAME',
                                        dataIndex: 'name',
                                        align: 'center',
                                        flex: 1
                                    }, {
                                        header: 'COUNTRY NAME',
                                        dataIndex: 'country',
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
                                                socket.emit('DestroyBuyer', rec.id).on('DestroyBuyer', function(message) {
                                                    if (message == "success") {
                                                        if (Ext.getCmp('buyer_grid')) {
                                                            Ext.getCmp('buyer_grid').getStore().load();
                                                        }
                                                        Ext.MessageBox.alert('success', 'Successfully Data REMOVED');
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
                                })
                            ]
                        }),
                        Ext.create('Ext.panel.Panel', {
                            id: 'supplierPanel',
                            title: 'Supplier',
                            width: '20%',
                            height: 270,
                            layout: 'fit',
                            autoScroll: true,
                            tbar: [{
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
                                        title: 'Add New Supplier',
                                        modal: true,
                                        layout: 'fit',
                                        items: [
                                            Ext.create('Ext.form.Panel', {
                                                width: '35%',
                                                bodyPadding: 20,
                                                border: true,
                                                items: [{
                                                    xtype: 'textfield',
                                                    name: 'name',
                                                    fieldLabel: 'Supplier Name',
                                                    filedAlign: 'top',
                                                    allowBlank: false,
                                                    labelAlign: 'left',
                                                    labelStyle: 'text-align:left;border solid 1px white;',
                                                    labelSeparator: '',
                                                    emptyText: 'Give Supplier Name...',
                                                    labelClsExtra: 'some-class',
                                                    fieldStyle: 'text-align: left;font-size: 12px;',
                                                    autoScroll: true
                                                }],
                                                buttons: [{
                                                    text: 'Reset',
                                                    handler: function() {
                                                        this.up('form').getForm().reset();
                                                    }
                                                }, {
                                                    text: 'Submit',
                                                    formBind: true,
                                                    handler: function() {
                                                        var panel = this.up('form');
                                                        var form = panel.getForm();
                                                        if (form.isValid()) {
                                                            socket.emit('CreateSupplier', form.getValues()).on('CreateSupplier', function(message) {
                                                                if (message == "success") {
                                                                    if (Ext.getCmp('supplier')) {
                                                                        Ext.getCmp('supplier').getStore().load();
                                                                    }
                                                                    if (Ext.getCmp('supplier_grid')) {
                                                                        Ext.getCmp('supplier_grid').getStore().load();
                                                                    }
                                                                    Ext.MessageBox.alert('success', 'Successfully data inserted');
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
                                                        this.up('.window').close();
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
                            }],
                            items: [
                                Ext.create('Ext.grid.Panel', {
                                    border: false,
                                    id: 'supplier_grid',
                                    autoScroll: true,
                                    store: {
                                        proxy: {
                                            type: 'ajax',
                                            url: '/supplier'
                                        },
                                        autoLoad: true,
                                        autoSync: false,
                                        model: Ext.define('SUPPLIER_MODEL', {
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
                                    autoScroll: true,
                                    loadMask: true,
                                    viewConfig: {
                                        emptyText: 'No records'
                                    },
                                    columns: [{
                                        header: 'SUPPLIER NAME',
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
                                                socket.emit('DestroySupplier', rec.id).on('DestroySupplier', function(message) {
                                                    if (message == "success") {
                                                        if (Ext.getCmp('supplier_grid')) {
                                                            Ext.getCmp('supplier_grid').getStore().load();
                                                        }
                                                        Ext.MessageBox.alert('success', 'Successfully Data REMOVED');
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
                                })
                            ]
                        }),
                    ]
                })
            ]
        });
        tab_panel.setActiveTab(new_tab);
    }
}