function attendanceTab() {
    if (Ext.getCmp('attendance_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("attendance_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Attendance',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            id: 'attendance_tab',
            autoScroll: true,
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'attendance_list_grid',
                    //title: 'Attendance',
                    //height: 300,
                    //layout: 'fit',
                    autoScroll: true,
                    columnLines: true,
                    store: {
                        proxy: {
                            type: 'ajax',
                            url: '/attendance'
                        },
                        autoLoad: true,
                        autoSync: true,
                        model: Ext.define('ATTENDANCE_MODEL', {
                            extend: 'Ext.data.Model',
                            fields: [{
                                name: 'id',
                                type: 'int'
                            }, {
                                name: 'employee_id',
                                type: 'string',
                                mapping: 'employeeTable.id'
                            }, {
                                name: 'employee',
                                type: 'string',
                                mapping: 'employeeTable.id'
                            }, {
                                name: 'punch_time',
                                type: 'date'
                            }, {
                                name: 'punch_date',
                                type: 'date',
                                mapping: 'punch_time'
                            }, {
                                name: 'attendance',
                                type: 'date',
                                mapping: 'punch_time'
                            }, {
                                name: 'first_name',
                                type: 'string',
                                mapping: 'employeeTable.userTable.first_name'
                            }, {
                                name: 'last_name',
                                type: 'string',
                                mapping: 'employeeTable.userTable.last_name'
                            }, {
                                name: 'department',
                                type: 'string',
                                mapping: 'employeeTable.departmentTable.name'
                            }, ]
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
                    columns: [
                        Ext.create('Ext.grid.RowNumberer'), {
                            header: 'ID',
                            dataIndex: 'employee',
                            align: 'left',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return 'JCLFFL' + addLeadingZero(4, parseInt(value));
                            },
                            flex: 0.5
                        }, {
                            header: 'EMPLOYEE NAME',
                            dataIndex: 'first_name',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var last_name = record.get('last_name');
                                return value + ' ' + last_name;
                            },
                            align: 'left',
                            flex: 1
                        }, {
                            header: 'DATE',
                            dataIndex: 'punch_date',
                            renderer: Ext.util.Format.dateRenderer('d-M-Y'),
                            align: 'left',
                            flex: 1
                        }, {
                            header: 'IN TIME',
                            dataIndex: 'punch_time',
                            renderer: function(val, meta, record) {
                                var d = Ext.Date.add(new Date(val), Ext.Date.HOUR, -6);
                                var c = Ext.Date.format(d, "g:i:s A");
                                return c;
                            },
                            align: 'left',
                            flex: 1
                        }, {
                            header: 'ATTENDANCE',
                            dataIndex: 'attendance',
                            renderer: function(val, meta, record) {
                                var d = new Date(val);
                                if (d.getUTCHours() < 10) {
                                    if (d.getUTCHours() == 9) {
                                        if (d.getUTCMinutes() > 29) {
                                            return '<b style="color:#FF0000">L</b>';
                                        } else {
                                            return 'P';
                                        }
                                    } else {
                                        return 'P';
                                    }
                                } else {
                                    return '<b style="color:#FF0000">L</b>';
                                }
                            },
                            align: 'left',
                            flex: 1
                        },
                    ]
                })
            ],
            tbar: [
                Ext.create('Ext.toolbar.Toolbar', {
                    border: false,
                    items: [
                        newDateField('Form Date', 'form_date', 'attendance_search_form_date'), {
                            xtype: 'button',
                            icon: '/uploads/icons/search.png',
                            text: 'SEARCH',
                            border: 1,
                            style: {
                                borderColor: 'blue',
                                borderStyle: 'solid'
                            },
                            handler: function() {
                                var f = Ext.getCmp('attendance_search_form_date').value
                                var d = new Date(f);
                                var v = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                                if (f) {
                                    Ext.getCmp('attendance_list_grid').getStore().load({
                                        params: {
                                            form_date: v
                                        },
                                        callback: function(records, operation, success) {
                                            //this.up('form').getForm().findField("line").clearValue();
                                        },
                                        scope: this
                                    });
                                }
                            }
                        }
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
                    if (Ext.getCmp('attendance_list_grid')) {
                        Ext.getCmp('attendance_list_grid').getStore().load();
                    }
                }
            }, {
                xtype: 'button',
                text: 'Download',
                icon: '/uploads/icons/upload.png',
                iconCls: 'add',
                name: 'reload',
                tooltip: 'Reload',
                target: '_blank',
                hrefTarget: '_blank',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    if (Ext.getCmp('attendance_list_grid')) {
                        var storeData = Ext.getCmp('attendance_list_grid').getStore().data.items;
                        var win = window;
                        var l = storeData.length;
                        if (l > 0) {
                            var p = new Date(storeData[0].data.punch_time);
                            var file_name = p.getUTCDate() + '_' + monthNames[p.getUTCMonth()] + '_' + p.getUTCFullYear() + '_daily_attendance';
                            var htmlData = '<!DOCTYPE html>' +
                                '<html>' +
                                '<head>' +
                                '<style>' +
                                'table, th, td {' +
                                'border: 1px solid black;' +
                                'border-collapse: collapse;' +
                                '}' +
                                'th, td {' +
                                'padding: 5px;' +
                                'align: center;' +
                                '}' +
                                'h1, h2, h4 {' +
                                'line-height: 0.5;' +
                                'text-align: center;' +
                                '}' +
                                'body {' +
                                'font-size: 10px;' +
                                'padding: 30px 50px;' +
                                '}' +
                                '</style>' +
                                '</head>' +
                                '<body>' +
                                '<h1>Fashion Flash Limited</h1>' +
                                '<h2>Daily Attendance Report</h2>' +
                                '<h4>' +
                                p.getUTCDate() +
                                '<sup>' + dayPower[p.getUTCDate()] + '</sup> ' +
                                monthNames[p.getUTCMonth()] + ', ' +
                                p.getUTCFullYear() +
                                '</h4>' +
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<th>EMPLOYEE ID</th>' +
                                '<th>EMPLOYEE NAME</th>' +
                                '<th>IN TIME</th>' +
                                '<th>STATUS</th>' +
                                '</tr>';
                            for (var i = 0; i < storeData.length; i++) {
                                var d = new Date(storeData[i].data.punch_time);
                                var attendance;
                                var period = 'AM';
                                var h = addLeadingZero(2, d.getUTCHours());
                                var m = addLeadingZero(2, d.getUTCMinutes());
                                var s = addLeadingZero(2, d.getUTCSeconds());
                                if (parseInt(h) > 12) {
                                    h -= 12;
                                    period = 'PM';
                                }
                                if (d.getUTCHours() < 10) {
                                    if (d.getUTCHours() == 9) {
                                        if (d.getUTCMinutes() > 29) {
                                            attendance = '<b style="color:#FF0000">L</b>';
                                        } else {
                                            attendance = 'P';
                                        }
                                    } else {
                                        attendance = 'P';
                                    }
                                } else {
                                    attendance = '<b style="color:#FF0000">L</b>';
                                }
                                htmlData += '<tr>';
                                htmlData += '<td align="center">';
                                htmlData += 'JCLFFL' + addLeadingZero(4, parseInt(storeData[i].data.employee));
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += storeData[i].data.first_name + ' ' + storeData[i].data.last_name;
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += h + ':' + m + ':' + s + ' ' + period;
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += attendance;
                                htmlData += '</td>';
                                htmlData += '</tr>';
                            };
                            htmlData += '</table></body></html>';
                            socket.emit('CreateDailyReportPDF', htmlData, file_name).on('CreateDailyReportPDF', function(message) {
                                if (message == "success") {
                                    success = true;
                                    //Ext.MessageBox.alert('ERROR', '<a href="/uploads/pdf/'+file_name+'.pdf" download>Click Here</a>');
                                    Ext.MessageBox.alert({
                                        title: 'Daily Attendance Download',
                                        buttons: Ext.MessageBox.CANCEL,
                                        msg: 'Please <a href="/uploads/pdf/' + file_name + '.pdf" download>click here</a> to confirm the file download',
                                        //buttons: Ext.MessageBox.YESNO,
                                        //target: '/uploads/pdf/'+file_name+'.pdf',
                                        //fn: showResult,
                                        animateTarget: 'mb4',
                                        icon: Ext.MessageBox.QUESTION
                                    });
                                }
                            });
                        } else {
                            Ext.MessageBox.alert('ERROR', 'No Data Found');
                        }
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}