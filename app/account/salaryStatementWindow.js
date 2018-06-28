function salaryStatementWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Salary Statement Report',
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
                        name: 'month_search',
                        id: 'monthly_salary_search',
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
                    //newDateField('Date:', 'date', 'dailyAttendanceReportDate')
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
                            values.date = (values.month_search != '') ? new Date(values.month_search) : new Date();
                            var tDate = new Date();
                            values.date.setDate(10);
                            values.file_name = tDate.getDate() + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getUTCFullYear() + '_Salary_Statement_Report';
                            if (tab_panel) {
                                panel.setLoading(true);
                                // socket.emit('DownloadSalaryStatementReport', values).on('DownloadSalaryStatementReport', function (r) {
                                //   Ext.MessageBox.alert({
                                //     title:'Salary Statement Report Download',
                                //     buttons: Ext.MessageBox.CANCEL,
                                //     msg: 'Please <a href="/uploads/pdf/'+values.file_name+'.pdf" download>click here</a> to confirm the file download',
                                //     animateTarget: 'mb4',
                                //     icon: Ext.MessageBox.QUESTION
                                //   });
                                //   panel.setLoading(false);
                                // });
                                socket.emit('DownloadSalaryStatementReportV2', values).on('DownloadSalaryStatementReportV2', function(r) {
                                    Ext.MessageBox.alert({
                                        title: 'Salary Statement Report Download',
                                        buttons: Ext.MessageBox.CANCEL,
                                        msg: 'Please <a href="/uploads/pdf/' + values.file_name + '.pdf" download>click here</a> to confirm the file download',
                                        animateTarget: 'mb4',
                                        icon: Ext.MessageBox.QUESTION
                                    });
                                    panel.setLoading(false);
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