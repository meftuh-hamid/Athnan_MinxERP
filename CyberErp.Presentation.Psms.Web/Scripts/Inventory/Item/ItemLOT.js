Ext.ns('Ext.erp.ux.itemLOT');
/**
* @desc      ItemSerial grid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.itemLOT
* @class     Ext.erp.ux.itemLOT.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.itemLOT.ItemGrid = function (config) {
    Ext.erp.ux.itemLOT.ItemGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Item.GetAllLOTItem,
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
                beforeLoad: function () { Ext.getCmp('itemLOT-itemGrid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('itemLOT-itemGrid').body.unmask(); },
                loadException: function () { Ext.getCmp('itemLOT-itemGrid').body.unmask(); },
                scope: this
            }
        }),
        id: 'itemLOT-itemGrid',
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
                var itemGrid = Ext.getCmp('itemLOT-itemGrid');
                var id=itemGrid.getSelectionModel().getSelected().data['Id'];
                Ext.getCmp('itemLOT-grid').itemId = id;
                Ext.getCmp('itemLOT-grid').onSearch();
               

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
Ext.extend(Ext.erp.ux.itemLOT.ItemGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
               xtype: 'tbfill'
           }, {
               xtype: 'textfield',
               id: 'itemLOTItem-searchText',
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
                           Ext.getCmp('itemLOT-itemGrid').onSearch();
                       }
                   },
                   Keyup: function (field, e) {
                       if (field.getValue() == '') {
                           Ext.getCmp('itemLOT-itemGrid').onSearch();
                       }
                   }
               }
           }];
        this.bbar = new Ext.PagingToolbar({
            id: 'itemLOTItem-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.itemLOT.Grid.superclass.initComponent.apply(this, arguments);
    },
    onSearch: function () {
        var itemGrid = Ext.getCmp('itemLOT-itemGrid');
        var searchText = Ext.getCmp('itemLOTItem-searchText').getValue();
        itemGrid.store.baseParams = { record: Ext.encode({ searchText: searchText }) };
        itemGrid.store.load({ params: { start: 0, limit: itemGrid.pageSize } });

    },
    afterRender: function () {
        this.onSearch();
        Ext.erp.ux.itemLOT.ItemGrid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('itemLOT-itemGrid', Ext.erp.ux.itemLOT.ItemGrid);

/**
* @desc      ItemLOT form
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.itemLOT
* @class     Ext.erp.ux.itemLOT.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.itemLOT.Form = function (config) {
    Ext.erp.ux.itemLOT.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ItemLOT.Get,
            submit: ItemLOT.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'itemLOT-form',
        frame: true,
        labelWidth: 130,
        padding: 5,
        autoHeight: false,
        border: false,
        loadDocument: function () {

            ItemLOT.GetDocumentNo(function (result) {
                var form = Ext.getCmp('itemLOT-form').getForm();
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
                            var form = Ext.getCmp('itemLOT-form').getForm();
                            form.findField('StoreId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('itemLOT-form').getForm();
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
                            name: 'NextLOTNumber',
                            xtype: 'textfield',
                            fieldLabel: 'Next LOT Number',
                            readOnly: true,
                            allowBlank: false
                        },
                        {
                            xtype: 'button',
                            width: 30,
                            id: 'generate-NextLOTNumber',
                            iconCls: 'icon-add',
                            handler: function () {
                                var form = Ext.getCmp('itemLOT-form').getForm();
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
Ext.extend(Ext.erp.ux.itemLOT.Form, Ext.form.FormPanel);
Ext.reg('itemLOT-form', Ext.erp.ux.itemLOT.Form);



/**
* @desc      ItemLOT detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.itemLOT
* @class     Ext.erp.ux.itemLOT.GridDetail
* @extends   Ext.grid.GridPanel
*/
var itemLOTSelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.itemLOT.GridDetail = function (config) {
    Ext.erp.ux.itemLOT.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ItemLOT.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            //  idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'StoreId', 'ItemId', 'Number', 'Quantity', 'CommittedQuantity', 'ManufacturedDate', 'Manufacturer', 'ExpiredDate', 'Remark'],

            remoteSort: true
        }),
        id: 'itemLOT-detailGrid',
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
                Ext.getCmp('itemLOT-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('itemLOT-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('itemLOT-detailGrid').body.unmask();
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
                    header: 'LOT Number',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'Quantity',
                    header: 'Quantity',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    },
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'Manufacturer',
                    header: 'Manufacturer',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: true
                    }
                }, {
                    dataIndex: 'ManufacturedDate',
                    header: 'Manufactured Date',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: Ext.util.Format.dateRenderer('m/d/Y'),
                    editor: {
                        xtype: 'datefield',
                        allowBlank: true
                    }
                }, {
                    dataIndex: 'ExpiredDate',
                    header: 'ExpiredDate',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: Ext.util.Format.dateRenderer('m/d/Y'),
                    editor: {
                        xtype: 'datefield',
                        allowBlank: true
                    }
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
Ext.extend(Ext.erp.ux.itemLOT.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('itemLOT-detailGrid');
                    var store = detailDrid.getStore();
                    var storeId = detailDrid.storeId;
                    var itemId = detailDrid.itemId;
                    var itemName = detailDrid.itemName;

                    var defaultData = {
                        StoreId: storeId,
                        ItemId: itemId,
                        Manufacturer: '',
                        ItemName: itemName,
                        CommittedQuantity: 0,
                        Quantity: 0,
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
                    var grid = Ext.getCmp('itemLOT-detailGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        return;

                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            }

        ]
        this.bbar = []

        Ext.erp.ux.itemLOT.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.ux.itemLOT.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('itemLOT-detailGrid', Ext.erp.ux.itemLOT.GridDetail);

/* @desc     itemLOTOrder form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date     September 2013
* @namespace Ext.erp.ux.itemLOTOrder
* @class     Ext.erp.ux.itemLOTOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.itemLOT.Window = function (config) {
    Ext.erp.ux.itemLOT.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'itemLOT-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
               
                if (typeof this.itemLOTId != "undefined" && this.itemLOTId != "") {

                    var grid = Ext.getCmp('itemLOT-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ itemLOTId: this.itemLOTId }) };

                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                } else {
                    if (this.isReceive) {
                        var grid = this.grid;
                        var store = grid.getStore();
                        var lOTItemGrid = store.recordType;
                        this.itemStore.each(function (item) {
                            var p = new lOTItemGrid({
                                Id: item.get('Id'),
                                ItemId: item.get('ItemId'),
                                ItemName: item.get('ItemName'),
                                ItemLOTId: item.get('ItemLOTId'),
                                StoreId: item.get('StoreId'),
                                Number: item.get('Number'),
                                Quantity: item.get('Quantity'),
                                OperationId: item.get('OperationId'),
                                Manufacturer: item.get('Manufacturer'),
                                ManufacturedDate: item.get('ManufacturedDate'),
                                ExpiredDate: item.get('ExpiredDate'),
                                Remark: item.get('Remark'),
                            });
                            var count = store.getCount();
                            store.insert(count, p);
                        });
                    }
                }

            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.itemLOT.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.itemLOT.GridDetail({
            storeId: this.storeId,
            itemId: this.itemId,
            itemName: this.itemName
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
        Ext.erp.ux.itemLOT.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (this.isReceive) {
            this.onLocalAdd();
            return;
        }

        var grid = Ext.getCmp('itemLOT-detailGrid');
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

            if (typeof item.get('Number') == 'undefined' || item.get('Number') == "") {
                if (errorMesssage == "")
                    errorMesssage = "Operation Number";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Operation Number";
            }
            if (typeof item.get('Quantity') == 'undefined' || item.get('Quantity') == "" || item.get('Quantity') <= 0) {
                if (errorMesssage == "")
                    errorMesssage = "Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Quantity";
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
           item.data['Manufacturer'] + ':' +
           (typeof item.data['ManufacturedDate'] != "undefined" && item.data['ManufacturedDate'] != "" ? (new Date(item.data['ManufacturedDate'])).format('M/d/y') : "") + ':' +
           (typeof item.data['ExpiredDate'] != "undefined" && item.data['ExpiredDate'] != "" ? (new Date(item.data['ExpiredDate'])).format('M/d/y') : "") + ':' +
           item.data['Quantity'] + ':' +
           item.data['CommittedQuantity'] + ':' +
           item.data['Remark'] + ':' +
           item.data['OperationId'] + ';';

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
        ItemLOT.SaveItemLOT(itemId, storeId, rec, function (result, response) {
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
                Ext.getCmp('itemLOT-paging').doRefresh();
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
        var selectionGrid = Ext.getCmp('itemLOT-detailGrid');
        var selectedGridStore = selectionGrid.getStore();
        var gridDatastore = targetgrid.lOTStore;
        var errorMesssage = '';
        this.removeOldRecord();
        selectedGridStore.each(function (item) {

            if (typeof item.get('Number') == 'undefined' || item.get('Number') == "") {
                if (errorMesssage == "")
                    errorMesssage = "Operation Number";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Operation Number";
            }
            if (typeof item.get('Quantity') == 'undefined' || item.get('Quantity') == "") {
                if (errorMesssage == "")
                    errorMesssage = "Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Quantity";
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
                    ItemLOTId: item.get('ItemLOTd'),
                    ItemId: item.get('ItemId'),
                    ItemName: item.get('ItemName'),
                    StoreId: item.get('StoreId'),
                    Number: item.get('Number'),
                    Quantity: item.get('Quantity'),
                    Manufacturer: item.get('Manufacturer'),
                    ManufacturedDate: item.get('ManufacturedDate'),
                    ExpiredDate: item.get('ExpiredDate'),
                    CommittedQuantity: item.get('CommittedQuantity'),
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
        var gridDatastore = this.targetGrid.lOTStore;

        this.itemStore.each(function (item) {
            gridDatastore.remove(item);
        });
    },
    onCancel: function () {
        this.close();
    }
});
Ext.reg('itemLOT-window', Ext.erp.ux.itemLOT.Window);

/**
* @desc      ItemLOT grid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.itemLOT
* @class     Ext.erp.ux.itemLOT.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.itemLOT.Grid = function (config) {
    Ext.erp.ux.itemLOT.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ItemLOT.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },

            fields: ['Id','ItemId',,'Item','StoreId', 'Number', 'Quantity', 'CommittedQuantity', 'ManufacturedDate', 'Manufacturer', 'ExpiredDate', 'Remark'],
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
        id: 'itemLOT-grid',
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
            dataIndex: 'Item',
            header: 'Item',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Number',
            header: 'LOT Number',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Quantity',
            header: 'Quantity',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'CommittedQuantity',
            header: 'Committed Quantity',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Manufacturer',
            header: 'Manufacturer',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ManufacturedDate',
            header: 'Manufactured Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ExpiredDate',
            header: 'Expired Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.itemLOT.Grid, Ext.grid.GridPanel, {
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
                id: 'itemLOT-storeId',
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

                        Ext.getCmp('itemLOT-grid').onSearch();
                    }
                }
            },
            {
                xtype: 'tbseparator'
            },
            {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Item LOT', 'CanAdd'),
            handler: this.onAdd
           },
            {
            xtype: 'tbseparator'
            },
           {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Item LOT', 'CanEdit'),
     
            handler: this.onEdit
        }, {
            xtype: 'button',
            text: 'Delete',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Item LOT', 'CanDelete'),
            handler: this.onDelete
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            id:'itemLOT-searchText',
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
                        Ext.getCmp('itemLOT-grid').onSearch();
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        Ext.getCmp('itemLOT-grid').onSearch();
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'itemLOT-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.itemLOT.Grid.superclass.initComponent.apply(this, arguments);
    },
    onSearch: function () {
        var grid = Ext.getCmp('itemLOT-grid');
        var storeId = Ext.getCmp('itemLOT-storeId').getValue();
        var itemId = grid.itemId;
        var searchText = Ext.getCmp('itemLOT-searchText').getValue();

        grid.store.baseParams = { record: Ext.encode({ storeId: storeId, itemId: itemId, searchText: searchText }) };
        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

    },
    onAdd: function () {
        var storeId = Ext.getCmp('itemLOT-storeId').getValue();
        var grid = Ext.getCmp('itemLOT-grid');
        var itemId = grid.itemId;
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
        new Ext.erp.ux.itemLOT.Window({
            storeId: storeId,
            itemId:itemId,
            title: 'Add Item LOT',
            action: 'Add'
        }).show();
    },
    onEdit: function () {

        var grid = Ext.getCmp('itemLOT-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var storeId = Ext.getCmp('itemLOT-storeId').getValue();
         var itemId = grid.itemId;
        new Ext.erp.ux.itemLOT.Window({
            storeId: storeId,
            itemId: itemId,
            title: 'Edit Item LOT',
            itemLOTId: id,
            action: 'edit'
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('itemLOT-grid');
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
                    ItemLOT.Delete(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('itemLOT-paging').doRefresh();
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
       
        Ext.erp.ux.itemLOT.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('itemLOT-grid', Ext.erp.ux.itemLOT.Grid);


/**
* @desc      ItemLOT pickerGrid
* @author    Mef
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.itemLOT
* @class     Ext.erp.ux.itemLOT.PickerGrid
* @extends   Ext.grid.GridPanel
*/

var lotSelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.itemLOT.PickerGrid = function (config) {
    Ext.erp.ux.itemLOT.PickerGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ItemLOT.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'StoreId', 'ItemId', 'Number', 'Quantity', 'CommittedQuantity', 'ManufacturedDate', 'Manufacturer', 'ExpiredDate', 'Remark'],

            remoteSort: true
        }),
        id: 'itemLOT-pickerGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 300,
        sm: lotSelectionModel,
        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('itemLOT-pickerGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('itemLOT-pickerGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('itemLOT-pickerGrid').body.unmask();
            },
            afteredit: function (e) {
            }
        },
        cm: new Ext.grid.ColumnModel({
            columns: [
                lotSelectionModel,
      new Ext.grid.RowNumberer(),
      {
          dataIndex: 'Number',
          header: 'LOT Number',
          sortable: true,
          width: 100,
          menuDisabled: true,
      }, {
          dataIndex: 'Quantity',
          header: 'Quantity',
          sortable: true,
          width: 100,
          menuDisabled: true,
          renderer: function (value) {
              return Ext.util.Format.number(value, '0,000.00 ');
          }
      }, {
          dataIndex: 'Manufacturer',
          header: 'Manufacturer',
          sortable: true,
          width: 70,
          menuDisabled: true,
      }, {
          dataIndex: 'ManufacturedDate',
          header: 'Manufactured Date',
          sortable: true,
          width: 70,
          menuDisabled: true,
          renderer: Ext.util.Format.dateRenderer('m/d/Y'),
      }, {
          dataIndex: 'ExpiredDate',
          header: 'ExpiredDate',
          sortable: true,
          width: 70,
          menuDisabled: true,
          renderer: Ext.util.Format.dateRenderer('m/d/Y'),
      }, {
          dataIndex: 'Remark',
          header: 'Remark',
          sortable: true,
          width: 70,
          menuDisabled: true,
      }, ]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.itemLOT.PickerGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
             {
                 xtype: 'tbfill'
             },
             {
                 xtype: 'textfield',
                 id: 'itemLOT-pickerSearchText',
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
                             Ext.getCmp('itemLOT-pickerGrid').onSearch();
                         }
                     },
                     Keyup: function (field, e) {
                         if (field.getValue() == '') {
                             Ext.getCmp('itemLOT-pickerGrid').onSearch();
                         }
                     }
                 }
             }

        ]
        this.bbar = new Ext.PagingToolbar({
            id: 'itemLOT-pickerPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });

        Ext.erp.ux.itemLOT.PickerGrid.superclass.initComponent.apply(this, arguments);
    },
    onSearch: function () {

        var grid = Ext.getCmp('itemLOT-pickerGrid');
        var storeId = this.storeId;
        var itemId = this.itemId;
        var searchText = Ext.getCmp('itemLOT-pickerSearchText').getValue();

        grid.store.baseParams = { record: Ext.encode({ storeId: storeId, itemId: itemId, searchText: searchText }) };
        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

    },
    afterRender: function () {
        Ext.getCmp('itemLOT-pickerGrid').onSearch();
        Ext.erp.ux.itemLOT.PickerGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('itemLOT-pickerGrid', Ext.erp.ux.itemLOT.PickerGrid);

/**
* @desc      ItemLOT PickerWindow
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.itemLOT
* @class     Ext.erp.ux.itemLOT.PickerWindow
* @extends   Ext.grid.Window
*/

Ext.erp.ux.itemLOT.PickerWindow = function (config) {
    Ext.erp.ux.itemLOT.PickerWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'itemLOT-pickerWindow',
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
Ext.extend(Ext.erp.ux.itemLOT.PickerWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.itemLOT.PickerGrid({
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
        Ext.erp.ux.itemLOT.PickerWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var targetgrid = this.targetGrid;
        var selectionGrid = this.grid;
        if (!selectionGrid.getSelectionModel().hasSelection()) return;
        var selectedItems = selectionGrid.getSelectionModel().getSelections();
        var gridDatastore = targetgrid.getStore();
        var item = gridDatastore.recordType;

        for (var i = 0; i < selectedItems.length; i++) {

            var index = gridDatastore.findExact("ItemLOTId", selectedItems[i].get('Id'))
            if (index == -1) {

                var p = new item({
                    ItemLOTId: selectedItems[i].get('Id'),
                    ItemId: selectedItems[i].get('ItemId'),
                    StoreId: selectedItems[i].get('StoreId'),
                    Number: selectedItems[i].get('Number'),
                    Quantity:0,
                    AvailableQuantity: selectedItems[i].get('Quantity'),
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
Ext.reg('itemLOT-pickerWindow', Ext.erp.ux.itemLOT.PickerWindow);


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
Ext.erp.ux.itemLOT.ItemPanel = function (config) {
    Ext.erp.ux.itemLOT.ItemPanel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'itemLOT-itemPanel',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.itemLOT.ItemPanel, Ext.Panel, {
    initComponent: function () {
        this.itemGrid = new Ext.erp.ux.itemLOT.ItemGrid();
        this.items = [this.itemGrid];
        Ext.erp.ux.itemLOT.ItemPanel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('itemLOT-itemPanel', Ext.erp.ux.itemLOT.ItemPanel);



/**
* @desc      itemLOT panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @version   $Id: itemLOT.js, 0.1
* @namespace Ext.erp.ux.itemLOT
* @class     Ext.erp.ux.itemLOT.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.itemLOT.Panel = function (config) {
    Ext.erp.ux.itemLOT.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.itemLOT.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.itemLOT.Grid();
        this.itemPanel = new Ext.erp.ux.itemLOT.ItemPanel();

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
            items: [this.itemPanel, this.headerGrid]
        }];

        Ext.erp.ux.itemLOT.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('itemLOT-panel', Ext.erp.ux.itemLOT.Panel);


