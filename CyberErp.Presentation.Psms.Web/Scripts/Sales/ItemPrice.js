/// <reference path="ItemPrice.js" />
Ext.ns('Ext.erp.ux.itemPrice');
/**
* @desc      ItemPrice registration form
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      January 14, 2011
* @namespace Ext.erp.ux.itemPrice
* @class     Ext.erp.ux.itemPrice.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.itemPrice.Form = function (config) {
    Ext.erp.ux.itemPrice.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ItemPrice.Get,
            submit: ItemPrice.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'itemPrice-form',
        padding: 5,
        labelWidth: 115,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
         items: [{
            layout: 'column',
            border: false,
            bodyStyle: 'background-color:transparent;',
            defaults: {
                border: false,
                bodyStyle: 'background-color:transparent;',
                layout: 'form'
            },

            items: [{
                columnWidth: .50,
                labelWidth: 130,
                defaults: {
                    anchor: '95%'
                },
                items: [{
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    name: 'UnitId',
                    xtype: 'hidden'
                }, {
                    name: 'PriceGroupId',
                    xtype: 'hidden'
                }, {
                    name: 'PriceCategoryId',
                    xtype: 'hidden'
                }, {
                    name: 'ItemId',
                    xtype: 'hidden'
                }, {
                    name: 'Remark',
                    xtype: 'hidden'
                },  {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                },{
                    name: 'PriceCategory',
                    hiddenName: 'PriceCategory',
                    xtype: 'combo',
                    fieldLabel: 'Price Category',
                    anchor: '95%',
                    triggerAction: 'all',
                    mode: 'local',
                    width: 100,
                    editable: false,
                    typeAhead: true,
                    forceSelection: true,
                    selectOnFocus: true,
                    emptyText: '---Select---',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetPriceCategory }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('itemPrice-form').getForm();
                            form.findField("PriceCategoryId").setValue(rec.id);
                        },
                    }
                }, {
                    hiddenName: 'Item',
                    xtype: 'combo',
                    fieldLabel: 'Item',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    allowBlank: true,
                    mode: 'remote',
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                            '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            totalProperty: 'total',
                            root: 'data',
                            fields: ['Id', 'Name','Code', 'PurchasePrice']
                        }),
                        api: { read: Psms.GetItemBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        scope: this,
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('itemPrice-form').getForm();
                            form.findField('ItemId').setValue(rec.id);
                            form.findField('PurchasePrice').setValue(rec.data['PurchasePrice']);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {

                                var form = Ext.getCmp('itemPrice-form').getForm();
                                form.findField('ItemId').reset();

                            }
                        }
                    }
                }, {
                    name: 'Unit',
                    hiddenName: 'Unit',
                    xtype: 'combo',
                    fieldLabel: 'Unit',
                    anchor: '95%',
                    triggerAction: 'all',
                    mode: 'local',
                    width: 100,
                    editable: false,
                    typeAhead: true,
                    forceSelection: true,
                    selectOnFocus: true,
                    emptyText: '---Select---',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetMeasurementUnit }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('itemPrice-form').getForm();
                            form.findField("UnitId").setValue(rec.id);
                        },
                    }
                }, {
                    hiddenName: 'PriceGroup',
                    xtype: 'combo',
                    fieldLabel: 'Price Group',
                    triggerAction: 'all',
                    mode: 'remote',
                    editable: false,
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetPriceGroup }
                    }),
                    valueField: 'Id', displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('itemPrice-form').getForm();
                            form.findField('PriceGroupId').setValue(rec.id);

                        }
                    }

                }, ]
            }, {
                columnWidth: .50,
                labelWidth: 120,
                defaults: {
                    anchor: '95%'
                },
                items: [
                   
                    {
                    name: 'IsTaxable',
                    checked: true,
                    xtype: 'checkbox',
                    fieldLabel: 'Is Taxable?',
                    width: 100,
                    readOnly: false,
                    allowBlank: true,
                    checked: false
                }, {
                    name: 'IsActive',
                    checked: true,
                    xtype: 'checkbox',
                    fieldLabel: 'Is Active?',
                    width: 100,
                    readOnly: false,
                    allowBlank: true,
                    checked: false
                }, 
                {
                    name: 'UnitPrice',
                    xtype: 'numberfield',
                    fieldLabel: 'Unit Price',
                    width: 100,
                    allowBlank: false
                }, {
                    name: 'WithHoldingTax',
                    xtype: 'numberfield',
                    fieldLabel: 'WithHolding Tax',
                    width: 100,
                    allowBlank: false
                }, ]
            }]
        }]

    }, config));
};
Ext.extend(Ext.erp.ux.itemPrice.Form, Ext.form.FormPanel);
Ext.reg('itemPrice-form', Ext.erp.ux.itemPrice.Form);


/**
* @desc      ItemPrice registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.itemPrice
* @class     Ext.erp.ux.itemPrice.Window
* @extends   Ext.Window
*/
Ext.erp.ux.itemPrice.Window = function (config) {
    Ext.erp.ux.itemPrice.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 600,
        id: 'itemPrice-window',
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                var form = Ext.getCmp('itemPrice-form').getForm();
                form.findField('Id').setValue(this.itemPriceId);
                form.findField('PriceCategoryId').setValue(this.priceCategoryId);
                var priceGroupId = Ext.getCmp('itemPrice-priceGroupId').getValue();
                var priceGroup = Ext.getCmp('itemPrice-priceGroupId').getRawValue();
                var nodeName = this.itemPriceCategory.attributes.text;
                this.form.getForm().findField('PriceCategory').setValue(nodeName);
                this.form.getForm().findField('PriceGroupId').setValue(priceGroupId);
                this.form.getForm().findField('PriceGroup').setValue(priceGroup);
                if (typeof this.itemPriceId != "undefined" && this.itemPriceId!="") {
                    this.form.load({
                        params: { id: this.itemPriceId },
                        success: function (form, action) {
                            Ext.getCmp('itemPrice-form').onRangeTypeLoad();
                        },
                        failure: function (form, action) {
                        }
                    });
                }
                
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.itemPrice.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.itemPrice.Form();
        this.items = [this.form];
        this.bbar = ['->', {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
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
            },
            scope: this
        }];
        Ext.erp.ux.itemPrice.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var priceCategoryId = Ext.getCmp('priceCategory-tree').selectedUnitId;
        if (priceCategoryId != '' && priceCategoryId != "root-priceCategory")
        this.form.getForm().findField('PriceCategoryId').setValue(priceCategoryId);
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
                Ext.getCmp('itemPrice-form').getForm().reset();
                Ext.getCmp('itemPrice-paging').doRefresh();
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('itemPrice-window', Ext.erp.ux.itemPrice.Window);

/**
* @desc      ItemPrice grid
* @author   Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.itemPrice
* @class     Ext.erp.ux.itemPrice.Grid
* @extends   Ext.grid.GridPanel
*/
var itemelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.itemPrice.Grid = function (config) {
    Ext.erp.ux.itemPrice.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ItemPrice.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Item',
                direction: 'ASC'
            },
            fields: ['Id', 'PriceCategory', 'Code', 'UnitPrice', 'Item', 'WithHoldingTax', 'PriceGroup', 'Unit', 'IsTaxable', 'Remark', 'IsActive'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('itemPrice-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('itemPrice-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('itemPrice-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'itemPrice-grid',
        pageSize: 30,
        //height: 550,
        stripeRows: true,
        border: false,
        listeners: {
            afteredit: function (e) {
                var record = e.record;

                
            }
        },
        viewConfig: {
            forceFit: false,
            autoExpandColumn: 'Name',
            autoFill: true
        },
        listeners: {
            rowClick: function () {
            },
            rowdblclick: function (grid, rowIndex, e) {
                this.onEdit();
            },
            scope: this
        },
        sm: itemelectionModel,
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, itemelectionModel, new Ext.grid.RowNumberer(),
        {
            dataIndex: 'IsTaxable',
            header: 'Is Taxable?',
            sortable: true,
            width: 70,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }
        }, {
            dataIndex: 'IsActive',
            header: 'Is Active?',
            sortable: true,
            width: 70,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }
        }, {
            dataIndex: 'PriceCategory',
            header: 'Price Category',
            sortable: true,
            width: 100,
            hidden:true,
            menuDisabled: true
        }, {
            dataIndex: 'Item',
            header: 'Item',
            sortable: true,
            width: 250,
            menuDisabled: true
        }, {
            dataIndex: 'Unit',
            header: 'Unit',
            sortable: true,
            width: 60,
            menuDisabled: true
        },  {
            dataIndex: 'UnitPrice',
            header: 'Unit Price',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        },
        ]
    }, config));
};
Ext.extend(Ext.erp.ux.itemPrice.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [
            {
                xtype: 'displayfield',
                style: 'font-weight: bold',
                value:"Price Group"
            }, {
                xtype: 'tbseparator'
            }, {
                hiddenName: 'PriceGroup',
                xtype: 'combo',
                fieldLabel: 'Price Group',
                triggerAction: 'all',
                id:'itemPrice-priceGroupId',
                mode: 'remote',
                editable: false,
                forceSelection: true,
                emptyText: '---Select---',
                allowBlank: false,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: Psms.GetPriceGroup }
                }),
                valueField: 'Id', displayField: 'Name',
                listeners: {
                    select: function (cmb, rec, idx) {
                        Ext.getCmp('itemPrice-grid').onSearchGrid();

                    }
                }

            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'tbseparator'
            }, {
            xtype: 'button',
            text: 'Add',
            id: 'addItemPrice',
            iconCls: 'icon-add',
            handler: function () {
                var tree = Ext.getCmp('priceCategory-tree');
                var priceCategoryId = tree.selectedUnitId;
                var selectedNode = tree.getSelectionModel().getSelectedNode();
                if (typeof priceCategoryId == "undefined" || priceCategoryId=="" ||  priceCategoryId == "root-priceCategory") {
                    Ext.MessageBox.show({
                        title: 'Select',
                        msg: 'You must select an Price Category.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                new Ext.erp.ux.itemPrice.Window({
                    itemPriceId: '',
                    priceCategoryId: priceCategoryId,
                    itemPriceCategory: selectedNode,
                    title: 'Add ItemPrice'
                }).show();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editItemPrice',
            iconCls: 'icon-edit',
            handler:this.onEdit,
        },   {
            xtype: 'tbseparator'
        },  {
            xtype: 'button',
            text: 'Delete',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Item Price', 'CanDelete'),
            handler: this.onDeleteClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Save',
            iconCls: 'icon-save',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Item Price', 'CanAdd'),
            handler: this.onSaveClick
        },  {
            xtype: 'button',
            text: '',
            hidden:true,
            iconCls: 'icon-excel',
            handler: function () {
                var searchText = "";
                window.open('ItemPrice/ExportToExcel?st=' + searchText, '', '');
            }
        }, {
            xtype: 'button',
            text: 'Import',
            iconCls: 'icon-accept',
            disabled: false,
            handler: function () {
                var detailGrid = Ext.getCmp('itemPrice-grid');
                new Ext.erp.ux.documentAttachment.Window({
                    targetGrid: detailGrid,
                    importype: 'Item Price',
                }).show();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-itemPrice',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        },{
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press "Enter"',
            submitEmptyText: false,
            id:'itemPriceSearchText',
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '120px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        Ext.getCmp('itemPrice-grid').onSearchGrid();
                    }
                },
                Keyup: function (field, e) {
                      if (field.getValue() == '') {
                          Ext.getCmp('itemPrice-grid').onSearchGrid();
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'itemPrice-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.itemPrice.Grid.superclass.initComponent.apply(this, arguments);
    },
    onEdit: function () {
        var grid = Ext.getCmp('itemPrice-grid');
        var tree = Ext.getCmp('priceCategory-tree');
        var priceCategoryId = tree.selectedUnitId;
        var selectedNode = tree.getSelectionModel().getSelectedNode();
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
        new Ext.erp.ux.itemPrice.Window({
            itemPriceId: id,
            priceCategoryId: priceCategoryId,
            itemPriceCategory: selectedNode,
            title: 'Edit ItemPrice'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('itemPrice-grid');
        var id = grid.getSelectionModel().getSelected().get('Id');

        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected itemPrice',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    ItemPrice.Delete(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('itemPrice-paging').doRefresh();
                            Ext.MessageBox.show({
                                title: 'Sucesss',
                                msg: result.data,
                                buttons: Ext.Msg.OK,
                                      scope: this
                            });
                        }
                        else {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: result.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    }, this);
                }
            }
        });
    },
    onSaveClick: function () {

        var grid = Ext.getCmp('itemPrice-grid');
        var selectionGrid = grid;
        if (!selectionGrid.getSelectionModel().hasSelection()) return;
        var selectedItems = selectionGrid.getSelectionModel().getSelections();

        var rec = '';
       
        var rec = '';
        var errorMesssage = '';
        for (var i = 0; i < selectedItems.length; i++) {
            item = selectedItems[i];
            if (typeof item.get('UnitPrice') == 'undefined' || item.get('UnitPrice') == '') {
                if (errorMesssage == "")
                    errorMesssage = "Unit Price";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Unit Price";
            }
            if (errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for " + errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.data['Id'] + ':' +
            item.data['UnitPrice'] + ';';
              };
        if (errorMesssage != "")
            return;
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        ItemPrice.SaveItemPriceList(rec, function (result) {
            if (result.success) {
                Ext.getCmp('itemPrice-paging').doRefresh();
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
            }
            else {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        }, this);
    },
    onPreview: function () {

        var priceCategoryTree = Ext.getCmp('priceCategory-tree');
        var priceCategoryId = priceCategoryTree.selectedUnitId;
        var priceGroupId = Ext.getCmp('itemPrice-priceGroupId').getValue();
        var priceGroup= Ext.getCmp('itemPrice-priceGroupId').getRawValue();

        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
     
        window.open('Reports/ErpReportViewer.aspx?rt=PreviewItemPrice&id=' + priceCategoryId + '&priceGroupId=' + priceGroupId + '&priceGroup=' + priceGroup , 'PreviewIV', parameter);


    },
    onSearchGrid: function () {
        var priceCategoryTree = Ext.getCmp('priceCategory-tree');
        var priceCategoryId = priceCategoryTree.selectedUnitId;
        var itemPriceTree = Ext.getCmp('itemPrice-tree');
        var itemCategoryId = itemPriceTree.selectedUnitId;
        var priceGroupId = Ext.getCmp('itemPrice-priceGroupId').getValue();
      
        
        var searchValue = Ext.getCmp('itemPriceSearchText').getValue();
        
        var grid = Ext.getCmp('itemPrice-grid');
        grid.store.baseParams['record'] = Ext.encode({ priceGroupId: priceGroupId, priceCategoryId: priceCategoryId, itemCategoryId: itemCategoryId, searchText: searchValue });
        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

    }
   
});
Ext.reg('itemPrice-grid', Ext.erp.ux.itemPrice.Grid);

/**
* @desc      Item tree
* @author    Henock Melisse
* @copyright (c) 2011, Cybersoft
* @date      December 01, 2011
* @namespace Ext.erp.ux.item
* @class     Ext.erp.ux.item.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.erp.ux.itemPrice.Tree = function (config) {
    Ext.erp.ux.itemPrice.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'itemPrice-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: Item.PopulateTree
        }),
        selectedUnitId: 0,
        selectedUnitTypeId: 0,
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        stateful: false,
        root: {
            text: 'Item Categories',
            id: 'root-priceCategory'
        },
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                if (node.isExpandable()) {
                    node.reload();
                }
                node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-priceCategory' ? 0 : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id == 'root-priceCategory' ? 0 : node.attributes.id;
                var tree = Ext.getCmp('priceCategory-tree');
                var priceCategoryId = tree.selectedUnitId;
                var itemPriceGrid = Ext.getCmp('itemPrice-grid');
                var selectedUnit = node.attributes.id == 'root-priceCategory' ? '' : '[' + node.attributes.text + ']';
                Ext.getCmp('selected-unit').setValue(selectedUnit);
                Ext.getCmp('itemPrice-grid').onSearchGrid();
            },
            contextmenu: function (node, e) {
                node.select();
                node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-priceCategory' ? 0 : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id == 'root-priceCategory' ? 0 : node.attributes.id;
                var tree = Ext.getCmp('priceCategory-tree');
                var priceCategoryId = tree.selectedUnitId;
                var selectedUnit = node.attributes.id == 'root-priceCategory' ? '' : '[' + node.attributes.text + ']';
                Ext.getCmp('selected-unit').setValue(selectedUnit);
                Ext.getCmp('itemPrice-grid').onSearchGrid();
            },
            expand: function (p) {
                p.syncSize();
            }
        }
    }, config));
}
Ext.extend(Ext.erp.ux.itemPrice.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'displayfield',
            id: 'selected-unit',
            style: 'font-weight: bold'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all-itemPrice',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('itemPrice-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all-itemPrice',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('item-tree').collapseAll();
            }
        }];
        Ext.erp.ux.itemPrice.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('itemPrice-tree', Ext.erp.ux.itemPrice.Tree);

/**
* @desc      ItemPrice panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @version   $Id: ItemPrice.js, 0.1
* @namespace Ext.erp.ux.itemPrice
* @class     Ext.erp.ux.itemPrice.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.itemPrice.Panel = function (config) {
    Ext.erp.ux.itemPrice.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.itemPrice.Panel, Ext.Panel, {
    initComponent: function () {
        this.priceCategoryPanel = new Ext.erp.ux.priceCategory.Panel();
        this.grid = new Ext.erp.ux.itemPrice.Grid();
        this.itemCategoryTree = new Ext.erp.ux.itemPrice.Tree();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                width: 310,
                minSize: 310,
                maxSize: 400,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.priceCategoryPanel]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [{
                    layout: 'border',
                    border: false,
                    items: [{
                        region: 'west',
                        border: true,
                        width: 170,
                        minSize: 200,
                        maxSize: 400,
                        layout: 'fit',
                        margins: '0 3 0 0',
                        items: [this.itemCategoryTree]
                    }, {
                        region: 'center',
                        border: true,
                        layout: 'fit',
                        items: [this.grid]
                    }]
                }]
            }]
        }];
        Ext.erp.ux.itemPrice.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('itemPrice-panel', Ext.erp.ux.itemPrice.Panel);