function exportFileTab() {
    if (Ext.getCmp('export_file_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("export_file_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Export File List',
            layout: 'fit',
            closable: true,
            id: 'export_file_tab',
            autoScroll: true,
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'export_file_grid',
                    columnLines: true,
                    loadMask: true,
                    autoScroll: true,
                    store: {
                        proxy: {
                            type: 'ajax',
                            url: '/export_file'
                        },
                        autoLoad: true,
                        autoSync: true,
                        model: Ext.define('EXPORT_FILE_MODEL', {
                            extend: 'Ext.data.Model',
                            fields: [{
                                name: 'id',
                                type: 'int'
                            }, {
                                name: 'buyer',
                                type: 'string',
                                mapping: 'buyerTable.name'
                            }, ]
                        })
                    },
                    viewConfig: {
                        emptyText: 'No records',
                        autoDestroy: false
                    },
                    listeners: {
                        rowclick: function(grid, row, e) {
                            var data = row.data;
                            //employeeProfileTab(data);
                        }
                    },
                    plugins: [
                        celEditPlugin
                    ],
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {
                            header: '#',
                            locked: true
                        }), {
                            header: 'SL NO',
                            dataIndex: 'sl_no',
                            align: 'center',
                            locked: true,
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.sl_no = self.value;
                                        socket.emit('UpdateExportFileSLNO', data).on('UpdateExportFileSLNO', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'BUYER',
                            dataIndex: 'buyer',
                            align: 'center',
                            field: {
                                xtype: 'combo',
                                name: 'buyer',
                                anyMatch: true,
                                typeAhead: true,
                                transform: 'stateSelect',
                                forceSelection: true,
                                allowBlank: false,
                                editable: false,
                                emptyText: 'Select Buyer...',
                                autoScroll: true,
                                queryMode: 'local',
                                displayField: 'name',
                                valueField: 'id',
                                selectOnFocus: true,
                                selectOnTab: true,
                                triggerAction: 'all',
                                lazyRender: true,
                                store: {
                                    fields: ['id', 'name'],
                                    proxy: {
                                        type: 'ajax',
                                        url: '/buyer'
                                    },
                                    autoLoad: true,
                                    autoSync: true
                                },
                                listeners: {
                                    change: function(self, newValue, oldValue, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.buyer = newValue;
                                        socket.emit('UpdateExportBuyer', data).on('UpdateExportBuyer', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    },
                                }
                            },
                        }, {
                            header: 'EXPORT LC NO',
                            dataIndex: 'export_lc_no',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.export_lc_no = self.value;
                                        socket.emit('UpdateExportExportLCNO', data).on('UpdateExportExportLCNO', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'EXPORT LC DATE',
                            dataIndex: 'export_lc_date',
                            xtype: 'datecolumn',
                            format: 'd-M-Y',
                            emptyCellText: '<a style="color:gray;">EXPORT LC DATE</a>',
                            align: 'center',
                            editor: {
                                xtype: 'datefield',
                                editable: false,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.export_lc_date = self.value;
                                        socket.emit('UpdateExportExportLCDate', data).on('UpdateExportExportLCDate', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'EXPORT LC VALUE',
                            dataIndex: 'export_lc_value',
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return '$ ' + value.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.export_lc_value = self.value;
                                        socket.emit('UpdateExportExportLCValue', data).on('UpdateExportExportLCValue', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'EXPORT LC EXPIRY DATE',
                            dataIndex: 'export_lc_expiry_date',
                            xtype: 'datecolumn',
                            format: 'd-M-Y',
                            emptyCellText: '<a style="color:gray;">EXPORT LC EXPIRY DATE</a>',
                            align: 'center',
                            editor: {
                                xtype: 'datefield',
                                editable: false,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.export_lc_expiry_date = self.value;
                                        socket.emit('UpdateExportExportLCExpiryDate', data).on('UpdateExportExportLCExpiryDate', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'FILE NO',
                            dataIndex: 'file_no',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.file_no = self.value;
                                        socket.emit('UpdateExportFileNO', data).on('UpdateExportFileNO', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'INVOICE VALUE',
                            dataIndex: 'invoice_value',
                            align: 'right',
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.invoice_value = self.value;
                                        socket.emit('UpdateExportInvoiceValue', data).on('UpdateExportInvoiceValue', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return '$ ' + value.formatMoney(2, '.', ',');
                            },
                        }, {
                            header: 'STYLE',
                            dataIndex: 'style',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.style = self.value;
                                        socket.emit('UpdateExportStyle', data).on('UpdateExportStyle', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'PO NO',
                            dataIndex: 'po_no',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.po_no = self.value;
                                        socket.emit('UpdateExportPONO', data).on('UpdateExportPONO', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'QUANTITY',
                            dataIndex: 'quantity',
                            align: 'center',
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.quantity = self.value;
                                        socket.emit('UpdateExportQuantity', data).on('UpdateExportQuantity', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'RATE',
                            dataIndex: 'rate',
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return '$ ' + value.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.rate = self.value;
                                        socket.emit('UpdateExportRate', data).on('UpdateExportRate', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'EXP NO',
                            dataIndex: 'exp_no',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.exp_no = self.value;
                                        socket.emit('UpdateExportEXPNO', data).on('UpdateExportEXPNO', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'EXP DATE',
                            dataIndex: 'exp_date',
                            xtype: 'datecolumn',
                            format: 'd-M-Y',
                            emptyCellText: '<a style="color:gray;">EXP DATE</a>',
                            align: 'center',
                            editor: {
                                xtype: 'datefield',
                                editable: false,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.exp_date = self.value;
                                        socket.emit('UpdateExportEXPDate', data).on('UpdateExportEXPDate', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'BL NO',
                            dataIndex: 'bl_no',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.bl_no = self.value;
                                        socket.emit('UpdateExportBLNO', data).on('UpdateExportBLNO', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'BL DATE',
                            dataIndex: 'bl_date',
                            xtype: 'datecolumn',
                            format: 'd-M-Y',
                            emptyCellText: '<a style="color:gray;">BL DATE</a>',
                            align: 'center',
                            editor: {
                                xtype: 'datefield',
                                editable: false,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.bl_date = self.value;
                                        socket.emit('UpdateExportBLDate', data).on('UpdateExportBLDate', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'GROSS WEIGHT',
                            dataIndex: 'gross_weight',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.gross_weight = self.value;
                                        socket.emit('UpdateExportGrossWeight', data).on('UpdateExportGrossWeight', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'NET WEIGHT',
                            dataIndex: 'net_weight',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.net_weight = self.value;
                                        socket.emit('UpdateExportNetWeight', data).on('UpdateExportNetWeight', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'SHIPPED BILL NO',
                            dataIndex: 'shipped_bill_no',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.shipped_bill_no = self.value;
                                        socket.emit('UpdateExportShippedBillNO', data).on('UpdateExportShippedBillNO', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'SHIPPED BILL DATE',
                            dataIndex: 'shipped_bill_date',
                            xtype: 'datecolumn',
                            format: 'd-M-Y',
                            emptyCellText: '<a style="color:gray;">SHIPPED BILL DATE</a>',
                            align: 'center',
                            editor: {
                                xtype: 'datefield',
                                editable: false,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.shipped_bill_date = self.value;
                                        socket.emit('UpdateExportShippedBillDate', data).on('UpdateExportShippedBillDate', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'DOCUMENT SUBMISSION DATE',
                            dataIndex: 'doc_sub_date',
                            xtype: 'datecolumn',
                            format: 'd-M-Y',
                            emptyCellText: '<a style="color:gray;">DOCUMENT SUBMISSION DATE</a>',
                            align: 'center',
                            editor: {
                                xtype: 'datefield',
                                editable: false,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.doc_sub_date = self.value;
                                        socket.emit('UpdateExportDocSubDate', data).on('UpdateExportDocSubDate', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'FDBC',
                            dataIndex: 'fdbc',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.fdbc = self.value;
                                        socket.emit('UpdateExportFDBC', data).on('UpdateExportFDBC', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'TENOR',
                            dataIndex: 'tenor',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.tenor = self.value;
                                        socket.emit('UpdateExportTenor', data).on('UpdateExportTenor', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'REALISED DATE',
                            dataIndex: 'realised_date',
                            xtype: 'datecolumn',
                            format: 'd-M-Y',
                            emptyCellText: '<a style="color:gray;">REALISED DATE</a>',
                            align: 'center',
                            editor: {
                                xtype: 'datefield',
                                editable: false,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.realised_date = self.value;
                                        socket.emit('UpdateExportRealisedDate', data).on('UpdateExportRealisedDate', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'REALISED AMOUNT',
                            dataIndex: 'realised_amount',
                            align: 'right',
                            width: 150,
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var conversion_rate = parseFloat(record.get('conversion_rate'));
                                var realised_amount = parseFloat(value);
                                var bdt_tk = conversion_rate * realised_amount;
                                return '$ ' + value.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.realised_amount = self.value;
                                        socket.emit('UpdateExportRealisedAmount', data).on('UpdateExportRealisedAmount', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'CON RATE',
                            dataIndex: 'conversion_rate',
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return '$ 1 = ' + value.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.conversion_rate = self.value;
                                        socket.emit('UpdateExportConRate', data).on('UpdateExportConRate', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'SHORT REALISED AMOUNT',
                            dataIndex: 'short_real_amount',
                            align: 'right',
                            width: 200,
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var invoice_value = parseFloat(record.get('invoice_value'));
                                var realised_amount = parseFloat(record.get('realised_amount'));
                                var conversion_rate = parseFloat(record.get('conversion_rate'));
                                var sr = invoice_value - realised_amount;
                                var bdt_tk = conversion_rate * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                        }, {
                            header: 'AIT',
                            dataIndex: 'ait',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var ait = parseFloat(record.get('ait')) / 100;
                                var realised_amount = parseFloat(record.get('realised_amount'));
                                var conversion_rate = parseFloat(record.get('conversion_rate'));
                                var sr = realised_amount * ait;
                                var bdt_tk = conversion_rate * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.ait = self.value;
                                        socket.emit('UpdateExportAIT', data).on('UpdateExportAIT', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'HANDLING COMMISSION',
                            dataIndex: 'handling_commission',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var cr = parseFloat(record.get('conversion_rate'));
                                var sr = parseFloat(record.get('handling_commission'));
                                var bdt_tk = cr * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.handling_commission = self.value;
                                        socket.emit('UpdateExportHandlingCommission', data).on('UpdateExportHandlingCommission', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'NEGOTIATION COMMISSION',
                            dataIndex: 'negotiation_commission',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var cr = parseFloat(record.get('conversion_rate'));
                                var sr = parseFloat(record.get('negotiation_commission'));
                                var bdt_tk = cr * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.negotiation_commission = self.value;
                                        socket.emit('UpdateExportNegotiationCommission', data).on('UpdateExportNegotiationCommission', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'POST CHARGE',
                            dataIndex: 'post_charge',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var cr = parseFloat(record.get('conversion_rate'));
                                var sr = parseFloat(record.get('post_charge'));
                                var bdt_tk = cr * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.post_charge = self.value;
                                        socket.emit('UpdateExportPostCharge', data).on('UpdateExportPostCharge', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'FDBP',
                            dataIndex: 'fdbp',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var cr = parseFloat(record.get('conversion_rate'));
                                var sr = parseFloat(record.get('fdbp'));
                                var bdt_tk = cr * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.fdbp = self.value;
                                        socket.emit('UpdateExportFDBP', data).on('UpdateExportFDBP', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'SOD',
                            dataIndex: 'sod',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var cr = parseFloat(record.get('conversion_rate'));
                                var sr = parseFloat(record.get('sod'));
                                var bdt_tk = cr * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.sod = self.value;
                                        socket.emit('UpdateExportSOD', data).on('UpdateExportSOD', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'FOBPAR',
                            dataIndex: 'fobpar',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var cr = parseFloat(record.get('conversion_rate'));
                                var sr = parseFloat(record.get('fobpar'));
                                var bdt_tk = cr * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.fobpar = self.value;
                                        socket.emit('UpdateExportFobpar', data).on('UpdateExportFobpar', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'FDR',
                            dataIndex: 'fdr',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var cr = parseFloat(record.get('conversion_rate'));
                                var sr = parseFloat(record.get('fdr'));
                                var bdt_tk = cr * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.fdr = self.value;
                                        socket.emit('UpdateExportFDR', data).on('UpdateExportFDR', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'PACKING CREDIT',
                            dataIndex: 'packing_credit',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var cr = parseFloat(record.get('conversion_rate'));
                                var sr = parseFloat(record.get('packing_credit'));
                                var bdt_tk = cr * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.packing_credit = self.value;
                                        socket.emit('UpdateExportPackingCredit', data).on('UpdateExportPackingCredit', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'ERQ',
                            dataIndex: 'erq',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var cr = parseFloat(record.get('conversion_rate'));
                                var sr = parseFloat(record.get('erq'));
                                var bdt_tk = cr * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.erq = self.value;
                                        socket.emit('UpdateExportERQ', data).on('UpdateExportERQ', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'CD',
                            dataIndex: 'cd',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var cr = parseFloat(record.get('conversion_rate'));
                                var sr = parseFloat(record.get('cd'));
                                var bdt_tk = cr * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.cd = self.value;
                                        socket.emit('UpdateExportCD', data).on('UpdateExportCD', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'OTHERS / LA COMMISSION',
                            dataIndex: 'others',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var cr = parseFloat(record.get('conversion_rate'));
                                var sr = parseFloat(record.get('others'));
                                var bdt_tk = cr * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('export_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.others = self.value;
                                        socket.emit('UpdateExportOthers', data).on('UpdateExportOthers', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('export_file_grid')) {
                                                    Ext.getCmp('export_file_grid').getStore().load();
                                                    //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                        }, {
                            header: 'TOTAL REALISED',
                            dataIndex: '',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var cr = parseFloat(record.get('conversion_rate'));
                                var a = parseFloat(record.get('ait'));
                                var b = parseFloat(record.get('handling_commission'));
                                var c = parseFloat(record.get('negotiation_commission'));
                                var d = parseFloat(record.get('post_charge'));
                                var e = parseFloat(record.get('fdbp'));
                                var f = parseFloat(record.get('sod'));
                                var g = parseFloat(record.get('fobpar'));
                                var h = parseFloat(record.get('fdr'));
                                var i = parseFloat(record.get('packing_credit'));
                                var j = parseFloat(record.get('erq'));
                                var k = parseFloat(record.get('cd'));
                                var l = parseFloat(record.get('others'));
                                var sr = a + b + c + d + e + f + g + h + i + j + k + l;
                                var bdt_tk = cr * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                        }, {
                            header: 'DIFFERENCE REALISED',
                            dataIndex: '',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var cr = parseFloat(record.get('conversion_rate'));
                                var r = parseFloat(record.get('realised_amount'));
                                var a = parseFloat(record.get('ait'));
                                var b = parseFloat(record.get('handling_commission'));
                                var c = parseFloat(record.get('negotiation_commission'));
                                var d = parseFloat(record.get('post_charge'));
                                var e = parseFloat(record.get('fdbp'));
                                var f = parseFloat(record.get('sod'));
                                var g = parseFloat(record.get('fobpar'));
                                var h = parseFloat(record.get('fdr'));
                                var i = parseFloat(record.get('packing_credit'));
                                var j = parseFloat(record.get('erq'));
                                var k = parseFloat(record.get('cd'));
                                var l = parseFloat(record.get('others'));
                                var t = a + b + c + d + e + f + g + h + i + j + k + l;
                                var sr = r - t;
                                var bdt_tk = cr * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                        }, {
                            header: 'SHORT REALISED %',
                            dataIndex: '',
                            width: 150,
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                var invoice_value = parseFloat(record.get('invoice_value'));
                                var realised_amount = parseFloat(record.get('realised_amount'));
                                var cr = parseFloat(record.get('conversion_rate'));
                                var v = invoice_value - realised_amount;
                                var sr = v / invoice_value;
                                var bdt_tk = cr * sr;
                                return '$ ' + sr.formatMoney(2, '.', ',') + ' = ' + bdt_tk.formatMoney(2, '.', ',');
                            },
                        },
                    ]
                })
            ],
            tbar: [{
                xtype: 'button',
                icon: '/uploads/icons/create.png',
                text: 'Add New Export SL',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    exportFileFormWindow();
                }
            }, {
                xtype: 'button',
                icon: '/uploads/icons/upload.png',
                text: 'Upload New Export File',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    uploadExportFileWindow();
                }
            }, ],
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
                    if (Ext.getCmp('export_file_grid')) {
                        Ext.getCmp('export_file_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function uploadExportFileWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Upload New Export File',
        modal: true,
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                width: '100%',
                bodyPadding: 20,
                border: false,
                items: [
                    newFileField('Choose File', 'export'),
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
                        var success = false;
                        var win = this.up('.window');
                        var panel = this.up('form'),
                            form = panel.getForm(),
                            values = form.getValues();
                        if (form.isValid()) {
                            form.submit({
                                url: '/UploadExportFile',
                                waitMsg: 'Uploading your excel file...',
                                success: function(fp, o) {
                                    win.close();
                                    if (Ext.getCmp('export_file_grid')) {
                                        Ext.getCmp('export_file_grid').getStore().load();
                                    }
                                    Ext.MessageBox.alert('Success', 'Processed file "' + o.result.file + '" on the server');
                                },
                                error: function(fp, o) {
                                    win.close();
                                    if (Ext.getCmp('export_file_grid')) {
                                        Ext.getCmp('export_file_grid').getStore().load();
                                    }
                                    Ext.MessageBox.alert('error', 'Processed file');
                                },
                                failure: function(fp, o) {
                                    win.close();
                                    if (Ext.getCmp('export_file_grid')) {
                                        Ext.getCmp('export_file_grid').getStore().load();
                                    }
                                    Ext.MessageBox.alert('failure', 'Processed file Complete');
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
                        if (success) {
                            this.up('.window').close();
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


function exportFileFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Export SL NO',
        modal: true,
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                width: '100%',
                bodyPadding: 20,
                border: false,
                items: [
                    newTextField('SL NO', 'sl_no'),
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
                        var success = false;
                        var win = this.up('.window');
                        var panel = this.up('form'),
                            form = panel.getForm(),
                            values = form.getValues();
                        if (form.isValid()) {
                            socket.emit('CreateExportFile', values).on('CreateExportFile', function(message) {
                                if (message == "success") {
                                    success = true;
                                    if (Ext.getCmp('export_file_grid')) {
                                        Ext.getCmp('export_file_grid').getStore().load();
                                    }
                                    Ext.MessageBox.alert('success', 'Successfully data inserted');
                                    win.close();
                                } else if (message == "error") {
                                    Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
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

function newFileField(a, b) {
    return Ext.create('Ext.form.field.File', {
        name: b,
        filedAlign: 'top',
        allowBlank: false,
        fieldLabel: a,
        width: 300,
        labelWidth: 80,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give ' + a + '...',
        clearOnSubmit: false,
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        //buttonText: 'B',
        icon: '/uploads/icons/upload.png',
        listeners: {
            afterrender: function(cmp) {
                cmp.fileInputEl.set({
                    multiple: 'multiple'
                });
            }
        },
        buttonConfig: {
            //'background-image': 'url(uploads/images/upload.png) !important',
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