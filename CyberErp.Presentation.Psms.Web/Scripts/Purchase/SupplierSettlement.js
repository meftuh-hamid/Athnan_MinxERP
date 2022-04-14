/// <reference path="SupplierSettlement.js" />
Ext.ns('Ext.erp.ux.supplierSettlement');
/**
* @desc      SupplierSettlement registration form
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.ux.supplierSettlement
* @class     Ext.erp.ux.supplierSettlement.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.supplierSettlement.Form = function (config) {
    Ext.erp.ux.supplierSettlement.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: SupplierSettlement.Get,
            submit: SupplierSettlement.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'supplierSettlement-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: true,
        refreshForm: function () {
        
            SupplierSettlement.GetDocumentNo(function (result) {
                var form = Ext.getCmp('supplierSettlement-form').getForm();
      
            });
        },
        baseCls: 'x-plain',
        items: [{
            layout: 'column',
            border: false,
            bodyStyle: 'background-color:transparent;',
            defaults: {
                columnWidth: .5,
                border: false,
                bodyStyle: 'background-color:transparent;',
                layout: 'form'
            },
            items: [{
                columnWidth: .5,
                defaults: {
                    anchor: '95%', labelStyle: 'text-align:right;', msgTarget: 'side', 
                },
                layout: 'form',
                border: false,
                items: [{
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                }, {
                    name: 'SupplierId',
                    xtype: 'hidden'
                }, {
                    name: 'ReferenceNo',
                    xtype: 'textfield',
                    fieldLabel: 'Reference No',
                    readOnly: false,
                    allowBlank: false
                },  {
                    name: 'Date',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                    maxValue: (new Date()).format('m/d/Y')
                }, {
                    hiddenName: 'CollectedFrom',
                    xtype: 'combo',
                    fieldLabel: 'Supplier',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: false,

                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            root: 'data',
                            fields: ['Id', 'Name', 'Code']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetSupplierBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('supplierSettlement-form').getForm();
                            form.findField('SupplierId').setValue(rec.id);

                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('supplierSettlement-form').getForm();
                                form.findField('SupplierId').reset();


                            }
                        }
                    }
                },
               
                  {
                     name: 'Amount',
                     xtype: 'numberfield',
                     fieldLabel: 'Amount',
                     readOnly: false,
                     allowBlank: false
                 },
                ]
            }, {
                columnWidth: .5,
                defaults: {
                    anchor: '95%',
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side'
                },
                layout: 'form',
                border: false,
                items: [
                      
                       {
                           name: 'Remark',
                           xtype: 'textarea',
                           fieldLabel: 'Remark',

                           height: 70,
                           readOnly: false,
                           allowBlank: true,
                       },

                ]
            }]
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.supplierSettlement.Form, Ext.form.FormPanel);
Ext.reg('supplierSettlement-form', Ext.erp.ux.supplierSettlement.Form);

/**
* @desc      SupplierSettlement registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.ux.supplierSettlement
* @class     Ext.erp.ux.supplierSettlement.Window
* @extends   Ext.Window
*/
Ext.erp.ux.supplierSettlement.Window = function (config) {
    Ext.erp.ux.supplierSettlement.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        //modal: true,
        id: 'supplierSettlement-window',
        actionType: 'Add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                if (this.supplierSettlementId != '' && typeof this.supplierSettlementId !='undefined') {
                    Ext.getCmp('supplierSettlement-window').actionType = "Edit";
                    this.form.load({ params: { id: this.supplierSettlementId } });
                    var grid = Ext.getCmp('supplierSettlement-detailGrid');
                    Ext.getCmp('supplierSettlement-Save').setDisabled(this.isApproved);                   
                    grid.store.baseParams = { param: Ext.encode({ supplierSettlementId: this.supplierSettlementId }) };
                    grid.getStore().load({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                }
                else {
                   Ext.getCmp('supplierSettlement-window').actionType = "Add";
                  this.form.getForm().findField('Id').setValue(this.supplierSettlementId);
                   this.form.refreshForm();

                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.supplierSettlement.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.supplierSettlement.Form(          
            );
        this.grid = new Ext.erp.ux.supplierSettlement.DetailGrid(         
            );
        this.items = [this.form, this.grid];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            id:"supplierSettlement-Save",
            handler: this.onSave,
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().reset();
                this.form.refreshForm();
            },
            scope: this
        }];
        Ext.erp.ux.supplierSettlement.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var detailGrid = Ext.getCmp('supplierSettlement-detailGrid');
        var store = detailGrid.getStore();
        var action = Ext.getCmp('supplierSettlement-window').actionType;
        if (store.getCount() == 0) {
            var msg = Ext.MessageBox;
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please fill services", buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        var records = '';
        var errorMessage = "";
        store.each(function (item) {
            if (typeof item.data['InvoiceId'] == "undefined" || item.data['InvoiceId'] == "")
                errorMessage = "please enter Invoice";
            if (typeof item.data['InvoiceAmount'] == "undefined" || item.data['InvoiceAmount'] == "")
                errorMessage = "please enter Invoice Amount";
            if (typeof item.data['SettledAmount'] == "undefined" || item.data['SettledAmount'] == "" || item.data['SettledAmount'] == 0)
                errorMessage = "please enter Amount";
            records = records + item.data['Id'] + ':' +
                                item.data['SupplierSettlementHeaderId'] + ':' +
                                item.data['InvoiceId'] + ':' +                              
                                item.data['InvoiceAmount'] + ':' +
                                item.data['SettledAmount'] + ':' +
                                item.data['RemainingAmount'] + ':' +
                                 item.data['CreditId'] + ':' +                               
                                item.data['Remark'] +';';
            

        });
        if (errorMessage != "") {
                var msg = Ext.MessageBox;
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: errorMessage,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
        }
            this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ supplierSettlementDetails: records, action: action }) },
            success: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.SUCCESS,
                    scope: this
                });
                Ext.getCmp('supplierSettlement-form').getForm().reset();
                Ext.getCmp('supplierSettlement-paging').doRefresh();
                var Grid = Ext.getCmp('supplierSettlement-detailGrid').getStore().removeAll(); 
                Ext.getCmp('supplierSettlement-form').form.refreshForm();
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('supplierSettlement-window', Ext.erp.ux.supplierSettlement.Window);

/**
* @desc      SupplierSettlement grid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.ux.supplierSettlement
* @class     Ext.erp.ux.supplierSettlement.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.supplierSettlement.Grid = function (config) {
    Ext.erp.ux.supplierSettlement.Grid.superclass.constructor.call(this, Ext.apply({      
        store: new Ext.data.DirectStore({
            directFn: SupplierSettlement.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Date', 'ReferenceNo', 'CollectedFrom', 'SupplierReference', 'OperationNos', 'Amount', 'Remark'],
            remoteSort: true
        }),
        id: 'supplierSettlement-grid',
        loadMask: true,
        height:300,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(),
        {
            dataIndex: 'ReferenceNo',
            header: 'Reference No',
            sortable: true,
            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'Date',
            header: 'Collected Date',
            sortable: true,
            hidden: false,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'CollectedFrom',
            header: 'Supplier',
            sortable: true,
            width: 130,
            menuDisabled: true
        }, {
            dataIndex: 'SupplierReference',
            header: 'Supplier Reference',
            sortable: true,
            width: 250,
            menuDisabled: true
        },{
            dataIndex: 'Amount',
            header: 'Amount',
            sortable: true,
            width: 130,
            menuDisabled: true
        },
        {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 200,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.supplierSettlement.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'supplierSettlement-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.supplierSettlement.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.supplierSettlement.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('supplierSettlement-grid', Ext.erp.ux.supplierSettlement.Grid);


/**
* @desc      SupplierSettlement detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.ux.supplierSettlement
* @class     Ext.erp.ux.supplierSettlement.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.supplierSettlement.DetailGrid = function (config) {
    Ext.erp.ux.supplierSettlement.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: SupplierSettlement.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
           // idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'SupplierSettlementHeaderId', 'InvoiceId', 'Invoice', 'InvoiceAmount', 'Remark', 'CreditId', 'SettledAmount', 'RemainingAmount'],
            remoteSort: true
        }),

        id: 'supplierSettlement-detailGrid',
        loadMask: true,
        pageSize: 30,
        columnLines: true,
        stripeRows: true,
        height:250,
        border: true,
        clicksToEdit: 1,
        selectedRecord:'',
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
          
            afteredit: function (e) {
                var record = e.record;
                var grid = Ext.getCmp('supplierSettlement-detailGrid');
                //if (record.get("SettledAmount") > record.get("RemainingAmount")) {
                //    Ext.MessageBox.show({
                //        title: 'Error',
                //        msg: "settled amount should not be greater than ramining amount",
                //        buttons: Ext.Msg.OK,
                //        icon: Ext.MessageBox.ERROR,
                //        scope: this
                //    });
                //    record.set("SettledAmount", 0);
                //    record.commit();
                //}
                grid.calculateTotal();
            },
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(),
        
        {
            dataIndex: 'Invoice',
            header: 'Invoice',
            sortable: true,
            width: 150,
            menuDisabled: true,
        }
          ,{
            dataIndex: 'InvoiceAmount',
            header: 'InvoiceAmount',
            sortable: true,
            width: 200,
            menuDisabled: true,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            dataIndex: 'SettledAmount',
            header: 'Settled Amount',
            sortable: true,
            width: 150,
            menuDisabled: true,
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        }, {
            dataIndex: 'RemainingAmount',
            header: 'Remaining Amount',
            sortable: true,
            width: 100,
            menuDisabled: true,
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 200,
            menuDisabled: true,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, ],
       
    }, config));
};
Ext.extend(Ext.erp.ux.supplierSettlement.DetailGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({operationTypeId:this.operationTypeId }) };
        this.tbar = [
             {
                 xtype: 'button',
                 text: 'Add',
                 iconCls: 'icon-add',
                 disabled: false,
                 handler: function () {
                     var detailDrid = Ext.getCmp('supplierSettlement-detailGrid');
                     var store = detailDrid.getStore();

                     var defaultData = {

                     };
                     var records = new store.recordType(defaultData);
                     store.add(records);
                 }
             }, {
                 xtype: 'tbseparator'
             }, {
                id: 'remove-supplierSettlementDetail',
                iconCls: 'icon-delete',
                text: 'Remove Item',
                handler: function () {
                    var grid = Ext.getCmp('supplierSettlement-detailGrid');
                    if (!grid.getSelectionModel().hasSelection()) return;
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            },
            '->',
            {
                id: 'invoicePicker-supplierSettlementDetail',
                iconCls: 'icon-accept',
                text: 'Invoice Picker',
                handler: function () {
                    var grid = Ext.getCmp('supplierSettlement-detailGrid');
                    var form = Ext.getCmp('supplierSettlement-form').getForm();
                    var supplierId = form.findField('SupplierId').getValue();
                     if (typeof supplierId == "undefined" || supplierId == "" || supplierId == 0 ) {
                        Ext.MessageBox.show({
                            title: 'Error',
                            msg: 'please select customer first!',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.OK,
                            scope: this
                        });
                        return;
                    }
                    new Ext.erp.ux.supplierSettlement.InvoiceSelectionWindow({
                        title: 'Load Invoice',
                        targetGrid: grid,
                                        
                        supplierId: supplierId
                    }).show();
                }
            },
        ];
        Ext.erp.ux.supplierSettlement.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
    calculateTotal: function () {
        var invoiceNo = '';
        var totalSettledAmount = 0;
        var detailGrid = Ext.getCmp('supplierSettlement-detailGrid');
        var store = detailGrid.getStore();
        var form = Ext.getCmp('supplierSettlement-form').getForm();
        var collectedAmount = form.findField('Amount').getValue();

        var remark = form.findField('Remark').getValue();
        store.each(function (item) {
            if (item.get("SettledAmount") > 0)
                totalSettledAmount = parseFloat(totalSettledAmount) + parseFloat(item.get("SettledAmount"));
              if (totalSettledAmount > collectedAmount) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: "total settled amount should not be greater than collected amount",
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                item.set("SettledAmount", 0);
                item.commit();
            }
        
                invoiceNo = invoiceNo == '' ? item.get("Invoice") + ' ' + item.get("SettledAmount") : invoiceNo + ', ' + item.get("Invoice") + ' ' + item.get("SettledAmount");
              });
        form.findField('Remark').setValue(invoiceNo);

    }
});
Ext.reg('supplierSettlement-detailGrid', Ext.erp.ux.supplierSettlement.DetailGrid);


/**
* @desc      Supplier Response window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 16, 2017
* @namespace Ext.erp.ux.supplierSettlement
* @class     Ext.erp.ux.supplierSettlement.InvoiceSelectionWindow
* @extends   Ext.Window
*/
Ext.erp.ux.supplierSettlement.InvoiceSelectionWindow = function (config) {
    Ext.erp.ux.supplierSettlement.InvoiceSelectionWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 700,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.supplierSettlement.InvoiceSelectionWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.supplierSettlement.InvoiceSelectionGrid({
            supplierId: this.supplierId,
        });
        this.items = [this.grid];      
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-accept',
            scope: this,
            handler: this.onSelect
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.ux.supplierSettlement.InvoiceSelectionWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var selectionGrid = this.grid;
        if (!selectionGrid.getSelectionModel().hasSelection())
            return;
        var selectedItems = selectionGrid.getSelectionModel().getSelections();
        var gridDatastore = this.targetGrid.getStore();
        var item = gridDatastore.recordType;

        for (var i = 0; i < selectedItems.length; i++) {

                var p = new item({
                    InvoiceId: selectedItems[i].get('Id'),
                    CreditId: selectedItems[i].get('CreditId'),
                    Invoice: selectedItems[i].get('VoucherNumber'),
                    InvoiceAmount: selectedItems[i].get('NetPay'),
                    SettledAmount: 0,
                    RemainingAmount: selectedItems[i].get('RemainingAmount'),
                    Remark: '',

                });
                var count = gridDatastore.getCount();
                gridDatastore.insert(count, p);
        }

    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('invoiceSelection-Window', Ext.erp.ux.supplierSettlement.InvoiceSelectionWindow);



/**
* @desc      InvoiceSelection grid
* @author    Meftuh mohammed
* @copyright (c) 2017, Cybersoft
* @date      jun 26, 2019
* @namespace Ext.erp.ux.supplierSettlement
* @class     Ext.erp.ux.supplierSettlement.InvoiceSelectionGrid
* @extends   Ext.grid.GridPanel
*/
var invoiceSelectionSm = new Ext.grid.CheckboxSelectionModel({
    clicksToEdit: 1,
    checkOnly: true,
    singleSelect: false
});

Ext.erp.ux.supplierSettlement.InvoiceSelectionGrid = function (config) {
    Ext.erp.ux.supplierSettlement.InvoiceSelectionGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Psms.GetPagedCreditPurchase,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
           // idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'VoucherNumber', 'ZReportReference', 'Date','Supplier', 'CreditId', 'SalesArea', 'NetPay', 'RemainingAmount'],
            remoteSort: true
        }),
        id: 'invoiceSelection-grid',
        pageSize: 10,
        height: 250,
        stripeRows: true,
        border: false,
        sm: invoiceSelectionSm,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [invoiceSelectionSm, {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(),
         {
             dataIndex: 'Date',
             header: 'Date',
             sortable: true,
             width: 120,
             menuDisabled: true
         }, {
            dataIndex: 'VoucherNumber',
            header: 'Invoice No',
            sortable: true,
            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'NetPay',
            header: 'Invoice Amount',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'RemainingAmount',
            header: 'Remaining Amount',
            sortable: true,
            width: 80,
            menuDisabled: true
        },]
    }, config));
}
Ext.extend(Ext.erp.ux.supplierSettlement.InvoiceSelectionGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.tbar = [
       
          '->',
        {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            id: 'txtInvoiceSelectionSearch',
            emptyText: 'Type Search text here and press Enter',
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '200px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('invoiceSelection-grid');
                         grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue(), supplierId: grid.supplierId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('invoiceSelection-grid');
                        var quotationId = Ext.getCmp('quotationId-supplierSettlement').getValue();
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue(), supplierId: grid.supplierId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'invoiceSelection-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.supplierSettlement.InvoiceSelectionGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        this.store.baseParams = { param: Ext.encode({ searchText: '', supplierId: this.supplierId}) };
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.supplierSettlement.InvoiceSelectionGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('invoiceSelection-grid', Ext.erp.ux.supplierSettlement.InvoiceSelectionGrid);

/**
* @desc      SupplierSettlement Item panel
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.ux.supplierSettlement
* @class     Ext.erp.ux.supplierSettlement.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.supplierSettlement.Panel = function (config) {
    Ext.erp.ux.supplierSettlement.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        id: 'supplierSettlement-panel',
        isLoadVoid: '',
        tbar: {
            xtype: 'toolbar',
            items: [
                {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.ux.Reception.getPermission('Supplier Settlement', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.ux.Reception.getPermission('Supplier Settlement', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.ux.Reception.getPermission('Supplier Settlement', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Preview',
                id: 'previewSupplierSettlement',
                iconCls: 'icon-preview',
                handler: this.onPreview
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: '',
                iconCls: 'icon-excel',
                handler: function () {
                    var searchText = Ext.getCmp('supplierSettlement.searchText').getValue();
                    window.open('SupplierSettlement/ExportToExcel?st=' + searchText, '', '');
                }
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                id: "supplierSettlement.searchText",
                emptyText: 'Type search text here',
                submitEmptyText: false,
                enableKeyEvents: true,
                style: {
                    borderRadius: '25px',
                    padding: '0 10px',
                    width: '300px'
                },
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            Ext.getCmp('supplierSettlement-panel').loadGrid();
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            Ext.getCmp('supplierSettlement-panel').loadGrid();
                        }
                    }
                }
            }, ]
        }
    }, config));
};
Ext.extend(Ext.erp.ux.supplierSettlement.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.ux.supplierSettlement.Grid();
        this.items = [grid];

        Ext.erp.ux.supplierSettlement.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.ux.supplierSettlement.Window({
            supplierSettlementId: 0,
            title: 'Add SupplierSettlement'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('supplierSettlement-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');
        var isApproved = grid.getSelectionModel().getSelected().get('IsApproved');

          new Ext.erp.ux.supplierSettlement.Window({
              supplierSettlementId: id,
              isApproved:isApproved,
            title: 'Edit SupplierSettlement'
        }).show();
    },
    onPreview: function () {
        var grid = Ext.getCmp('supplierSettlement-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var id = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/ErpReportViewer.aspx?rt=PreviewSupplierSettlement&id=' + id, 'PreviewQuote', parameter);
    },
     onDeleteClick: function () {
        var grid = Ext.getCmp('supplierSettlement-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected record',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'Delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    SupplierSettlement.Delete(id, function (result, response) {
                        Ext.getCmp('supplierSettlement-paging').doRefresh();
                    }, this);
                }
            }
        });
     },
     loadGrid: function () {
         var grid = Ext.getCmp('supplierSettlement-grid');
         var searchText = Ext.getCmp('supplierSettlement.searchText').getValue();

         grid.store.baseParams['param'] = Ext.encode({ searchText: searchText});
         grid.store.load({ params: { start: 0, limit: grid.pageSize } });

     }
});
Ext.reg('supplierSettlement-panel', Ext.erp.ux.supplierSettlement.Panel);