Ext.ns('Ext.erp.ux.freightOrder');

/**
* @desc      FreightOrder form

* @copyright (c) 2020, 
* @date      September 2013
* @namespace Ext.erp.ux.freightOrder
* @class     Ext.erp.ux.freightOrder.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.freightOrder.Form = function (config) {
    Ext.erp.ux.freightOrder.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FreightOrder.Get,
            submit: FreightOrder.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'freightOrder-form',
        frame: true,
        labelWidth: 70,
        padding: 5,
        autoHeight: false,
        border: false,

        loadDocument: function () {

            FreightOrder.GetDocumentNo(function (result) {
                var form = Ext.getCmp('freightOrder-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('Date').setValue(new Date());
                form.findField('FiscalYearId').setValue(result.data.FiscalYearId);
                form.findField('DriverName').setValue('');
                form.findField('PlateNo').setValue('');
                form.findField('DriverTelephone').setValue('');


            });


        },
         baseCls: 'x-plain',
        items: [{
            layout: 'column',
            bodyStyle: 'background-color:transparent;',
            border: false,
            defaults: {
                border: false,
                bodyStyle: 'background-color:transparent;',
                layout: 'form'
            },
            items: [{
                defaults: {
                    anchor: '95%',
                    columnWidth: .8,

                },
                items: [{
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    name: 'FiscalYearId',
                    xtype: 'hidden'
                },  {
                    name: 'SupplierId',
                    xtype: 'hidden'
                },  {
                    name: 'UnitId',
                    xtype: 'hidden'
                }, {
                    name: 'PurchaseReqeustATCDetailId',
                    xtype: 'hidden'
                }, {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                }, {
                    name: 'StatusId',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedById',
                    xtype: 'hidden'
                }, {
                    name: 'CustomerId',
                    xtype: 'hidden'
                }, {
                    name: 'ItemId',
                    xtype: 'hidden'
                }, {
                    name: 'InvoiceNo',
                    xtype: 'hidden'
                }, {
                    name: 'CustomerTelephone',
                    xtype: 'hidden'
                }, {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher Number',
                    readOnly: false,
                    allowBlank: false
                }, {
                    hiddenName: 'ATC',
                    xtype: 'combo',
                    fieldLabel: 'ATC',
                    typeAhead: false,
                    width: 100,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: true,
                     tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name','SupplierId','Supplier','ItemId','Item', 'Quantity', 'Unit', 'UnitId']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetATCBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('freightOrder-form').getForm();
                            form.findField('PurchaseReqeustATCDetailId').setValue(rec.data['Id']);
                            form.findField('SupplierId').setValue(rec.data['SupplierId']);
                            form.findField('Supplier').setValue(rec.data['Supplier']);
                            form.findField('Quantity').setValue(rec.data['Quantity']);
                            form.findField('UnitId').setValue(rec.data['UnitId']);
                            form.findField('ItemId').setValue(rec.data['ItemId']);
                            form.findField('Item').setValue(rec.data['Item']);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('freightOrder-form').getForm();
                                form.findField('StoreId').reset();

                            }
                        }
                    }
                }, {
                    hiddenName: 'Supplier',
                    xtype: 'combo',
                    fieldLabel: 'Suplier',
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
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetSupplierBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('freightOrder-form').getForm();
                            form.findField('SupplierId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('freightOrder-form').getForm();
                                form.findField('SupplierId').reset();
                            }
                        }
                    }
                }, {
                    hiddenName: 'Item',
                    xtype: 'combo',
                    fieldLabel: 'Item',
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
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetItemBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('freightOrder-form').getForm();
                            form.findField('ItemId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('freightOrder-form').getForm();
                                form.findField('ItemId').reset();
                            }
                        }
                    }
                }, {
                    name: 'Quantity',
                    xtype: 'numberfield',
                    fieldLabel: 'Quantity',
                    readOnly: false,
                    hidden:false,
                    allowBlank: true
                }, {
                    name: 'Date',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                }, 
                 ]
            }, {
                defaults: {
                    anchor: '95%',
                    columnWidth: .0,
           
                },
                items: [
                       {
                          hiddenName: 'DriverName',
                          xtype: 'combo',
                          fieldLabel: 'DriverName',
                          typeAhead: false,
                          width: 100,
                          hideTrigger: true,
                          minChars: 2,
                          listWidth: 280,
                          emptyText: '---Type to Search---',
                          mode: 'remote',
                          allowBlank: true,
                          hidden: true,
                          tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                          store: new Ext.data.DirectStore({
                              reader: new Ext.data.JsonReader({
                                  successProperty: 'success',
                                  idProperty: 'Id',
                                  root: 'data',
                                  fields: ['Id', 'Name']
                              }),
                              autoLoad: true,
                              api: { read: Psms.GetEmployeeBySearch }
                          }),
                          valueField: 'Name',
                          displayField: 'Name',
                          pageSize: 10,
                          listeners: {
                              beforeQuery: function (combo, record, index) {
                                  this.store.baseParams = { salesPersonType: 'Driver' };
                                  this.getStore().reload({
                                      params: {
                                          start: 0,
                                          limit: this.pageSize
                                      }
                                  });

                              },
                              select: function (cmb, rec, idx) {
                               },
                              change: function (cmb, newvalue, oldvalue) {
                                  if (newvalue == "") {                                  
                                  }
                              }
                          }
                      }, {
                          name: 'DriverTelephone',
                          xtype: 'textfield',
                          fieldLabel: 'Driver Telephone',
                          readOnly: false,
                          allowBlank: true,
                          hidden: true,
                      }, {
                          name: 'PlateNo',
                          xtype: 'textfield',
                          fieldLabel: 'PlateNo',
                          readOnly: false,
                          allowBlank: true,
                          hidden: true,
                      }, {
                          name: 'LicenseNo',
                          xtype: 'textfield',
                          fieldLabel: 'LicenseNo',
                          readOnly: false,
                          allowBlank: true,
                          hidden: true,
                      },
                ]
            }, {
                defaults: {
                    anchor: '95%',
                    columnWidth: .0,

                },
                items: [
                     {
                         name: 'ShipperName',
                         xtype: 'textfield',
                         fieldLabel: 'Shipper',
                         readOnly: false,
                         allowBlank: true,
                         hidden: true,
                     }, {
                        name: 'ReceivedBy',
                        xtype: 'textfield',
                        fieldLabel: 'Received By',
                        readOnly: false,
                        allowBlank: true,
                        hidden: true,
                    }, {
                        name: 'Remark',
                        xtype: 'textarea',
                        fieldLabel: 'Remark',
                        width: 100,
                        hidden:true,
                        allowBlank: true,
                        readOnly: false
                    },{
                        name: 'From',
                        xtype: 'textfield',
                        fieldLabel: 'From',
                        readOnly:true,
                        allowBlank: true,
                        hidden: true,
                    }, {
                        name: 'To',
                        xtype: 'textfield',
                        fieldLabel: 'To',
                        readOnly: true,
                        allowBlank: true,
                        hidden: true,
                    },]
            }]
        }]
       
    }, config));
}
Ext.extend(Ext.erp.ux.freightOrder.Form, Ext.form.FormPanel);
Ext.reg('freightOrder-form', Ext.erp.ux.freightOrder.Form);



/* @desc     freightOrderOrder form host window

* @copyright (c) 2020, 
* @date     September 2013
* @namespace Ext.erp.ux.freightOrderOrder
* @class     Ext.erp.ux.freightOrderOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.freightOrder.Window = function (config) {
    Ext.erp.ux.freightOrder.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 400,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'freightOrder-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.freightOrderHeaderId);
               
                if (typeof this.freightOrderHeaderId != "undefined" && this.freightOrderHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.freightOrderHeaderId },
                        success: function () {
                     
                        }
                    });
                }
                else {
                    Ext.getCmp('freightOrder-form').loadDocument();

                    this.form.getForm().findField('PurchaseReqeustATCDetailId').setValue(this.purchaseReqeustATCDetailId);
                    this.form.getForm().findField('ATC').setValue(this.atc);
                    this.form.getForm().findField('Quantity').setValue(this.quantity);
                    this.form.getForm().findField('SupplierId').setValue(this.supplierId);
                    this.form.getForm().findField('Supplier').setValue(this.supplier);
                    this.form.getForm().findField('Item').setValue(this.item);
                    this.form.getForm().findField('ItemId').setValue(this.itemId);
                    this.form.getForm().findField('UnitId').setValue(this.unitId);
                }

            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.freightOrder.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.freightOrder.Form();
        this.items = [this.form];
        this.buttons = [
            {
                xtype: 'tbfill'
            }, {
                text: 'Save',
                iconCls: 'icon-accept',
                scope: this,
                handler: this.onSave
            }, {
                xtype: 'tbseparator'
            }, {
                text: 'Close',
                iconCls: 'icon-exit',
                handler: this.onCancel,
                scope: this
            }];
        Ext.erp.ux.freightOrder.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
       
    
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        var window = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ action: this.action }) },

            success: function (form, action) {

                Ext.getCmp('freightOrder-form').getForm().reset();
                 Ext.getCmp('freightOrder-paging').doRefresh();
                 Ext.getCmp('freightOrderPurchaseGrid-paging').doRefresh();

                Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                window.close();
            },
            failure: function (form, action) {
                Ext.MessageBox.hide();

                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            },
        });
    },
    onCancel: function () {
        this.close();
    }
});
Ext.reg('freightOrder-window', Ext.erp.ux.freightOrder.Window);

/**
* @desc      FreightOrder grid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.freightOrder
* @class     Ext.erp.ux.freightOrder.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.freightOrder.Grid = function (config) {
    Ext.erp.ux.freightOrder.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FreightOrder.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DSC'
            },
            fields: ['Id', 'VoucherNumber', 'Date', 'StatusId', 'Status', 'PreparedBy', 'IsLastStep', 'ATC', 'Unit', 'Quantity', 'DriverName', 'DriverTelephone', 'PlateNo', 'LicenseNo', 'ShipperName', 'ReceivedBy', 'Supplier'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    this.body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    this.body.unmask();
                },
                loadException: function () {
                    this.body.unmask();
                },
                scope: this
            }
        }),
        id: 'freightOrder-grid',
        pageSize: 36,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true
        },
        listeners: {
            rowClick: function () {
            },
            rowdblclick: function (grid, rowIndex, e) {
            },
            scope: this
        },
        columns: [
            new Ext.grid.RowNumberer(),
        {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return '<img src="Content/images/app/yes.png"/>';
            }
        }, {
            dataIndex: 'VoucherNumber',
            header: 'VoucherNumber',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'ATC',
            header: 'ATC',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Supplier',
            header: 'Supplier',
            sortable: true,
            width: 100,
            menuDisabled: true,
           renderer: this.customRenderer,
        }, {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: this.customRenderer,

        },{
            dataIndex: 'Quantity',
            header: 'Quantity',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRendererForAmount,

        }]
    }, config));
}
Ext.extend(Ext.erp.ux.freightOrder.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchFreightOrder',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Freight Order', 'CanEdit'),
     
            handler: this.onEdit
        },  {
            xtype: 'tbseparator',
            hidden: true,
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Freight Order', 'CanDelete'),
            handler: this.onDelete
        },{
            xtype: 'button',
            text: 'Preview',
            id: 'preview-FreightOrder',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'freightOrder-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.freightOrder.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('freightOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

       
        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewFreightOrder&id=' + voucherId, 'PreviewIV', parameter);

    },  
    onEdit: function () {
        var grid = Ext.getCmp('freightOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');
        if (status != "Posted") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Only posted transaction are edited, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.freightOrder.Window({
            title: 'Edit Freight Order',
            freightOrderHeaderId: id,
            action: 'edit'
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('freightOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');
        if (status == "Void") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "you can not void already void transaction, check the status!",
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
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        msg: 'Please wait...',
                        width: 250,
                        wait: true,
                        waitConfig: { interval: 1000 }
                    });
                    FreightOrder.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('freightOrder-paging').doRefresh();
                            Ext.getCmp('freightOrderPurchaseGrid-paging').doRefresh();

                            Ext.MessageBox.show({
                                title: 'Success',
                                msg: "Data has been deleted successfully",
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
                        }
                        else {
                            Ext.MessageBox.show({
                                title: 'Failed',
                                msg: result.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    });
                }
            }
        });

    },
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('freightOrder-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("Status") == "Approved")
            return '<span style=color:blue>' + value + '</span>';
        else if (record.get("Status") == "Void")
            return '<span style=color:red>' + value + '</span>';
        else if (record.get("Status") == "Certified")
            return '<span style=color:black>' + value + '</span>';

        else
            return '<span style=color:black>' + value + '</span>';


    },
    customRendererForAmount: function (value, metaData, record, rowIndex, colIndex, store) {
        return '<span style=color:darkorange>' + Ext.util.Format.number(value, '0,000.00 ') + '</span>';
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.freightOrder.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('freightOrder-grid', Ext.erp.ux.freightOrder.Grid);





/**
* @desc      PurchaseRequest grid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.freightOrder
* @class     Ext.erp.ux.freightOrder.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.freightOrder.PurchaseGrid = function (config) {
    Ext.erp.ux.freightOrder.PurchaseGrid.superclass.constructor.call(this, Ext.apply({

        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: FreightOrder.GetAllHeaderPurchaseATC,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|record',
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                idProperty: 'Id',
                totalProperty: 'total',
                sortInfo: {
                    field: 'VoucherNumber',
                    direction: 'ASC'
                },
                fields: ['Id', 'VoucherNumber', 'Date', 'Item', 'ATC', 'Quantity', 'Supplier', 'SupplierId','ItemId','UnitId'],
            }),
            groupField: 'VoucherNumber',
            sortInfo: {
                field: 'VoucherNumber',
                direction: 'ASC'
            },
            remoteSort: true,
            listeners: {
                beforeLoad: function () { this.body.mask('Loading...', 'x-mask-loading'); },
                load: function () { this.body.unmask(); },
                loadException: function () { this.body.unmask(); },
                scope: this
            }
        }),
        view: new Ext.grid.GroupingView({
            forceFit: true,
            showGroupName: false,
            groupTextTpl: '{text}'
        }),
        id: 'freightOrder-purchaseGrid',
        pageSize: 36,
        height: 300,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true
        },
        listeners: {
            rowClick: function () {
            },
            rowdblclick: function (grid, rowIndex, e) {
            },
            scope: this
        },
        columns: [
            new Ext.grid.RowNumberer(),
       {
           dataIndex: 'VoucherNumber',
           header: 'Voucher Number',
           sortable: true,
           width: 100,
           menuDisabled: true,
           renderer: this.customRenderer,

       },{
           dataIndex: 'ATC',
           header: 'ATC',
           sortable: true,
           width: 80,
           menuDisabled: true,      
       },  {
           dataIndex: 'Date',
           header: 'Date',
           sortable: true,
           width: 100,
           menuDisabled: true,
       }, {
           dataIndex: 'Supplier',
           header: 'Supplier',
           sortable: true,
           width: 100,
           menuDisabled: true,
        }, {
            dataIndex: 'Quantity',
           header: 'Quantity',
           sortable: true,
           width: 100,
           menuDisabled: true,     
       }]
    }, config));
}
Ext.extend(Ext.erp.ux.freightOrder.PurchaseGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchfreightOrder',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Freight Order', 'CanAdd'),
            handler: this.onAdd
        },];
        this.bbar = new Ext.PagingToolbar({
            id: 'freightOrderPurchaseGrid-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.freightOrder.PurchaseGrid.superclass.initComponent.apply(this, arguments);
    },
    onAdd: function () {
        var grid = Ext.getCmp('freightOrder-purchaseGrid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var item = grid.getSelectionModel().getSelected().get('Item');
        var atc = grid.getSelectionModel().getSelected().get('ATC');
        var quantity = grid.getSelectionModel().getSelected().get('Quantity');
        var supplierId = grid.getSelectionModel().getSelected().get('SupplierId');
        var supplier = grid.getSelectionModel().getSelected().get('Supplier');
        var itemId = grid.getSelectionModel().getSelected().get('ItemId');
        var unitId = grid.getSelectionModel().getSelected().get('UnitId');
        new Ext.erp.ux.freightOrder.Window({
            title: 'Add Freight Order',
            purchaseReqeustATCDetailId: id,
            item: item,
            atc: atc,
            quantity: quantity,
            supplierId: supplierId,
            supplier: supplier,
            itemId: itemId,
            unitId:unitId,
            action: 'Add'
        }).show();
    },
     onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('freightOrder-purchaseGrid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.freightOrder.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('freightOrder-purchaseGrid', Ext.erp.ux.freightOrder.PurchaseGrid);



/**
* @desc      freightOrder panel

* @copyright (c) 2010, 
* @date      September 2013
* @version   $Id: freightOrder.js, 0.1
* @namespace Ext.erp.ux.freightOrder
* @class     Ext.erp.ux.freightOrder.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.freightOrder.Panel = function (config) {
    Ext.erp.ux.freightOrder.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.freightOrder.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.freightOrder.Grid();
        this.purchaseGrid = new Ext.erp.ux.freightOrder.PurchaseGrid();


        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                collapsed: false,
                split: true,
                width: 500,
                minSize: 200,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.purchaseGrid]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [{
                    layout: 'vbox',
                    layoutConfig: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: {
                        flex: 1
                    },
                    items: [this.headerGrid]

                }]
            }]
        }];
   
        Ext.erp.ux.freightOrder.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('freightOrder-panel', Ext.erp.ux.freightOrder.Panel);


