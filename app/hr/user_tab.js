function userTab() {
    if (Ext.getCmp('user_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("user_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'User',
            layout: 'fit',
            closable: true,
            id: 'user_tab',
            autoScroll: true,
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'user_list_grid',
                    store: {
                        proxy: {
                            type: 'ajax',
                            url: '/user'
                        },
                        autoLoad: true,
                        autoSync: true,
                        model: Ext.define('USER_MODEL', {
                            extend: 'Ext.data.Model',
                            fields: [{
                                name: 'id',
                                type: 'int'
                            }, {
                                name: 'card_no',
                                type: 'int'
                            }, {
                                name: 'finger_print_id',
                                type: 'int'
                            }, {
                                name: 'first_name',
                                type: 'string'
                            }, {
                                name: 'last_name',
                                type: 'string'
                            }, {
                                name: 'email',
                                type: 'string'
                            }, {
                                name: 'access_level',
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
                    //selType: 'cellmodel',
                    plugins: [
                        celEditPlugin
                    ],
                    columnLines: true,
                    autoScroll: true,
                    columns: [
                        Ext.create('Ext.grid.RowNumberer'), {
                            header: 'FP',
                            dataIndex: 'finger_print_id',
                            align: 'center',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return 'JCLFFL' + addLeadingZero(4, value);
                            },
                            flex: 0.5
                        }, {
                            header: 'FIRST NAME',
                            dataIndex: 'first_name',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                if (value)
                                    return value;
                                else
                                    return '<b style="color:#CCC">Give First Name</b>';
                            },
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('user_list_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.first_name = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateUserFirstName', data).on('UpdateUserFirstName', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('user_list_grid')) {
                                                        Ext.getCmp('user_list_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            align: 'left',
                            flex: 1
                        }, {
                            header: 'LAST NAME',
                            dataIndex: 'last_name',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                if (value)
                                    return value;
                                else
                                    return '<b style="color:#CCC">Give Last Name</b>';
                            },
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('user_list_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.last_name = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateUserLastName', data).on('UpdateUserLastName', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('user_list_grid')) {
                                                        Ext.getCmp('user_list_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            align: 'left',
                            flex: 1
                        }, {
                            header: 'EMAIL',
                            dataIndex: 'email',
                            align: 'left',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                if (value)
                                    return value;
                                else
                                    return '<b style="color:#CCC">Give Email Address</b>';
                            },
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('user_list_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.email = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateUserEmail', data).on('UpdateUserEmail', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('user_list_grid')) {
                                                        Ext.getCmp('user_list_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            flex: 1
                        }, {
                            header: 'ACCESS LEVEL',
                            dataIndex: 'access_level',
                            /*renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                                if(value)
                                    return value;
                                else
                                    return '<b style="color:#CCC">Give Last Name</b>';
                            },*/
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('user_list_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.access_level = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateUserAccessLevel', data).on('UpdateUserAccessLevel', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('user_list_grid')) {
                                                        Ext.getCmp('user_list_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            align: 'left',
                            flex: 1
                        }, {
                            xtype: 'actioncolumn',
                            header: 'PASSWORD',
                            flex: 0.5,
                            align: 'center',
                            items: [{
                                icon: '/uploads/icons/password.png',
                                tooltip: 'Password',
                                handler: function(grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    assignUserPasswordWindow(rec);
                                }
                            }]
                        }
                    ]
                })
            ],
            tbar: [{
                xtype: 'button',
                icon: '/uploads/icons/create.png',
                text: 'Add New User',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    userInputFormWindow();
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
                    if (Ext.getCmp('user_list_grid')) {
                        Ext.getCmp('user_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}