/// <reference path="Item.js" />
Ext.ns('Ext.erp.ux.taxPicker');
/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2019, Cybersoft
* @date      oct 16, 2019
* @namespace Ext.erp.ux.taxPicker
* @class     Ext.erp.ux.taxPicker.Window
* @extends   Ext.Window
*/
Ext.erp.ux.taxPicker.Window = function (config) {
    Ext.erp.ux.taxPicker.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 350,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.erp.ux.taxPicker.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.taxPicker.Grid({
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
        Ext.erp.ux.taxPicker.Window.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {

        var targetForm = this.targetForm;
        var selectionGrid = this.grid;
        if (!selectionGrid.getSelectionModel().hasSelection()) return;
        var selectedItems = selectionGrid.getSelectionModel().getSelections();
        var taxIds = '';
        var taxDescription = '';
        var taxRates = '';
        for (var i = 0; i < selectedItems.length; i++) {

            taxIds = taxIds + selectedItems[i].get('Id') + ':';
            taxDescription = taxDescription + selectedItems[i].get('Name') + "(" + selectedItems[i].get('Rate') + ")" + ':' + '\n';
            taxRates = taxRates + selectedItems[i].get('Rate') + ':' + selectedItems[i].get('IsAddition') + ':' + selectedItems[i].get('IsTaxable') + ";";
        }
        var targetForm = this.targetForm;
        targetForm.findField('TaxRateIds').setValue(taxIds);
        targetForm.findField('TaxRateDescription').setValue(taxDescription);
        targetForm.findField('TaxRate').setValue(taxRates);
        if (typeof this.targetGrid!="undefied" && this.targetGrid != null)
        this.targetGrid.calculateTax(true, '');
        this.close();
    },
    onClose: function () {

        this.close();
    }
});
Ext.reg('taxPicker-Window', Ext.erp.ux.taxPicker.Window);
/**
* @desc      Item Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2014, Cybersoft
* @date      oct 16, 2014
* @namespace Ext.erp.ux.taxPicker
* @class     Ext.erp.ux.taxPicker.Grid
* @extends   Ext.grid.GridPanel
*/
var taxRateSelectModel = new Ext.grid.CheckboxSelectionModel();

Ext.erp.ux.taxPicker.Grid = function (config) {
    Ext.erp.ux.taxPicker.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Psms.GetPagedTax,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },

            fields: ['Id', 'Name', 'Code', 'IsAddition', 'IsTaxable', 'Rate'],
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
        id: 'taxPicker-grid',
        pageSize: 10,
        height: 280,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: taxRateSelectModel,
        columns: [

        taxRateSelectModel, new Ext.grid.RowNumberer(), {
            dataIndex: 'Name',
            header: 'Item Name',
            sortable: true,
            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Rate',
            header: 'Rate',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'IsAddition',
            header: 'Is Addition?',
            sortable: true,
            width: 80,
            menuDisabled: true
        }
        ]
    }, config));
};
Ext.extend(Ext.erp.ux.taxPicker.Grid, Ext.grid.GridPanel, {
    initComponent: function () {

        this.store.baseParams = { record: Ext.encode({ itemCategoryId: '' }) };
        this.tbar = [
      '->',
        {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press   Enter',
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
                        var grid = Ext.getCmp('taxPicker-grid');

                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {

                        var grid = Ext.getCmp('taxPicker-grid');
                        var itemCategoryId = Ext.getCmp('taxPicker-itemCategory').getValue();

                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'taxPicker-itemSelectionPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.taxPicker.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.taxPicker.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('taxPicker-grid', Ext.erp.ux.taxPicker.Grid);
