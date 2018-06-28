function accounts() {

    return Ext.create('Ext.tree.Panel', {
        region: 'north',
        title: 'Accounts Section',
        icon: '/uploads/icons/accounts.png',
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
                text: 'Bonus Statement',
                leaf: true
            },
            {
                text: 'Bonus Bank Statement',
                leaf: true
            },
            {
                'text': 'Input List',
                'leaf': true,
            },
            {
                text: 'Import Export File',
                expanded: true,
                children: [{
                    text: 'Import File',
                    leaf: true
                }, {
                    text: 'Export File',
                    leaf: true
                }, ]
            },
            {
                text: 'Salary',
                expanded: true,
                children: [{
                    text: 'Salary Statement',
                    leaf: true
                }, {
                    text: 'Bank Statement',
                    leaf: true
                }, {
                    text: 'Salary Bank Statement',
                    leaf: true
                }, {
                    text: 'Salary List',
                    leaf: true
                }, ]
            },
            {
                text: 'Employee',
                expanded: true,
                children: [{
                    text: 'Employee Details',
                    leaf: true
                }, ]
            }

        }
    }).show();
}