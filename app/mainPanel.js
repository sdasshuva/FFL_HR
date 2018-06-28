Ext.tip.QuickTipManager.init();

var UNMARRIED = 0;
var MARRIED = 1;

var conf_curr_pass = 0;
var conf_new_pass = 0;
var conf_renew_pass = 0;

var site_url = window.location.href;
var ac_lvl = parseInt(user.access_level);
var mthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var mthCPNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
var monthCapitalNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

var dayPower = ["",
    "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th",
    "th", "th", "th", "th", "th", "th", "th", "th", "th", "th",
    "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"
];
var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var celEditPlugin = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 2
});

function fileDownload(location, name) {
    fileLocation = location + name + '.pdf';
    window.open(fileLocation);
}

Number.prototype.formatMoney = function(c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function getDaysBetweenDates(d0, d1) {

    var msPerDay = 8.64e7;

    // Copy dates so don't mess them up
    var x0 = new Date(d0);
    var x1 = new Date(d1);

    // Set to noon - avoid DST errors
    x0.setHours(12, 0, 0);
    x1.setHours(12, 0, 0);

    // Round to remove daylight saving errors
    return Math.round((x1 - x0) / msPerDay);
}

function addLeadingZero(length, str) {
    var returnString = str.toString();
    var l = length - returnString.length;
    var zero = '';
    while (l > 0) {
        zero += '0';
        l--
    }
    return zero + returnString;
}

function findWeekendsCount(inDate, duration, weekDay) {
    var tmpDate = new Date(inDate);
    var weekDayCount = 0;
    var i;
    for (i = 0; i < parseInt(duration); i++) {
        tmpDate.setDate(tmpDate.getDate() + 1);
        if (tmpDate.getDay() == parseInt(weekDay)) {
            weekDayCount++;
        }
    }
    if (weekDayCount > 0) {
        var j;
        for (j = 0; j < weekDayCount; j++) {
            tmpDate.setDate(tmpDate.getDate() + 1);
            if (tmpDate.getDay() == parseInt(weekDay)) {
                weekDayCount++;
            }
        }
    }
    return weekDayCount + 4;
}

function findOutputDate(inDate, duration, weekDay) {
    var input = new Date(inDate);
    var tmpDate = new Date(inDate);
    var weekDayCount = 0;
    var i;
    for (i = 0; i < parseInt(duration); i++) {
        tmpDate.setDate(tmpDate.getDate() + 1);
        if (tmpDate.getDay() == parseInt(weekDay)) {
            weekDayCount++;
        }
    }
    if (weekDayCount > 0) {
        var j;
        for (j = 0; j < weekDayCount; j++) {
            tmpDate.setDate(tmpDate.getDate() + 1);
            if (tmpDate.getDay() == parseInt(weekDay)) {
                weekDayCount++;
            }
        }
    }
    var durations = input.getDate() + parseInt(duration) + weekDayCount + 4;
    input.setDate(durations);
    var outDate = input.getDate();
    var outMonth = input.getMonth() + 1;
    var outYear = input.getFullYear();
    return outMonth + "/" + outDate + "/" + outYear;
}

var changingImage = Ext.create('Ext.Img', {
    src: '/uploads/images/logo.png',
    height: 30,
    width: 50,
    margins: '8 10 0 0'
});

function passChangeImage(a, b) {
    return Ext.create('Ext.Img', {
        src: '/uploads/icons/' + b + '.png',
        id: a,
        height: 10,
        width: 15,
        border: false,
        margins: 4
    });
}

function infoImage(a) {
    return Ext.create('Ext.Img', {
        src: '/uploads/icons/warning.png',
        id: a,
        height: 10,
        width: 15,
        border: false,
        margins: 4
    });
}

function successImage(a) {
    return Ext.create('Ext.Img', {
        src: '/uploads/icons/tick_green.png',
        id: a,
        height: 10,
        width: 15,
        border: false,
        margins: 4
    });
}

function failImage(a) {
    return Ext.create('Ext.Img', {
        src: '/uploads/icons/erase.png',
        id: a,
        height: 10,
        width: 15,
        border: false,
        margins: 4
    });
}

function leaveAmount(a, d) {
    var amount = parseInt(a);
    var doj = new Date(d);
    var date = new Date();
    doj = date;
    var last_date = new Date(doj.getUTCFullYear() + '-' + 12 + '-' + 31);
    if (doj.getUTCFullYear() == date.getUTCFullYear()) {
        var days = doj.getFullYear() % 4 == 0 ? 366 : 365;
        var rest_days = Math.round((last_date - doj) / (1000 * 60 * 60 * 24)) + 1;
        return Math.round((amount * rest_days) / days);
    } else {
        return amount;
    }
}



//===============================================================//
//======================Header Panel============================//
//=============================================================//
var header_panel = Ext.create('Ext.panel.Panel', {
    region: 'north',
    layout: {
        type: 'hbox'
    },
    listeners: {
        afterrender: function(self, eOpts) {
            //Ext.getCmp('toolMenu').menu.add(dexT);
            Ext.getCmp('toolMenu').setMenu({
                items: [{
                    text: 'Calculator',
                    icon: '/uploads/icons/calculator.png',
                    border: 2,
                    style: {
                        borderColor: 'black',
                        borderStyle: 'solid'
                    },
                    handler: function() {
                        ripsCalculator()
                    }
                }]
            })
        }
    },
    bbar: [
        changingImage, {
            xtype: 'tbtext',
            text: "<h2>FFL HR & Payroll System</h2>"
        },
        '->', {
            text: '<b>TOOLS</b>',
            id: 'toolMenu',
            xtype: 'button',
            icon: '/uploads/icons/tools.png',
            border: 2,
            style: {
                borderColor: 'black',
                borderStyle: 'solid'
            },
            //menu: []
        }, {
            icon: '/uploads/icons/user.png',
            border: 0,
            iconCls: 'add',
        }, {
            xtype: 'tbtext',
            text: user.email
        }, {
            text: '<b style="color: red">Sign Out</b>',
            icon: '/uploads/icons/log_out.png',
            iconCls: 'add',
            name: 'sign_out',
            tooltip: 'Sign Out',
            border: 2,
            style: {
                borderColor: 'red',
                borderStyle: 'solid'
            },
            handler: function() {
                window.location.href = site_url + 'signout';
            }
        },
    ],
    autoHeight: true,
    border: false
});

var footer_panel = Ext.create('Ext.toolbar.Toolbar', {
    region: 'south',
    border: false,
    items: [{
            xtype: 'tbtext',
            text: '<b><i>Developed By M.A.K. Ripon (Email: ripon@fashionflashltd.com, Contact: +880 168 0800 291)</i></b>'
        },
        '->', {
            xtype: 'tbtext',
            text: '<b><i>©2016 Fashion Flash LTD. All rights reserved</i></b>'
        },
    ],
});


function ripsCalculator() {
    var ripsValue = '0';
    var tmpValue = '0';
    return Ext.create('Ext.window.Window', {
        title: 'RIPS CALCULATOR',
        modal: true,
        layout: {
            type: 'vbox'
        },
        resizable: false,
        items: [{
            xtype: 'textfield',
            id: 'ripsCalculatorMonitor',
            width: 200,
            height: 40,
            anchor: '96%',
            editable: true,
            border: false,
            allowBlank: true,
            fieldStyle: 'text-align: right;font-weight: bold;font-size: 18px;',
            value: ripsValue,
        }, {
            xtype: 'panel',
            width: 200,
            height: 40,
            border: false,
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'button',
                text: '<big><big><b>MC</b></big></big>',
                style: {
                    marginBottom: '30px'
                },
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            //ripsValue+=;
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>MR</b></big></big>',
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>MS</b></big></big>',
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>M+</b></big></big>',
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>M-</b></big></big>',
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, ]
        }, {
            xtype: 'panel',
            width: 200,
            height: 40,
            border: false,
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'button',
                text: '<big><big><b><=</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue = ripsValue.slice(0, -1);
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>CE</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue = '0';
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>C</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue = '0';
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>+-</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue += '+-';
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>^/</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue += '^/';
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, ]
        }, {
            xtype: 'panel',
            width: 200,
            height: 40,
            border: false,
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'button',
                text: '<big><big><b>7</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue += '7';
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>8</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue += '8';
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>9</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue += '9';
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>/</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue += '/';
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>%</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue += '%';
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, ]
        }, {
            xtype: 'panel',
            width: 200,
            height: 40,
            border: false,
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'button',
                text: '<big><big><b>4</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue += '4';
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>5</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue += '5';
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>6</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue += '6';
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>*</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue += '*';
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, {
                xtype: 'button',
                text: '<big><big><b>1/x</b></big></big>',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {
                            ripsValue += '1/x';
                            Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                        }
                    },
                },
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                border: true,
            }, ]
        }, {
            xtype: 'panel',
            width: 200,
            height: 80,
            border: false,
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'panel',
                width: 160,
                height: 80,
                border: false,
                layout: {
                    type: 'vbox'
                },
                items: [{
                    xtype: 'panel',
                    width: 160,
                    height: 40,
                    border: false,
                    layout: {
                        type: 'hbox'
                    },
                    items: [{
                        xtype: 'button',
                        text: '<big><big><b>1</b></big></big>',
                        listeners: {
                            click: {
                                element: 'el',
                                fn: function() {
                                    ripsValue += '1';
                                    Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                                }
                            },
                        },
                        padding: 0,
                        margin: 0,
                        width: 40,
                        height: 40,
                        border: true,
                    }, {
                        xtype: 'button',
                        text: '<big><big><b>2</b></big></big>',
                        listeners: {
                            click: {
                                element: 'el',
                                fn: function() {
                                    ripsValue += '2';
                                    Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                                }
                            },
                        },
                        padding: 0,
                        margin: 0,
                        width: 40,
                        height: 40,
                        border: true,
                    }, {
                        xtype: 'button',
                        text: '<big><big><b>3</b></big></big>',
                        listeners: {
                            click: {
                                element: 'el',
                                fn: function() {
                                    ripsValue += '3';
                                    Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                                }
                            },
                        },
                        padding: 0,
                        margin: 0,
                        width: 40,
                        height: 40,
                        border: true,
                    }, {
                        xtype: 'button',
                        text: '<big><big><b>-</b></big></big>',
                        listeners: {
                            click: {
                                element: 'el',
                                fn: function() {
                                    ripsValue += '-';
                                    Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                                }
                            },
                        },
                        padding: 0,
                        margin: 0,
                        width: 40,
                        height: 40,
                        border: true,
                    }, {
                        xtype: 'button',
                        text: '<big><big><big><b>=</b></big></big></big>',
                        listeners: {
                            click: {
                                element: 'el',
                                fn: function() {
                                    ripsValue += '=';
                                    Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                                }
                            },
                        },
                        padding: 0,
                        margin: 0,
                        width: 40,
                        height: 80,
                        border: true,
                    }, ]
                }, {
                    xtype: 'panel',
                    width: 160,
                    height: 40,
                    border: false,
                    layout: {
                        type: 'hbox'
                    },
                    items: [{
                        xtype: 'button',
                        text: '<big><big><b>0</b></big></big>',
                        listeners: {
                            click: {
                                element: 'el',
                                fn: function() {
                                    ripsValue += '0';
                                    Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                                }
                            },
                        },
                        padding: 0,
                        margin: 0,
                        width: 80,
                        height: 40,
                        border: true,
                    }, {
                        xtype: 'button',
                        text: '<big><big><b>.</b></big></big>',
                        listeners: {
                            click: {
                                element: 'el',
                                fn: function() {
                                    ripsValue += '.';
                                    Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                                }
                            },
                        },
                        padding: 0,
                        margin: 0,
                        width: 40,
                        height: 40,
                        border: true,
                    }, {
                        xtype: 'button',
                        text: '<big><big><b>+</b></big></big>',
                        listeners: {
                            click: {
                                element: 'el',
                                fn: function() {
                                    ripsValue += '+';
                                    Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                                }
                            },
                        },
                        padding: 0,
                        margin: 0,
                        width: 40,
                        height: 40,
                        border: true,
                    }, ]
                }, ]
            }, {
                xtype: 'panel',
                width: 40,
                height: 80,
                border: false,
                layout: {
                    type: 'hbox'
                },
                items: [{
                    xtype: 'button',
                    text: '<big><big><big><b>=</b></big></big></big>',
                    listeners: {
                        click: {
                            element: 'el',
                            fn: function() {
                                ripsValue += '=';
                                Ext.getCmp('ripsCalculatorMonitor').setValue(ripsValue);
                            }
                        },
                    },
                    padding: 0,
                    margin: 0,
                    width: 40,
                    height: 80,
                    border: true,
                }, ]
            }, ]
        }, ]
    }).show();
}

var tab_panel = Ext.create('Ext.tab.Panel', {
    region: 'center',
    layout: 'border',
    bodyStyle: {
        color: '#000000',
        //backgroundImage: 'url(/uploads/soltech_needle_fullscreen.png)',
        //backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
    },
    id: 'tab_panel',
    items: []
});


var navigation_panel = {
    region: 'west',
    title: 'Navigation',
    id: 'navigation_panel',
    icon: '/uploads/icons/navigation.png',
    width: 200,
    split: true,
    collapsible: true,
    collapsed: false,
    floatable: false,
    layout: 'accordion',
    layoutConfig: {
        titleCollapse: false,
        animate: true,
        activeOnTop: true
    },
    items: [],
    listeners: {
        afterrender: function(self, eOpts) {
            if (ac_lvl == 0 || ac_lvl == 1) {
                Ext.getCmp('navigation_panel').add(hr());
            } else if (ac_lvl > 200 && ac_lvl < 300) {
                Ext.getCmp('navigation_panel').add(hr());
            }
            if (ac_lvl == 101 || ac_lvl == 0 || ac_lvl == 1) {
                Ext.getCmp('navigation_panel').add(accounts());
            }
            if (ac_lvl > 101 && ac_lvl < 200) {
                Ext.getCmp('navigation_panel').add(accounts());
            }
            Ext.getCmp('navigation_panel').add(userPanel());
        }
    }
};

function userPanel() {
    return Ext.create('Ext.tree.Panel', {
        region: 'north',
        title: 'User Panel',
        icon: '/uploads/icons/user_panel.png',
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
                text: 'Personal',
                expanded: true,
                children: [{
                    text: 'Change Password',
                    leaf: true
                }, {
                    text: 'User Profile',
                    leaf: true
                }, ],
                {
                    text: 'Attendance',
                    expanded: true,
                    children: [{
                        text: 'Monthly Attendance',
                        leaf: true
                    }, {
                        text: 'Leave Details',
                        leaf: true
                    }, ]
                }
            }
        }
    }).show();
}



function navigation_event(cmd) {
    switch (cmd) {
        /***    Dashboard Start      ***/
        case "Dashboard":
            //dashboardTab();
            break;
            /***    Dashboard End        ***/
            /***    MAIL CLIENT START      ***/
        case "Mail List":
            mailListTab();
            break;
            /***    MAIL CLIENT END      ***/
            /***    ITEM LIST Start      ***/
        case "Address List":
            addressListTab();
            break;
        case "Address Type List":
            addressTypeTab();
            break;
        case "Village List":
            villageTab();
            break;
        case "Post Office List":
            postOfficeTab();
            break;
        case "Police Station List":
            policeStationTab();
            break;
        case "District List":
            districtTab();
            break;
        case "Department List":
            departmentTab();
            break;
        case "Designation List":
            designationTab();
            break;
        case "Blood Group List":
            bloodGroupTab();
            break;
        case "Duty Shift List":
            dutyShiftTab();
            break;
        case "Employee Type":
            employeeTypeTab();
            break;
        case "Education List":
            educationTab();
            break;
        case "Experience List":
            experienceTab();
            break;
            // ========function handler==========
        case "Holiday List":
            holidayTab();
            break;
        case "Adjustment List":
            adjustmentTab();
            break;
        case "Referer List":
            refererTab();
            break;
        case "Religion List":
            religionTab();
            break;
        case "Working Place List":
            workingPlaceTab();
            break;
        case "Leave Type List":
            leaveTypeTab();
            break;
        case "Payment Type":
            paymentTypeTab();
            break;
            /***    ITEM LIST End        ***/
            /***    HR Start      ***/
        case "Employee List":
            employeeListTab();
            break;
        case "User List":
            userTab();
            break;
            /***    HR End        ***/
            /***    Input Form Window Start      ***/
        case "Machine Dat File":
            userListFileFormWindow();
            break;
        case "Archive Txt File":
            archiveTxtFileFormWindow();
            break;
            /***    Input Form Window End        ***/
            /***    Report Start      ***/
        case "Daily Attendance":
            dailyAttendanceWindow();
            break;
        case "Department Attendance":
            departmentAttendanceTab();
            break;
        case "User Attendance":
            userAttendanceTab();
            break;
        case "Daily Report":
            dailyReportTab();
            break;
            // =========================================================
        case "Attendance Report":
            attendanceReportTab();
            break;
        case "Monthly Report":
            monthlyReportWindow();
            break;
        case "Leave Report":
            leaveReportTab();
            break;
            /***    Report End          ***/
            /***    Personal Start      ***/
        case "Change Password":
            changePasswordWindow();
            break;
        case "User Profile":
            userProfileTab();
            break;
            /***    Personal End        ***/
            /***    Attendance Start      ***/
        case "Monthly Attendance":
            monthlyAttendanceTab();
            break;
        case "Leave Details":
            leaveDetailsTab();
            break;
            /***    Attendance End        ***/
            /***    Accounts Start      ***/
        case "Employee Details":
            //employeeListTab();
            employeeDetailsListTab();
            break;
            /***    Salary Start      ***/
        case "Salary Statement":
            salaryStatementWindow();
            //salaryStatementTab();
            break;
        case "Bank Statement":
            bankStatementTab();
            break;
        case "Salary Bank Statement":
            salaryBankStatementWindow();
            //salaryBankStatementTab();
            break;
        case "Salary List":
            salaryTab();
            break;
            /***    Salary End        ***/
            /***    Others Start      ***/
        case "Bonus Statement":
            bonusStatementWindow();
            break;
        case "Bonus Bank Statement":
            bonusBankStatementWindow();
            break;
            /***    Others End        ***/
            /***    File Start      ***/
        case "Import File":
            importFileTab();
            break;
        case "Export File":
            exportFileTab();
            break;
        case "Input List":
            inputListTab();
            break;
            /***    File End        ***/
            /***    Accounts End        ***/
    }
}