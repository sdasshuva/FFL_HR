module.exports = function() {};

function import_file(db, callback) {
    db.import_file.findAll({
        include: [{
            model: db.buyer,
            attributes: [
                'id', 'name'
            ]
        }, {
            model: db.supplier,
            attributes: [
                'id', 'name'
            ]
        }],
    }).complete(function(err, import_file) {
        callback(import_file);
    })
}

function CreateImportFile(db, DATA, callback) {
    db.import_file.create({
        sl_no: DATA.sl_no,
    }).complete(function(err, employee) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}

function UpdateImportFileSLNO(db, DATA, callback) {
    db.import_file.update({
        sl_no: DATA.sl_no
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportBuyer(db, DATA, callback) {
    db.import_file.update({
        buyer: DATA.buyer
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportExportLCNO(db, DATA, callback) {
    db.import_file.update({
        export_lc_no: DATA.export_lc_no
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportExportLCDate(db, DATA, callback) {
    db.import_file.update({
        export_lc_date: DATA.export_lc_date
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportExportLCValue(db, DATA, callback) {
    db.import_file.update({
        export_lc_value: DATA.export_lc_value
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportExportLCExpiryDate(db, DATA, callback) {
    db.import_file.update({
        export_lc_expiry_date: DATA.export_lc_expiry_date
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportCostingFileNo(db, DATA, callback) {
    db.import_file.update({
        costing_file_no: DATA.costing_file_no
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportSupplier(db, DATA, callback) {
    db.import_file.update({
        supplier: DATA.supplier
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportPINO(db, DATA, callback) {
    db.import_file.update({
        pi_no: DATA.pi_no
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportPIDate(db, DATA, callback) {
    db.import_file.update({
        pi_date: DATA.pi_date
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportPIAmount(db, DATA, callback) {
    db.import_file.update({
        pi_amount: DATA.pi_amount
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportItem(db, DATA, callback) {
    db.import_file.update({
        item: DATA.item
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportQuantity(db, DATA, callback) {
    db.import_file.update({
        quantity: DATA.quantity
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportBTBLCNO(db, DATA, callback) {
    db.import_file.update({
        btb_lc_no: DATA.btb_lc_no
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportBTBLCDate(db, DATA, callback) {
    db.import_file.update({
        btb_lc_date: DATA.btb_lc_date
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportCNF(db, DATA, callback) {
    db.import_file.update({
        cnf: DATA.cnf
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportInsurancePremium(db, DATA, callback) {
    db.import_file.update({
        insurance_premium: DATA.insurance_premium
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportInsurancePolicy(db, DATA, callback) {
    db.import_file.update({
        insurance_policy: DATA.insurance_policy
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportBank(db, DATA, callback) {
    db.import_file.update({
        bank: DATA.bank
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportAcceptanceDate(db, DATA, callback) {
    db.import_file.update({
        acceptance_date: DATA.acceptance_date
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportAcceptanceAmount(db, DATA, callback) {
    db.import_file.update({
        acceptance_amount: DATA.acceptance_amount
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportABPNO(db, DATA, callback) {
    db.import_file.update({
        abp_no: DATA.abp_no
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportABPDate(db, DATA, callback) {
    db.import_file.update({
        abp_date: DATA.abp_date
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportMaturityDate(db, DATA, callback) {
    db.import_file.update({
        maturity_date: DATA.maturity_date
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportPaymentDate(db, DATA, callback) {
    db.import_file.update({
        payment_date: DATA.payment_date
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportPaymentAmountUSD(db, DATA, callback) {
    db.import_file.update({
        payment_amount_usd: DATA.payment_amount_usd
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportPaymentAmountBDT(db, DATA, callback) {
    db.import_file.update({
        payment_amount_bdt: DATA.payment_amount_bdt
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportConRate(db, DATA, callback) {
    db.import_file.update({
        conversion_rate: DATA.conversion_rate
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportLCOpening(db, DATA, callback) {
    db.import_file.update({
        lc_opening: DATA.lc_opening
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportTotalLC(db, DATA, callback) {
    db.import_file.update({
        total_lc: DATA.total_lc
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportAcceptanceCharge(db, DATA, callback) {
    db.import_file.update({
        acceptance_charge: DATA.acceptance_charge
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportTotalExpence(db, DATA, callback) {
    db.import_file.update({
        total_expence: DATA.total_expence
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateImportPayment(db, DATA, callback) {
    db.import_file.update({
        payment: DATA.payment
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}


function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/import_file', /*isAuthenticated,*/ function(req, res) {
        import_file(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('CreateImportFile', function(data) {
        CreateImportFile(db, data, function(data) {
            socket.emit("CreateImportFile", data)
        });
    });

    socket.on('UpdateImportFileSLNO', function(data) {
        UpdateImportFileSLNO(db, data, function(data) {
            socket.emit("UpdateImportFileSLNO", data)
        });
    });

    socket.on('UpdateImportExportLCNO', function(data) {
        UpdateImportExportLCNO(db, data, function(data) {
            socket.emit("UpdateImportExportLCNO", data)
        });
    });

    socket.on('UpdateImportExportLCDate', function(data) {
        UpdateImportExportLCDate(db, data, function(data) {
            socket.emit("UpdateImportExportLCDate", data)
        });
    });

    socket.on('UpdateImportExportLCDate', function(data) {
        UpdateImportExportLCDate(db, data, function(data) {
            socket.emit("UpdateImportExportLCDate", data)
        });
    });

    socket.on('UpdateImportExportLCValue', function(data) {
        UpdateImportExportLCValue(db, data, function(data) {
            socket.emit("UpdateImportExportLCValue", data)
        });
    });

    socket.on('UpdateImportExportLCExpiryDate', function(data) {
        UpdateImportExportLCExpiryDate(db, data, function(data) {
            socket.emit("UpdateImportExportLCExpiryDate", data)
        });
    });

    socket.on('UpdateImportCostingFileNo', function(data) {
        UpdateImportCostingFileNo(db, data, function(data) {
            socket.emit("UpdateImportCostingFileNo", data)
        });
    });

    socket.on('UpdateImportSupplier', function(data) {
        UpdateImportSupplier(db, data, function(data) {
            socket.emit("UpdateImportSupplier", data)
        });
    });

    socket.on('UpdateImportPINO', function(data) {
        UpdateImportPINO(db, data, function(data) {
            socket.emit("UpdateImportPINO", data)
        });
    });

    socket.on('UpdateImportPIDate', function(data) {
        UpdateImportPIDate(db, data, function(data) {
            socket.emit("UpdateImportPIDate", data)
        });
    });

    socket.on('UpdateImportPIAmount', function(data) {
        UpdateImportPIAmount(db, data, function(data) {
            socket.emit("UpdateImportPIAmount", data)
        });
    });

    socket.on('UpdateImportItem', function(data) {
        UpdateImportItem(db, data, function(data) {
            socket.emit("UpdateImportItem", data)
        });
    });

    socket.on('UpdateImportQuantity', function(data) {
        UpdateImportQuantity(db, data, function(data) {
            socket.emit("UpdateImportQuantity", data)
        });
    });

    socket.on('UpdateImportBTBLCNO', function(data) {
        UpdateImportBTBLCNO(db, data, function(data) {
            socket.emit("UpdateImportBTBLCNO", data)
        });
    });

    socket.on('UpdateImportBTBLCDate', function(data) {
        UpdateImportBTBLCDate(db, data, function(data) {
            socket.emit("UpdateImportBTBLCDate", data)
        });
    });

    socket.on('UpdateImportCNF', function(data) {
        UpdateImportCNF(db, data, function(data) {
            socket.emit("UpdateImportCNF", data)
        });
    });

    socket.on('UpdateImportInsurancePremium', function(data) {
        UpdateImportInsurancePremium(db, data, function(data) {
            socket.emit("UpdateImportInsurancePremium", data)
        });
    });

    socket.on('UpdateImportInsurancePolicy', function(data) {
        UpdateImportInsurancePolicy(db, data, function(data) {
            socket.emit("UpdateImportInsurancePolicy", data)
        });
    });

    socket.on('UpdateImportBank', function(data) {
        UpdateImportBank(db, data, function(data) {
            socket.emit("UpdateImportBank", data)
        });
    });

    socket.on('UpdateImportAcceptanceDate', function(data) {
        UpdateImportAcceptanceDate(db, data, function(data) {
            socket.emit("UpdateImportAcceptanceDate", data)
        });
    });

    socket.on('UpdateImportAcceptanceAmount', function(data) {
        UpdateImportAcceptanceAmount(db, data, function(data) {
            socket.emit("UpdateImportAcceptanceAmount", data)
        });
    });

    socket.on('UpdateImportABPNO', function(data) {
        UpdateImportABPNO(db, data, function(data) {
            socket.emit("UpdateImportABPNO", data)
        });
    });

    socket.on('UpdateImportABPDate', function(data) {
        UpdateImportABPDate(db, data, function(data) {
            socket.emit("UpdateImportABPDate", data)
        });
    });

    socket.on('UpdateImportMaturityDate', function(data) {
        UpdateImportMaturityDate(db, data, function(data) {
            socket.emit("UpdateImportMaturityDate", data)
        });
    });

    socket.on('UpdateImportPaymentDate', function(data) {
        UpdateImportPaymentDate(db, data, function(data) {
            socket.emit("UpdateImportPaymentDate", data)
        });
    });

    socket.on('UpdateImportPaymentAmountUSD', function(data) {
        UpdateImportPaymentAmountUSD(db, data, function(data) {
            socket.emit("UpdateImportPaymentAmountUSD", data)
        });
    });

    socket.on('UpdateImportPaymentAmountBDT', function(data) {
        UpdateImportPaymentAmountBDT(db, data, function(data) {
            socket.emit("UpdateImportPaymentAmountBDT", data)
        });
    });

    socket.on('UpdateImportConRate', function(data) {
        UpdateImportConRate(db, data, function(data) {
            socket.emit("UpdateImportConRate", data)
        });
    });

    socket.on('UpdateImportLCOpening', function(data) {
        UpdateImportLCOpening(db, data, function(data) {
            socket.emit("UpdateImportLCOpening", data)
        });
    });

    socket.on('UpdateImportTotalLC', function(data) {
        UpdateImportTotalLC(db, data, function(data) {
            socket.emit("UpdateImportTotalLC", data)
        });
    });

    socket.on('UpdateImportAcceptanceCharge', function(data) {
        UpdateImportAcceptanceCharge(db, data, function(data) {
            socket.emit("UpdateImportAcceptanceCharge", data)
        });
    });

    socket.on('UpdateImportTotalExpence', function(data) {
        UpdateImportTotalExpence(db, data, function(data) {
            socket.emit("UpdateImportTotalExpence", data)
        });
    });

    socket.on('UpdateImportPayment', function(data) {
        UpdateImportPayment(db, data, function(data) {
            socket.emit("UpdateImportPayment", data)
        });
    });


}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;