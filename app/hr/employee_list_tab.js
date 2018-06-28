function employeeListTab() {
    var statusChange = false;
    var departmentChange = false;
    var designationChange = false;

    if (Ext.getCmp('employee_list_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("employee_list_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Employee',
            layout: 'fit',
            closable: true,
            id: 'employee_list_tab',
            autoScroll: true,
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'employee_list_grid',
                    loadMask: true,
                    autoScroll: true,
                    //selType: 'cellmodel',
                    columnLines: true,
                    store: {
                        proxy: {
                            type: 'ajax',
                            url: '/employee'
                        },
                        autoLoad: true,
                        autoSync: true,
                        model: Ext.define('EMPLOYEE_MODEL', {
                            extend: 'Ext.data.Model',
                            fields: [{
                                name: 'id',
                                type: 'int',
                                mapping: 'employee.id'
                            }, {
                                name: 'card_no',
                                type: 'int',
                                mapping: 'employee.userTable.card_no'
                            }, {
                                name: 'finger_print_id',
                                type: 'int',
                                mapping: 'employee.userTable.finger_print_id'
                            }, {
                                name: 'first_name',
                                type: 'string',
                                mapping: 'employee.userTable.first_name'
                            }, {
                                name: 'last_name',
                                type: 'string',
                                mapping: 'employee.userTable.last_name'
                            }, {
                                name: 'email',
                                type: 'string',
                                mapping: 'employee.userTable.email'
                            }, {
                                name: 'access_level',
                                type: 'string',
                                mapping: 'employee.userTable.access_level'
                            }, {
                                name: 'photo',
                                type: 'string',
                                mapping: 'employee.photo'
                            }, {
                                name: 'designation',
                                type: 'string',
                                mapping: 'employee.designationTable.name'
                            }, {
                                name: 'department',
                                type: 'string',
                                mapping: 'employee.departmentTable.name'
                            }, {
                                name: 'working_place',
                                type: 'string',
                                mapping: 'employee.workingPlaceTable.name'
                            }, {
                                name: 'employee_type',
                                type: 'string',
                                mapping: 'employee.employeeTypeTable.name'
                            }, {
                                name: 'date_of_birth',
                                type: 'date',
                                mapping: 'employee.date_of_birth'
                            }, {
                                name: 'date_of_join',
                                type: 'date',
                                mapping: 'employee.date_of_join'
                            }, {
                                name: 'date_of_release',
                                type: 'date',
                                mapping: 'employee.date_of_release'
                            }, {
                                name: 'referer',
                                type: 'string',
                                mapping: 'employee.refererTable.name'
                            }, {
                                name: 'referer_address',
                                type: 'string',
                                mapping: 'employee.refererTable.address'
                            }, {
                                name: 'referer_contact_no',
                                type: 'string',
                                mapping: 'employee.refererTable.contact_no'
                            }, {
                                name: 'national_id',
                                type: 'int',
                                mapping: 'employee.national_id'
                            }, {
                                name: 'religion',
                                type: 'string',
                                mapping: 'employee.religionTable.name'
                            }, {
                                name: 'marital_status',
                                type: 'int',
                                mapping: 'employee.marital_status'
                            }, {
                                name: 'contact_no',
                                type: 'string',
                                mapping: 'employee.contact_no'
                            }, {
                                name: 'blood_group',
                                type: 'string',
                                mapping: 'employee.bloodGroupTable.name'
                            }, {
                                name: 'remarks',
                                type: 'string',
                                mapping: 'employee.remarks'
                            }, {
                                name: 'duty_shift',
                                type: 'string',
                                mapping: 'employee.dutyShiftTable.name'
                            }, {
                                name: 'status',
                                type: 'string',
                                mapping: 'employee.status'
                            }, {
                                name: 'payment_method',
                                type: 'string',
                                mapping: 'employee.payment_method'
                            }, {
                                name: 'sl',
                                type: 'string',
                            }, {
                                name: 'cl',
                                type: 'string',
                            }, ]
                        })
                    },
                    viewConfig: {
                        emptyText: 'No records',
                        autoDestroy: false
                            /*getRowClass: function(record) { 
                                return record.get('status') < 18 ? 'child-row' : 'adult-row'; 
                            }*/
                    },
                    listeners: {
                        rowclick: function(grid, row, e) {
                            var data = row.data;
                            //viewEmployeeDetailsWindow(data);
                            //employeeProfileTab(data);
                        },
                        afterrender: function(self, eOpts) {
                            var manual = {
                                xtype: 'actioncolumn',
                                header: 'MANUAL',
                                align: 'center',
                                items: [{
                                    icon: '/uploads/icons/add.png',
                                    tooltip: 'MANUAL',
                                    handler: function(grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex);
                                        employeeManualAttendanceFormWindow(rec)
                                    }
                                }],
                                width: 60,
                            };
                            var status = {
                                header: 'STATUS',
                                dataIndex: 'status',
                                align: 'center',
                                field: {
                                    xtype: 'combo',
                                    name: 'status',
                                    allowBlank: false,
                                    editable: false,
                                    emptyText: 'Select Status...',
                                    autoScroll: true,
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'status',
                                    selectOnFocus: true,
                                    selectOnTab: true,
                                    triggerAction: 'all',
                                    lazyRender: true,
                                    store: {
                                        fields: ['status', 'name'],
                                        data: [{
                                            status: 0,
                                            name: 'REGULAR'
                                        }, {
                                            status: 1,
                                            name: 'DISAPPOINTED'
                                        }]
                                    },
                                    listeners: {
                                        change: function(self, newValue, oldValue, eOpts) {
                                            if (parseInt(newValue) >= 0 && newValue != oldValue) {
                                                statusChange = true;
                                            } else {
                                                statusChange = false;
                                            }
                                        },
                                        blur: function(self, event, eOpts) {
                                            var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data.id;
                                            var data = {};
                                            data.id = row;
                                            data.status = self.value;
                                            if (statusChange) {
                                                socket.emit('UpdateEmployeeStatus', data).on('UpdateEmployeeStatus', function(message) {
                                                    if (message == "success") {
                                                        if (Ext.getCmp('employee_list_grid')) {
                                                            var param = {};
                                                            if (Ext.getCmp('employee_list_fp_id_search').value)
                                                                param.employee = Ext.getCmp('employee_list_fp_id_search').value;
                                                            else if (Ext.getCmp('employee_list_name_search').value)
                                                                param.employee = Ext.getCmp('employee_list_name_search').value;
                                                            else if (Ext.getCmp('employee_list_department_search').value)
                                                                param.department = Ext.getCmp('employee_list_department_search').value;
                                                            else if (Ext.getCmp('employee_list_status_search').value)
                                                                param.status = Ext.getCmp('employee_list_status_search').value;
                                                            Ext.getCmp('employee_list_grid').setLoading(true);
                                                            Ext.getCmp('employee_list_grid').getStore().load({
                                                                params: param,
                                                                callback: function(records, operation, success) {
                                                                    Ext.getCmp('employee_list_grid').setLoading(false);
                                                                },
                                                                scope: this
                                                            });
                                                        }
                                                    } else if (message == "error") {
                                                        Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                    }
                                                });
                                            }
                                        }
                                    }
                                },
                                renderer: function(val, meta, record) {
                                    if (parseInt(val) == 0)
                                        return 'REGULAR';
                                    else if (parseInt(val) == 1)
                                        return 'DISAPPOINTED';
                                },
                                width: 70,
                            };
                            if (parseInt(user.access_level) == 0) {
                                self.headerCt.add(status);
                                self.headerCt.add(manual);
                            }
                            if (parseInt(user.access_level) == 202 || parseInt(user.access_level) == 203) {
                                self.headerCt.add(status);
                            }
                            if (parseInt(user.access_level) == 201 || parseInt(user.access_level) == 203) {
                                self.headerCt.add(manual);
                            }
                        }
                    },
                    plugins: [
                        celEditPlugin
                    ],
                    columns: [{
                        header: 'FP ID',
                        dataIndex: 'finger_print_id',
                        align: 'center',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return 'JCLFFL' + addLeadingZero(4, value);
                        },
                        width: 80
                    }, {
                        header: 'FIRST NAME',
                        dataIndex: 'first_name',
                        align: 'left',
                        editor: {
                            xtype: 'textfield',
                            editable: true,
                            listeners: {
                                blur: function(self, event, eOpts) {
                                    var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data;
                                    var data = {};
                                    data.id = row.employee.user;
                                    data.first_name = self.value;
                                    if (self.value) {
                                        socket.emit('UpdateUserFirstName', data).on('UpdateUserFirstName', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('employee_list_grid')) {
                                                    var param = {};
                                                    if (Ext.getCmp('employee_list_fp_id_search').value)
                                                        param.employee = Ext.getCmp('employee_list_fp_id_search').value;
                                                    else if (Ext.getCmp('employee_list_name_search').value)
                                                        param.employee = Ext.getCmp('employee_list_name_search').value;
                                                    else if (Ext.getCmp('employee_list_department_search').value)
                                                        param.department = Ext.getCmp('employee_list_department_search').value;
                                                    else if (Ext.getCmp('employee_list_status_search').value)
                                                        param.status = Ext.getCmp('employee_list_status_search').value;
                                                    Ext.getCmp('employee_list_grid').setLoading(true);
                                                    Ext.getCmp('employee_list_grid').getStore().load({
                                                        params: param,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('employee_list_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
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
                        width: 170
                    }, {
                        header: 'LAST NAME',
                        dataIndex: 'last_name',
                        align: 'left',
                        editor: {
                            xtype: 'textfield',
                            editable: true,
                            listeners: {
                                blur: function(self, event, eOpts) {
                                    var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data;
                                    var data = {};
                                    data.id = row.employee.user;
                                    data.last_name = self.value;
                                    if (self.value) {
                                        socket.emit('UpdateUserLastName', data).on('UpdateUserLastName', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('employee_list_grid')) {
                                                    var param = {};
                                                    if (Ext.getCmp('employee_list_fp_id_search').value)
                                                        param.employee = Ext.getCmp('employee_list_fp_id_search').value;
                                                    else if (Ext.getCmp('employee_list_name_search').value)
                                                        param.employee = Ext.getCmp('employee_list_name_search').value;
                                                    else if (Ext.getCmp('employee_list_department_search').value)
                                                        param.department = Ext.getCmp('employee_list_department_search').value;
                                                    else if (Ext.getCmp('employee_list_status_search').value)
                                                        param.status = Ext.getCmp('employee_list_status_search').value;
                                                    Ext.getCmp('employee_list_grid').setLoading(true);
                                                    Ext.getCmp('employee_list_grid').getStore().load({
                                                        params: param,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('employee_list_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
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
                        width: 80
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
                                    var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data;
                                    var data = {};
                                    data.id = row.employee.user;
                                    data.email = self.value;
                                    if (self.value) {
                                        socket.emit('UpdateUserEmail', data).on('UpdateUserEmail', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('employee_list_grid')) {
                                                    var param = {};
                                                    if (Ext.getCmp('employee_list_fp_id_search').value)
                                                        param.employee = Ext.getCmp('employee_list_fp_id_search').value;
                                                    else if (Ext.getCmp('employee_list_name_search').value)
                                                        param.employee = Ext.getCmp('employee_list_name_search').value;
                                                    else if (Ext.getCmp('employee_list_department_search').value)
                                                        param.department = Ext.getCmp('employee_list_department_search').value;
                                                    else if (Ext.getCmp('employee_list_status_search').value)
                                                        param.status = Ext.getCmp('employee_list_status_search').value;
                                                    Ext.getCmp('employee_list_grid').setLoading(true);
                                                    Ext.getCmp('employee_list_grid').getStore().load({
                                                        params: param,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('employee_list_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
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
                        width: 160
                    }, {
                        header: 'DESIGNATION',
                        dataIndex: 'designation',
                        align: 'left',
                        field: {
                            xtype: 'combo',
                            name: 'designation',
                            allowBlank: false,
                            editable: false,
                            emptyText: 'Select Designation...',
                            autoScroll: true,
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'id',
                            selectOnFocus: true,
                            selectOnTab: true,
                            triggerAction: 'all',
                            lazyRender: true,
                            store: {
                                fields: ['id', 'name'],
                                proxy: {
                                    type: 'ajax',
                                    url: '/designation'
                                },
                                autoLoad: true,
                                autoSync: true
                            },
                            listeners: {
                                blur: function(self, event, eOpts) {
                                    var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data.id;
                                    var data = {};
                                    data.id = row;
                                    data.designation = self.value;
                                    if (designationChange) {
                                        socket.emit('UpdateEmployeeDesignation', data).on('UpdateEmployeeDesignation', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('employee_list_grid')) {
                                                    var param = {};
                                                    if (Ext.getCmp('employee_list_fp_id_search').value)
                                                        param.employee = Ext.getCmp('employee_list_fp_id_search').value;
                                                    else if (Ext.getCmp('employee_list_name_search').value)
                                                        param.employee = Ext.getCmp('employee_list_name_search').value;
                                                    else if (Ext.getCmp('employee_list_department_search').value)
                                                        param.department = Ext.getCmp('employee_list_department_search').value;
                                                    else if (Ext.getCmp('employee_list_status_search').value)
                                                        param.status = Ext.getCmp('employee_list_status_search').value;
                                                    Ext.getCmp('employee_list_grid').setLoading(true);
                                                    Ext.getCmp('employee_list_grid').getStore().load({
                                                        params: param,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('employee_list_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
                                                }
                                            } else if (message == "error") {
                                                Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                },
                                change: function(self, newValue, oldValue, eOpts) {
                                    if (parseInt(newValue) > 0 && newValue != oldValue) {
                                        designationChange = true;
                                    } else {
                                        designationChange = false;
                                    }
                                },
                            }
                        },
                        width: 120
                    }, {
                        header: 'DEPARTMENT',
                        dataIndex: 'department',
                        align: 'left',
                        field: {
                            xtype: 'combo',
                            name: 'department',
                            allowBlank: false,
                            editable: false,
                            emptyText: 'Select Department...',
                            autoScroll: true,
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'id',
                            selectOnFocus: true,
                            selectOnTab: true,
                            triggerAction: 'all',
                            lazyRender: true,
                            store: {
                                fields: ['id', 'name'],
                                proxy: {
                                    type: 'ajax',
                                    url: '/department'
                                },
                                autoLoad: true,
                                autoSync: true
                            },
                            listeners: {
                                change: function(self, newValue, oldValue, eOpts) {
                                    if (parseInt(newValue) > 0 && newValue != oldValue) {
                                        departmentChange = true;
                                    } else {
                                        departmentChange = false;
                                    }
                                },
                                blur: function(self, event, eOpts) {
                                    var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data.id;
                                    var data = {};
                                    data.id = row;
                                    data.department = self.value;
                                    if (departmentChange) {
                                        socket.emit('UpdateEmployeeDepartment', data).on('UpdateEmployeeDepartment', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('employee_list_grid')) {
                                                    var param = {};
                                                    if (Ext.getCmp('employee_list_fp_id_search').value)
                                                        param.employee = Ext.getCmp('employee_list_fp_id_search').value;
                                                    else if (Ext.getCmp('employee_list_name_search').value)
                                                        param.employee = Ext.getCmp('employee_list_name_search').value;
                                                    else if (Ext.getCmp('employee_list_department_search').value)
                                                        param.department = Ext.getCmp('employee_list_department_search').value;
                                                    else if (Ext.getCmp('employee_list_status_search').value)
                                                        param.status = Ext.getCmp('employee_list_status_search').value;
                                                    Ext.getCmp('employee_list_grid').setLoading(true);
                                                    Ext.getCmp('employee_list_grid').getStore().load({
                                                        params: param,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('employee_list_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
                                                }
                                            } else if (message == "error") {
                                                Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            }
                        },
                        width: 120
                    }, {
                        header: 'DATE OF BIRTH',
                        dataIndex: 'date_of_birth',
                        renderer: Ext.util.Format.dateRenderer('d, F Y'),
                        align: 'left',
                        editor: {
                            xtype: 'datefield',
                            editable: false,
                            listeners: {
                                change: function(self, newValue, oldValue, eOpts) {
                                    var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data.id;
                                    var data = {};
                                    data.id = row;
                                    var date = new Date(newValue);
                                    var d = date.getDate();
                                    var m = date.getMonth();
                                    var y = date.getFullYear();
                                    data.date_of_birth = new Date(Date.UTC(y, m, d, 00, 00, 00));
                                    if (newValue != oldValue) {
                                        socket.emit('UpdateEmployeeDateOfBirth', data).on('UpdateEmployeeDateOfBirth', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('employee_list_grid')) {
                                                    var param = {};
                                                    if (Ext.getCmp('employee_list_fp_id_search').value)
                                                        param.employee = Ext.getCmp('employee_list_fp_id_search').value;
                                                    else if (Ext.getCmp('employee_list_name_search').value)
                                                        param.employee = Ext.getCmp('employee_list_name_search').value;
                                                    else if (Ext.getCmp('employee_list_department_search').value)
                                                        param.department = Ext.getCmp('employee_list_department_search').value;
                                                    else if (Ext.getCmp('employee_list_status_search').value)
                                                        param.status = Ext.getCmp('employee_list_status_search').value;
                                                    Ext.getCmp('employee_list_grid').setLoading(true);
                                                    Ext.getCmp('employee_list_grid').getStore().load({
                                                        params: param,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('employee_list_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
                                                }
                                            } else if (message == "error") {
                                                Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            }
                        },
                        width: 120
                    }, {
                        header: 'DATE OF JOIN',
                        dataIndex: 'date_of_join',
                        renderer: Ext.util.Format.dateRenderer('d, F Y'),
                        align: 'left',
                        editor: {
                            xtype: 'datefield',
                            editable: false,
                            listeners: {
                                change: function(self, newValue, oldValue, eOpts) {
                                    var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data.id;
                                    var data = {};
                                    data.id = row;
                                    var date = new Date(newValue);
                                    var d = date.getDate();
                                    var m = date.getMonth();
                                    var y = date.getFullYear();
                                    data.date_of_join = new Date(Date.UTC(y, m, d, 00, 00, 00));
                                    if (newValue != oldValue) {
                                        socket.emit('UpdateEmployeeDateOfJoin', data).on('UpdateEmployeeDateOfJoin', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('employee_list_grid')) {
                                                    var param = {};
                                                    if (Ext.getCmp('employee_list_fp_id_search').value)
                                                        param.employee = Ext.getCmp('employee_list_fp_id_search').value;
                                                    else if (Ext.getCmp('employee_list_name_search').value)
                                                        param.employee = Ext.getCmp('employee_list_name_search').value;
                                                    else if (Ext.getCmp('employee_list_department_search').value)
                                                        param.department = Ext.getCmp('employee_list_department_search').value;
                                                    else if (Ext.getCmp('employee_list_status_search').value)
                                                        param.status = Ext.getCmp('employee_list_status_search').value;
                                                    Ext.getCmp('employee_list_grid').setLoading(true);
                                                    Ext.getCmp('employee_list_grid').getStore().load({
                                                        params: param,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('employee_list_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
                                                }
                                            } else if (message == "error") {
                                                Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            }
                        },
                        width: 120
                    }, {
                        header: 'ACCESS',
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
                                    var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data;
                                    var data = {};
                                    data.id = row.employee.user;
                                    data.access_level = self.value;
                                    if (self.value) {
                                        socket.emit('UpdateUserAccessLevel', data).on('UpdateUserAccessLevel', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('employee_list_grid')) {
                                                    var param = {};
                                                    if (Ext.getCmp('employee_list_fp_id_search').value)
                                                        param.employee = Ext.getCmp('employee_list_fp_id_search').value;
                                                    else if (Ext.getCmp('employee_list_name_search').value)
                                                        param.employee = Ext.getCmp('employee_list_name_search').value;
                                                    else if (Ext.getCmp('employee_list_department_search').value)
                                                        param.department = Ext.getCmp('employee_list_department_search').value;
                                                    else if (Ext.getCmp('employee_list_status_search').value)
                                                        param.status = Ext.getCmp('employee_list_status_search').value;
                                                    Ext.getCmp('employee_list_grid').setLoading(true);
                                                    Ext.getCmp('employee_list_grid').getStore().load({
                                                        params: param,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('employee_list_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
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
                        width: 60,
                    }, {
                        xtype: 'actioncolumn',
                        header: 'LEAVE',
                        align: 'center',
                        items: [{
                            icon: '/uploads/icons/eye.png',
                            tooltip: 'LEAVE DETAILS',
                            handler: function(grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                employeeLeaveDetailsWindow(rec)
                            }
                        }],
                        width: 60,
                    }, {
                        xtype: 'actioncolumn',
                        header: 'ATTENDANCE',
                        align: 'center',
                        items: [{
                            icon: '/uploads/icons/form.png',
                            tooltip: 'MONTHLY ATTENDANCE',
                            handler: function(grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                monthlyUserAttendanceWindow(rec);
                            }
                        }],
                        width: 60,
                    }, {
                        xtype: 'actioncolumn',
                        header: 'PASSWORD',
                        align: 'center',
                        items: [{
                            icon: '/uploads/icons/password.png',
                            tooltip: 'Password',
                            handler: function(grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                assignUserPasswordWindow(rec.data.employee.userTable);
                            }
                        }],
                        width: 60,
                    }]
                })
            ],
            tbar: [
                Ext.create('Ext.form.field.Number', {
                    name: 'fp_id',
                    id: 'employee_list_fp_id_search',
                    filedAlign: 'top',
                    allowBlank: true,
                    minValue: 1,
                    labelAlign: 'left',
                    labelStyle: 'text-align:left;border solid 1px white;',
                    labelSeparator: '',
                    emptyText: 'Give FP ID',
                    labelClsExtra: 'some-class',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true,
                    listeners: {
                        change: {
                            fn: function(combo, value) {
                                if (value) {
                                    Ext.getCmp('employee_list_name_search').setValue('');
                                    Ext.getCmp('employee_list_department_search').setValue('');
                                    Ext.getCmp('employee_list_status_search').setValue('');
                                }
                            }
                        }
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    id: 'employee_list_name_search',
                    name: 'name',
                    anyMatch: true,
                    allowBlank: true,
                    editable: true,
                    typeAhead: true,
                    transform: 'stateSelect',
                    forceSelection: true,
                    emptyText: 'Employee First Name ...',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'first_name',
                    valueField: 'finger_print_id',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['finger_print_id', 'first_name'],
                        proxy: {
                            type: 'ajax',
                            url: '/user'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                    listeners: {
                        change: {
                            fn: function(combo, value) {
                                if (value) {
                                    Ext.getCmp('employee_list_fp_id_search').setValue('');
                                    Ext.getCmp('employee_list_department_search').setValue('');
                                    Ext.getCmp('employee_list_status_search').setValue('');
                                }
                            }
                        }
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    id: 'employee_list_department_search',
                    name: 'department',
                    anyMatch: true,
                    allowBlank: true,
                    editable: true,
                    typeAhead: true,
                    transform: 'stateSelect',
                    forceSelection: true,
                    emptyText: 'Department ...',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['id', 'name'],
                        proxy: {
                            type: 'ajax',
                            url: '/department'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                    listeners: {
                        change: {
                            fn: function(combo, value) {
                                if (value) {
                                    Ext.getCmp('employee_list_fp_id_search').setValue('');
                                    Ext.getCmp('employee_list_name_search').setValue('');
                                    Ext.getCmp('employee_list_status_search').setValue('');
                                }
                            }
                        }
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    id: 'employee_list_status_search',
                    name: 'status',
                    anyMatch: true,
                    allowBlank: true,
                    editable: true,
                    typeAhead: true,
                    transform: 'stateSelect',
                    forceSelection: true,
                    emptyText: 'Status ...',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['id', 'name'],
                        data: [{
                            id: 2,
                            name: 'REGULER'
                        }, {
                            id: 1,
                            name: 'DISAPPOINTED'
                        }],
                        autoLoad: true,
                        autoSync: true
                    },
                    listeners: {
                        change: {
                            fn: function(combo, value) {
                                if (value) {
                                    Ext.getCmp('employee_list_fp_id_search').setValue('');
                                    Ext.getCmp('employee_list_name_search').setValue('');
                                    Ext.getCmp('employee_list_department_search').setValue('');
                                }
                            }
                        }
                    }
                }), {
                    xtype: 'button',
                    icon: '/uploads/icons/search.png',
                    text: 'SEARCH',
                    border: 1,
                    style: {
                        borderColor: 'blue',
                        borderStyle: 'solid'
                    },
                    handler: function() {
                        var param = {};
                        var em;
                        if (Ext.getCmp('employee_list_fp_id_search').value)
                            param.employee = Ext.getCmp('employee_list_fp_id_search').value;
                        else if (Ext.getCmp('employee_list_name_search').value)
                            param.employee = Ext.getCmp('employee_list_name_search').value;
                        else if (Ext.getCmp('employee_list_department_search').value)
                            param.department = Ext.getCmp('employee_list_department_search').value;
                        else if (Ext.getCmp('employee_list_status_search').value)
                            param.status = Ext.getCmp('employee_list_status_search').value;
                        if (param.employee || param.department || param.status) {
                            Ext.getCmp('employee_list_grid').setLoading(true);
                            Ext.getCmp('employee_list_grid').getStore().load({
                                params: param,
                                callback: function(records, operation, success) {
                                    Ext.getCmp('employee_list_grid').setLoading(false);
                                },
                                scope: this
                            });
                        } else {
                            Ext.MessageBox.alert('Error', 'Give id or employee name');
                        }
                    }
                }
            ],
            bbar: [{
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
            }, {
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

function employeeManualAttendanceFormWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: 'Employee Manual Attendance',
        modal: true,
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                width: '100%',
                bodyPadding: 20,
                border: false,
                items: [
                    newDateField('Manual Date', 'date'), {
                        xtype: 'timefield',
                        name: 'time',
                        editable: false,
                        allowBlank: false,
                        fieldLabel: 'Manual Time',
                        emptyText: 'Give Manual Time...',
                        format: 'h:i:s A',
                        minValue: Ext.Date.parse('09:00:00 AM', 'h:i:s A'),
                        maxValue: Ext.Date.parse('06:00:00 PM', 'h:i:s A'),
                        increment: 0.1,
                        anchor: '100%'
                    }
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
                        var date = new Date(values.date);
                        var d = date.getDate();
                        var m = date.getMonth();
                        var y = date.getFullYear();
                        var time = values.time.split(":");
                        values.punch_time = new Date(Date.UTC(y, m, d, parseInt(time[0]), parseInt(time[1]), 00));
                        values.employee = rec.id;
                        values.type = 1;
                        if (form.isValid()) {
                            socket.emit('CreateEmployeeManualPunch', values).on('CreateEmployeeManualPunch', function(message) {
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
    }).show();
}

function userInputFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New User',
        modal: true,
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                width: '100%',
                bodyPadding: 20,
                border: false,
                items: [
                    newTextField('First Name', 'first_name'),
                    newTextField('Last Name', 'last_name'),
                    //numberField('Card No', 'card_no'),
                    numberField('Finger Print ID', 'finger_print_id', true),
                    employeeDepartmentCombo(),
                    employeeDesignationCombo(),
                    emailField('Email', 'email'),
                    passwordField('Password', 'password', true),
                    passwordField('Re Password', 'password', true),
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
                            values = form.getValues(),
                            repass = form.monitor.getItems().items[1];
                        if (form.isValid()) {
                            if (values.password[0] != values.password[1]) {
                                Ext.MessageBox.alert('ERROR', 'Password not matched');
                                repass.reset();
                            }
                            socket.emit('CreateUser', values).on('CreateUser', function(message) {
                                if (message == "success") {
                                    success = true;
                                    if (Ext.getCmp('user_list_grid')) {
                                        Ext.getCmp('user_list_grid').getStore().load();
                                    }
                                    if (Ext.getCmp('employee_list_grid')) {
                                        Ext.getCmp('employee_list_grid').getStore().load();
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


function employeeLeaveDetailsWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: rec.data.first_name.toUpperCase() + ' LEAVE DETAILS',
        width: '50%',
        modal: true,
        layout: 'fit',
        tbar: [{
            xtype: 'button',
            text: 'NEW LEAVE',
            icon: '/uploads/icons/create.png',
            iconCls: 'add',
            name: 'reload',
            tooltip: 'Reload',
            border: 1,
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                employeeLeaveFormWindow(rec)
            }
        }],
        items: [
            Ext.create('Ext.grid.Panel', {
                id: 'employee_leave_details_grid',
                loadMask: true,
                autoScroll: true,
                //selType: 'cellmodel',
                columnLines: true,
                width: '100%',
                height: 200,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/leave_report/' + rec.id
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
                },
                viewConfig: {
                    emptyText: 'No records',
                    autoDestroy: false
                },
                columns: [
                    Ext.create('Ext.grid.RowNumberer'), {
                        header: 'LEAVE TYPE',
                        dataIndex: 'leave',
                        align: 'left',
                        flex: 1
                    }, {
                        header: 'TOTAL',
                        dataIndex: 'allocation',
                        align: 'center',
                        flex: 0.5
                    }, {
                        header: 'TAKEN',
                        dataIndex: 'leaves',
                        align: 'center',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return value.length;
                        },
                        flex: 0.5
                    }, {
                        header: 'REMAINS',
                        dataIndex: 'leaves',
                        align: 'center',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return record.get('allocation') - value.length;
                        },
                        flex: 0.5
                    }, {
                        xtype: 'actioncolumn',
                        header: 'LEAVE DATES',
                        flex: 1,
                        align: 'center',
                        items: [{
                            icon: '/uploads/icons/eye.png',
                            tooltip: 'LEAVE DATES',
                            handler: function(grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex).data.leaves;
                                Ext.create('Ext.window.Window', {
                                    title: 'TAKEN LEAVE DATES',
                                    width: '20%',
                                    modal: true,
                                    layout: 'fit',
                                    items: [
                                        Ext.create('Ext.grid.Panel', {
                                            id: 'employee_leave_date_grid',
                                            loadMask: true,
                                            autoScroll: true,
                                            //selType: 'cellmodel',
                                            columnLines: true,
                                            width: '100%',
                                            height: 200,
                                            store: {
                                                data: rec,
                                                model: Ext.define('TEST_MODEL', {
                                                    extend: 'Ext.data.Model',
                                                    fields: [{
                                                        name: 'id',
                                                        type: 'int'
                                                    }, ]
                                                })
                                            },
                                            viewConfig: {
                                                emptyText: 'No records',
                                                autoDestroy: false
                                            },
                                            columns: [
                                                Ext.create('Ext.grid.RowNumberer'), {
                                                    header: 'LEAVE TAKEN DATE',
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
                                                            var win = this.up('.window');
                                                            var rec = grid.getStore().getAt(rowIndex);
                                                            socket.emit('DestroyLeaveDate', rec.id).on('DestroyLeaveDate', function(message) {
                                                                if (message == "success") {
                                                                    win.close();
                                                                    if (Ext.getCmp('employee_leave_details_grid')) {
                                                                        Ext.getCmp('employee_leave_details_grid').getStore().load();
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
                                                }
                                            ]
                                        })
                                    ]
                                }).show()
                            }
                        }]
                    },
                ]
            })
        ],
        bbar: [{
            xtype: 'button',
            id: 'employee_leave_details_window_previous_year',
            icon: '/uploads/icons/go-previous.png',
            iconCls: 'add',
            name: 'previous',
            tooltip: 'Previous',
            border: 1,
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                var params = {};
                params.year = (Ext.getCmp('employee_leave_details_window_current_year')) ?
                    parseInt(new Date(Ext.getCmp('employee_leave_details_window_current_year').getText()).getFullYear()) - 1 :
                    parseInt(new Date().getFullYear()) - 1;
                Ext.getCmp('employee_leave_details_grid').setLoading(true);
                Ext.getCmp('employee_leave_details_grid').getStore().load({
                    params: params,
                    callback: function(records, operation, success) {
                        if (Ext.getCmp('employee_leave_details_window_current_year')) {
                            Ext.getCmp('employee_leave_details_window_current_year').setText(params.year);
                        }
                        Ext.getCmp('employee_leave_details_grid').setLoading(false);
                    },
                    scope: this
                });
                //employeeLeaveFormWindow(rec)
            }
        }, {
            xtype: 'button',
            text: new Date().getFullYear(),
            id: 'employee_leave_details_window_current_year',
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
                var params = {};
                params.year = (Ext.getCmp('employee_leave_details_window_current_year')) ?
                    parseInt(new Date(Ext.getCmp('employee_leave_details_window_current_year').getText()).getFullYear()) :
                    parseInt(new Date().getFullYear());
                Ext.getCmp('employee_leave_details_grid').setLoading(true);
                Ext.getCmp('employee_leave_details_grid').getStore().load({
                    params: params,
                    callback: function(records, operation, success) {
                        if (Ext.getCmp('employee_leave_details_window_current_year')) {
                            Ext.getCmp('employee_leave_details_window_current_year').setText(params.year);
                            //Ext.getCmp('employee_leave_details_window_current_year').setDisabled(true);
                        }
                        Ext.getCmp('employee_leave_details_grid').setLoading(false);
                    },
                    scope: this
                });
            }
        }, {
            xtype: 'button',
            id: 'employee_leave_details_window_next_year',
            icon: '/uploads/icons/go-next.png',
            iconCls: 'add',
            name: 'next',
            tooltip: 'Next',
            border: 1,
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                var params = {};
                params.year = (Ext.getCmp('employee_leave_details_window_current_year')) ?
                    parseInt(new Date(Ext.getCmp('employee_leave_details_window_current_year').getText()).getFullYear()) + 1 :
                    parseInt(new Date().getFullYear()) + 1;
                Ext.getCmp('employee_leave_details_grid').setLoading(true);
                Ext.getCmp('employee_leave_details_grid').getStore().load({
                    params: params,
                    callback: function(records, operation, success) {
                        if (Ext.getCmp('employee_leave_details_window_current_year')) {
                            Ext.getCmp('employee_leave_details_window_current_year').setText(params.year);
                        }
                        Ext.getCmp('employee_leave_details_grid').setLoading(false);
                    },
                    scope: this
                });
            }
        }]
    }).show();
}


function employeeLeaveFormWindow(rec) {
    var fp = rec.id
    var fn = rec.data.first_name
    var ln = rec.data.last_name
    return Ext.create('Ext.window.Window', {
        title: '(' + fp + ') ' + fn + ' ' + ln + ' Leave Form',
        modal: true,
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                width: '100%',
                bodyPadding: 20,
                border: false,
                items: [
                    newCombo('Leave Type', 'leave_type'),
                    newDateField('Form Date', 'from_date'),
                    newDateField('To Date', 'to_date')
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
                        var from_date = values.from_date.split("/");
                        var to_date = values.to_date.split("/");
                        var fd = parseInt(from_date[1]);
                        var fm = parseInt(from_date[0]) - 1;
                        var fy = parseInt(from_date[2]);
                        var td = parseInt(to_date[1]);
                        var tm = parseInt(to_date[0]) - 1;
                        var ty = parseInt(to_date[2]);
                        values.from_date = new Date(Date.UTC(fy, fm, fd));
                        values.to_date = new Date(Date.UTC(ty, tm, td));
                        values.employee = rec.id;
                        if (form.isValid()) {
                            socket.emit('CreateEmployeeLeave', values).on('CreateEmployeeLeave', function(message) {
                                if (message == "success") {
                                    success = true;
                                    if (Ext.getCmp('employee_list_grid')) {
                                        Ext.getCmp('employee_list_grid').getStore().load();
                                    }
                                    if (Ext.getCmp('employee_leave_details_grid')) {
                                        Ext.getCmp('employee_leave_details_grid').getStore().load();
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

function newCombo(a, b, c) {
    return Ext.create('Ext.form.ComboBox', {
        fieldLabel: a,
        name: b,
        id: c,
        anyMatch: true,
        typeAhead: true,
        transform: 'stateSelect',
        forceSelection: true,
        allowBlank: false,
        editable: false,
        labelAlign: 'left',
        labelSeparator: '',
        emptyText: 'Select ' + a + ' ...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        selectOnFocus: true,
        triggerAction: 'all',
        store: {
            fields: ['id', 'name'],
            proxy: {
                type: 'ajax',
                url: '/' + b
            },
            autoLoad: true,
            autoSync: true
        },
        listeners: {
            change: {
                fn: function(combo, value) {
                    //console.log(value)
                }
            }
        }
    });
}


function newTextField(a, b, c) {
    var blank = true;
    if (c)
        blank = false;
    var allow = false;
    if (b == 'name') {
        blank = false;
    }
    return Ext.create('Ext.form.field.Text', {
        name: b,
        fieldLabel: a,
        filedAlign: 'top',
        allowBlank: blank,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give ' + a + '...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
}


function passwordField(a, b, c, d) {
    var blank = true;
    if (c)
        blank = false;
    return Ext.create('Ext.form.field.Text', {
        name: b,
        inputType: 'password',
        fieldLabel: a,
        filedAlign: 'top',
        allowBlank: blank,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give ' + a + '...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
}


function emailField(a, b, c, d) {
    var blank = true;
    if (c)
        blank = false;
    return Ext.create('Ext.form.field.Text', {
        name: b,
        vtype: 'email',
        fieldLabel: a,
        filedAlign: 'top',
        allowBlank: blank,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give ' + a + '...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
}


function employeeDesignationCombo() {
    return Ext.create('Ext.form.ComboBox', {
        id: 'employee_designation_input_form_combo_box',
        fieldLabel: 'Designation',
        name: 'designation',
        anyMatch: true,
        typeAhead: true,
        transform: 'stateSelect',
        forceSelection: true,
        allowBlank: true,
        editable: false,
        labelAlign: 'left',
        labelSeparator: '',
        emptyText: 'Select Employee Designation ...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        selectOnFocus: true,
        triggerAction: 'all',
        store: {
            fields: ['id', 'name'],
            proxy: {
                type: 'ajax',
                url: '/designation'
            },
            autoLoad: true,
            autoSync: true
        },
        listeners: {
            change: {
                fn: function(combo, value) {
                    //console.log(value)
                }
            }
        }
    });
}


function employeeDepartmentCombo() {
    return Ext.create('Ext.form.ComboBox', {
        id: 'employee_department_input_form_combo_box',
        fieldLabel: 'Department',
        name: 'department',
        anyMatch: true,
        typeAhead: true,
        transform: 'stateSelect',
        forceSelection: true,
        allowBlank: true,
        editable: false,
        labelAlign: 'left',
        labelSeparator: '',
        emptyText: 'Select Employee Department ...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        selectOnFocus: true,
        triggerAction: 'all',
        store: {
            fields: ['id', 'name'],
            proxy: {
                type: 'ajax',
                url: '/department'
            },
            autoLoad: true,
            autoSync: true
        },
        listeners: {
            change: {
                fn: function(combo, value) {
                    //console.log(value)
                }
            }
        }
    });
}


function numberField(a, b, c, d) {
    var blank = true;
    if (c)
        blank = false;
    return Ext.create('Ext.form.field.Number', {
        name: b,
        id: d,
        fieldLabel: a,
        filedAlign: 'top',
        allowBlank: blank,
        minValue: 0,
        value: 0,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give ' + a + '...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
}


function monthlyUserAttendanceWindow(rec) {
    var tmp = {};
    tmp.id = rec.id;
    tmp.department = (rec.data.department) ? rec.data.department.toUpperCase() : '';
    tmp.designation = (rec.data.designation) ? rec.data.designation.toUpperCase() : '';
    tmp.date_of_join = (rec.data.date_of_join) ? rec.data.date_of_join : new Date();
    tmp.email = (rec.data.email) ? rec.data.email.toUpperCase() : '';
    tmp.name = rec.data.first_name.toUpperCase();
    return Ext.create('Ext.window.Window', {
        title: 'Monthly User Attendance',
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
                    Ext.create('Ext.form.field.Date', {
                        name: 'date',
                        fieldLabel: 'Select Month',
                        filedAlign: 'top',
                        allowBlank: false,
                        editable: false,
                        emptyText: 'Select Month',
                        format: "M-Y",
                        autoScroll: true,
                        safeParse: function(value, format) {
                            var FDF = this.picker.value[0] + 1 + "/1/" + this.picker.value[1];
                            return new Date(FDF);
                        },
                        createPicker: function() {
                            var me = this,
                                format = Ext.String.format;
                            return new Ext.picker.Month({
                                pickerField: me,
                                ownerCt: me.ownerCt,
                                renderTo: document.body,
                                floating: true,
                                hidden: true,
                                focusOnShow: true,
                                showButtons: false,
                                minDate: me.minValue,
                                maxDate: me.maxValue,
                                disabledDatesRE: me.disabledDatesRE,
                                disabledDatesText: me.disabledDatesText,
                                disabledDays: me.disabledDays,
                                disabledDaysText: me.disabledDaysText,
                                format: me.format,
                                showToday: me.showToday,
                                startDay: me.startDay,
                                minText: format(me.minText, me.formatDate(me.minValue)),
                                maxText: format(me.maxText, me.formatDate(me.maxValue)),
                                listeners: {
                                    scope: me,
                                    select: me.onSelect
                                },
                                keyNavConfig: {
                                    esc: function() {
                                        me.collapse();
                                    }
                                }
                            });
                        },
                    }),
                ],
                buttons: [{
                    text: 'Download',
                    icon: '/uploads/icons/download.png',
                    formBind: true,
                    handler: function() {
                        var panel = this.up('form'),
                            form = panel.getForm(),
                            values = form.getValues();
                        if (form.isValid()) {
                            values.date = (values.date != '') ? new Date(values.date) : new Date();
                            values.file_name = rec.name + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getFullYear() + '_Attendance_Report';
                            values.URL = site_url;
                            values.id = rec.id;
                            values.employee = rec.id;
                            if (tab_panel) {
                                panel.setLoading(true);
                                // socket.emit('DownloadEmployeeMonthlyAttendance', values).on('DownloadEmployeeMonthlyAttendance', function (r) {
                                //   Ext.MessageBox.alert({
                                //     title:'Monthly User Attendance Report Download',
                                //     buttons: Ext.MessageBox.CANCEL,
                                //     msg: 'Please <a href="/uploads/pdf/'+values.file_name+'.pdf" download>click here</a> to confirm the file download',
                                //     animateTarget: 'mb4',
                                //     icon: Ext.MessageBox.QUESTION
                                //   });
                                //   panel.setLoading(false);
                                // });
                                socket.emit('DownloadEmployeeMonthlyAttendanceV2', values).on('DownloadEmployeeMonthlyAttendanceV2', function(r) {
                                    Ext.MessageBox.alert({
                                        title: 'Monthly User Attendance Report Download',
                                        buttons: Ext.MessageBox.CANCEL,
                                        msg: 'Please <a href="/uploads/pdf/' + values.file_name + '.pdf" download>click here</a> to confirm the file download',
                                        animateTarget: 'mb4',
                                        icon: Ext.MessageBox.QUESTION
                                    });
                                    panel.setLoading(false);
                                });
                                // var panel = this.up('form'),
                                //     form = panel.getForm(),
                                //     values = form.getValues();
                                // if (form.isValid()) {
                                //   var ms =(values.date!='') ? new Date(values.date): new Date();
                                //   var file_name = rec.name+'_'+monthNames[ms.getMonth()]+'_'+ms.getFullYear()+'_Attendance_Report';
                                //   if(tab_panel){
                                //     panel.setLoading(true);
                                //     socket.emit('CreateMonthlyUserAttendanceReportPDF', file_name, site_url, ms, rec).on('CreateMonthlyUserAttendanceReportPDF', function (r) {
                                //       Ext.MessageBox.alert({
                                //         title:'Monthly User Attendance Report Download',
                                //         buttons: Ext.MessageBox.CANCEL,
                                //         msg: 'Please <a href="/uploads/pdf/'+file_name+'.pdf" download>click here</a> to confirm the file download',
                                //         animateTarget: 'mb4',
                                //         icon: Ext.MessageBox.QUESTION
                                //       });
                                //       panel.setLoading(false);
                                //     });
                            }
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

function assignUserPasswordWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: 'Assign New Password',
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
                    newPasswordPanel(),
                    reNewPasswordPanel(),
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
                        var values = {};
                        values.id = rec.id;
                        values.password = Ext.getCmp('re_new_password_field').value;
                        var panel = this.up('form'),
                            form = panel.getForm();
                        if (form.isValid()) {
                            if (conf_new_pass == 1) {
                                if (conf_renew_pass == 1) {
                                    socket.emit('AssignUserPassword', values).on('AssignUserPassword', function(message) {
                                        if (message == "success") {
                                            Ext.MessageBox.alert('success', 'Successfully password changed');
                                            win.close();
                                        } else {
                                            Ext.MessageBox.alert('Error', 'Something went wrong while changing password. Please try again.');
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.alert('Password Unmatched', 'Please confirm password correctly');
                                }
                            } else {
                                Ext.MessageBox.alert('Low Password', 'Please give minimum 8 character');
                            }
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

function newDateField(a, b, c) {
    var blank = true;
    if (b == 'date') {
        blank = false;
    }
    return Ext.create('Ext.form.field.Date', {
        name: b,
        id: c,
        fieldLabel: a,
        filedAlign: 'top',
        allowBlank: blank,
        editable: false,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give ' + a + '...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
}


function dateField(a, b, c, d) {
    var blank = true;
    if (c)
        blank = false;
    return Ext.create('Ext.form.field.Date', {
        name: b,
        id: d,
        fieldLabel: a,
        filedAlign: 'top',
        allowBlank: blank,
        minValue: 0,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give ' + a + '...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
}