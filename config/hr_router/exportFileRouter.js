module.exports = function() {};


function export_file(db, callback) {
    db.export_file.findAll({
        include: [{
            model: db.buyer,
            attributes: [
                'id', 'name'
            ]
        }],
    }).complete(function(err, export_file) {
        callback(export_file);
    })
}

function CreateExportFile(db, DATA, callback) {
    db.export_file.create({
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

function UpdateExportShortRealised(db, DATA, callback) {
    db.export_file.update({
        short_realised: DATA.short_realised
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

function UpdateExportDifferenceRealised(db, DATA, callback) {
    db.export_file.update({
        difference_realised: DATA.difference_realised
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

function UpdateExportOthers(db, DATA, callback) {
    db.export_file.update({
        others: DATA.others
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

function UpdateExportCD(db, DATA, callback) {
    db.export_file.update({
        cd: DATA.cd
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

function UpdateExportERQ(db, DATA, callback) {
    db.export_file.update({
        erq: DATA.erq
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

function UpdateExportPackingCredit(db, DATA, callback) {
    db.export_file.update({
        packing_credit: DATA.packing_credit
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

function UpdateExportFDR(db, DATA, callback) {
    db.export_file.update({
        fdr: DATA.fdr
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

function UpdateExportFobpar(db, DATA, callback) {
    db.export_file.update({
        fobpar: DATA.fobpar
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

function UpdateExportSOD(db, DATA, callback) {
    db.export_file.update({
        sod: DATA.sod
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

function UpdateExportFDBP(db, DATA, callback) {
    db.export_file.update({
        fdbp: DATA.fdbp
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

function UpdateExportPostCharge(db, DATA, callback) {
    db.export_file.update({
        post_charge: DATA.post_charge
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

function UpdateExportNegociationCommission(db, DATA, callback) {
    db.export_file.update({
        negociation_commission: DATA.negociation_commission
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

function UpdateExportHandlingCommission(db, DATA, callback) {
    db.export_file.update({
        handling_commission: DATA.handling_commission
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

function UpdateExportAIT(db, DATA, callback) {
    db.export_file.update({
        ait: DATA.ait
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

function UpdateExportShortRealAmount(db, DATA, callback) {
    db.export_file.update({
        short_real_amount: DATA.short_real_amount
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

function UpdateExportConRate(db, DATA, callback) {
    db.export_file.update({
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

function UpdateExportRealisedAmount(db, DATA, callback) {
    db.export_file.update({
        realised_amount: DATA.realised_amount
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

function UpdateExportRealisedDate(db, DATA, callback) {
    db.export_file.update({
        realised_date: DATA.realised_date
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

function UpdateExportTenor(db, DATA, callback) {
    db.export_file.update({
        tenor: DATA.tenor
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

function UpdateExportFDBC(db, DATA, callback) {
    db.export_file.update({
        fdbc: DATA.fdbc
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

function UpdateExportDocSubDate(db, DATA, callback) {
    db.export_file.update({
        doc_sub_date: DATA.doc_sub_date
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

function UpdateExportShippedBillDate(db, DATA, callback) {
    db.export_file.update({
        shipped_bill_date: DATA.shipped_bill_date
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

function UpdateExportShippedBillNO(db, DATA, callback) {
    db.export_file.update({
        shipped_bill_no: DATA.shipped_bill_no
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

function UpdateExportNetWeight(db, DATA, callback) {
    db.export_file.update({
        net_weight: DATA.net_weight
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

function UpdateExportGrossWeight(db, DATA, callback) {
    db.export_file.update({
        gross_weight: DATA.gross_weight
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

function UpdateExportBLDate(db, DATA, callback) {
    db.export_file.update({
        bl_date: DATA.bl_date
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

function UpdateExportBLNO(db, DATA, callback) {
    db.export_file.update({
        bl_no: DATA.bl_no
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

function UpdateExportEXPDate(db, DATA, callback) {
    db.export_file.update({
        exp_date: DATA.exp_date
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

function UpdateExportEXPNO(db, DATA, callback) {
    db.export_file.update({
        exp_no: DATA.exp_no
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

function UpdateExportRate(db, DATA, callback) {
    db.export_file.update({
        rate: DATA.rate
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

function UpdateExportQuantity(db, DATA, callback) {
    db.export_file.update({
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

function UpdateExportPONO(db, DATA, callback) {
    db.export_file.update({
        po_no: DATA.po_no
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

function UpdateExportStyle(db, DATA, callback) {
    db.export_file.update({
        style: DATA.style
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

function UpdateExportInvoiceValue(db, DATA, callback) {
    db.export_file.update({
        invoice_value: DATA.invoice_value
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

function UpdateExportFileNO(db, DATA, callback) {
    db.export_file.update({
        file_no: DATA.file_no
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

function UpdateExportExportLCExpiryDate(db, DATA, callback) {
    db.export_file.update({
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

function UpdateExportExportLCValue(db, DATA, callback) {
    db.export_file.update({
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

function UpdateExportExportLCDate(db, DATA, callback) {
    db.export_file.update({
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

function UpdateExportExportLCNO(db, DATA, callback) {
    db.export_file.update({
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

function UpdateExportBuyerCountry(db, DATA, callback) {
    db.export_file.update({
        buyer_country: DATA.buyer_country
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

function UpdateExportBuyer(db, DATA, callback) {
    db.export_file.update({
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

function UpdateExportFileSLNO(db, DATA, callback) {
    db.export_file.update({
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

function UploadExportFile(db, DATA, callback) {
    db.export_file.bulkCreate(DATA).complete(function(err, export_file) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}



function routerInit(app, dbFull) {
    var db = dbFull.FFL_HR

    app.get('/export_file', /*isAuthenticated,*/ function(req, res) {
        export_file(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.post('/UploadExportFile', /*isAuthenticated,*/ function(req, res) {
        var returnArray = [];
        if (req.files.export) {
            var file = req.files.export;
            var obj = xlsx.parse('./' + file.path);
            var success = true;
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].name.toUpperCase() == 'EXPORT') {
                    var js = {}
                    for (var j = 1; j < obj[i].data[0].length; j++) {
                        if (obj[i].data[0][j].toUpperCase() == 'INVOICE NO')
                            js.invoice_no = j;
                        if (obj[i].data[0][j].toUpperCase() == 'BUYER')
                            js.buyer = j;
                        if (obj[i].data[0][j].toUpperCase() == 'EXPORT LC NO')
                            js.export_lc_no = j;
                        if (obj[i].data[0][j].toUpperCase() == 'EXPORT LC DATE')
                            js.export_lc_date = j;
                        if (obj[i].data[0][j].toUpperCase() == 'EXPORT LC VALUE')
                            js.export_lc_value = j;
                        if (obj[i].data[0][j].toUpperCase() == 'EXPORT LC EXPIRY DATE')
                            js.export_lc_expiry_date = j;
                        if (obj[i].data[0][j].toUpperCase() == 'FILE NO')
                            js.file_no = j;
                        if (obj[i].data[0][j].toUpperCase() == 'INVOICE VALUE')
                            js.invoice_value = j;
                        if (obj[i].data[0][j].toUpperCase() == 'STYLE')
                            js.style = j;
                        if (obj[i].data[0][j].toUpperCase() == 'PO NO')
                            js.po_no = j;
                        if (obj[i].data[0][j].toUpperCase() == 'SHIPPED QUANTITY')
                            js.shipped_quantity = j;
                        if (obj[i].data[0][j].toUpperCase() == 'RATE')
                            js.rate = j;
                        if (obj[i].data[0][j].toUpperCase() == 'EXP NO')
                            js.exp_no = j;
                        if (obj[i].data[0][j].toUpperCase() == 'EXP DATE')
                            js.exp_date = j;
                        if (obj[i].data[0][j].toUpperCase() == 'BL NO')
                            js.bl_no = j;
                        if (obj[i].data[0][j].toUpperCase() == 'BL DATE')
                            js.bl_date = j;
                        if (obj[i].data[0][j].toUpperCase() == 'GROSS WEIGHT')
                            js.gross_weight = j;
                        if (obj[i].data[0][j].toUpperCase() == 'NET WEIGHT')
                            js.net_weight = j;
                        if (obj[i].data[0][j].toUpperCase() == 'SHIPPED BILL NO')
                            js.shipped_bill_no = j;
                        if (obj[i].data[0][j].toUpperCase() == 'SHIPPED BILL DATE')
                            js.shipped_bill_date = j;
                        if (obj[i].data[0][j].toUpperCase() == 'DOCUMENT SUBMISSION DATE')
                            js.document_submission_date = j;
                        if (obj[i].data[0][j].toUpperCase() == 'FDBC NO')
                            js.fdbc_no = j;
                        if (obj[i].data[0][j].toUpperCase() == 'TENOR')
                            js.tenor = j;
                        if (obj[i].data[0][j].toUpperCase() == 'REALISED DATE')
                            js.realised_date = j;
                        if (obj[i].data[0][j].toUpperCase() == 'REALISED AMOUNT')
                            js.realised_amount = j;
                        if (obj[i].data[0][j].toUpperCase() == 'CON RATE')
                            js.con_rate = j;
                        if (obj[i].data[0][j].toUpperCase() == 'AIT')
                            js.ait = j;
                        if (obj[i].data[0][j].toUpperCase() == 'HANDLING COMMISSION')
                            js.handling_commission = j;
                        if (obj[i].data[0][j].toUpperCase() == 'NEGOTIATION COMMISSION')
                            js.negotiation_commission = j;
                        if (obj[i].data[0][j].toUpperCase() == 'POST CHARGE')
                            js.post_charge = j;
                        if (obj[i].data[0][j].toUpperCase() == 'FDBP')
                            js.fdbp = j;
                        if (obj[i].data[0][j].toUpperCase() == 'SOD')
                            js.sod = j;
                        if (obj[i].data[0][j].toUpperCase() == 'FBPAR')
                            js.fbpar = j;
                        if (obj[i].data[0][j].toUpperCase() == 'FDR')
                            js.fdr = j;
                        if (obj[i].data[0][j].toUpperCase() == 'PACKING CREDIT')
                            js.packing_credit = j;
                        if (obj[i].data[0][j].toUpperCase() == 'ERQ')
                            js.erq = j;
                        if (obj[i].data[0][j].toUpperCase() == 'CD')
                            js.cd = j;
                        if (obj[i].data[0][j].toUpperCase() == 'FBAR')
                            js.fbar = j;
                        if (obj[i].data[0][j].toUpperCase() == 'CENTRAL FUND')
                            js.central_fund = j;
                        if (obj[i].data[0][j].toUpperCase() == 'L.A COMMISSION')
                            js.la_commission = j;
                        if (obj[i].data[0][j].toUpperCase() == 'OTHER COMMISSION')
                            js.other_commission = j;
                        if (obj[i].data[0][j].toUpperCase() == 'CNF BILL NO')
                            js.cnf_bill_no = j;
                        //obj[i].data[0][j];
                    }
                    if (!js.invoice_no) {
                        success = false;
                    }
                    if (!js.buyer) {
                        success = false;
                    }
                    if (!js.export_lc_no) {
                        success = false;
                    }
                    if (!js.export_lc_date) {
                        success = false;
                    }
                    if (!js.export_lc_value) {
                        success = false;
                    }
                    if (!js.export_lc_expiry_date) {
                        success = false;
                    }
                    if (!js.file_no) {
                        success = false;
                    }
                    if (!js.invoice_value) {
                        success = false;
                    }
                    if (!js.style) {
                        success = false;
                    }
                    if (!js.po_no) {
                        success = false;
                    }
                    if (!js.shipped_quantity) {
                        success = false;
                    }
                    if (!js.rate) {
                        success = false;
                    }
                    if (!js.exp_no) {
                        success = false;
                    }
                    if (!js.exp_date) {
                        success = false;
                    }
                    if (!js.bl_no) {
                        success = false;
                    }
                    if (!js.bl_date) {
                        success = false;
                    }
                    if (!js.gross_weight) {
                        success = false;
                    }
                    if (!js.net_weight) {
                        success = false;
                    }
                    if (!js.shipped_bill_no) {
                        success = false;
                    }
                    if (!js.shipped_bill_date) {
                        success = false;
                    }
                    if (!js.document_submission_date) {
                        success = false;
                    }
                    if (!js.fdbc_no) {
                        success = false;
                    }
                    if (!js.tenor) {
                        success = false;
                    }
                    if (!js.realised_date) {
                        success = false;
                    }
                    if (!js.realised_amount) {
                        success = false;
                    }
                    if (!js.con_rate) {
                        success = false;
                    }
                    if (!js.ait) {
                        success = false;
                    }
                    if (!js.handling_commission) {
                        success = false;
                    }
                    if (!js.negotiation_commission) {
                        success = false;
                    }
                    if (!js.post_charge) {
                        success = false;
                    }
                    if (!js.fdbp) {
                        success = false;
                    }
                    if (!js.sod) {
                        success = false;
                    }
                    if (!js.fbpar) {
                        success = false;
                    }
                    if (!js.fdr) {
                        success = false;
                    }
                    if (!js.packing_credit) {
                        success = false;
                    }
                    if (!js.erq) {
                        success = false;
                    }
                    if (!js.cd) {
                        success = false;
                    }
                    if (!js.fbar) {
                        success = false;
                    }
                    if (!js.central_fund) {
                        success = false;
                    }
                    if (!js.la_commission) {
                        success = false;
                    }
                    if (!js.other_commission) {
                        success = false;
                    }
                    if (!js.cnf_bill_no) {
                        success = false;
                    }
                    for (var j = 1; j < obj[i].data.length; j++) {
                        var o = {};
                        if (obj[i].data[j][0]) {
                            if (js.invoice_no)
                                o.invoice_no = obj[i].data[j][js.invoice_no];
                            if (js.buyer)
                                o.buyer = obj[i].data[j][js.buyer];
                            if (js.export_lc_no)
                                o.export_lc_no = obj[i].data[j][js.export_lc_no];
                            if (js.export_lc_date)
                                o.export_lc_date = new Date((obj[i].data[j][js.export_lc_date] - (25567 + 2)) * 86400 * 1000);
                            if (js.export_lc_value)
                                o.export_lc_value = obj[i].data[j][js.export_lc_value];
                            if (js.export_lc_expiry_date)
                                o.export_lc_expiry_date = new Date((obj[i].data[j][js.export_lc_expiry_date] - (25567 + 2)) * 86400 * 1000);
                            if (js.file_no)
                                o.file_no = obj[i].data[j][js.file_no];
                            if (js.invoice_value)
                                o.invoice_value = obj[i].data[j][js.invoice_value];
                            if (js.style)
                                o.style = obj[i].data[j][js.style];
                            if (js.po_no)
                                o.po_no = obj[i].data[j][js.po_no];
                            if (js.quantity)
                                o.quantity = obj[i].data[j][js.quantity];
                            if (js.rate)
                                o.rate = obj[i].data[j][js.rate];
                            if (js.exp_no)
                                o.exp_no = obj[i].data[j][js.exp_no];
                            if (js.exp_date)
                                o.exp_date = new Date((obj[i].data[j][js.exp_date] - (25567 + 2)) * 86400 * 1000);
                            if (js.bl_no)
                                o.bl_no = obj[i].data[j][js.bl_no];
                            if (js.bl_date)
                                o.bl_date = new Date((obj[i].data[j][js.bl_date] - (25567 + 2)) * 86400 * 1000);
                            if (js.gross_weight)
                                o.gross_weight = obj[i].data[j][js.gross_weight];
                            if (js.net_weight)
                                o.net_weight = obj[i].data[j][js.net_weight];
                            if (js.shipped_bill_no)
                                o.shipped_bill_no = obj[i].data[j][js.shipped_bill_no];
                            if (js.shipped_bill_date)
                                o.shipped_bill_date = new Date((obj[i].data[j][js.shipped_bill_date] - (25567 + 2)) * 86400 * 1000);
                            if (js.document_submission_date)
                                o.document_submission_date = new Date((obj[i].data[j][js.document_submission_date] - (25567 + 2)) * 86400 * 1000);
                            if (js.fdbc)
                                o.fdbc = obj[i].data[j][js.fdbc];
                            if (js.tenor)
                                o.tenor = obj[i].data[j][js.tenor];
                            if (js.realised_date)
                                o.realised_date = new Date((obj[i].data[j][js.realised_date] - (25567 + 2)) * 86400 * 1000);
                            if (js.realised_amount)
                                o.realised_amount = obj[i].data[j][js.realised_amount];
                            if (js.ait)
                                o.ait = obj[i].data[j][js.ait];
                            if (js.handling_commission)
                                o.handling_commission = obj[i].data[j][js.handling_commission];
                            if (js.negotiation_commission)
                                o.negotiation_commission = obj[i].data[j][js.negotiation_commission];
                            if (js.postage_charge)
                                o.postage_charge = obj[i].data[j][js.postage_charge];
                            if (js.fdbp)
                                o.fdbp = obj[i].data[j][js.fdbp];
                            if (js.sod)
                                o.sod = obj[i].data[j][js.sod];
                            if (js.fobpar)
                                o.fobpar = obj[i].data[j][js.fobpar];
                            if (js.fdr)
                                o.fdr = obj[i].data[j][js.fdr];
                            if (js.packing_credit)
                                o.packing_credit = obj[i].data[j][js.packing_credit];
                            if (js.erq)
                                o.erq = obj[i].data[j][js.erq];
                            if (js.cd)
                                o.cd = obj[i].data[j][js.cd];
                            if (js.other_commission)
                                o.other_commission = obj[i].data[j][js.other_commission];
                            returnArray.push(o);
                        }
                    }
                }
            }
        }
        UploadExportFile(db, returnArray, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

}

function socketInit(dbFull, socket) {
    var db = dbFull.FFL_HR

    socket.on('CreateExportFile', function(data) {
        input.CreateExportFile(db, data, function(data) {
            socket.emit("CreateExportFile", data)
        });
    });

    socket.on('UpdateExportShortRealised', function(data) {
        update.UpdateExportShortRealised(db, data, function(data) {
            socket.emit("UpdateExportShortRealised", data)
        });
    });

    socket.on('UpdateExportDifferenceRealised', function(data) {
        update.UpdateExportDifferenceRealised(db, data, function(data) {
            socket.emit("UpdateExportDifferenceRealised", data)
        });
    });

    socket.on('UpdateExportOthers', function(data) {
        update.UpdateExportOthers(db, data, function(data) {
            socket.emit("UpdateExportOthers", data)
        });
    });

    socket.on('UpdateExportCD', function(data) {
        update.UpdateExportCD(db, data, function(data) {
            socket.emit("UpdateExportCD", data)
        });
    });

    socket.on('UpdateExportERQ', function(data) {
        update.UpdateExportERQ(db, data, function(data) {
            socket.emit("UpdateExportERQ", data)
        });
    });

    socket.on('UpdateExportPackingCredit', function(data) {
        update.UpdateExportPackingCredit(db, data, function(data) {
            socket.emit("UpdateExportPackingCredit", data)
        });
    });

    socket.on('UpdateExportFDR', function(data) {
        update.UpdateExportFDR(db, data, function(data) {
            socket.emit("UpdateExportFDR", data)
        });
    });

    socket.on('UpdateExportFobpar', function(data) {
        update.UpdateExportFobpar(db, data, function(data) {
            socket.emit("UpdateExportFobpar", data)
        });
    });

    socket.on('UpdateExportSOD', function(data) {
        update.UpdateExportSOD(db, data, function(data) {
            socket.emit("UpdateExportSOD", data)
        });
    });

    socket.on('UpdateExportFDBP', function(data) {
        update.UpdateExportFDBP(db, data, function(data) {
            socket.emit("UpdateExportFDBP", data)
        });
    });

    socket.on('UpdateExportPostCharge', function(data) {
        update.UpdateExportPostCharge(db, data, function(data) {
            socket.emit("UpdateExportPostCharge", data)
        });
    });

    socket.on('UpdateExportNegociationCommission', function(data) {
        update.UpdateExportNegociationCommission(db, data, function(data) {
            socket.emit("UpdateExportNegociationCommission", data)
        });
    });

    socket.on('UpdateExportHandlingCommission', function(data) {
        update.UpdateExportHandlingCommission(db, data, function(data) {
            socket.emit("UpdateExportHandlingCommission", data)
        });
    });

    socket.on('UpdateExportAIT', function(data) {
        update.UpdateExportAIT(db, data, function(data) {
            socket.emit("UpdateExportAIT", data)
        });
    });

    socket.on('UpdateExportShortRealAmount', function(data) {
        update.UpdateExportShortRealAmount(db, data, function(data) {
            socket.emit("UpdateExportShortRealAmount", data)
        });
    });

    socket.on('UpdateExportConRate', function(data) {
        update.UpdateExportConRate(db, data, function(data) {
            socket.emit("UpdateExportConRate", data)
        });
    });

    socket.on('UpdateExportRealisedAmount', function(data) {
        update.UpdateExportRealisedAmount(db, data, function(data) {
            socket.emit("UpdateExportRealisedAmount", data)
        });
    });

    socket.on('UpdateExportRealisedDate', function(data) {
        update.UpdateExportRealisedDate(db, data, function(data) {
            socket.emit("UpdateExportRealisedDate", data)
        });
    });

    socket.on('UpdateExportTenor', function(data) {
        update.UpdateExportTenor(db, data, function(data) {
            socket.emit("UpdateExportTenor", data)
        });
    });

    socket.on('UpdateExportFDBC', function(data) {
        update.UpdateExportFDBC(db, data, function(data) {
            socket.emit("UpdateExportFDBC", data)
        });
    });

    socket.on('UpdateExportDocSubDate', function(data) {
        update.UpdateExportDocSubDate(db, data, function(data) {
            socket.emit("UpdateExportDocSubDate", data)
        });
    });

    socket.on('UpdateExportShippedBillDate', function(data) {
        update.UpdateExportShippedBillDate(db, data, function(data) {
            socket.emit("UpdateExportShippedBillDate", data)
        });
    });

    socket.on('UpdateExportShippedBillNO', function(data) {
        update.UpdateExportShippedBillNO(db, data, function(data) {
            socket.emit("UpdateExportShippedBillNO", data)
        });
    });

    socket.on('UpdateExportNetWeight', function(data) {
        update.UpdateExportNetWeight(db, data, function(data) {
            socket.emit("UpdateExportNetWeight", data)
        });
    });

    socket.on('UpdateExportGrossWeight', function(data) {
        update.UpdateExportGrossWeight(db, data, function(data) {
            socket.emit("UpdateExportGrossWeight", data)
        });
    });

    socket.on('UpdateExportBLDate', function(data) {
        update.UpdateExportBLDate(db, data, function(data) {
            socket.emit("UpdateExportBLDate", data)
        });
    });

    socket.on('UpdateExportBLNO', function(data) {
        update.UpdateExportBLNO(db, data, function(data) {
            socket.emit("UpdateExportBLNO", data)
        });
    });

    socket.on('UpdateExportEXPDate', function(data) {
        update.UpdateExportEXPDate(db, data, function(data) {
            socket.emit("UpdateExportEXPDate", data)
        });
    });

    socket.on('UpdateExportEXPNO', function(data) {
        update.UpdateExportEXPNO(db, data, function(data) {
            socket.emit("UpdateExportEXPNO", data)
        });
    });

    socket.on('UpdateExportRate', function(data) {
        update.UpdateExportRate(db, data, function(data) {
            socket.emit("UpdateExportRate", data)
        });
    });

    socket.on('UpdateExportQuantity', function(data) {
        update.UpdateExportQuantity(db, data, function(data) {
            socket.emit("UpdateExportQuantity", data)
        });
    });

    socket.on('UpdateExportPONO', function(data) {
        update.UpdateExportPONO(db, data, function(data) {
            socket.emit("UpdateExportPONO", data)
        });
    });

    socket.on('UpdateExportStyle', function(data) {
        update.UpdateExportStyle(db, data, function(data) {
            socket.emit("UpdateExportStyle", data)
        });
    });

    socket.on('UpdateExportInvoiceValue', function(data) {
        update.UpdateExportInvoiceValue(db, data, function(data) {
            socket.emit("UpdateExportInvoiceValue", data)
        });
    });

    socket.on('UpdateExportFileNO', function(data) {
        update.UpdateExportFileNO(db, data, function(data) {
            socket.emit("UpdateExportFileNO", data)
        });
    });

    socket.on('UpdateExportExportLCExpiryDate', function(data) {
        update.UpdateExportExportLCExpiryDate(db, data, function(data) {
            socket.emit("UpdateExportExportLCExpiryDate", data)
        });
    });

    socket.on('UpdateExportExportLCValue', function(data) {
        update.UpdateExportExportLCValue(db, data, function(data) {
            socket.emit("UpdateExportExportLCValue", data)
        });
    });

    socket.on('UpdateExportExportLCDate', function(data) {
        update.UpdateExportExportLCDate(db, data, function(data) {
            socket.emit("UpdateExportExportLCDate", data)
        });
    });

    socket.on('UpdateExportExportLCNO', function(data) {
        update.UpdateExportExportLCNO(db, data, function(data) {
            socket.emit("UpdateExportExportLCNO", data)
        });
    });

    socket.on('UpdateExportBuyerCountry', function(data) {
        update.UpdateExportBuyerCountry(db, data, function(data) {
            socket.emit("UpdateExportBuyerCountry", data)
        });
    });

    socket.on('UpdateExportBuyer', function(data) {
        update.UpdateExportBuyer(db, data, function(data) {
            socket.emit("UpdateExportBuyer", data)
        });
    });

    socket.on('UpdateExportFileSLNO', function(data) {
        update.UpdateExportFileSLNO(db, data, function(data) {
            socket.emit("UpdateExportFileSLNO", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;