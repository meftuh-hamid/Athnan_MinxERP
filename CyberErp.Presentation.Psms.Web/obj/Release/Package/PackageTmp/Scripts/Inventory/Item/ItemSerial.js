Ext.ns('Ext.erp.ux.itemSerial');



/**
* @desc      ItemSerial form
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.itemSerial
* @class     Ext.erp.ux.itemSerial.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.itemSerial.Form = function (config) {
    Ext.erp.ux.itemSerial.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ItemSerial.Get,
            submit: ItemSerial.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'itemSerial-form',
        frame: true,
        labelWidth: 130,
        padding: 5,
        autoHeight: false,
        border: false,
        loadDocument: function () {

            ItemSerial.GetDocumentNo(function (result) {
                var form = Ext.getCmp('itemSerial-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);                
            });
        },
        baseCls: 'x-plain',
        items: [{
            layout: 'column',
            bodyStyle: 'background-color:transparent;',
            border: false,
            defaults: {
                columnWidth: .5,
                border: false,
                bodyStyle: 'background-color:transparent;',
                layout: 'form'
            },
            items: [{
                defaults: {
                    anchor: '95%',

                },
                items: [{
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    name: 'FiscalYearId',
                    xtype: 'hidden'
                }, {
                    name: 'StoreId',
                    xtype: 'hidden'
                }, {
                    name: 'TransactionTypeId',
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
                    name: 'CertifiedById',
                    xtype: 'hidden'
                }, {
                    name: 'ApprovedById',
                    xtype: 'hidden'
                }, {
                    name: 'ItemId',
                    xtype: 'hidden'
                }, {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher Number',
                    readOnly: true,
                    allowBlank: false
                }, {
                    hiddenName: 'TransactionTypeId',
                    xtype: 'combo',
                    fieldLabel: 'Category',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: false,
                    forceSelection: false,
                    emptyText: '---Select---',
                    allowBlank: false,
                    store: new Ext.data.ArrayStore({
                        fields: ['Id', 'Name'],
                        idProperty: 'Id',
                        data: [
                            [1, 'Receipt'],
                            [2, 'Issue'],
                    
                        ]
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                }, {
                    hiddenName: 'Store',
                    xtype: 'combo',
                    fieldLabel: 'To Store',
                    typeAhead: true,
                    width: 100,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: false,
                    hidden: false,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetStoreBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('itemSerial-form').getForm();
                            form.findField('StoreId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('itemSerial-form').getForm();
                                form.findField('StoreId').reset();

                            }
                        }
                    }
                }, {
                    name: 'Date',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                    maxValue: (new Date()).format('m/d/Y')
            } ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                    {
                        xtype: 'compositefield',
                        fieldLabel: 'Generate',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            name: 'NextSerialNumber',
                            xtype: 'textfield',
                            fieldLabel: 'Next ETRE Code',
                            readOnly: true,
                            allowBlank: false
                        },
                        {
                            xtype: 'button',
                            width: 30,
                            id: 'generate-NextSerialNumber',
                            iconCls: 'icon-add',
                            handler: function () {
                                var form = Ext.getCmp('itemSerial-form').getForm();
                                new Ext.erp.ux.supplier.Window({
                                    targetForm: form,
                                }).show();
                           
                            }
                        }
                        ]
                    },{
                        name: 'Remark',
                        xtype: 'textarea',
                        fieldLabel: 'Remark',
                        width: 100,
                        allowBlank: true,
                        readOnly: false
                    }]
            }]
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.itemSerial.Form, Ext.form.FormPanel);
Ext.reg('itemSerial-form', Ext.erp.ux.itemSerial.Form);

/**
* @desc      ItemSerial detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.itemSerial
* @class     Ext.erp.ux.itemSerial.GridDetail
* @extends   Ext.grid.GridPanel
*/
var itemSerialSelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.itemSerial.GridDetail = function (config) {
    Ext.erp.ux.itemSerial.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ItemSerial.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            //  idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'StoreId', 'ItemId', 'Number', 'GRNNumber', 'PlateNo', 'IsDisposed', 'Description', 'SN', 'GRNDate', 'PurchaseCost', 'Quantity', 'IsAvailable', 'Remark'],

            remoteSort: true
        }),
        id: 'itemSerial-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 300,
         sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('itemSerial-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('itemSerial-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('itemSerial-detailGrid').body.unmask();
            },
            afteredit: function (e) {
            }    
        },
        sm: Ext.erp.ux.common.SelectionModel,
        cm: new Ext.grid.ColumnModel({
            columns: [
                new Ext.grid.RowNumberer(),
                {
                    dataIndex: 'Number',
                    header: 'ETRE Code',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },  {
                    dataIndex: 'Description',
                    header: 'Description',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'SN',
                    header: 'SN',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'PlateNo',
                    header: 'Plate No',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'GRNNumber',
                    header: 'GRN Number',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'GRNDate',
                    header: 'GRN Date',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                    renderer: Ext.util.Format.dateRenderer('m/d/Y'),
                    editor: new Ext.form.DateField({}),
                }, {
                    dataIndex: 'PurchaseCost',
                    header: 'Purchase Cost',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'IsAvailable',
                    header: 'Is Available?',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        if (value)
                            return '<img src="Content/images/app/accept.png"/>';
                        else
                            return '<img src="Content/images/app/cancel.png"/>';
                    },
                    editor: new Ext.form.Checkbox({
                    })
                }, {
                    dataIndex: 'IsDisposed',
                    header: 'Is Disposed?',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        if (value)
                            return '<img src="Content/images/app/accept.png"/>';
                        else
                            return '<img src="Content/images/app/cancel.png"/>';
                    },
                    editor: new Ext.form.Checkbox({
                    })
                }, {
                    dataIndex: 'Remark',
                    header: 'Remark',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,                    
                    editor: {
                        xtype: 'textarea',
                        allowBlank: true
                    }
                }, ]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.itemSerial.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('itemSerial-detailGrid');
                    var store = detailDrid.getStore();
                    var storeId = detailDrid.storeId;
                    var itemId = detailDrid.itemId;
                    var itemName = detailDrid.itemName;

                    var defaultData = {
                        StoreId: storeId,
                        ItemId: itemId,
                        ItemName:itemName,
                        IsAvailable: true,
                        IsDisposed:false,
                        Remark:''
                    };
                    var records = new store.recordType(defaultData);
                    store.add(records);
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Remove',
                iconCls: 'icon-exit',
                disabled: false,
                handler: function () {
                    var grid = Ext.getCmp('itemSerial-detailGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        return;

                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            }

        ]
        this.bbar = []

        Ext.erp.ux.itemSerial.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.ux.itemSerial.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('itemSerial-detailGrid', Ext.erp.ux.itemSerial.GridDetail);



/* @desc     itemSerialOrder form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date     September 2013
* @namespace Ext.erp.ux.itemSerialOrder
* @class     Ext.erp.ux.itemSerialOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.itemSerial.Window = function (config) {
    Ext.erp.ux.itemSerial.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'itemSerial-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
               
                if (typeof this.itemSerialId != "undefined" && this.itemSerialId != "") {

                    var grid = Ext.getCmp('itemSerial-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ itemSerialId: this.itemSerialId }) };

                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                }
                else
                {
                    if(this.isReceive)
                    {
                        var grid = this.grid;
                        var store = grid.getStore();
                        var serialItemGrid = store.recordType;
                        this.itemStore.each(function (item) {
                             var p = new serialItemGrid({
                                Id: item.get('Id'),
                                ItemId: item.get('ItemId'),
                                ItemName: item.get('ItemName'),
                                ItemSerialId: item.get('ItemSerialId'),
                                StoreId: item.get('StoreId'),
                                Number: item.get('Number'),
                                IsAvailable: item.get('IsAvailable'),
                                Description: item.get('Description'),
                                SN: item.get('SN'),
                                PlateNo: item.get('PlateNo'),
                                IsDisposed: item.get('IsDisposed'),
                                Remark: item.get('Remark'),
                            });
                            var count = store.getCount();
                            store.insert(count, p);
                        });
                            cm = grid.getColumnModel();
                            cm.setHidden(5, true);
                            cm.setHidden(6, true);
                            cm.setHidden(7, true);
                    }
                    else
                    {
                        var grid = this.grid;

                        cm = grid.getColumnModel();
                        cm.setHidden(5, false);
                        cm.setHidden(6, false);
                        cm.setHidden(7, false);
                    }
                }

            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.itemSerial.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.itemSerial.GridDetail({
            storeId: this.storeId,
            itemId: this.itemId,
            itemName:this.itemName

        });
        this.items = [this.grid];
        this.bbar = [
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
        Ext.erp.ux.itemSerial.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (this.isReceive)
        {
            this.onLocalAdd();
            return;
        }
           
        var grid = Ext.getCmp('itemSerial-detailGrid');
        var store = grid.getStore();
        var rec = ''; var errorMesssage = "";
        var itemId = grid.itemId;
        var storeId = grid.storeId;
        if (store.Count < 1) {
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please Add detail items",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }

        store.each(function (item) {

            if (typeof item.get('Number') == 'undefined' || item.get('Number') =="") {
                if (errorMesssage == "")
                    errorMesssage = "ETRE Code";
                else
                    errorMesssage = errorMesssage + "</br>" + "           ETRE Code";
            }
            if (typeof item.get('GRNDate') == 'undefined' || item.get('GRNDate') == "") {
                if (errorMesssage == "")
                    errorMesssage = "GRN Date";
                else
                    errorMesssage = errorMesssage + "</br>" + "           GRN Date";
            }
            if (typeof item.get('GRNNumber') == 'undefined' || item.get('GRNNumber') == "") {
                if (errorMesssage == "")
                    errorMesssage = "GRN Number";
                else
                    errorMesssage = errorMesssage + "</br>" + "           GRN Number";
            }
            if (typeof item.get('PurchaseCost') == 'undefined' || item.get('PurchaseCost') == "") {
                if (errorMesssage == "")
                    errorMesssage = "Purchase Cost";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Purchase Cost";
            }
           
            if (errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values" + "</br>" + errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.data['Id'] + ':' +
           item.data['ItemId'] + ':' +
           item.data['StoreId'] + ':' +
           item.data['Number'] + ':' +
           item.data['IsAvailable'] + ':' +
           (new Date(item.data['GRNDate'])).format('M/d/y') + ':' +
               item.data['GRNNumber'] + ':' +
                 item.data['PurchaseCost'] + ':' +
                   item.data['Description'] + ':' +
                    item.data['SN'] + ':' +
                     item.data['PlateNo'] + ':' +
                      item.data['IsDisposed'] + ':' +
           item.data['Remark'] + ';';

        });

        if (errorMesssage != "")
            return;

        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        var window = this;
        ItemSerial.SaveItemSerial(itemId,storeId,rec, function (result, response) {
            Ext.MessageBox.hide();
            if (result.success == true) {
                Ext.MessageBox.show({
                    title: 'Success',
                    icon: Ext.MessageBox.INFO,
                    msg: result.data,
                    buttons: {
                        ok: 'Ok'
                    }
                });
                Ext.getCmp('itemSerial-paging').doRefresh();
                window.close();

            }
            else {
                Ext.MessageBox.show({
                    title: 'Error',
                    icon: Ext.MessageBox.INFO,
                    msg: result.data,
                    buttons: {
                        ok: 'Ok'
                    }
                });
            }
        }, this);
    },
    onLocalAdd: function () {
        var targetgrid = this.targetGrid;
        var selectionGrid = Ext.getCmp('itemSerial-detailGrid');
        var selectedGridStore = selectionGrid.getStore();
        var gridDatastore = targetgrid.serialStore;
        var errorMesssage = '';
        this.removeOldRecord();
        selectedGridStore.each(function (item) {

            if (typeof item.get('Number') == 'undefined' || item.get('Number') == "") {
                if (errorMesssage == "")
                    errorMesssage = "ETRE Code";
                else
                    errorMesssage = errorMesssage + "</br>" + "           ETRE Code";
            }
           
            if (errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values" + "</br>" + errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            var index = gridDatastore.findExact("Number", item.get('Number'));
       
            if (index == -1) {
             
                var p = new Ext.data.Record({
                    ItemSerialId: item.get('ItemSerialId'),
                    ItemId: item.get('ItemId'),
                    ItemName: item.get('ItemName'),
                    StoreId: item.get('StoreId'),
                    Number: item.get('Number'),
                    IsAvailable: item.get('IsAvailable'),
                    Description: item.get('Description'),
                    SN: item.get('SN'),
                    PlateNo: item.get('PlateNo'),
                    IsDisposed: item.get('IsDisposed'),
                    Remark: item.get('Remark'),
                });

                var count = gridDatastore.getCount();
                gridDatastore.insert(count, p);
            }


        });

        if (errorMesssage != "")
            return;

        this.close();
    },
    removeOldRecord: function () {
        var gridDatastore = this.targetGrid.serialStore;

        this.itemStore.each(function (item) {
            gridDatastore.remove(item);
        });
    },
    onCancel: function () {
        this.close();
    }
});
Ext.reg('itemSerial-window', Ext.erp.ux.itemSerial.Window);

/**
* @desc      ItemSerial grid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.itemSerial
* @class     Ext.erp.ux.itemSerial.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.itemSerial.ItemGrid = function (config) {
    Ext.erp.ux.itemSerial.ItemGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Item.GetAllSerialItem,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'ItemCategory', 'Code', 'Name', 'ItemType', 'PartNumber', 'ItemSpecification', 'MeasurementUnit', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('itemSerial-itemGrid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('itemSerial-itemGrid').body.unmask(); },
                loadException: function () { Ext.getCmp('itemSerial-itemGrid').body.unmask(); },
                scope: this
            }
        }),
        id: 'itemSerial-itemGrid',
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
                Ext.getCmp('itemSerial-grid').onSearch();
                var itemId = Ext.getCmp('itemSerial-itemGrid').getSelectionModel().getSelected().get("Id");
               Ext.getCmp('custodian-grid').itemId = itemId;
                Ext.getCmp('custodian-grid').loadData();

            },
            rowdblclick: function (grid, rowIndex, e) {
            },
            scope: this
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'ItemCategory',
            header: 'Item Category',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Name',
            header: 'Description',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PartNumber',
            header: 'Part Number',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ItemType',
            header: 'Item Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'MeasurementUnit',
            header: 'Unit',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.itemSerial.ItemGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [
           {
               xtype: 'button',
               text: 'Change Item',
               iconCls: 'icon-accept',
               handler: function () {
                   new Ext.erp.ux.itemSerialItemChange.Window({
                       title: 'Change Item',
                       action: 'Add'
                   }).show();
               }
           }, {
               xtype: 'tbfill'
           }, {
               xtype: 'textfield',
               id: 'itemSerialItem-searchText',
               emptyText: 'Type Search text here and press "Enter"',
               submitemptyText: false,
               enableKeyEvents: true,
               style: {
                   borderRadius: '25px',
                   padding: '0 10px',
                   width: '200px'
               },
               listeners: {
                   specialKey: function (field, e) {
                       if (e.getKey() == e.ENTER) {
                           Ext.getCmp('itemSerial-itemGrid').onSearch();
                       }
                   },
                   Keyup: function (field, e) {
                       if (field.getValue() == '') {
                           Ext.getCmp('itemSerial-itemGrid').onSearch();
                       }
                   }
               }
           }];
        this.bbar = new Ext.PagingToolbar({
            id: 'itemSerialItem-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.itemSerial.Grid.superclass.initComponent.apply(this, arguments);
    },
    onSearch: function () {
        var itemGrid = Ext.getCmp('itemSerial-itemGrid');
        var searchText = Ext.getCmp('itemSerialItem-searchText').getValue();
        itemGrid.store.baseParams = { record: Ext.encode({ searchText: searchText }) };
        itemGrid.store.load({ params: { start: 0, limit: itemGrid.pageSize } });

    },
       afterRender: function () {
           this.onSearch();
           Ext.erp.ux.itemSerial.ItemGrid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('itemSerial-itemGrid', Ext.erp.ux.itemSerial.ItemGrid);



/**
* @desc      ItemSerial grid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.itemSerial
* @class     Ext.erp.ux.itemSerial.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.itemSerial.Grid = function (config) {
    Ext.erp.ux.itemSerial.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ItemSerial.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },

            fields: ['Id', 'ItemId', 'Item', 'Description', 'SN', 'GRNNumber', 'PlateNo', 'IsDisposed', 'GRNDate', 'PurchaseCost', 'StoreId', 'Number', 'IsAvailable', 'Remark'],
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
        id: 'itemSerial-grid',
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
            dataIndex: 'Number',
            header: 'ETRE Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'SN',
            header: 'SN',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PlateNo',
            header: 'Plate No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'GRNNumber',
            header: 'GRN Number',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            dataIndex: 'GRNDate',
            header: 'GRN Date',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: Ext.util.Format.dateRenderer('m/d/Y'),
            editor: {
                xtype: 'datefield',
                allowBlank: false
            }
        }, {
            dataIndex: 'PurchaseCost',
            header: 'Purchase Cost',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            dataIndex: 'IsAvailable',
            header: 'Is Available?',
            sortable: true,
            width: 70,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/accept.png"/>';
                else
                    return '<img src="Content/images/app/cancel.png"/>';
            }
          
        }, {
            dataIndex: 'IsDisposed',
            header: 'Is Disposed?',
            sortable: true,
            width: 70,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/accept.png"/>';
                else
                    return '<img src="Content/images/app/cancel.png"/>';
            }

        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.itemSerial.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [
            {
                xtype: 'displayfield',
                value: 'Store',
                style: 'font-weight: bold; height: 20px; line-height: 20px'
            }, {
                xtype: 'tbseparator'
            }, {
                id: 'itemSerial-storeId',
                xtype: 'combo',
                fieldLabel: 'Item',
                typeAhead: true,
                hideTrigger: true,
                minChars: 2,
                listWidth: 280,
                emptyText: '---Type to Search---',
                mode: 'remote',
                allowBlank: false,
                hidden: false,
                tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: Psms.GetStoreBySearch }
                }),
                valueField: 'Id',
                displayField: 'Name',
                pageSize: 10,
                listeners: {
                    select: function (cmb, rec, idx) {

                        Ext.getCmp('itemSerial-grid').onSearch();
                    }
                }
            }, {
                xtype: 'tbseparator'
            }, 
            {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Item Serial', 'CanAdd'),
            handler: this.onAdd
           },
            {
            xtype: 'tbseparator'
            },
           {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Item Serial', 'CanEdit'),
     
            handler: this.onEdit
        }, {
            xtype: 'button',
            text: 'Delete',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Item Serial', 'CanDelete'),
            handler: this.onDelete
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            id:'itemSerial-searchText',
            emptyText: 'Type Search text here and press "Enter"',
            submitemptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '200px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        Ext.getCmp('itemSerial-grid').onSearch();
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        Ext.getCmp('itemSerial-grid').onSearch();
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'itemSerial-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.itemSerial.Grid.superclass.initComponent.apply(this, arguments);
    },
    onSearch: function () {
        var grid = Ext.getCmp('itemSerial-grid');
        var storeId = Ext.getCmp('itemSerial-storeId').getValue();
        var itemId = Ext.getCmp('itemSerial-itemGrid').getSelectionModel().getSelected().get('Id');
        var searchText = Ext.getCmp('itemSerial-searchText').getValue();

        grid.store.baseParams = { record: Ext.encode({ storeId: storeId, itemId: itemId, searchText: searchText }) };
        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

    },
    onAdd: function () {
        var storeId = Ext.getCmp('itemSerial-storeId').getValue();
        var itemId = Ext.getCmp('itemSerial-itemGrid').getSelectionModel().getSelected().get('Id');
        if (typeof storeId == "undefined" || storeId == "" || typeof itemId == "undefined" || itemId == "")
        {
            Ext.MessageBox.show({
                title: 'error',
                icon: Ext.MessageBox.INFO,
                msg:"Please select store and item",
                buttons: {
                    ok: 'Ok'
                }
            });
            return;
        }
        new Ext.erp.ux.itemSerial.Window({
            storeId: storeId,
            itemId:itemId,
            title: 'Add Item Serial',
            action: 'Add'
        }).show();
    },
    onEdit: function () {

        var grid = Ext.getCmp('itemSerial-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var storeId = Ext.getCmp('itemSerial-storeId').getValue();
        var itemId = Ext.getCmp('itemSerial-itemGrid').getSelectionModel().getSelected().get('Id');

        new Ext.erp.ux.itemSerial.Window({
            storeId: storeId,
            itemId: itemId,
            title: 'Edit ItemSerial',
            itemSerialId: id,
            action: 'edit'
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('itemSerial-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
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
                    ItemSerial.Delete(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('itemSerial-paging').doRefresh();
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
    afterRender: function () {
     
        Ext.erp.ux.itemSerial.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('itemSerial-grid', Ext.erp.ux.itemSerial.Grid);

/**
* @desc      ItemSerial pickerGrid
* @author    Mef
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.itemSerial
* @class     Ext.erp.ux.itemSerial.PickerGrid
* @extends   Ext.grid.GridPanel
*/

var serialSelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.itemSerial.PickerGrid = function (config) {
    Ext.erp.ux.itemSerial.PickerGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ItemSerial.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'StoreId', 'ItemId', 'Number', 'Description', 'SN', 'PlateNo', 'IsDisposed', 'IsAvailable', 'Remark'],

            remoteSort: true
        }),
        id: 'itemSerial-pickerGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 300,
        sm: serialSelectionModel,
        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('itemSerial-pickerGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('itemSerial-pickerGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('itemSerial-pickerGrid').body.unmask();
            },
            afteredit: function (e) {
            }
        },
        cm: new Ext.grid.ColumnModel({
            columns: [serialSelectionModel,
                new Ext.grid.RowNumberer(),
                {
                    dataIndex: 'Number',
                    header: 'ETRE Code',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                }, {
                    dataIndex: 'Description',
                    header: 'Description',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                },
                {
                    dataIndex: 'PlateNo',
                    header: 'Plate No',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                }, {
                    dataIndex: 'SN',
                    header: 'SN',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                }, {
                    dataIndex: 'IsAvailable',
                    header: 'Is Available?',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        if (value)
                            return '<img src="Content/images/app/accept.png"/>';
                        else
                            return '<img src="Content/images/app/cancel.png"/>';
                    },
                }, {
                    dataIndex: 'Remark',
                    header: 'Remark',
                    sortable: true,
                    width: 70,
                    menuDisabled: true
                }, ]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.itemSerial.PickerGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
             {
                 xtype: 'tbfill'
             },
             {
                 xtype: 'textfield',
                 id: 'itemSerial-pickerSearchText',
                 emptyText: 'Type Search text here and press "Enter"',
                 submitemptyText: false,
                 enableKeyEvents: true,
                 style: {
                     borderRadius: '25px',
                     padding: '0 10px',
                     width: '200px'
                 },
                 listeners: {
                     specialKey: function (field, e) {
                         if (e.getKey() == e.ENTER) {
                             Ext.getCmp('itemSerial-pickerGrid').onSearch();
                         }
                     },
                     Keyup: function (field, e) {
                         if (field.getValue() == '') {
                             Ext.getCmp('itemSerial-pickerGrid').onSearch();
                         }
                     }
                 }
             }

        ]
        this.bbar = new Ext.PagingToolbar({
            id: 'itemSerial-pickerPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });

        Ext.erp.ux.itemSerial.PickerGrid.superclass.initComponent.apply(this, arguments);
    },
    onSearch:function(){

        var grid = Ext.getCmp('itemSerial-pickerGrid');
        var storeId =this.storeId;
        var itemId =this.itemId;
        var searchText = Ext.getCmp('itemSerial-pickerSearchText').getValue();

        grid.store.baseParams = { record: Ext.encode({ storeId: storeId, itemId: itemId, searchText: searchText }) };
        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

    },
    afterRender: function () {
        Ext.getCmp('itemSerial-pickerGrid').onSearch();
        Ext.erp.ux.itemSerial.PickerGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('itemSerial-pickerGrid', Ext.erp.ux.itemSerial.PickerGrid);

/**
* @desc      ItemSerial PickerWindow
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.itemSerial
* @class     Ext.erp.ux.itemSerial.PickerWindow
* @extends   Ext.grid.Window
*/

Ext.erp.ux.itemSerial.PickerWindow = function (config) {
    Ext.erp.ux.itemSerial.PickerWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'itemSerial-pickerWindow',
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
};
Ext.extend(Ext.erp.ux.itemSerial.PickerWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.itemSerial.PickerGrid({
            storeId: this.storeId,
            itemId: this.itemId

        });
        this.items = [this.grid];
        this.bbar = [
            {
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
                handler: this.onCancel,
                scope: this
            }];
        Ext.erp.ux.itemSerial.PickerWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var targetgrid = this.targetGrid;
         var selectionGrid = this.grid;
        if (!selectionGrid.getSelectionModel().hasSelection()) return;
        var selectedItems = selectionGrid.getSelectionModel().getSelections();
        var gridDatastore = targetgrid.getStore();
        var item = gridDatastore.recordType;

        for (var i = 0; i < selectedItems.length; i++) {

            var index = gridDatastore.findExact("ItemSerialId", selectedItems[i].get('Id'))
            if (index == -1) {

                var p = new item({
                    ItemSerialId: selectedItems[i].get('Id'),
                    ItemId: selectedItems[i].get('ItemId'),                   
                    StoreId: selectedItems[i].get('StoreId'),
                    Number: selectedItems[i].get('Number'),
                    SN: selectedItems[i].get('SN'),
                    IsAvailable: selectedItems[i].get('IsAvailable'),
                });

                var count = gridDatastore.getCount();
                gridDatastore.insert(count, p);
            }

        }
    },
    onCancel: function () {
        this.close();
    }
});
Ext.reg('itemSerial-pickerWindow', Ext.erp.ux.itemSerial.PickerWindow);



/**
* @desc      itemSerial panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @version   $Id: itemSerial.js, 0.1
* @namespace Ext.erp.ux.itemSerial
* @class     Ext.erp.ux.itemSerial.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.itemSerial.ItemPanel = function (config) {
    Ext.erp.ux.itemSerial.ItemPanel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id:'itemSerial-itemPanel',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.itemSerial.ItemPanel, Ext.Panel, {
    initComponent: function () {
         this.itemGrid = new Ext.erp.ux.itemSerial.ItemGrid();
        this.items = [this.itemGrid];
        Ext.erp.ux.itemSerial.ItemPanel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('itemSerial-itemPanel', Ext.erp.ux.itemSerial.ItemPanel);


/**
* @desc      Tabs
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @version   $Id: Item.js, 0.1
* @namespace Ext.erp.ux.tender
* @class     Ext.erp.ux.tender.Tab
* @extends   Ext.Tab
*/

Ext.erp.ux.itemSerial.Tabs = function (config) {
    Ext.erp.ux.itemSerial.Tabs.superclass.constructor.call(this, Ext.apply({
        activeTab: 0,
        frame: true,
        id: 'itemSerial-tab',
        items: [
            {
                xtype: 'itemSerial-grid',
                title: 'Item Serial'
            },
             {
                 xtype: 'custodian-panel',
                 title: 'Custodian'
             }

        ]
    }, config));
};
Ext.extend(Ext.erp.ux.itemSerial.Tabs, Ext.TabPanel, {
    initComponent: function () {
        Ext.erp.ux.itemSerial.Tabs.superclass.initComponent.apply(this, arguments);

    }

});
Ext.reg('itemSerial-tab', Ext.erp.ux.itemSerial.Tabs);




/**
* @desc      itemSerial panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @version   $Id: itemSerial.js, 0.1
* @namespace Ext.erp.ux.itemSerial
* @class     Ext.erp.ux.itemSerial.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.itemSerial.Panel = function (config) {
    Ext.erp.ux.itemSerial.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.itemSerial.Panel, Ext.Panel, {
    initComponent: function () {
        this.itemPanel = new Ext.erp.ux.itemSerial.ItemPanel();
        this.tabs = new Ext.erp.ux.itemSerial.Tabs();
        this.items = [{
            layout: 'vbox',
            layoutConfig: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start'
            },
            defaults: {
                flex: 1
            },
            items: [this.itemPanel, this.tabs]
        }];
        Ext.erp.ux.itemSerial.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('itemSerial-panel', Ext.erp.ux.itemSerial.Panel);



