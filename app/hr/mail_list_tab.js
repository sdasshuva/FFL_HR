function mailListTab() {
    var mailStore = ;
    if (Ext.getCmp('mail_list_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("mail_list_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Mail List',
            layout: 'fit',
            closable: true,
            id: 'mail_list_tab',
            autoScroll: true,
            items: [
                Ext.create('Ext.data.Store', {
                    proxy: {
                        type: 'ajax',
                        url: '/mail_list'
                    },
                    autoLoad: true,
                    autoSync: true,
                    model: Ext.define('TEST_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, ]
                    })
                });
                return Ext.create('Ext.grid.Panel', {
                    id: 'mail_list_grid',
                    columnLines: true,
                    store: mailStore,
                    loadMask: true,
                    autoScroll: true,
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
                    plugins: [
                        celEditPlugin
                    ],
                    columns: [{
                        header: 'EMAIL ADDRESS',
                        dataIndex: 'email',
                        align: 'left',
                        flex: 3
                    }, {
                        header: 'PASSWORD',
                        dataIndex: 'pass',
                        align: 'left',
                        editor: {
                            xtype: 'textfield',
                            editable: true,
                            listeners: {
                                blur: function(self, event, eOpts) {
                                    var row = Ext.getCmp('mail_list_grid').getSelectionModel().getSelection()[0].data.id;
                                    var data = {};
                                    data.id = row;
                                    data.pass = self.value;
                                    Ext.Msg.show({
                                        title: 'Delete Email Account?',
                                        msg: 'Are you sure you want to delete this information. <br>It will permanently delete this information from the server',
                                        buttons: Ext.Msg.YESNO,
                                        icon: Ext.Msg.WARNING,
                                        fn: function(btn, text) {
                                            if (btn == 'yes') {
                                                socket.emit('UpdateEmailPassword', data).on('UpdateEmailPassword', function(message) {
                                                    if (message == "success") {
                                                        if (Ext.getCmp('mail_list_grid')) {
                                                            Ext.getCmp('mail_list_grid').getStore().load();
                                                        }
                                                        Ext.MessageBox.alert('success', 'Successfully data updated');
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
                                        }
                                    });
                                    /*if (self.value){
                                        socket.emit('UpdateEmailPassword', data).on('UpdateEmailPassword', function (message) {
                                            if (message == "success") {
                                                if(Ext.getCmp('mail_list_grid')){
                                                    Ext.getCmp('mail_list_grid').getStore().load();
                                                }
                                            } else if(message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }*/
                                }
                            }
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
                                Ext.Msg.show({
                                    title: 'Delete Email Account?',
                                    msg: 'Are you sure you want to delete this information. <br>It will permanently delete this information from the server',
                                    buttons: Ext.Msg.YESNO,
                                    icon: Ext.Msg.WARNING,
                                    fn: function(btn, text) {
                                        if (btn == 'yes') {
                                            socket.emit('DestroyMailUser', rec.id).on('DestroyMailUser', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('mail_list_grid')) {
                                                        Ext.getCmp('mail_list_grid').getStore().load();
                                                    }
                                                    Ext.MessageBox.alert('success', 'Successfully data removed');
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
                    mailFormWindow();
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
                    if (Ext.getCmp('mail_list_grid')) {
                        Ext.getCmp('mail_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}


function mailFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'New Mail Address',
        modal: true,
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                width: '100%',
                bodyPadding: 20,
                border: false,
                items: [
                    newTextField('User Name', 'email', true),
                    newTextField('Password', 'password', true)
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
                        values.email = values.email + '@denimaltd.com';
                        if (form.isValid()) {
                            socket.emit('CreateNewMail', values).on('CreateNewMail', function(message) {
                                if (message == "success") {
                                    success = true;
                                    if (Ext.getCmp('mail_list_grid')) {
                                        Ext.getCmp('mail_list_grid').getStore().load();
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

// function mailListGrid() {
//     var mailStore = ;
// }