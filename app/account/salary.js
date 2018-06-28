function salaryTab() {
    if (Ext.getCmp('salary_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("salary_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Employee Salary List',
            layout: 'fit',
            closable: true,
            id: 'salary_tab',
            autoScroll: true,
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'salary_list_grid',
                    columnLines: true,
                    store: Ext.create('Ext.data.Store', {
                        proxy: {
                            type: 'ajax',
                            url: '/employee_salary'
                        },
                        autoLoad: true,
                        autoSync: true,
                        model: Ext.define('EMPLOYEE_SALARY_MODEL', {
                            extend: 'Ext.data.Model',
                            fields: [{
                                name: 'id',
                                type: 'int'
                            }, {
                                name: 'name',
                                type: 'string'
                            }, {
                                name: 'salary',
                                type: 'int'
                            }, {
                                name: 'approve_date',
                                type: 'string'
                            }, ]
                        })
                    }),
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
                    features: [{
                        ftype: 'summary',
                        dock: 'bottom'
                    }],
                    plugins: [
                        celEditPlugin
                    ],
                    columns: [
                        Ext.create('Ext.grid.RowNumberer'), {
                            header: 'EMP. ID',
                            dataIndex: 'id',
                            align: 'center',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return 'JCLFFL' + addLeadingZero(4, value);
                            },
                            flex: 0.5,
                            summaryType: 'count',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b><big>TOTAL:</big></b> ';
                            }
                        }, {
                            header: 'NAME',
                            dataIndex: 'name',
                            align: 'left',
                            flex: 1
                        }, {
                            header: 'SALARY',
                            dataIndex: 'salary',
                            align: 'right',
                            flex: 0.5,
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.formatMoney(2, '.', ',');
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b><big>' + value.formatMoney(2, '.', ',') + '</big></b> ';
                            },
                        }, {
                            header: 'APPROVE DATE',
                            dataIndex: 'approve_date',
                            align: 'center',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                if (value == '00-00-0000') {
                                    return 'OOO-0000';
                                } else {
                                    var date = new Date(value);
                                    return mthCPNames[date.getMonth()] + '-' + date.getFullYear();
                                }
                            },
                            flex: 0.7
                        }, {
                            xtype: 'actioncolumn',
                            header: 'DETAILS',
                            flex: 0.4,
                            align: 'center',
                            items: [{
                                icon: '/uploads/icons/eye.png',
                                tooltip: 'DETAILS',
                                handler: function(grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    // salaryDetailsWindow(rec.data);
                                    Ext.create('Ext.window.Window', {
                                        title: 'Salary Details For ' + rec.name,
                                        modal: true,
                                        width: '25%',
                                        items: [
                                            Ext.create('Ext.grid.Panel', {
                                                id: 'salaryDetailsGrid',
                                                columnLines: true,
                                                loadMask: true,
                                                autoScroll: true,
                                                store: {
                                                    proxy: {
                                                        type: 'ajax',
                                                        url: '/salary/' + rec.id
                                                    },
                                                    autoLoad: true,
                                                    autoSync: true,
                                                    model: Ext.define('SALARY_MODEL', {
                                                        extend: 'Ext.data.Model',
                                                        fields: [{
                                                            name: 'id',
                                                            type: 'int'
                                                        }, {
                                                            name: 'employee',
                                                            type: 'string',
                                                            mapping: 'employeeTable.name'
                                                        }, {
                                                            name: 'amount',
                                                            type: 'float'
                                                        }, {
                                                            name: 'approve_date',
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
                                                    }
                                                },
                                                features: [{
                                                    ftype: 'summary',
                                                    dock: 'bottom'
                                                }],
                                                plugins: [
                                                    celEditPlugin
                                                ],
                                                columns: [
                                                    Ext.create('Ext.grid.RowNumberer'), {
                                                        header: 'SALARY (BDT)',
                                                        dataIndex: 'amount',
                                                        align: 'right',
                                                        flex: 0.5,
                                                        editor: {
                                                            xtype: 'numberfield',
                                                            editable: true,
                                                            listeners: {
                                                                blur: function(self, event, eOpts) {
                                                                    var row = Ext.getCmp('salaryDetailsGrid').getSelectionModel().getSelection()[0].data.id;
                                                                    var data = {};
                                                                    data.id = row;
                                                                    data.amount = self.value;
                                                                    if (self.value) {
                                                                        socket.emit('UpdateSalaryAmount', data).on('UpdateSalaryAmount', function(message) {
                                                                            if (message == "success") {
                                                                                if (Ext.getCmp('salaryDetailsGrid')) {
                                                                                    Ext.getCmp('salaryDetailsGrid').getStore().load();
                                                                                }
                                                                                if (Ext.getCmp('salary_list_grid')) {
                                                                                    Ext.getCmp('salary_list_grid').getStore().load();
                                                                                }
                                                                            } else if (message == "error") {
                                                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                                            return value.formatMoney(2, '.', ',');
                                                        },
                                                        summaryType: 'sum',
                                                        summaryRenderer: function(value, summaryData, dataIndex) {
                                                            return '<b>' + value.formatMoney(2, '.', ',') + '</b> ';
                                                        },
                                                    }, {
                                                        header: 'APPROVE DATE',
                                                        dataIndex: 'approve_date',
                                                        align: 'center',
                                                        editor: {
                                                            xtype: 'datefield',
                                                            format: 'M-Y', // or other format you'd like
                                                            editable: false,
                                                            safeParse: function(value, format) {
                                                                if (this.picker) {
                                                                    var FDF = this.picker.value[0] + 1 + "/1/" + this.picker.value[1];
                                                                    return new Date(FDF);
                                                                } else {
                                                                    return new Date(value);
                                                                }
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
                                                            emptyText: 'APPROVE DATE',
                                                            listeners: {
                                                                blur: function(self, event, eOpts) {
                                                                    var row = Ext.getCmp('salaryDetailsGrid').getSelectionModel().getSelection()[0].data.id;
                                                                    var data = {};
                                                                    data.id = row;
                                                                    data.approve_date = self.value;
                                                                    if (self.value) {
                                                                        socket.emit('UpdateSalaryApproveDate', data).on('UpdateSalaryApproveDate', function(message) {
                                                                            if (message == "success") {
                                                                                if (Ext.getCmp('salaryDetailsGrid')) {
                                                                                    Ext.getCmp('salaryDetailsGrid').getStore().load();
                                                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                                                }
                                                                                if (Ext.getCmp('salary_list_grid')) {
                                                                                    Ext.getCmp('salary_list_grid').getStore().load();
                                                                                }
                                                                            } else if (message == "error") {
                                                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                                            var date = new Date(value);
                                                            return mthCPNames[date.getMonth()] + '-' + date.getFullYear();
                                                        },
                                                        flex: 0.8
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
                                                                    title: 'Delete Salary?',
                                                                    msg: 'Are you sure you want to delete this information. <br>It will permanently delete this information from the server',
                                                                    buttons: Ext.Msg.YESNO,
                                                                    icon: Ext.Msg.WARNING,
                                                                    fn: function(btn, text) {
                                                                        if (btn == 'yes') {
                                                                            socket.emit('DestroySalary', rec.id).on('DestroySalary', function(message) {
                                                                                if (message == "success") {
                                                                                    grid.getStore().load();
                                                                                    if (Ext.getCmp('salary_list_grid')) {
                                                                                        Ext.getCmp('salary_list_grid').getStore().load();
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
                                                    }
                                                ]
                                            })
                                        ]
                                    }).show()
                                }
                            }]
                        }, {
                            xtype: 'actioncolumn',
                            header: 'UPDATE<br />SALARY',
                            flex: 0.4,
                            align: 'center',
                            items: [{
                                icon: '/uploads/icons/update.png',
                                tooltip: 'UPDATE SALARY',
                                handler: function(grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    salaryInputFormWindow(rec.data);
                                }
                            }]
                        }, {
                            header: 'PAYMENT<br />METHOD',
                            dataIndex: 'payment_method',
                            align: 'center',
                            field: {
                                xtype: 'combo',
                                name: 'status',
                                anyMatch: true,
                                typeAhead: true,
                                transform: 'stateSelect',
                                forceSelection: true,
                                allowBlank: false,
                                editable: false,
                                emptyText: 'Select Status...',
                                autoScroll: true,
                                queryMode: 'local',
                                displayField: 'method',
                                valueField: 'payment_method',
                                selectOnFocus: true,
                                selectOnTab: true,
                                triggerAction: 'all',
                                lazyRender: true,
                                store: {
                                    fields: ['payment_method', 'method'],
                                    data: [{
                                        payment_method: 1,
                                        method: 'CASH'
                                    }, {
                                        payment_method: 2,
                                        method: 'BANK'
                                    }]
                                },
                                listeners: {
                                    change: function(self, newValue, oldValue, eOpts) {
                                        var row = Ext.getCmp('salary_list_grid').getSelectionModel().getSelection()[0].data;
                                        var data = {};
                                        data.id = row.id;
                                        data.payment_method = newValue;
                                        if (newValue == 2) {
                                            if (row.account_no == "000-000-0000000") {
                                                salaryBankAccountFormWindow(row);
                                            } else {
                                                socket.emit('UpdateSalaryPaymentMethod', data).on('UpdateSalaryPaymentMethod', function(message) {
                                                    if (message == "success") {
                                                        if (Ext.getCmp('salary_list_grid')) {
                                                            Ext.getCmp('salary_list_grid').getStore().load();
                                                            Ext.MessageBox.alert('Success', 'Data successfully updated');
                                                        }
                                                    } else if (message == "error") {
                                                        Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                    }
                                                });
                                            }
                                        } else {
                                            socket.emit('UpdateSalaryPaymentMethod', data).on('UpdateSalaryPaymentMethod', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('salary_list_grid')) {
                                                        Ext.getCmp('salary_list_grid').getStore().load();
                                                        Ext.MessageBox.alert('Success', 'Data successfully updated');
                                                    }
                                                } else if (message == "error") {
                                                    Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return (value == 1) ? 'CASH' : 'BANK';
                            },
                            flex: 0.4
                        }, {
                            header: 'ACCOUNT NO',
                            dataIndex: 'account_no',
                            align: 'left',
                            flex: 0.5,
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value;
                            },
                        },
                    ]
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
                        if (Ext.getCmp('salary_list_grid')) {
                            Ext.getCmp('salary_list_grid').getStore().load();
                        }
                    }
                }, {
                    xtype: 'button',
                    text: 'Download',
                    icon: '/uploads/icons/upload.png',
                    iconCls: 'add',
                    name: 'reload',
                    tooltip: 'Download Salary Details',
                    target: '_blank',
                    hrefTarget: '_blank',
                    border: 1,
                    style: {
                        borderColor: 'blue',
                        borderStyle: 'solid'
                    },
                    handler: function() {
                        values = {};
                        values.date = new Date();
                        values.file_name = values.date.getDate() + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getUTCFullYear() + '_Employee_Salary_Details_Report';
                        values.URL = site_url;
                        if (tab_panel) {
                            tab_panel.setLoading(true);
                            socket.emit('DownloadEmployeeSalaryDetails', values).on('DownloadEmployeeSalaryDetails', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Download Employee Salary Details',
                                    buttons: Ext.MessageBox.CANCEL,
                                    msg: 'Please <a href="/uploads/pdf/' + values.file_name + '.pdf" download>click here</a> to confirm the file download',
                                    animateTarget: 'mb4',
                                    icon: Ext.MessageBox.QUESTION
                                });
                                tab_panel.setLoading(false);
                            });
                        }
                    }
                },

            ]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function salaryInputFormWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: 'Update Salary For ' + rec.name,
        modal: true,
        layout: 'fit',
        items: [
            salaryInputForm(rec)
        ]
    }).show();
}

function salaryInputForm(rec) {
    var itemArray = [];
    var account_no = 0;
    var account_type = 0;
    var branch_code = 0;
    if (rec.bank_account) {
        account_no = rec.bank_account.account_no;
        account_type = rec.bank_account.account_type;
        branch_code = rec.bank_account.branch_code;
    }
    var inputSalary = {
        xtype: 'fieldcontainer',
        //fieldLabel : 'Update Salary',
        defaultType: 'checkboxfield',
        defaults: {
            flex: 2,
        },
        layout: 'hbox',
        items: [{
            boxLabel: ' Update Salary ',
            name: 'input_salary',
            // inputValue: 1,
            checked: true,
            id: 'input_salary_checkbox1',
            listeners: {
                change: function(self, newValue, oldValue, eOpts) {
                    if (self.checked) {
                        Ext.getCmp('salaryBoxFieldContainer').show();
                        Ext.getCmp('salaryBoxFieldContainer').enable();
                    } else {
                        Ext.getCmp('salaryBoxFieldContainer').hide();
                        Ext.getCmp('salaryBoxFieldContainer').disable();
                    }
                },
            }
        }]
    };

    var salaryBox = {
        xtype: 'fieldcontainer',
        id: 'salaryBoxFieldContainer',
        defaults: {
            flex: 2,
        },
        hidden: false,
        layout: 'vbox',
        items: []
    };

    var payMethod = {
        xtype: 'fieldcontainer',
        fieldLabel: 'Payment Method',
        defaultType: 'radiofield',
        defaults: {
            flex: 2,
        },
        layout: 'hbox',
        items: [{
            boxLabel: ' CASH ',
            name: 'payment_method',
            inputValue: 1,
            checked: (rec.payment_method == 1) ? true : false,
            id: 'payMethod1'
        }, {
            boxLabel: ' BANK ',
            name: 'payment_method',
            inputValue: 2,
            checked: (rec.payment_method == 2) ? true : false,
            id: 'payMethod2'
        }]
    };

    var branchCode = Ext.create('Ext.form.field.Number', {
        name: 'branch_code',
        fieldLabel: 'Branch Code',
        width: 350,
        // labelWidth: 100,
        filedAlign: 'top',
        allowBlank: false,
        minValue: 0,
        value: branch_code,
        maxLength: 3,
        enforceMaxLength: 3,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Branch...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
    var accountType = Ext.create('Ext.form.field.Number', {
        name: 'account_type',
        fieldLabel: 'Account Type',
        width: 350,
        filedAlign: 'top',
        allowBlank: false,
        minValue: 0,
        value: account_type,
        maxLength: 3,
        enforceMaxLength: 3,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Type...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
    var accountNo = Ext.create('Ext.form.field.Number', {
        name: 'account_no',
        fieldLabel: 'Account Number',
        width: 350,
        filedAlign: 'top',
        allowBlank: false,
        minValue: 0,
        value: account_no,
        maxLength: 7,
        enforceMaxLength: 7,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Account No...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
    var ppdateAmount = Ext.create('Ext.form.field.Number', {
        name: 'amount',
        width: 350,
        fieldLabel: 'Update Amount',
        filedAlign: 'top',
        allowBlank: false,
        minValue: 0,
        value: 0,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Update Amount...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });

    var bankList = Ext.create('Ext.form.ComboBox', {
        name: 'bank',
        width: 350,
        fieldLabel: 'Bank Name',
        filedAlign: 'top',
        allowBlank: false,
        editable: false,
        value: 1,
        emptyText: 'Bank Name',
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
                url: '/getBankList'
            },
            autoLoad: true,
            autoSync: true
        },
    });

    var newMonthPicker = Ext.create('Ext.form.field.Date', {
        name: 'approve_date',
        width: 350,
        fieldLabel: 'Select Month',
        filedAlign: 'top',
        allowBlank: true,
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
    });

    var activateAccount = {
        xtype: 'fieldcontainer',
        fieldLabel: 'Set Active',
        defaultType: 'radiofield',
        defaults: {
            flex: 2,
        },
        layout: 'hbox',
        items: [{
            boxLabel: ' ACTIVATE',
            name: 'is_active',
            inputValue: 1,
            checked: true,
            id: 'is_active_emp_bank_account_1'
        }, {
            boxLabel: ' DEACTIVATE ',
            name: 'is_active',
            inputValue: 0,
            checked: false,
            id: 'is_active_emp_bank_account_2'
        }]
    };

    salaryBox.items.push(ppdateAmount);
    salaryBox.items.push(newMonthPicker);
    itemArray.push(inputSalary);
    itemArray.push(salaryBox);
    //itemArray.push(numberField('Update Amount', 'amount', true));
    //itemArray.push(newMonthPicker('approve_date'));

    itemArray.push(payMethod);
    itemArray.push(bankList);
    itemArray.push(branchCode);
    itemArray.push(accountType);
    itemArray.push(accountNo);
    itemArray.push(activateAccount);
    itemArray.push(employeeBankAccountGrid(rec));

    var salary_input_form = Ext.create('Ext.form.Panel', {
        width: '100%',
        bodyPadding: 20,
        border: false,
        items: itemArray,
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
                values.approve_date = new Date(values.approve_date);
                values.approve_date.setDate(2);
                values.employee = rec.id;
                if (parseInt(values.amount) > 0 && new Date(values.approve_date)) {
                    values.update_salary = true;
                } else {
                    values.update_salary = false;
                }
                if (form.isValid()) {
                    if (values.input_salary) {
                        if (parseInt(values.amount) > 0 && values.approve_date != 'Invalid Date') {
                            socket.emit('CreateSalary', values).on('CreateSalary', function(message) {
                                if (message == "success") {
                                    success = true;
                                    if (Ext.getCmp('salary_list_grid')) {
                                        Ext.getCmp('salary_list_grid').getStore().load();
                                    }
                                    Ext.MessageBox.alert('success', 'Successfully data inserted');
                                    win.close();
                                } else if (message == "error") {
                                    Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                                }

                                // Ext.getCmp('employee_bank_account_grid').getStore().load({
                                //   callback: function (records, operation, success) {
                                //     // Ext.getCmp('employee_bank_account_grid').setLoading(false);
                                //   },
                                //   scope: this
                                // });
                            });
                        } else {
                            Ext.MessageBox.alert('Error', 'Fill Up Salary Amount & Month Details Properly');
                        }
                    } else {
                        socket.emit('CreateSalary', values).on('CreateSalary', function(message) {
                            if (message == "success") {
                                success = true;
                                if (Ext.getCmp('salary_list_grid')) {
                                    Ext.getCmp('salary_list_grid').getStore().load();
                                }
                                Ext.MessageBox.alert('success', 'Successfully data inserted');
                                win.close();
                            } else if (message == "error") {
                                Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                            }
                            // Ext.getCmp('employee_bank_account_grid').getStore().load({
                            //   callback: function (records, operation, success) {
                            //     Ext.getCmp('employee_bank_account_grid').setLoading(false);
                            //   },
                            //   scope: this
                            // });
                        });
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
    });
    return salary_input_form;
}


function employeeBankAccountGrid(eData) {
    return Ext.create('Ext.grid.Panel', {
        id: 'employee_bank_account_grid',
        width: 350,
        autoScroll: true,
        columnLines: true,
        store: {
            proxy: {
                type: 'ajax',
                url: '/getEMPBankAccountList/' + eData.id
            },
            autoLoad: true,
            autoSync: true,
            model: Ext.define('EMP_BANK_ACCOUNT_MODEL', {
                extend: 'Ext.data.Model',
                fields: [{
                    name: 'id',
                    type: 'int'
                }, ]
            }),
            remoteSort: false,
            listeners: {
                beforeload: function() {
                    Ext.getCmp('employee_bank_account_grid').setLoading(true);
                },
                load: {
                    fn: function() {
                        Ext.getCmp('employee_bank_account_grid').setLoading(false);
                    }
                }
            }
        },
        loadMask: true,
        viewConfig: {
            emptyText: 'No records',
            loadMask: true,
            autoDestroy: false,
            getRowClass: function(record) {
                if (record.get('is_active') == 1) {
                    return 'green-row';
                }
                if (record.get('is_active') == 0) {
                    return 'red-row';
                }
            }
        },
        listeners: {
            rowclick: function(grid, row, e) {
                var data = row.data;
                // data.date = Ext.getCmp('hourlyPunchTitle').text;
                // sectionHourlyPunchDetailsWindow(data);
            }
        },
        columns: [{
            header: 'BANK NAME',
            dataIndex: 'bankName',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                return value.toUpperCase();
            },
            align: 'left',
            flex: 1,
        }, {
            header: 'ACCOUNT',
            dataIndex: 'account',
            align: 'center',
            flex: 0.7,
        }, {
            header: 'STATUS',
            dataIndex: 'is_active',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                if (value == 1) {
                    return 'ACTIVE';
                } else {
                    return 'DEACTIVE';
                }
            },
            align: 'center',
            flex: 0.5,
        }, {
            xtype: 'actioncolumn',
            header: ' ',
            flex: 0.2,
            align: 'center',
            items: [{
                icon: '/uploads/icons/update.png',
                tooltip: 'UPDATE',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex).data;
                    Ext.getCmp('employee_bank_account_grid').setLoading(true);
                    socket.emit('ActivateEMPBankAccount', rec).on('ActivateEMPBankAccount', function(r) {
                        if (r == "success") {
                            Ext.MessageBox.alert('success', 'Successfully data updated');
                        } else if (r == "error") {
                            Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                        }
                        Ext.getCmp('employee_bank_account_grid').getStore().load({
                            callback: function(records, operation, success) {
                                Ext.getCmp('employee_bank_account_grid').setLoading(false);
                            },
                            scope: this
                        });
                    });
                }
            }]
        }]
    });
}

function salaryBankAccountFormWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: 'Update Bank Account For ' + rec.name,
        modal: true,
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                width: '100%',
                bodyPadding: 20,
                border: false,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                        xtype: 'textfield',
                        name: 'employee',
                        value: rec.id,
                        hidden: true
                    },
                    Ext.create('Ext.form.ComboBox', {
                        name: 'bank',
                        width: 350,
                        fieldLabel: 'Bank Name',
                        filedAlign: 'top',
                        allowBlank: false,
                        editable: false,
                        value: 1,
                        emptyText: 'Bank Name',
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
                                url: '/getBankList'
                            },
                            autoLoad: true,
                            autoSync: true
                        },
                    }),
                    Ext.create('Ext.form.field.Number', {
                        name: 'branch_code',
                        fieldLabel: 'Account Number',
                        width: 170,
                        labelWidth: 100,
                        filedAlign: 'top',
                        allowBlank: false,
                        minValue: 0,
                        maxLength: 3,
                        enforceMaxLength: 3,
                        labelAlign: 'left',
                        labelStyle: 'text-align:left;border solid 1px white;',
                        labelSeparator: '',
                        emptyText: 'Branch...',
                        labelClsExtra: 'some-class',
                        fieldStyle: 'text-align: left;font-size: 12px;',
                        autoScroll: true
                    }),
                    Ext.create('Ext.form.field.Number', {
                        name: 'account_type',
                        width: 70,
                        filedAlign: 'top',
                        allowBlank: false,
                        minValue: 0,
                        maxLength: 3,
                        enforceMaxLength: 3,
                        labelAlign: 'left',
                        labelStyle: 'text-align:left;border solid 1px white;',
                        labelSeparator: '',
                        emptyText: 'Type...',
                        labelClsExtra: 'some-class',
                        fieldStyle: 'text-align: left;font-size: 12px;',
                        autoScroll: true
                    }),
                    Ext.create('Ext.form.field.Number', {
                        name: 'account_no',
                        width: 100,
                        filedAlign: 'top',
                        allowBlank: false,
                        minValue: 0,
                        maxLength: 7,
                        enforceMaxLength: 7,
                        labelAlign: 'left',
                        labelStyle: 'text-align:left;border solid 1px white;',
                        labelSeparator: '',
                        emptyText: 'Account No...',
                        labelClsExtra: 'some-class',
                        fieldStyle: 'text-align: left;font-size: 12px;',
                        autoScroll: true
                    }), {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Set Active',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 2,
                        },
                        layout: 'hbox',
                        items: [{
                            boxLabel: ' ACTIVATE',
                            name: 'is_active',
                            inputValue: 1,
                            checked: true,
                            id: 'is_active_emp_bank_account_1'
                        }, {
                            boxLabel: ' DEACTIVATE ',
                            name: 'is_active',
                            inputValue: 0,
                            checked: false,
                            id: 'is_active_emp_bank_account_2'
                        }]
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
                        if (form.isValid()) {
                            socket.emit('CreateBankAccount', values).on('CreateBankAccount', function(message) {
                                if (message == "success") {
                                    success = true;
                                    if (Ext.getCmp('salary_bank_statement_list_grid')) {
                                        Ext.getCmp('salary_bank_statement_list_grid').getStore().load();
                                    }
                                    if (Ext.getCmp('salary_list_grid')) {
                                        Ext.getCmp('salary_list_grid').getStore().load();
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