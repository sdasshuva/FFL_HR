function adjustmentTab() {
    if (Ext.getCmp('adjustment_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("adjustment_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Adjustment',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            id: 'adjustment_tab',
            autoScroll: true,
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'adjustment_list_grid',
                    columnLines: true,
                    autoScroll: true,
                    loadMask: true,
                    store: {
                        proxy: {
                            type: 'ajax',
                            url: '/adjustment'
                        },
                        autoLoad: true,
                        autoSync: true,
                        model: Ext.define('ADJUSTMENT_MODEL', {
                            extend: 'Ext.data.Model',
                            fields: [{
                                name: 'id',
                                type: 'int'
                            }, {
                                name: 'reason',
                                type: 'string'
                            }, {
                                name: 'date',
                                type: 'date'
                            }]
                        })
                    },
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
                    columns: [{
                        header: 'REASON',
                        dataIndex: 'reason',
                        align: 'center',
                        flex: 1
                    }, {
                        header: 'DATE',
                        dataIndex: 'date',
                        renderer: Ext.util.Format.dateRenderer('jS F, Y'),
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
                                socket.emit('DestroyAdjustment', rec.id).on('DestroyAdjustment', function(message) {
                                    if (message == "success") {
                                        if (Ext.getCmp('adjustment_list_grid')) {
                                            Ext.getCmp('adjustment_list_grid').getStore().load();
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
                    adjustmentInputFormWindow();
                }
            }],
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
                    if (Ext.getCmp('adjustment_list_grid')) {
                        Ext.getCmp('adjustment_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}


function adjustmentInputFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Adjustment',
        modal: true,
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                width: '100%',
                bodyPadding: 20,
                border: false,
                items: [
                    newTextField('Reason', 'reason'),
                    newDateField('Adjustment', 'date')
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
                        var date = values.date.split("/");
                        var d = parseInt(date[1]);
                        var m = parseInt(date[0]) - 1;
                        var y = parseInt(date[2]);
                        values.date = new Date(Date.UTC(y, m, d));
                        if (form.isValid()) {
                            socket.emit('CreateAdjustment', values).on('CreateAdjustment', function(message) {
                                if (message == "success") {
                                    success = true;
                                    if (Ext.getCmp('adjustment_list_grid')) {
                                        Ext.getCmp('adjustment_list_grid').getStore().load();
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