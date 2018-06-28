function leaveReportTab() {
    if (Ext.getCmp('leave_report_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("leave_report_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Leave Report',
            layout: 'fit',
            closable: true,
            id: 'leave_report_tab',
            autoScroll: true,
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'leave_report_grid',
                    loadMask: true,
                    autoScroll: true,
                    //selType: 'cellmodel',
                    columnLines: true,
                    width: '200%',
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
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer'), {
                            header: 'FP ID',
                            dataIndex: 'finger_print_id',
                            align: 'center',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var zero = '';
                                var zero_length = 4 - value.toString().length;
                                while (zero_length > 0) {
                                    zero += '0'
                                    zero_length--;
                                }
                                return 'JCLFFL' + zero + value;
                            },
                            flex: 0.5
                        }, {
                            header: 'EMPLOYEE NAME',
                            dataIndex: 'first_name',
                            align: 'left',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return record.get('first_name') + ' ' + record.get('last_name');
                            },
                            flex: 1
                        }, {
                            header: 'TOTAL CL',
                            dataIndex: 'cl',
                            align: 'center',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return 10;
                            },
                            flex: 0.6
                        }, {
                            header: 'CL TAKEN',
                            dataIndex: 'cl',
                            align: 'center',
                            flex: 0.6
                        }, {
                            header: 'CL LEFT',
                            dataIndex: 'cl',
                            align: 'center',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return 10 - parseInt(value);
                            },
                            flex: 0.6
                        }, {
                            header: 'TOTAL SL',
                            dataIndex: 'sl',
                            align: 'center',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return 14;
                            },
                            flex: 0.6
                        }, {
                            header: 'SL TAKEN',
                            dataIndex: 'sl',
                            align: 'center',
                            flex: 0.6
                        }, {
                            header: 'SL LEFT',
                            dataIndex: 'sl',
                            align: 'center',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return 14 - parseInt(value);
                            },
                            flex: 0.6
                        }, {
                            xtype: 'actioncolumn',
                            header: 'LEAVE',
                            align: 'center',
                            items: [{
                                icon: '/uploads/icons/add.png',
                                tooltip: 'LEAVE',
                                handler: function(grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    employeeLeaveFormWindow(rec)
                                }
                            }],
                            flex: 0.5
                        }
                    ]
                })
            ],
            tbar: [
                numberField('', 'employee', true, 'employee_id_leave_search'), {
                    xtype: 'button',
                    icon: '/uploads/icons/search.png',
                    text: 'SEARCH',
                    border: 1,
                    style: {
                        borderColor: 'blue',
                        borderStyle: 'solid'
                    },
                    handler: function() {
                        var e_id = Ext.getCmp('employee_id_leave_search').value;
                        if (e_id) {
                            var store = Ext.getCmp('leave_report_grid').getStore();
                            store.load({
                                params: {
                                    employee: e_id,
                                },
                                callback: function(records, operation, success) {
                                    //this.up('form').getForm().findField("line").clearValue();
                                },
                                scope: this
                            });
                        }
                    }
                }
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
                    if (Ext.getCmp('leave_report_grid')) {
                        Ext.getCmp('leave_report_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}