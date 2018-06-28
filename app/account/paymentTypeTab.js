function paymentTypeTab() {
    if (Ext.getCmp('payment_type_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("payment_type_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Payment Type',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            id: 'payment_type_tab',
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
                    paymentTypeWindow();
                }
            }],
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'payment_type_grid',
                    title: 'Payment Type',
                    columnLines: true,
                    store: {
                        proxy: {
                            type: 'ajax',
                            url: '/getPaymentType'
                        },
                        autoLoad: true,
                        autoSync: true,
                        model: Ext.define('PAYMENT_TYPE_MODEL', {
                            extend: 'Ext.data.Model',
                            fields: [{
                                name: 'id',
                                type: 'int'
                            }, ]
                        }),
                    },
                    loadMask: true,
                    viewConfig: {
                        emptyText: 'No records',
                        autoDestroy: false
                    },
                    listeners: {
                        rowclick: function(grid, row, e) {
                            var data = row.data;
                        }
                    },
                    autoScroll: true,
                    columns: [{
                        header: 'NAME',
                        dataIndex: 'name',
                        align: 'center',
                        flex: 1
                    }, {
                        header: 'PERCENT',
                        dataIndex: 'percent',
                        align: 'center',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return value + ' %';
                        },
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
                                socket.emit('DestroyPaymentType', rec.id).on('DestroyPaymentType', function(message) {
                                    if (message == "success") {
                                        if (Ext.getCmp('payment_type_grid')) {
                                            Ext.getCmp('payment_type_grid').getStore().load();
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
                })
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
                    if (Ext.getCmp('payment_type_grid')) {
                        Ext.getCmp('payment_type_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}


function paymentTypeWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Payment Type',
        modal: true,
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                width: '100%',
                bodyPadding: 20,
                border: false,
                items: [
                    Ext.create('Ext.form.field.Text', {
                        name: 'name',
                        fieldLabel: 'Payment Type',
                        filedAlign: 'top',
                        allowBlank: false,
                        labelAlign: 'left',
                        labelStyle: 'text-align:left;border solid 1px white;',
                        labelSeparator: '',
                        emptyText: 'Give Payment Type...',
                        labelClsExtra: 'some-class',
                        fieldStyle: 'text-align: left;font-size: 12px;',
                        autoScroll: true
                    }),
                    Ext.create('Ext.form.field.Number', {
                        name: 'percent',
                        fieldLabel: 'Percent (%)',
                        filedAlign: 'top',
                        allowBlank: false,
                        minValue: 1,
                        labelAlign: 'left',
                        labelStyle: 'text-align:left;border solid 1px white;',
                        labelSeparator: '',
                        emptyText: 'Give Percent (%)...',
                        labelClsExtra: 'some-class',
                        fieldStyle: 'text-align: left;font-size: 12px;',
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
                        var success = false;
                        var win = this.up('.window');
                        var panel = this.up('form'),
                            form = panel.getForm(),
                            values = form.getValues();
                        if (form.isValid()) {
                            socket.emit('CreatePaymentType', values).on('CreatePaymentType', function(message) {
                                if (message == "success") {
                                    success = true;
                                    if (Ext.getCmp('payment_type_grid')) {
                                        Ext.getCmp('payment_type_grid').getStore().load();
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
    }).show();
}