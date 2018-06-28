function importFileTab() {
    if (Ext.getCmp('import_file_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("import_file_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Import File List',
            layout: 'fit',
            closable: true,
            id: 'import_file_tab',
            autoScroll: true,
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'import_file_grid',
                    columnLines: true,
                    loadMask: true,
                    autoScroll: true,
                    store: {
                        proxy: {
                            type: 'ajax',
                            url: '/import_file'
                        },
                        autoLoad: true,
                        autoSync: true,
                        model: Ext.define('IMPORT_FILE_MODEL', {
                            extend: 'Ext.data.Model',
                            fields: [{
                                name: 'id',
                                type: 'int'
                            }, {
                                name: 'buyer',
                                type: 'string',
                                mapping: 'buyerTable.name'
                            }, {
                                name: 'supplier',
                                type: 'string',
                                mapping: 'supplierTable.name'
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
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.sl_no = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportFileSLNO', data).on('UpdateImportFileSLNO', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
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
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.buyer = newValue;
                                        if (newValue) {
                                            socket.emit('UpdateImportBuyer', data).on('UpdateImportBuyer', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
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
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.export_lc_no = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportExportLCNO', data).on('UpdateImportExportLCNO', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
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
                                emptyText: 'EXPORT LC DATE',
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.export_lc_date = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportExportLCDate', data).on('UpdateImportExportLCDate', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'EXPORT LC VALUE',
                            dataIndex: 'export_lc_value',
                            align: 'center',
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.export_lc_value = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportExportLCValue', data).on('UpdateImportExportLCValue', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
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
                                emptyText: 'EXPORT LC EXPIRY DATE',
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.export_lc_expiry_date = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportExportLCExpiryDate', data).on('UpdateImportExportLCExpiryDate', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'COSTING FILE NO',
                            dataIndex: 'costing_file_no',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.costing_file_no = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportCostingFileNo', data).on('UpdateImportCostingFileNo', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'SUPPLIER',
                            dataIndex: 'supplier',
                            align: 'center',
                            field: {
                                xtype: 'combo',
                                name: 'supplier',
                                anyMatch: true,
                                typeAhead: true,
                                transform: 'stateSelect',
                                forceSelection: true,
                                allowBlank: false,
                                editable: false,
                                emptyText: 'Select Supplier...',
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
                                        url: '/supplier'
                                    },
                                    autoLoad: true,
                                    autoSync: true
                                },
                                listeners: {
                                    change: function(self, newValue, oldValue, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.supplier = newValue;
                                        if (newValue) {
                                            socket.emit('UpdateImportSupplier', data).on('UpdateImportSupplier', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    },
                                }
                            },
                            width: 100
                        }, {
                            header: 'PI NO',
                            dataIndex: 'pi_no',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.pi_no = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportPINO', data).on('UpdateImportPINO', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'PI DATE',
                            dataIndex: 'pi_date',
                            xtype: 'datecolumn',
                            format: 'd-M-Y',
                            emptyCellText: '<a style="color:gray;">PI DATE</a>',
                            align: 'center',
                            editor: {
                                xtype: 'datefield',
                                editable: false,
                                emptyText: 'PI DATE',
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.pi_date = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportPIDate', data).on('UpdateImportPIDate', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'PI AMOUNT',
                            dataIndex: 'pi_amount',
                            align: 'center',
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.pi_amount = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportPIAmount', data).on('UpdateImportPIAmount', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'ITEM',
                            dataIndex: 'item',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.item = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportItem', data).on('UpdateImportItem', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'QUANTITY',
                            dataIndex: 'quantity',
                            align: 'center',
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.quantity = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportQuantity', data).on('UpdateImportQuantity', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'BTB LC NO',
                            dataIndex: 'btb_lc_no',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.btb_lc_no = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportBTBLCNO', data).on('UpdateImportBTBLCNO', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'BTB LC DATE',
                            dataIndex: 'btb_lc_date',
                            xtype: 'datecolumn',
                            format: 'd-M-Y',
                            emptyCellText: '<a style="color:gray;">BTB LC DATE</a>',
                            align: 'center',
                            editor: {
                                xtype: 'datefield',
                                editable: false,
                                emptyText: 'BTB LC DATE',
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.btb_lc_date = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportBTBLCDate', data).on('UpdateImportBTBLCDate', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'COMMERCIAL INV. C&F',
                            dataIndex: 'cnf',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.cnf = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportCNF', data).on('UpdateImportCNF', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'INSURANCE PREMIUM',
                            dataIndex: 'insurance_premium',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.insurance_premium = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportInsurancePremium', data).on('UpdateImportInsurancePremium', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'INSURANCE POLICY',
                            dataIndex: 'insurance_policy',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.insurance_policy = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportInsurancePolicy', data).on('UpdateImportInsurancePolicy', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'BANK',
                            dataIndex: 'bank',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.bank = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportBank', data).on('UpdateImportBank', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'ACCEPTANCE DATE',
                            dataIndex: 'acceptance_date',
                            xtype: 'datecolumn',
                            format: 'd-M-Y',
                            emptyCellText: '<a style="color:gray;">ACCEPTANCE DATE</a>',
                            align: 'center',
                            editor: {
                                xtype: 'datefield',
                                editable: false,
                                emptyText: 'ACCEPTANCE DATE',
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.acceptance_date = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportAcceptanceDate', data).on('UpdateImportAcceptanceDate', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'ACCEPTANCE AMOUNT',
                            dataIndex: 'acceptance_amount',
                            align: 'center',
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.acceptance_amount = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportAcceptanceAmount', data).on('UpdateImportAcceptanceAmount', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'ABP NO',
                            dataIndex: 'abp_no',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.abp_no = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportABPNO', data).on('UpdateImportABPNO', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'ABP DATE',
                            dataIndex: 'abp_date',
                            xtype: 'datecolumn',
                            format: 'd-M-Y',
                            emptyCellText: '<a style="color:gray;">ABP DATE</a>',
                            align: 'center',
                            editor: {
                                xtype: 'datefield',
                                editable: false,
                                emptyText: 'ABP DATE',
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.abp_date = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportABPDate', data).on('UpdateImportABPDate', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'MATURITY DATE',
                            dataIndex: 'maturity_date',
                            xtype: 'datecolumn',
                            format: 'd-M-Y',
                            emptyCellText: '<a style="color:gray;">MATURITY DATE</a>',
                            align: 'center',
                            editor: {
                                xtype: 'datefield',
                                editable: false,
                                emptyText: 'MATURITY DATE',
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.maturity_date = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportMaturityDate', data).on('UpdateImportMaturityDate', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'PAYMENT DATE',
                            dataIndex: 'payment_date',
                            xtype: 'datecolumn',
                            format: 'd-M-Y',
                            emptyCellText: '<a style="color:gray;">PAYMENT DATE</a>',
                            align: 'center',
                            editor: {
                                xtype: 'datefield',
                                editable: false,
                                emptyText: 'PAYMENT DATE',
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.payment_date = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportPaymentDate', data).on('UpdateImportPaymentDate', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'PAYMENT AMOUNT USD',
                            dataIndex: 'payment_amount_usd',
                            align: 'center',
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.payment_amount_usd = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportPaymentAmountUSD', data).on('UpdateImportPaymentAmountUSD', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'PAYMENT AMOUNT BDT',
                            dataIndex: 'payment_amount_bdt',
                            align: 'center',
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.payment_amount_bdt = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportPaymentAmountBDT', data).on('UpdateImportPaymentAmountBDT', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'CON RATE',
                            dataIndex: 'conversion_rate',
                            align: 'center',
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.conversion_rate = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportConRate', data).on('UpdateImportConRate', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'LC OPENING',
                            dataIndex: 'lc_opening',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.lc_opening = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportLCOpening', data).on('UpdateImportLCOpening', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'TOTAL LC',
                            dataIndex: 'total_lc',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.total_lc = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportTotalLC', data).on('UpdateImportTotalLC', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'ACCEPTANCE CHARGE',
                            dataIndex: 'acceptance_charge',
                            align: 'center',
                            editor: {
                                xtype: 'textfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.acceptance_charge = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportAcceptanceCharge', data).on('UpdateImportAcceptanceCharge', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'TOTAL EXPENCE',
                            dataIndex: 'total_expence',
                            align: 'center',
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.total_expence = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportTotalExpence', data).on('UpdateImportTotalExpence', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        }, {
                            header: 'PAYMENT',
                            dataIndex: 'payment',
                            align: 'center',
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('import_file_grid').getSelectionModel().getSelection()[0].data.id;
                                        var data = {};
                                        data.id = row;
                                        data.payment = self.value;
                                        if (self.value) {
                                            socket.emit('UpdateImportPayment', data).on('UpdateImportPayment', function(message) {
                                                if (message == "success") {
                                                    if (Ext.getCmp('import_file_grid')) {
                                                        Ext.getCmp('import_file_grid').getStore().load();
                                                        //Ext.MessageBox.alert('success', 'Successfully data updated');
                                                    }
                                                } else if (message == "error") {
                                                    //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            width: 100
                        },
                    ]
                })
            ],
            tbar: [{
                xtype: 'button',
                icon: '/uploads/icons/create.png',
                text: 'Add New Import SL',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    importFileFormWindow();
                }
            }],
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
                    if (Ext.getCmp('import_file_grid')) {
                        Ext.getCmp('import_file_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function importFileFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Import SL NO',
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
                            socket.emit('CreateImportFile', values).on('CreateImportFile', function(message) {
                                if (message == "success") {
                                    success = true;
                                    if (Ext.getCmp('import_file_grid')) {
                                        Ext.getCmp('import_file_grid').getStore().load();
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