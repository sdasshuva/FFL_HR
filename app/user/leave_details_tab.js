function leaveDetailsTab() {
    if (Ext.getCmp('leave_details_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("leave_details_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Leave Details',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            id: 'leave_details_tab',
            autoScroll: true,
            listeners: {
                afterrender: function(self, eOpts) {
                    Ext.getStore('leaveTypeStore').load({
                        callback: function(records, operation, success) {
                            if (success) {
                                Ext.getCmp('leave_details_tab').removeAll();
                                for (var i = 0; i < records.length; i++) {
                                    Ext.getCmp('leave_details_tab').add(userLeaveTypePanel(records[i].data));
                                };
                            } else {
                                Ext.MessageBox.alert('Error', 'Something gone wrong while loading Leave Data');
                            }
                        }
                    })
                }
            },
            items: [],
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function userLeaveTypePanel(rec) {
    return Ext.create('Ext.panel.Panel', {
        title: rec.name,
        id: 'user_leave_type_panel' + rec.id,
        bodyStyle: {
            "background-color": "#DEECFD"
        },
        bodyPadding: 20,
        layout: {
            type: 'hbox',
            align: 'stretch',
            pack: 'start',
        },
        listeners: {
            afterrender: function(self, eOpts) {
                var userLeaveStore = Ext.create('Ext.data.Store', {
                    storeId: 'userLeaveStore',
                    proxy: {
                        type: 'ajax',
                        url: '/leave/' + employeeStore.getRange()[0].data.id + '/' + rec.id
                    },
                    autoLoad: true,
                    autoSync: true,
                    model: Ext.define('LEAVE_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'employee',
                            type: 'int',
                        }, {
                            name: 'leave_type',
                            type: 'int'
                        }, {
                            name: 'date',
                            type: 'date'
                        }, {
                            name: 'status',
                            type: 'int'
                        }]
                    })
                });
                Ext.getStore('userLeaveStore').load({
                    callback: function(records, operation, success) {
                        if (success) {
                            if (rec.id == 1 || rec.id == 2) {
                                var leave_total = leaveAmount(rec.amount, employeeStore.getRange()[0].data.date_of_join);
                                var leave_taken = records.length;
                                var cmp1 = Ext.create('Ext.panel.Panel', {
                                    bodyStyle: {
                                        "background-color": "#DEECFD"
                                    },
                                    border: false,
                                    html: '<p><b>Total Leave:</b> ' + leave_total + '</p>' +
                                        '<p><b>Leave Taken:</b> ' + leave_taken + '</p>' +
                                        '<p><b>Leave Left:</b> ' + (leave_total - leave_taken) + '</p>'
                                });
                                Ext.getCmp('user_leave_type_panel' + rec.id).add(cmp1);
                            } else {
                                var cmp1 = Ext.create('Ext.panel.Panel', {
                                    bodyStyle: {
                                        "background-color": "#DEECFD"
                                    },
                                    border: false,
                                    html: '<h2 style="color:red;">Contact With The Authority</h2>'
                                });
                                Ext.getCmp('user_leave_type_panel' + rec.id).add(cmp1);
                            }
                        } else {
                            Ext.MessageBox.alert('Error', 'Something gone wrong while loading Leave Data');
                        }
                    }
                })
            }
        },
        items: []
    })
}