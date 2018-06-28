function salaryStatementTab() {
    if (Ext.getCmp('salary_statement_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("salary_statement_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Salary Statement List',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            id: 'salary_statement_tab',
            autoScroll: true,
            listeners: {
                afterrender: function(self, eOpts) {
                    var departmentData = departmentStore.getRange();
                    var department = [];
                    for (var i = 0; i < departmentData.length; i++) {
                        self.add(salaryStatementListGrid(departmentData[i].data));
                    };
                }
            },
            items: [],
            //items: [
            //  salaryStatementListGrid()
            //],
            tbar: [
                Ext.create('Ext.form.field.Date', {
                    name: 'month_search',
                    id: 'salary_statement_month_search',
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
                        var ms = Ext.getCmp('salary_statement_month_search').value;
                        var holidayData = holidayStore.getRange();
                        var holiday = 0;
                        var holiday_array = {};
                        var departmentData = departmentStore.getRange();
                        var department = [];
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
                            for (var i = 0; i < departmentData.length; i++) {
                                var storePanel = Ext.getCmp('salary_statement_tab');
                                var store = Ext.getCmp('salary_statement_list_grid' + departmentData[i].id).getStore();
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
                            };

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
                    if (Ext.getCmp('salary_statement_list_grid')) {
                        Ext.getCmp('salary_statement_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function salaryStatementListGrid(rec) {
    return Ext.create('Ext.grid.Panel', {
        id: 'salary_statement_list_grid' + rec.id,
        title: rec.name.toUpperCase(),
        columnLines: true,
        loadMask: true,
        autoScroll: true,
        store: {
            proxy: {
                type: 'ajax',
                url: '/salary_statement_report/' + rec.id
            },
            autoLoad: true,
            autoSync: true,
            model: Ext.define('SALARY_STATEMENT_REPORT_MODEL', {
                extend: 'Ext.data.Model',
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'name',
                    type: 'string',
                }, {
                    name: 'designation',
                    type: 'string',
                }, {
                    name: 'date_of_join',
                    type: 'string',
                }, {
                    name: 'work_day',
                    type: 'int',
                }, {
                    name: 'present',
                    type: 'int',
                }, {
                    name: 'absent',
                    type: 'int',
                }, {
                    name: 'salary',
                    type: 'int',
                }, {
                    name: 'basic',
                    type: 'int',
                }, {
                    name: 'house_rent',
                    type: 'int',
                }, {
                    name: 'medical',
                    type: 'int',
                }, {
                    name: 'conveyance',
                    type: 'int',
                }, {
                    name: 'absent_deduct',
                    type: 'int',
                }, {
                    name: 'advance_deduct',
                    type: 'int',
                }, {
                    name: 'others_deduct',
                    type: 'int',
                }, {
                    name: 'ait_deduct',
                    type: 'int',
                }, {
                    name: 'total_deduct',
                    type: 'int',
                }, {
                    name: 'net_payable',
                    type: 'int',
                }, ]
            })
        },
        viewConfig: {
            emptyText: 'No records',
            autoDestroy: false
        },
        features: [{
            ftype: 'summary',
            dock: 'bottom'
        }],
        listeners: {
            rowclick: function(grid, row, e) {
                var data = row.data;
                //employeeProfileTab(data);
            }
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer'), {
                header: 'EMPLOYEE NAME',
                dataIndex: 'name',
                align: 'left',
                width: 200,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value;
                },
                summaryType: 'count',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b>TOTAL =></b> ';
                },
            }, {
                header: 'DESIGNATION',
                dataIndex: 'designation',
                align: 'left',
                width: 150,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value;
                },
            }, {
                header: 'JOINING DATE',
                dataIndex: 'date_of_join',
                align: 'left',
                width: 120,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    //return value;
                    var date = new Date(value);
                    return addLeadingZero(2, date.getDate()) + '-' + mthCPNames[date.getMonth()] + '-' + date.getFullYear();

                },
            }, {
                header: 'WORKING DAY',
                dataIndex: 'work_day',
                align: 'right',
                width: 110,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value;
                },
            }, {
                header: 'PRESENT',
                dataIndex: 'present_day',
                align: 'right',
                width: 100,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value;
                },
            }, {
                header: 'ABSENT',
                dataIndex: 'absent_day',
                align: 'right',
                width: 100,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value;
                },
            }, {
                header: 'BASIC',
                dataIndex: 'basic',
                align: 'right',
                width: 100,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.formatMoney(2, '.', ',');
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b>' + value.formatMoney(2, '.', ',') + '</b> ';
                },
            }, {
                header: 'ALLOWANCES',
                columns: [{
                    header: 'HOUSE RENT',
                    dataIndex: 'house_rent',
                    align: 'right',
                    width: 100,
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return value.formatMoney(2, '.', ',');
                    },
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b>' + value.formatMoney(2, '.', ',') + '</b> ';
                    },
                }, {
                    header: 'MEDICAL',
                    dataIndex: 'medical',
                    align: 'right',
                    width: 100,
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return value.formatMoney(2, '.', ',');
                    },
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b>' + value.formatMoney(2, '.', ',') + ' TK</b> ';
                    },
                }, {
                    header: 'CONVEYANCE',
                    dataIndex: 'conveyance',
                    align: 'right',
                    width: 100,
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return value.formatMoney(2, '.', ',');
                    },
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b>' + value.formatMoney(2, '.', ',') + '</b> ';
                    },
                }, ]
            }, {
                header: 'GROSS SALARY',
                dataIndex: 'salary',
                align: 'right',
                width: 120,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.formatMoney(2, '.', ',');
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b>' + value.formatMoney(2, '.', ',') + '</b> ';
                },
            }, {
                header: 'DEDUCTIONS',
                columns: [{
                    header: 'ABSENT',
                    dataIndex: 'absent_deduct',
                    align: 'right',
                    width: 100,
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return value.formatMoney(2, '.', ',');
                    },
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b>' + value.formatMoney(2, '.', ',') + '</b> ';
                    },
                }, {
                    header: 'ADVANCE',
                    dataIndex: 'advance_deduct',
                    align: 'right',
                    width: 100,
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return value.formatMoney(2, '.', ',');
                    },
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b>' + value.formatMoney(2, '.', ',') + '</b> ';
                    },
                }, {
                    header: 'OTHERS',
                    dataIndex: 'others_deduct',
                    align: 'right',
                    width: 100,
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return value.formatMoney(2, '.', ',');
                    },
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b>' + value.formatMoney(2, '.', ',') + '</b> ';
                    },
                }, {
                    header: 'AIT',
                    dataIndex: 'ait_deduct',
                    align: 'right',
                    width: 100,
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return value.formatMoney(2, '.', ',');
                    },
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b>' + value.formatMoney(2, '.', ',') + '</b> ';
                    },
                }, ]
            }, {
                header: 'TOTAL DEDUCTION',
                dataIndex: 'total_deduct',
                align: 'right',
                width: 120,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.formatMoney(2, '.', ',');
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b>' + value.formatMoney(2, '.', ',') + '</b> ';
                },
            }, {
                header: 'NET PAYABLE',
                dataIndex: 'net_payable',
                align: 'right',
                width: 100,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.formatMoney(2, '.', ',');
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b>' + value.formatMoney(2, '.', ',') + '</b> ';
                },
            },
        ]
    });
}