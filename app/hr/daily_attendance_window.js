function dailyAttendanceWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Daily Attendance Report',
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
                        id: 'dailyAttendanceReportDate',
                        fieldLabel: 'Report Date:',
                        filedAlign: 'top',
                        allowBlank: false,
                        editable: false,
                        labelAlign: 'left',
                        labelStyle: 'text-align:left;border solid 1px white;',
                        labelSeparator: '',
                        emptyText: 'Give Date...',
                        labelClsExtra: 'some-class',
                        fieldStyle: 'text-align: left;font-size: 12px;',
                        autoScroll: true
                    })
                    //newDateField('Date:', 'date', 'dailyAttendanceReportDate')
                ],
                buttons: [{
                    text: 'SEND MAIL',
                    icon: '/uploads/icons/mail.png',
                    formBind: true,
                    handler: function() {
                        var panel = this.up('form'),
                            form = panel.getForm(),
                            values = form.getValues();
                        if (form.isValid()) {
                            values.date = (values.date != '') ? new Date(values.date) : new Date();
                            values.file_name = values.date.getDate() + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getUTCFullYear() + '_Daily_Report';
                            values.filePath = site_url + 'uploads/pdf/' + values.file_name + '.pdf';
                            values.mail = true;
                            values.downloadSuccess = true;
                            values.mailSuccess = true;
                            if (tab_panel) {
                                panel.setLoading(true);
                                socket.emit('DownloadDailyAttendanceReportPDF', values).on('DownloadDailyAttendanceReportPDF', function(r, v) {
                                    if (r == 'success' && values.downloadSuccess) {
                                        values.downloadSuccess = false;
                                        socket.emit('SendDailyAttendanceReport', values, v).on('SendDailyAttendanceReport', function(r) {
                                            if (r == 'success' && values.mailSuccess) {
                                                values.mailSuccess = false;
                                                socket.emit('SendIndividualDayAttendance', 'dd').on('SendIndividualDayAttendance', function(message) {
                                                    panel.setLoading(false);
                                                    Ext.MessageBox.alert({
                                                        title: 'Mail Sending Successful',
                                                        buttons: Ext.MessageBox.CANCEL,
                                                        msg: 'Mail Successfully Sent',
                                                        animateTarget: 'mb4',
                                                    });
                                                });
                                            }
                                            panel.setLoading(false);
                                        });
                                    } else {
                                        Ext.MessageBox.alert({
                                            title: 'ERROR',
                                            buttons: Ext.MessageBox.CANCEL,
                                            msg: 'Something Went Wrong',
                                            animateTarget: 'mb4',
                                        });
                                        panel.setLoading(false);
                                    }
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
                    }
                }, {
                    text: 'DOWNLOAD',
                    icon: '/uploads/icons/download.png',
                    formBind: true,
                    handler: function() {
                        var panel = this.up('form'),
                            form = panel.getForm(),
                            values = form.getValues();
                        if (form.isValid()) {
                            values.date = (values.date != '') ? new Date(values.date) : new Date();
                            values.file_name = values.date.getDate() + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getUTCFullYear() + '_Daily_Report';
                            values.mail = false;
                            values.downloadSuccess = true;
                            if (tab_panel) {
                                panel.setLoading(true);
                                socket.emit('DownloadDailyAttendanceReportPDF', values).on('DownloadDailyAttendanceReportPDF', function(r, v) {
                                    if (r == 'success' && values.downloadSuccess) {
                                        values.downloadSuccess = false;
                                        Ext.MessageBox.alert({
                                            title: 'Daily Attendance Download',
                                            buttons: Ext.MessageBox.CANCEL,
                                            msg: 'Please <a href="/uploads/pdf/' + values.file_name + '.pdf" download>click here</a> to confirm the file download',
                                            animateTarget: 'mb4',
                                            icon: Ext.MessageBox.QUESTION
                                        });
                                        panel.setLoading(false);
                                    } else {
                                        Ext.MessageBox.alert({
                                            title: 'ERROR',
                                            buttons: Ext.MessageBox.CANCEL,
                                            msg: 'Something Went Wrong',
                                            animateTarget: 'mb4',
                                        });
                                        panel.setLoading(false);
                                    }
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
                    }
                }, {
                    text: 'CLOSE',
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