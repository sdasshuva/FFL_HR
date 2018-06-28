function changePasswordWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Change Password',
        modal: true,
        id: 'changePasswordWindow',
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                width: '100%',
                id: 'change_password_form',
                bodyPadding: 20,
                border: false,
                layout: {
                    type: 'vbox',
                    align: 'stretch' // Child items are stretched to full width
                },
                items: [
                    Ext.create('Ext.panel.Panel', {
                        id: 'current_password',
                        border: false,
                        layout: {
                            type: 'hbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        bodyPadding: 4,
                        items: [
                            Ext.create('Ext.form.field.Text', {
                                name: 'current_password',
                                id: 'current_password_field',
                                inputType: 'password',
                                fieldLabel: 'Current Password',
                                filedAlign: 'top',
                                allowBlank: false,
                                labelAlign: 'left',
                                labelWidth: 130,
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Give Current Password...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true,
                                listeners: {
                                    change: function(self, newValue, oldValue, eOpts) {
                                        var values = {};
                                        values.email = user.email;
                                        values.password = newValue;
                                        if (newValue == '') {
                                            Ext.getCmp('current_password').remove(Ext.getCmp('current_password_img'));
                                            Ext.getCmp('current_password').add(infoImage('current_password_img'));
                                            conf_curr_pass = 0;
                                        } else {
                                            if (newValue.length < 8) {
                                                Ext.getCmp('current_password').remove(Ext.getCmp('current_password_img'));
                                                Ext.getCmp('current_password').add(failImage('current_password_img'));
                                                conf_curr_pass = 0;
                                            } else {
                                                socket.emit('CheckPasswordMatch', values).on('CheckPasswordMatch', function(message) {
                                                    if (message == "success") {
                                                        Ext.getCmp('current_password').remove(Ext.getCmp('current_password_img'));
                                                        Ext.getCmp('current_password').add(successImage('current_password_img'));
                                                        conf_curr_pass = 1;
                                                    } else if (message == "error") {
                                                        Ext.getCmp('current_password').remove(Ext.getCmp('current_password_img'));
                                                        Ext.getCmp('current_password').add(failImage('current_password_img'));
                                                        conf_curr_pass = 0;
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }),
                            infoImage('current_password_img')
                        ]
                    }),
                    Ext.create('Ext.panel.Panel', {
                        border: false,
                        id: 'new_password',
                        layout: {
                            type: 'hbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        bodyPadding: 4,
                        items: [
                            Ext.create('Ext.form.field.Text', {
                                name: 'new_password',
                                id: 'new_password_field',
                                inputType: 'password',
                                fieldLabel: 'New Password',
                                filedAlign: 'top',
                                allowBlank: false,
                                labelAlign: 'left',
                                labelWidth: 130,
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Give New Password...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true,
                                listeners: {
                                    change: function(self, newValue, oldValue, eOpts) {
                                        if (newValue == '') {
                                            Ext.getCmp('new_password').remove(Ext.getCmp('new_password_img'));
                                            Ext.getCmp('new_password').add(infoImage('new_password_img'));
                                            Ext.getCmp('re_new_password_field').setValue('');
                                            conf_new_pass = 0;
                                        } else {
                                            if (newValue.length < 8) {
                                                Ext.getCmp('new_password').remove(Ext.getCmp('new_password_img'));
                                                Ext.getCmp('new_password').add(failImage('new_password_img'));
                                                Ext.getCmp('re_new_password_field').setValue('');
                                                conf_new_pass = 0;
                                            } else {
                                                Ext.getCmp('new_password').remove(Ext.getCmp('new_password_img'));
                                                Ext.getCmp('new_password').add(successImage('new_password_img'));
                                                conf_new_pass = 1;
                                            }
                                        }
                                    }
                                }
                            }),
                            infoImage('new_password_img')
                        ]
                    }),
                    Ext.create('Ext.panel.Panel', {
                        border: false,
                        id: 're_new_password',
                        layout: {
                            type: 'hbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        bodyPadding: 4,
                        items: [
                            Ext.create('Ext.form.field.Text', {
                                name: 're_new_password',
                                id: 're_new_password_field',
                                inputType: 'password',
                                fieldLabel: 'Confirm New Password',
                                filedAlign: 'top',
                                allowBlank: false,
                                labelAlign: 'left',
                                labelWidth: 130,
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Confirm New Password...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true,
                                listeners: {
                                    change: function(self, newValue, oldValue, eOpts) {
                                        if (newValue == '') {
                                            Ext.getCmp('re_new_password').remove(Ext.getCmp('re_new_password_img'));
                                            Ext.getCmp('re_new_password').add(infoImage('re_new_password_img'));
                                            conf_renew_pass = 0;
                                        } else {
                                            if (newValue == Ext.getCmp('new_password_field').value) {
                                                Ext.getCmp('re_new_password').remove(Ext.getCmp('re_new_password_img'));
                                                Ext.getCmp('re_new_password').add(successImage('re_new_password_img'));
                                                conf_renew_pass = 1;
                                            } else {
                                                Ext.getCmp('re_new_password').remove(Ext.getCmp('re_new_password_img'));
                                                Ext.getCmp('re_new_password').add(failImage('re_new_password_img'));
                                                conf_renew_pass = 0;
                                            }
                                        }
                                    }
                                }
                            }),
                            infoImage('re_new_password_img')
                        ]
                    }),
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
                        var win = this.up('.window');
                        var values = {};
                        values.email = user.email;
                        values.password = Ext.getCmp('re_new_password_field').value;
                        var panel = this.up('form'),
                            form = panel.getForm();
                        if (form.isValid()) {
                            if (conf_curr_pass == 1) {
                                if (conf_new_pass == 1) {
                                    if (conf_renew_pass == 1) {
                                        socket.emit('ChangeUserPassword', values).on('ChangeUserPassword', function(message) {
                                            if (message == "success") {
                                                Ext.MessageBox.alert('success', 'Successfully password changed');
                                                win.close();
                                            } else {
                                                Ext.MessageBox.alert('Error', 'Something went wrong while changing password. Please try again.');
                                            }
                                        });
                                    } else {
                                        Ext.MessageBox.alert('Password Unmatched', 'Please confirm password correctly');
                                    }
                                } else {
                                    Ext.MessageBox.alert('Low Password', 'Please give minimum 8 character');
                                }
                            } else {
                                Ext.MessageBox.alert('Wrong Password', 'Please give the corrent password');
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