function attendanceReportTab() {
    if (Ext.getCmp('attendance_report_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("attendance_report_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Attendance Report',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            id: 'attendance_report_tab',
            autoScroll: true,
            listeners: {
                afterrender: function(self, eOpts) {
                    var departmentData = departmentStore.getRange();
                    var department = [];
                    for (var i = 0; i < departmentData.length; i++) {
                        self.add(attendanceReportGrid(departmentData[i].data));
                    };
                }
            },
            items: [],
            tbar: [
                Ext.create('Ext.form.field.Date', {
                    name: 'month_search',
                    id: 'attendance_report_month_search',
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
                        var ms = Ext.getCmp('attendance_report_month_search').value;
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
                                var storePanel = Ext.getCmp('attendance_report_tab');
                                var store = Ext.getCmp('attendance_report_grid_' + departmentData[i].id).getStore();
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
                    var departmentData = departmentStore.getRange();
                    var ms = Ext.getCmp('attendance_report_month_search').value;
                    var file_name = monthNames[ms.getMonth()] + '_' + ms.getFullYear() + '_Attendance_Report';
                    var htmlData =
                        '<!DOCTYPE html>' +
                        '<html>' +
                        '<head>' +
                        '<style>' +
                        'table, th, td {' +
                        'border: 1px solid black;' +
                        'border-collapse: collapse;' +
                        '}' +
                        'th, td {' +
                        'padding: 5px;' +
                        'line-height: 1.2;' +
                        'align: center;' +
                        '}' +
                        'h1, h2, h4 {' +
                        'line-height: 0.8;' +
                        'text-align: center;' +
                        '}' +
                        'div {' +
                        'font-size: 20px;' +
                        'padding: 50px 30px;' +
                        '}' +
                        'hr {' +
                        'page-break-after: always;' +
                        '}' +
                        '</style>' +
                        '</head>' +
                        '<body>' +
                        '<div>' +
                        '<img src="' +
                        site_url +
                        'uploads/images/logo.png"' +
                        'style=" position:fixed; left:1250px; margin-top:10px; width:200px;' +
                        'height:130px; border:none;"/>' +
                        '<h1><b>Fashion Flash Limited</b></h1>' +
                        '<h2><b>Monthly Attendance Report</b></h2>' +
                        '<h4><b>' +
                        monthCapitalNames[ms.getMonth()] + ', ' +
                        ms.getFullYear() +
                        '</b></h4>';
                    for (var i = 0; i < departmentData.length; i++) {
                        if (Ext.getCmp('attendance_report_grid_' + departmentData[i].id)) {
                            var storeData = Ext.getCmp('attendance_report_grid_' + departmentData[i].id).getStore().data.items;
                            var l = storeData.length;
                            htmlData +=
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<th align="left">' +
                                '<h3>' +
                                departmentData[i].data.name.toUpperCase() +
                                '</h3>' +
                                '</th>' +
                                '</tr>' +
                                '</table>' +
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<th>EMP. ID</th>' +
                                '<th width="260px">EMP. NAME</th>';
                            htmlData += '<th>P</th>' +
                                '<th>A</th>' +
                                '<th>L</th>' +
                                '<th>W</th>' +
                                '<th>H</th>' +
                                '<th>AL</th>' +
                                '<th>ALL</th>' +
                                '<th>LL</th>' +
                                '<th>LA</th>' +
                                '<th>PD</th>' +
                                '<th>AD</th>' +
                                '<th>TD</th>';
                            for (var j = 1; j < storeData[0].data.day_length + 1; j++) {
                                htmlData += '<th width="65px"><small><small>' + mthCPNames[ms.getMonth()] + ' ' + j + '</small></small></th>';
                            };
                            htmlData += '</tr>';
                            for (var j = 0; j < storeData.length; j++) {
                                htmlData += '<tr>';
                                htmlData += '<td align="center"><b>';
                                htmlData += 'JCLFFL';
                                htmlData += addLeadingZero(4, parseInt(storeData[j].id));
                                htmlData += '</b></td>';
                                htmlData += '<td align="left"><b>';
                                if (storeData[j].data.first_name != '') {
                                    htmlData += storeData[j].data.first_name;
                                }
                                htmlData += ' ';
                                if (storeData[j].data.last_name != '') {
                                    htmlData += storeData[j].data.last_name;
                                }
                                htmlData += '</b></td>';
                                var tmp_TD = parseInt(storeData[j].data.day_length);
                                var tmp_P = parseInt(storeData[j].data.present);
                                var tmp_A = parseInt(storeData[j].data.absent);
                                var tmp_L = parseInt(storeData[j].data.late);
                                var tmp_W = parseInt(storeData[j].data.weekend);
                                var tmp_H = parseInt(storeData[j].data.holidays);
                                var tmp_LA = parseInt(storeData[j].data.leave);
                                var tmp_LL = parseInt(storeData[j].data.late_leave);
                                var tmp_ALL = parseInt(storeData[j].data.absent_late_leave);
                                htmlData += '<td align="center"><b>';
                                htmlData += addLeadingZero(2, tmp_P.toString());
                                htmlData += '</b></td>';
                                htmlData += '<td align="center"><b>';
                                htmlData += addLeadingZero(2, tmp_A.toString());
                                htmlData += '</b></td>';
                                htmlData += '<td align="center"><b>';
                                htmlData += addLeadingZero(2, tmp_L.toString());
                                htmlData += '</b></td>';
                                htmlData += '<td align="center"><b>';
                                htmlData += addLeadingZero(2, tmp_W.toString());
                                htmlData += '</b></td>';
                                htmlData += '<td align="center"><b>';
                                htmlData += addLeadingZero(2, tmp_H.toString());
                                htmlData += '</b></td>';
                                htmlData += '<td align="center"><b>';
                                var tmp_AL = parseInt(tmp_L / 3);
                                htmlData += addLeadingZero(2, tmp_AL.toString());
                                htmlData += '</b></td>';
                                htmlData += '<td align="center"><b>';
                                htmlData += addLeadingZero(2, tmp_ALL.toString());
                                htmlData += '</b></td>';
                                htmlData += '<td align="center"><b>';
                                htmlData += addLeadingZero(2, tmp_LL.toString());
                                htmlData += '</b></td>';
                                htmlData += '<td align="center"><b>';
                                htmlData += addLeadingZero(2, tmp_LA.toString());
                                htmlData += '</b></td>';
                                htmlData += '<td align="center"><b>';
                                var tmp_LLP = parseInt(tmp_L - tmp_LL);
                                var tmp_NAL = parseInt(tmp_LLP / 3);
                                var tmp_PD = parseInt(tmp_P + (tmp_LLP - tmp_NAL) + tmp_LL + tmp_LA + tmp_W + tmp_H + tmp_ALL);
                                htmlData += addLeadingZero(2, tmp_PD.toString());
                                htmlData += '</b></td>';
                                htmlData += '<td align="center"><b>';
                                var tmp_AD = parseInt(tmp_TD - tmp_PD);
                                htmlData += addLeadingZero(2, tmp_AD.toString());
                                htmlData += '</b></td>';
                                htmlData += '<td align="center"><b>';
                                htmlData += addLeadingZero(2, tmp_TD.toString());
                                htmlData += '</b></td>';
                                for (var k = 1; k < storeData[0].data.day_length + 1; k++) {
                                    var obj_res = Object.keys(storeData[j].data)[18 + k];
                                    htmlData += '<td align="center"><small>' + storeData[j].data['day_' + k] + '</small></td>';
                                };
                                htmlData += '</tr>';
                            };
                            htmlData += '</table>';
                            htmlData += '<br>';
                            //htmlData+='<small><b>Notice:</b> Every 3 days of late has been counted as an extra 1 day of absent.</small>';

                            if (i == 3) {
                                htmlData += '<br>' +
                                    '<small>' +
                                    '<i>P = PRESENT, A = ABSENT, L = LATE, W = WEEKEND, ' +
                                    'H = HOLIDAY, TD = TOTAL DAYS, AL = ABSENT DUE TO LATE, ALL = LATE LEAVE ON ABSENT DAY, ' +
                                    'LL = LATE LEAVE/ SHORT LEAVE, CL = CASUAL LEAVE, SL = SICK LEAVE, EL = EARN LEAVE, ' +
                                    'LA = LEAVE ACCEPTED, PD = PRESENT DAYS, AD = ABSENT DAYS</i>' +
                                    '</small>' +
                                    '</div>' +
                                    '<hr>' +
                                    '<div>' +
                                    '<img src="' +
                                    site_url +
                                    'uploads/images/logo.png"' +
                                    'style=" position:fixed; left:1250px; margin-top:10px; width:200px;' +
                                    'height:130px; border:none;"/>' +
                                    '<h1><b>Fashion Flash Limited</b></h1>' +
                                    '<h2><b>Monthly Attendance Report</b></h2>' +
                                    '<h4><b>' +
                                    monthCapitalNames[ms.getMonth()] + ', ' +
                                    ms.getFullYear() +
                                    '</b></h4>';
                            }
                        }
                    };
                    htmlData += '<br>' +
                        '<small>' +
                        '<i>P = PRESENT, A = ABSENT, L = LATE, W = WEEKEND, ' +
                        'H = HOLIDAY, TD = TOTAL DAYS, AL = ABSENT DUE TO LATE, ALL = LATE LEAVE ON ABSENT DAY, ' +
                        'LL = LATE LEAVE / SHORT LEAVE, CL = CASUAL LEAVE, SL = SICK LEAVE, EL = EARN LEAVE, ' +
                        'LA = LEAVE ACCEPTED, PD = PRESENT DAYS</i>' +
                        '</small>' +
                        '</div>' +
                        '</body>' +
                        '</html>';
                    socket.emit('CreateMonthlyAttendanceReportPDF', htmlData, file_name).on('CreateMonthlyAttendanceReportPDF', function(message) {
                        if (message == "success") {
                            success = true;
                            Ext.MessageBox.alert({
                                title: 'Monthly Attendance Download',
                                buttons: Ext.MessageBox.CANCEL,
                                msg: 'Please <a href="/uploads/pdf/' + file_name + '.pdf" download>click here</a> to confirm the file download',
                                animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    });
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function attendanceReportGrid(rec) {
    return Ext.create('Ext.grid.Panel', {
        id: 'attendance_report_grid_' + rec.id,
        title: rec.name.toUpperCase(),
        //layout: 'fit',
        autoScroll: true,
        columnLines: true,
        //store: attendanceReportStore,
        store: {
            proxy: {
                type: 'ajax',
                url: '/attendance_report/' + rec.id
            },
            autoLoad: true,
            autoSync: true,
            model: 'ATTENDANCE_REPORT_MODEL'
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
            },
            /*afterrender: function( self, eOpts ){
                for (var i = 1; i < 5; i++) {
                    var days =  {
                        header: 'DAY '+i,
                        dataIndex: 'day_'+i,
                        flex: 0.5,
                        align: 'center',
                    };
                    self.headerCt.add(days);
                };
            }*/
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer'), {
                header: 'ID',
                dataIndex: 'id',
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
            },
            /*{
                header: 'SL TAKEN',
                dataIndex: 'sick_leave',
                align: 'left',
                flex: 0.5
            },
            {
                header: 'CL TAKEN',
                dataIndex: 'casual_leave',
                align: 'left',
                flex: 0.5
            },*/
            {
                header: 'PRESENT',
                dataIndex: 'present',
                align: 'left',
                flex: 0.5
            }, {
                header: 'ABSENT',
                dataIndex: 'absent',
                align: 'left',
                flex: 0.5
            }, {
                header: 'LATE',
                dataIndex: 'late',
                align: 'left',
                flex: 0.5
            }, {
                header: 'TOTAL',
                dataIndex: 'total',
                align: 'left',
                flex: 0.5
            }, {
                header: 'WEEKEND',
                dataIndex: 'weekend',
                align: 'left',
                flex: 0.5
            }, {
                header: 'HOLIDAY',
                dataIndex: 'holidays',
                align: 'left',
                flex: 0.5
            },
        ]
    });
}