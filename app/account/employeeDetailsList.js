function employeeDetailsListTab() {
    if (Ext.getCmp('employee_details_list_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("employee_details_list_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Employee',
            layout: 'fit',
            closable: true,
            id: 'employee_details_list_tab',
            autoScroll: true,
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'employee_details_list_grid',
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
                    },
                    listeners: {
                        rowclick: function(grid, row, e) {
                            var data = row.data;
                        },
                    },
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
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            if (value)
                                return value.toUpperCase();
                        },
                        flex: 2
                    }, {
                        header: 'LAST NAME',
                        dataIndex: 'last_name',
                        align: 'left',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            if (value)
                                return value.toUpperCase();
                        },
                        flex: 1
                    }, {
                        header: 'DEPARTMENT',
                        dataIndex: 'department',
                        align: 'left',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            if (value)
                                return value.toUpperCase();
                        },
                        flex: 1.5
                    }, {
                        header: 'DESIGNATION',
                        dataIndex: 'designation',
                        align: 'left',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            if (value)
                                return value.toUpperCase();
                        },
                        flex: 1.5
                    }, {
                        header: 'DATE OF BIRTH',
                        dataIndex: 'date_of_birth',
                        renderer: Ext.util.Format.dateRenderer('d, F Y'),
                        align: 'left',
                        flex: 1.5
                    }, {
                        header: 'DATE OF JOIN',
                        dataIndex: 'date_of_join',
                        renderer: Ext.util.Format.dateRenderer('d, F Y'),
                        align: 'left',
                        flex: 1.5
                    }, {
                        xtype: 'actioncolumn',
                        header: 'DEDUCTION',
                        align: 'center',
                        items: [{
                            icon: '/uploads/icons/eye.png',
                            tooltip: 'SALARY DEDUCTION',
                            handler: function(grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                salaryDeductionDetailsWindow(rec)
                            }
                        }],
                        flex: 1
                    }, ]
                })
            ],
            tbar: [
                Ext.create('Ext.form.field.Number', {
                    name: 'fp_id',
                    id: 'employee_details_list_fp_id_search',
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
                                    Ext.getCmp('employee_details_list_name_search').setValue('');
                                    Ext.getCmp('employee_details_list_department_search').setValue('');
                                    Ext.getCmp('employee_details_list_status_search').setValue('');
                                }
                            }
                        }
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    id: 'employee_details_list_name_search',
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
                                    Ext.getCmp('employee_details_list_fp_id_search').setValue('');
                                    Ext.getCmp('employee_details_list_department_search').setValue('');
                                    Ext.getCmp('employee_details_list_status_search').setValue('');
                                }
                            }
                        }
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    id: 'employee_details_list_department_search',
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
                                    Ext.getCmp('employee_details_list_fp_id_search').setValue('');
                                    Ext.getCmp('employee_details_list_name_search').setValue('');
                                    Ext.getCmp('employee_details_list_status_search').setValue('');
                                }
                            }
                        }
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    id: 'employee_details_list_status_search',
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
                                    Ext.getCmp('employee_details_list_fp_id_search').setValue('');
                                    Ext.getCmp('employee_details_list_name_search').setValue('');
                                    Ext.getCmp('employee_details_list_department_search').setValue('');
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
                        if (Ext.getCmp('employee_details_list_fp_id_search').value)
                            param.employee = Ext.getCmp('employee_details_list_fp_id_search').value;
                        else if (Ext.getCmp('employee_details_list_name_search').value)
                            param.employee = Ext.getCmp('employee_details_list_name_search').value;
                        else if (Ext.getCmp('employee_details_list_department_search').value)
                            param.department = Ext.getCmp('employee_details_list_department_search').value;
                        else if (Ext.getCmp('employee_details_list_status_search').value)
                            param.status = Ext.getCmp('employee_details_list_status_search').value;
                        if (param.employee || param.department || param.status) {
                            Ext.getCmp('employee_details_list_grid').setLoading(true);
                            Ext.getCmp('employee_details_list_grid').getStore().load({
                                params: param,
                                callback: function(records, operation, success) {
                                    Ext.getCmp('employee_details_list_grid').setLoading(false);
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
                    if (Ext.getCmp('employee_details_list_grid')) {
                        Ext.getCmp('employee_details_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}


function salaryDeductionDetailsWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: rec.data.first_name.toUpperCase() + ' DEDUCTION DETAILS',
        width: '40%',
        modal: true,
        layout: 'fit',
        items: [
            salaryDeductionDetailsGrid(rec)
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
                if (Ext.getCmp('salary_deduction_details_grid')) {
                    Ext.getCmp('salary_deduction_details_grid').getStore().load();
                }
            }
        }]
    }).show();
}

function salaryDeductionDetailsGrid(rec) {
    return Ext.create('Ext.grid.Panel', {
        id: 'salary_deduction_details_grid',
        loadMask: true,
        autoScroll: true,
        //selType: 'cellmodel',
        columnLines: true,
        width: '100%',
        height: 200,
        store: {
            proxy: {
                type: 'ajax',
                url: '/deduction_details/' + rec.id
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
        tbar: [{
            xtype: 'button',
            text: 'NEW DEDUCTION',
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
                salaryDeductionFormWindow(rec)
            }
        }],
        columns: [
            Ext.create('Ext.grid.RowNumberer'), {
                header: 'MONTH',
                dataIndex: 'month',
                renderer: Ext.util.Format.dateRenderer('F Y'),
                align: 'left',
                flex: 1
            }, {
                header: 'ADVANCE',
                dataIndex: 'advance',
                align: 'center',
                flex: 0.5
            }, {
                header: 'AIT',
                dataIndex: 'ait',
                align: 'center',
                /*renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                    return value.length;
                },*/
                flex: 0.5
            }, {
                header: 'OTHERS',
                dataIndex: 'others',
                align: 'center',
                flex: 0.5
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
                        socket.emit('DestroySalaryDeduction', rec.id).on('DestroySalaryDeduction', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('employee_details_list_grid')) {
                                    Ext.getCmp('employee_details_list_grid').getStore().load();
                                }
                                if (Ext.getCmp('salary_deduction_details_grid')) {
                                    Ext.getCmp('salary_deduction_details_grid').getStore().load();
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
            }
        ]
    });
}


function salaryDeductionFormWindow(rec) {
    var fp = rec.id
    var fn = rec.data.first_name
    var ln = rec.data.last_name
    return Ext.create('Ext.window.Window', {
        title: '(' + fp + ') ' + fn + ' ' + ln + ' Deduction Form',
        modal: true,
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                width: '100%',
                bodyPadding: 20,
                border: false,
                items: [
                    Ext.create('Ext.form.field.Date', {
                        name: 'month',
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
                    numberField('Advance', 'advance', true),
                    numberField('AIT', 'ait', true),
                    numberField('Others', 'others', true),
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
                        values.month = new Date(values.month);
                        values.month.setDate(10);
                        values.employee = rec.id;
                        if (form.isValid()) {
                            socket.emit('CreateSalaryDeduction', values).on('CreateSalaryDeduction', function(message) {
                                if (message == "success") {
                                    success = true;
                                    if (Ext.getCmp('employee_details_list_grid')) {
                                        Ext.getCmp('employee_details_list_grid').getStore().load();
                                    }
                                    if (Ext.getCmp('salary_deduction_details_grid')) {
                                        Ext.getCmp('salary_deduction_details_grid').getStore().load();
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