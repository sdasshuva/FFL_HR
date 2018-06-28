function salaryBankStatementTab() {
    if (Ext.getCmp('salary_bank_statement_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("salary_bank_statement_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Employee Salary Bank Account Statement',
            layout: 'fit',
            closable: true,
            id: 'salary_bank_statement_tab',
            autoScroll: true,
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'salary_bank_statement_list_grid',
                    columnLines: true,
                    store: {
                        proxy: {
                            type: 'ajax',
                            url: '/salary_bank_account'
                        },
                        autoLoad: true,
                        autoSync: true,
                        model: Ext.define('SALARY_BANK_ACCOUNT_MODEL', {
                            extend: 'Ext.data.Model',
                            fields: [{
                                name: 'id',
                                type: 'int'
                            }, {
                                name: 'name',
                                type: 'string'
                            }, {
                                name: 'account_no',
                                type: 'string'
                            }, ]
                        })
                    },
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
                    /*features: [
                        {
                            ftype: 'summary',
                            dock: 'bottom'
                        }
                    ],*/
                    columns: [
                        Ext.create('Ext.grid.RowNumberer'), {
                            header: 'EMP. ID',
                            dataIndex: 'id',
                            align: 'center',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return 'JCLFFL' + addLeadingZero(4, value);
                            },
                            flex: 0.5,
                            /*summaryType: 'count',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b><big>TOTAL:</big></b> ';
                            }*/
                        }, {
                            header: 'NAME',
                            dataIndex: 'name',
                            align: 'left',
                            flex: 1
                        }, {
                            header: 'ACCOUNT NO',
                            dataIndex: 'account_no',
                            align: 'right',
                            flex: 0.5,
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value;
                            },
                        }, {
                            xtype: 'actioncolumn',
                            header: 'UPDATE ACCOUNT',
                            flex: 0.5,
                            align: 'center',
                            items: [{
                                icon: '/uploads/icons/update.png',
                                tooltip: 'UPDATE SALARY',
                                handler: function(grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    salaryBankAccountFormWindow(rec.data);
                                }
                            }]
                        }, {
                            xtype: 'actioncolumn',
                            header: 'DETAILS',
                            flex: 0.5,
                            align: 'center',
                            items: [{
                                icon: '/uploads/icons/eye.png',
                                tooltip: 'DETAILS',
                                handler: function(grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    //salaryBankAccountDetailsWindow(rec.data);
                                }
                            }]
                        }
                    ]
                })
            ],
            tbar: [
                Ext.create('Ext.form.field.Date', {
                    name: 'month_search',
                    id: 'salary_bank_statement_month_search',
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
                        var ms = Ext.getCmp('salary_bank_statement_month_search').value;
                        var holidayData = holidayStore.getRange();
                        var holiday = 0;
                        var holiday_array = {};
                        var adjustmentData = adjustmentStore.getRange();
                        var adjustment = {};
                        if (ms) {
                            for (var i = 0; i < holidayData.length; i++) {
                                holiday_array[0] = 0;
                                holiday_array[32] = 32;
                                if (holidayData[i].data.date.getFullYear() == ms.getFullYear()) {
                                    if (holidayData[i].data.date.getMonth() == ms.getMonth()) {
                                        holiday_array[holidayData[i].data.date.getDate()] = holidayData[i].data.date.getDate();
                                        holiday++;
                                    }
                                }
                            };
                            for (var i = 0; i < adjustmentData.length; i++) {
                                adjustment[0] = 0;
                                adjustment[32] = 32;
                                if (adjustmentData[i].data.date.getFullYear() == ms.getFullYear()) {
                                    if (adjustmentData[i].data.date.getMonth() == ms.getMonth()) {
                                        adjustment[adjustmentData[i].data.date.getDate()] = adjustmentData[i].data.date.getDate();
                                    }
                                }
                            };
                            var storePanel = Ext.getCmp('salary_bank_statement_tab');
                            var store = Ext.getCmp('salary_bank_statement_list_grid').getStore();
                            storePanel.setLoading(true);
                            store.load({
                                params: {
                                    month: ms,
                                    holiday: holiday,
                                    holiday_array: holiday_array,
                                    adjustment: adjustment,
                                },
                                callback: function(records, operation, success) {
                                    storePanel.setLoading(false);
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
                    if (Ext.getCmp('salary_bank_statement_list_grid')) {
                        Ext.getCmp('salary_bank_statement_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}