function employeeInputFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Employee Profile',
        modal: true,
        id: 'employeeInputFormWindow',
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                id: 'employeeInputForm',
                width: '100%',
                bodyPadding: 20,
                border: false,
                layout: {
                    type: 'vbox',
                    align: 'stretch' // Child items are stretched to full width
                },
                items: [
                    employeeNameTextField(),
                    employeePhotoFileField(),
                    employeeDesignationCombo(),
                    employeeDepartmentCombo(),
                    employeeWorkingPlaceCombo(),
                    employeeTypeCombo(),
                    employeeDateOfBirth(),
                    employeeDateOfJoin(),
                    employeeDateOfRelease()
                ],
                buttons: [{
                    text: 'Reset',
                    handler: function() {
                        this.up('form').getForm().reset();
                    }
                }, {
                    text: 'Submit',
                    id: 'employeeInputFormSubmitButton',
                    handler: function() {
                        var panel = this.up('form'),
                            form = panel.getForm(),
                            filefield = panel.query('filefield')[0],
                            values = form.getValues();
                        if (form.isValid()) {
                            form.submit({
                                url: '/CreateEmployee',
                                waitMsg: 'Uploading your file...',
                                success: function(fp, o) {
                                    msg('Success', 'Processed file "' + o.result.file + '" on the server');
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

function employeeDateOfRelease() {
    return Ext.create('Ext.form.field.Date', {
        name: 'date_of_release',
        id: 'employee_date_of_release_input_form_date_field',
        fieldLabel: 'Date of Release',
        filedAlign: 'top',
        allowBlank: true,
        editable: false,
        width: 300,
        labelWidth: 120,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Date of Release...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
}

function employeeDateOfJoin() {
    return Ext.create('Ext.form.field.Date', {
        name: 'date_of_join',
        id: 'employee_date_of_join_input_form_date_field',
        fieldLabel: 'Date of Join',
        filedAlign: 'top',
        allowBlank: true,
        editable: false,
        width: 300,
        labelWidth: 120,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Date of Join...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
}

function employeeDateOfBirth() {
    return Ext.create('Ext.form.field.Date', {
        name: 'date_of_birth',
        id: 'employee_date_of_birth_input_form_date_field',
        fieldLabel: 'Date of Birth',
        filedAlign: 'top',
        allowBlank: true,
        editable: false,
        width: 300,
        labelWidth: 120,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Date of Birth...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
}

function employeeTypeCombo() {
    return Ext.create('Ext.form.ComboBox', {
        id: 'employee_type_input_form_combo_box',
        fieldLabel: 'Employee Type',
        name: 'employee_type',
        anyMatch: true,
        typeAhead: true,
        transform: 'stateSelect',
        forceSelection: true,
        allowBlank: true,
        editable: false,
        width: 300,
        labelWidth: 120,
        labelAlign: 'left',
        labelSeparator: '',
        emptyText: 'Select Employee Type ...',
        labelClsExtra: 'some-class',
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
                url: '/employee_type'
            },
            autoLoad: true,
            autoSync: true
        },
        listeners: {
            change: {
                fn: function(combo, value) {
                    //console.log(value)
                }
            }
        }
    });
}

function employeeWorkingPlaceCombo() {
    return Ext.create('Ext.form.ComboBox', {
        id: 'employee_working_place_input_form_combo_box',
        fieldLabel: 'Working Place',
        name: 'working_place',
        anyMatch: true,
        typeAhead: true,
        transform: 'stateSelect',
        forceSelection: true,
        allowBlank: true,
        editable: false,
        width: 300,
        labelWidth: 120,
        labelAlign: 'left',
        labelSeparator: '',
        emptyText: 'Select Employee Department ...',
        labelClsExtra: 'some-class',
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
                url: '/working_place'
            },
            autoLoad: true,
            autoSync: true
        },
        listeners: {
            change: {
                fn: function(combo, value) {
                    //console.log(value)
                }
            }
        }
    });
}

function employeePhotoFileField() {
    return Ext.create('Ext.form.field.File', {
        name: 'photo',
        id: 'employee_photo_input_form_file_field',
        fieldLabel: 'Photo' +
            '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
        filedAlign: 'top',
        allowBlank: false,
        width: 300,
        labelWidth: 120,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Photo...',
        clearOnSubmit: false,
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        buttonText: 'B',
        buttonConfig: {
            //'background-image': 'url(uploads/images/logo.png) !important',
        },
        /*listeners: {
            change: function (filefield, value) {
                'use strict';
                var newValue = value.replace(/(^.*(\\|\/))?/, "");
                filefield.setRawValue(newValue);
                console.log(filefield);
                console.log(value);
            }
        },*/
        //draggable: true,
        autoScroll: true
    });
}

function employeeNameTextField() {
    return Ext.create('Ext.form.field.Text', {
        name: 'name',
        id: 'employee_name_input_form_text_field',
        fieldLabel: 'Employee Name' +
            '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
        filedAlign: 'top',
        allowBlank: false,
        width: 300,
        labelWidth: 120,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Employee Name...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
}