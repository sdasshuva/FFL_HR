function hr() {
    return Ext.create('Ext.tree.Panel', {
        region: 'north',
        title: 'Human Resourse',
        icon: '/uploads/icons/form.png',
        collapsible: true,
        collapsed: false,
        autoScroll: true,
        rootVisible: false,
        border: false,
        listeners: {
            itemclick: function(s, r) {
                navigation_event(r.data.text);
            },
        },
        root: {
            text: 'Root',
            expanded: true,
            children: {
                text: 'Upload File',
                expanded: false,
                children: [{
                    text: 'Machine Dat File',
                    leaf: true
                }, ]

            },
            {
                text: 'Input List',
                expanded: false,
                children: [{
                    text: 'Address List',
                    leaf: true
                }, {
                    text: 'Address Type List',
                    leaf: true
                }, {
                    text: 'Blood Group List',
                    leaf: true
                }, {
                    text: 'District List',
                    leaf: true
                }, {
                    text: 'Department List',
                    leaf: true
                }, {
                    text: 'Designation List',
                    leaf: true
                }, {
                    text: 'Duty Shift List',
                    leaf: true
                }, {
                    text: 'Employee Type',
                    leaf: true
                }, {
                    text: 'Education List',
                    leaf: true
                }, {
                    text: 'Experience List',
                    leaf: true
                }, {
                    text: 'Holiday List',
                    leaf: true
                }, {
                    text: 'Adjustment List',
                    leaf: true
                }, {
                    text: 'Leave Type List',
                    leaf: true
                }, {
                    text: 'Post Office List',
                    leaf: true
                }, {
                    text: 'Police Station List',
                    leaf: true
                }, {
                    text: 'Referer List',
                    leaf: true
                }, {
                    text: 'Religion List',
                    leaf: true
                }, {
                    text: 'Village List',
                    leaf: true
                }, {
                    text: 'Working Place List',
                    leaf: true
                }, ]
            },
            {
                text: 'Employee',
                expanded: true,
                children: [{
                    text: 'Employee List',
                    leaf: true
                }, ]
            },
            {
                text: 'Mail Client',
                expanded: true,
                children: [{
                    text: 'Mail List',
                    leaf: true
                }]
            },
            {
                text: 'Report',
                expanded: true,
                children: {
                    text: 'Daily Attendance',
                    leaf: true
                },
                {
                    text: 'User Attendance',
                    leaf: true
                },
                {
                    text: 'Daily Report',
                    leaf: true
                },
                {
                    text: 'Attendance Report',
                    leaf: true
                },
                {
                    text: 'Monthly Report',
                    leaf: true
                },
                {
                    text: 'Leave Report',
                    leaf: true
                }
            }
        }
    }).show();
}