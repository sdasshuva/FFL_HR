function userAttendanceTab() {
    if (Ext.getCmp('user_attendance_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("user_attendance_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'User Attendance',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            id: 'user_attendance_tab',
            autoScroll: true,
            listeners: {
                afterrender: function(self, eOpts) {}
            },
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'user_attendance_list_grid',
                    loadMask: true,
                    autoScroll: true,
                    columnLines: true,
                    viewConfig: {
                        emptyText: 'No records',
                        autoDestroy: false
                    },
                    listeners: {
                        rowclick: function(grid, row, e) {
                            var data = row.data;
                        }
                    },
                    store: {
                        proxy: {
                            type: 'ajax',
                            url: '/user_attendance'
                        },
                        autoLoad: true,
                        autoSync: true,
                        model: Ext.define('USER_ATTENDANCE_MODEL', {
                            extend: 'Ext.data.Model',
                            fields: [{
                                    name: 'date',
                                    type: 'string'
                                }, {
                                    name: 'attendance',
                                    type: 'string'
                                }, {
                                    name: 'in_time',
                                    type: 'string'
                                }, {
                                    name: 'in_time_h',
                                    type: 'string'
                                }, {
                                    name: 'in_time_m',
                                    type: 'string'
                                }, {
                                    name: 'in_time_s',
                                    type: 'string'
                                }, {
                                    name: 'punch_time',
                                    type: 'auto'
                                }, {
                                    name: 'name',
                                    type: 'string'
                                }, {
                                    name: 'access_level',
                                    type: 'int'
                                }, {
                                    name: 'email',
                                    type: 'string'
                                }, {
                                    name: 'finger_print_id',
                                    type: 'int'
                                }, {
                                    name: 'weekend',
                                    type: 'int'
                                }, {
                                    name: 'nextdays',
                                    type: 'int'
                                }, {
                                    name: 'absent',
                                    type: 'int'
                                }, {
                                    name: 'present',
                                    type: 'int'
                                }, {
                                    name: 'late',
                                    type: 'int'
                                }, {
                                    name: 'holiday',
                                    type: 'int'
                                }, {
                                    name: 'date_of_join',
                                    type: 'string'
                                },
                                /*{
                                    name: 'id',
                                    type: 'int'
                                },
                                {
                                    name: 'employee_id',
                                    type: 'string',
                                    mapping: 'employeeTable.id'
                                },
                                {
                                    name: 'employee',
                                    type: 'string',
                                    mapping: 'employeeTable.id'
                                },
                                {
                                    name: 'punch_time',
                                    type: 'date'
                                },
                                {
                                    name: 'punch_date',
                                    type: 'date',
                                    mapping: 'punch_time'
                                },
                                {
                                    name: 'attendance',
                                    type: 'date',
                                    mapping: 'punch_time'
                                },
                                {
                                    name: 'first_name',
                                    type: 'string',
                                    mapping: 'employeeTable.userTable.first_name'
                                },
                                {
                                    name: 'last_name',
                                    type: 'string',
                                    mapping: 'employeeTable.userTable.last_name'
                                },*/
                            ]
                        })
                    },
                    columns: [
                        //Ext.create('Ext.grid.RowNumberer'),
                        {
                            header: 'DATE',
                            dataIndex: 'date',
                            renderer: Ext.util.Format.dateRenderer('jS F, Y'),
                            align: 'left',
                            flex: 1
                        }, {
                            header: 'IN TIME',
                            dataIndex: 'in_time',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                if (value != '') {
                                    var in_time_h = record.get('in_time_h');
                                    var in_time_m = record.get('in_time_m');
                                    var in_time_s = record.get('in_time_s');
                                    var e_period = 'AM';
                                    if (parseInt(in_time_h) > 12)
                                        e_period = 'PM';
                                    var r = in_time_h + ':' + in_time_m + ':' + in_time_s + ' ' + e_period;
                                    if (record.get('attendance') == 'L') {
                                        return '<b style="color:#FF00FF">' + r + '</b>';
                                    }
                                    return r;
                                }
                                if (record.get('attendance') == 'W') {
                                    return '<b style="color:green">WEEKEND</b>';
                                }
                                if (record.get('attendance') == 'H') {
                                    return '<b style="color:green">HOLIDAY</b>';
                                }
                                if (record.get('attendance') == 'A') {
                                    return '<b style="color:red">ABSENT</b>';
                                }
                            },
                            align: 'left',
                            flex: 1
                        }, {
                            header: 'OUT TIME',
                            dataIndex: 'punch_time',
                            align: 'left',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                if (value != '') {
                                    if (record.get('attendance') == 'L') {
                                        return '<b style="color:#FF00FF">' + value[value.length - 1] + '</b>';
                                    }
                                    //console.log(value.split('[ '));
                                    return value[value.length - 1];
                                }
                                if (record.get('attendance') == 'W') {
                                    return '<b style="color:green">WEEKEND</b>';
                                }
                                if (record.get('attendance') == 'H') {
                                    return '<b style="color:green">HOLIDAY</b>';
                                }
                                if (record.get('attendance') == 'A') {
                                    return '<b style="color:red">ABSENT</b>';
                                }
                            },
                            flex: 1
                        }, {
                            header: 'ATTENDANCE',
                            dataIndex: 'attendance',
                            align: 'left',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                if (value == 'P') {
                                    return '<b style="color:#005500">P</b>';
                                }
                                if (value == 'L') {
                                    return '<b style="color:#FF00FF">L</b>';
                                }
                                if (value == 'W') {
                                    return '<b style="color:#00AA00">W</b>';
                                }
                                if (value == 'H') {
                                    return '<b style="color:#00AA00">H</b>';
                                }
                                if (value == 'A') {
                                    return '<b style="color:#FF0000">A</b>';
                                }
                            },
                            flex: 1
                        }, {
                            header: 'PUNCH TIME',
                            dataIndex: 'punch_time',
                            align: 'left',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                if (value != '') {
                                    if (record.get('attendance') == 'L') {
                                        return '<b style="color:#FF00FF">' + value + '</b>';
                                    }
                                    return value;
                                }
                                if (record.get('attendance') == 'W') {
                                    return '<b style="color:green">WEEKEND</b>';
                                }
                                if (record.get('attendance') == 'H') {
                                    return '<b style="color:green">HOLIDAY</b>';
                                }
                                if (record.get('attendance') == 'A') {
                                    return '<b style="color:red">ABSENT</b>';
                                }
                            },
                            flex: 2
                        },
                    ]
                })
            ],
            tbar: [
                Ext.create('Ext.form.field.Number', {
                    name: 'fp_id',
                    id: 'employee_fp_id_search',
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
                                    Ext.getCmp('employee_name_search').setValue('');
                                }
                            }
                        }
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    id: 'employee_name_search',
                    name: 'name',
                    anyMatch: true,
                    allowBlank: true,
                    editable: true,
                    typeAhead: true,
                    transform: 'stateSelect',
                    forceSelection: true,
                    emptyText: 'Select Employee Name ...',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'first_name',
                    valueField: 'finger_print_id',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['finger_print_id', 'last_name'],
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
                                    Ext.getCmp('employee_fp_id_search').setValue('');
                                }
                            }
                        }
                    }
                }),
                Ext.create('Ext.form.field.Date', {
                    name: 'month_search',
                    id: 'employee_month_search',
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
                        var em;
                        if (Ext.getCmp('employee_fp_id_search').value)
                            em = Ext.getCmp('employee_fp_id_search').value;
                        else if (Ext.getCmp('employee_name_search').value)
                            em = Ext.getCmp('employee_name_search').value;
                        var ms = Ext.getCmp('employee_month_search').value;
                        if (ms) {
                            var holidayData = holidayStore.getRange();
                            var adjustmentData = adjustmentStore.getRange();
                            var holiday = [];
                            var adjustment = [];
                            for (var i = 0; i < holidayData.length; i++) {
                                if (holidayData[i].data.date.getFullYear() == ms.getFullYear()) {
                                    if (holidayData[i].data.date.getMonth() == ms.getMonth()) {
                                        holiday.push(0);
                                        holiday.push(0);
                                        holiday.push(holidayData[i].data.date.getDate());
                                    }
                                }
                            };
                            for (var i = 0; i < adjustmentData.length; i++) {
                                if (adjustmentData[i].data.date.getFullYear() == ms.getFullYear()) {
                                    if (adjustmentData[i].data.date.getMonth() == ms.getMonth()) {
                                        adjustment.push(0);
                                        adjustment.push(0);
                                        adjustment.push(adjustmentData[i].data.date.getDate());
                                    }
                                }
                            };
                            if (em && ms) {
                                Ext.getCmp('user_attendance_list_grid').getStore().load({
                                    params: {
                                        employee: em,
                                        month: ms,
                                        holiday: holiday,
                                        adjustment: adjustment,
                                    },
                                    callback: function(records, operation, success) {
                                        var cmp1 = userAttendanceSummaryPanel(records);
                                        if (Ext.getCmp('user_attendance_tab')) {
                                            if (Ext.getCmp('user_attendance_summary_panel')) {
                                                Ext.getCmp('user_attendance_tab').remove(Ext.getCmp('user_attendance_summary_panel'));
                                                Ext.getCmp('user_attendance_tab').insert(0, cmp1);
                                            } else {
                                                Ext.getCmp('user_attendance_tab').insert(0, cmp1);
                                            }
                                        }
                                        //this.up('form').getForm().findField("line").clearValue();
                                    },
                                    scope: this
                                });
                            }
                        } else {
                            Ext.MessageBox.alert('Error', 'Please select month first');
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
                    if (Ext.getCmp('user_attendance_list_grid')) {
                        Ext.getCmp('user_attendance_list_grid').getStore().load();
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
                    if (Ext.getCmp('user_attendance_list_grid')) {
                        var storeData = Ext.getCmp('user_attendance_list_grid').getStore().data.items;
                        var win = window;
                        var l = storeData.length;
                        if (l > 0) {
                            var f = new Date(storeData[0].data.date);
                            var p = new Date(storeData[l - 1].data.date);
                            var doj = new Date(storeData[l - 1].data.date_of_join);
                            var date_of_join = doj.getDate() + '<sup>' + dayPower[doj.getDate()] + '</sup> ' +
                                monthNames[doj.getMonth()] + ', ' + doj.getFullYear();
                            if (storeData[l - 1].data.date_of_join == '')
                                date_of_join = '';
                            var present = parseInt(storeData[l - 1].data.present);
                            var absent = parseInt(storeData[l - 1].data.absent);
                            var late = parseInt(storeData[l - 1].data.late);
                            var weekend = parseInt(storeData[l - 1].data.weekend);
                            var holiday = parseInt(storeData[l - 1].data.holiday);
                            var total = present + absent + late + weekend + holiday;
                            var file_name = storeData[l - 1].data.name + '_' + monthNames[p.getUTCMonth()] + '_' + p.getUTCFullYear();
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
                                'line-height: 0.7;' +
                                'align: center;' +
                                '}' +
                                'h1, h2, h4 {' +
                                'line-height: 0.5;' +
                                'text-align: center;' +
                                '}' +
                                'body {' +
                                'font-size: 11px;' +
                                'padding: 50px 80px;' +
                                '}' +
                                '</style>' +
                                '</head>' +
                                '<body>' +
                                '<h1>Fashion Flash Limited</h1>' +
                                '<h2>Monthly Individual Attendance Report</h2>' +
                                '<img src="' +
                                site_url +
                                'uploads/images/logo.png"' +
                                'style=" position:fixed; left:130px; top:60px; width:90px;' +
                                'height:55px; border:none;"/>' +
                                '<h4>' +
                                storeData[l - 1].data.name.toUpperCase() + ' | ' +
                                monthCapitalNames[p.getUTCMonth()] + ', ' +
                                p.getUTCFullYear() +
                                '</h4>' +
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<td rowspan="2" align="center">' +
                                '<b>' +
                                'EMPLOYEE ATTENDANCE REPORT- ' +
                                f.getDate() +
                                '<sup>' +
                                dayPower[f.getDate()] +
                                '</sup> ' +
                                monthCapitalNames[f.getMonth()] + ', ' +
                                f.getUTCFullYear() +
                                ' TO ' +
                                p.getDate() +
                                '<sup>' +
                                dayPower[p.getDate()] +
                                '</sup> ' +
                                monthCapitalNames[p.getMonth()] + ', ' +
                                p.getUTCFullYear() +
                                '</b>' +
                                '</td>' +
                                '</tr>' +
                                '</table>' +
                                '<table style="width:100%;">' +
                                //////////////////////ROW////////////////////////
                                '<tr>' +
                                /////////////////////COL/////////////////////////
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                'EMPLOYEE ID ' +
                                '</b>' +
                                '</td>' +
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                ': ' +
                                'JCLFFL' +
                                addLeadingZero(4, parseInt(storeData[l - 1].data.finger_print_id)) +
                                '</b>' +
                                '</td>' +
                                /////////////////////COL/////////////////////////
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                'PRESENT ' +
                                '</b>' +
                                '</td>' +
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                ': ' +
                                addLeadingZero(2, present) +
                                '</b>' +
                                '</td>' +
                                '</tr>' +
                                //////////////////////ROW////////////////////////
                                '<tr>' +
                                /////////////////////COL/////////////////////////
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                'NAME ' +
                                '</b>' +
                                '</td>' +
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                ': ' +
                                storeData[l - 1].data.name +
                                '</b>' +
                                '</td>' +
                                /////////////////////COL/////////////////////////
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                'ABSENT ' +
                                '</b>' +
                                '</td>' +
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                ': ' +
                                addLeadingZero(2, absent) +
                                '</b>' +
                                '</td>' +
                                '</tr>' +
                                //////////////////////ROW////////////////////////
                                '<tr>' +
                                /////////////////////COL/////////////////////////
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                'JOINING DATE ' +
                                '</b>' +
                                '</td>' +
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                ': ' +
                                date_of_join +
                                '</b>' +
                                '</td>' +
                                /////////////////////COL/////////////////////////
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                'LATE ' +
                                '</b>' +
                                '</td>' +
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                ': ' +
                                addLeadingZero(2, late) +
                                '</b>' +
                                '</td>' +
                                '</tr>' +
                                //////////////////////ROW////////////////////////
                                '<tr>' +
                                /////////////////////COL/////////////////////////
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                'DEPARTMENT ' +
                                '</b>' +
                                '</td>' +
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                ': ' +
                                storeData[l - 1].data.department +
                                '</b>' +
                                '</td>' +
                                /////////////////////COL/////////////////////////
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                'HOLIDAY ' +
                                '</b>' +
                                '</td>' +
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                ': ' +
                                addLeadingZero(2, holiday) +
                                '</b>' +
                                '</td>' +
                                '</tr>' +
                                //////////////////////ROW////////////////////////
                                '<tr>' +
                                /////////////////////COL/////////////////////////
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                'DESIGNATION ' +
                                '</b>' +
                                '</td>' +
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                ': ' +
                                storeData[l - 1].data.designation +
                                '</b>' +
                                '</td>' +
                                /////////////////////COL/////////////////////////
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                'WEEKEND ' +
                                '</b>' +
                                '</td>' +
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                ': ' +
                                addLeadingZero(2, weekend) +
                                '</b>' +
                                '</td>' +
                                '</tr>' +
                                //////////////////////ROW////////////////////////
                                '<tr>' +
                                /////////////////////COL/////////////////////////
                                '<td style="border: 0px solid white;">' +
                                '</td>' +
                                '<td style="border: 0px solid white;">' +
                                '</td>' +
                                /////////////////////COL/////////////////////////
                                '<td style="border: 0px solid white;">' +
                                '<b>' +
                                'TOTAL ' +
                                '</b>' +
                                '</td>' +
                                '<td style="border-left: 0px solid white;">' +
                                '<b>' +
                                ': ' +
                                addLeadingZero(2, total) +
                                '</b>' +
                                '</td>' +
                                '</tr>' +
                                '</table>' +
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<th>DATE</th>' +
                                '<th>IN TIME</th>' +
                                '<th>OUT TIME</th>' +
                                '<th>STATUS</th>' +
                                '</tr>';
                            for (var i = 0; i < storeData.length; i++) {
                                var d = new Date(storeData[i].data.punch_time);
                                var pd = new Date(storeData[i].data.date);
                                var attendance;
                                var period = 'AM';
                                var h = addLeadingZero(2, parseInt(storeData[i].data.in_time_h));
                                var m = addLeadingZero(2, parseInt(storeData[i].data.in_time_m));
                                var s = addLeadingZero(2, parseInt(storeData[i].data.in_time_s));
                                if (parseInt(h) > 12) {
                                    h -= 12;
                                    period = 'PM';
                                }
                                htmlData += '<tr>';
                                htmlData += '<td align="center">';
                                //htmlData+=addLeadingZero(2, parseInt(pd.getDate()));
                                htmlData += pd.getDate();
                                htmlData += '<sup>';
                                htmlData += dayPower[pd.getDate()];
                                htmlData += '</sup> ';
                                htmlData += monthCapitalNames[pd.getMonth()];
                                htmlData += ', ';
                                htmlData += pd.getFullYear();
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                if (storeData[i].data.attendance == 'P' || storeData[i].data.attendance == 'L')
                                    htmlData += h + ':' + m + ':' + s + ' ' + period;
                                else if (storeData[i].data.attendance == 'H')
                                    htmlData += 'HOLIDAY';
                                else if (storeData[i].data.attendance == 'W')
                                    htmlData += 'WEEKEND';
                                else if (storeData[i].data.attendance == 'A')
                                    htmlData += 'ABSENT';
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                var out_time = storeData[i].data.punch_time;
                                if (out_time != '') {
                                    var val = out_time[out_time.length - 1].split('[ ');
                                    var val = val[1].split(' ] ');
                                    var val = val[0];
                                }
                                if (storeData[i].data.attendance == 'P' || storeData[i].data.attendance == 'L')
                                    htmlData += val;
                                else if (storeData[i].data.attendance == 'H')
                                    htmlData += 'HOLIDAY';
                                else if (storeData[i].data.attendance == 'W')
                                    htmlData += 'WEEKEND';
                                else if (storeData[i].data.attendance == 'A')
                                    htmlData += 'ABSENT';
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[i].data.attendance;
                                htmlData += '</td>';
                                htmlData += '</tr>';
                            };
                            htmlData += '</table></body></html>';
                            socket.emit('CreateUserMonthlyReportPDF', htmlData, file_name).on('CreateUserMonthlyReportPDF', function(message) {
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

function userAttendanceSummaryPanel(records) {
    var data = records[records.length - 1].data;
    var p = parseInt(data.present);
    var present = '<b>:</b> ' + addLeadingZero(2, data.present) + '';
    var a = parseInt(data.absent);
    var absent = '<b>:</b> ' + addLeadingZero(2, data.absent) + '';
    var l = parseInt(data.late);
    var late = '<b>:</b> ' + addLeadingZero(2, data.late) + '';
    var w = parseInt(data.weekend);
    var weekend = '<b>:</b> ' + addLeadingZero(2, data.weekend) + '';
    var h = parseInt(data.holiday);
    var holiday = '<b>:</b> ' + addLeadingZero(2, data.holiday) + '';
    var total_day = p + a + l + w + h;
    var total_days = '<b>:</b> ' + addLeadingZero(2, total_day);
    var item_boder = false;
    var value_padding = '3 10';
    var fp_id = data.finger_print_id;
    var name = data.name;
    var email = data.email;
    var card_no = data.card_no;
    return Ext.create('Ext.panel.Panel', {
        id: 'user_attendance_summary_panel',
        width: '100%',
        layout: {
            type: 'table',
            columns: 4
        },
        padding: 20,
        border: false,
        items: [
            ///////////////////////////ROW1////////////////////////////////////
            ///////////////////////////COL1////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>PRESENT</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: present,
            },
            ///////////////////////////COL2////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>FP ID:</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: fp_id,
            },


            ///////////////////////////ROW2////////////////////////////////////
            ///////////////////////////COL1////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>ABSENT</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: absent,
            },
            ///////////////////////////COL2////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>CARD NO:</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: card_no,
            },


            ///////////////////////////ROW3////////////////////////////////////
            ///////////////////////////COL1////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>LATE</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: late,
            },
            ///////////////////////////COL2////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>NAME:</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: name,
            },


            ///////////////////////////ROW4////////////////////////////////////
            ///////////////////////////COL1////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>WEEKEND</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: weekend,
            },
            ///////////////////////////COL2////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>EMAIL:</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: email,
            },


            ///////////////////////////ROW4////////////////////////////////////
            ///////////////////////////COL1////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>HOLIDAYS</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: holiday,
            },
            ///////////////////////////COL2////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: ''
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: '',
            },


            ///////////////////////////ROW5////////////////////////////////////
            ///////////////////////////COL1////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>TOTAL</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: total_days,
            },
            ///////////////////////////COL2////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                //html:'<b>Email:</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                //html: email,
            },

        ]
    });
}