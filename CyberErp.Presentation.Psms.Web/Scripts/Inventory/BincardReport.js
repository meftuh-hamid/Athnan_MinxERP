Ext.ns('Ext.erp.ux.rptBincard');

/**
* @desc      General Ledger Report Criteria form
* @author    Meftuh Mohammed
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.erp.ux.rptBincard
* @class     Ext.erp.ux.rptBincard.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.rptBincard.Form = function (config) {
    Ext.erp.ux.rptBincard.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: ERPReport.SetBincardReportParam
        },
        defaults: {
            anchor: '95%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptBincard-form',
        padding: 5,
        labelWidth: 110,
        autoHeight: true,
        border: false,
        width: 840,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            hiddenName: 'ReportName',
            xtype: 'combo',
            fieldLabel: 'Report Name',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
            emptyText: '---Select---',
            allowBlank: false,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [
                    ['Bincard', 'Bincard'],
                    ['BincardList', 'Bincard List'],
                    ['Stockcard', 'Stockcard'],
                    ['Begining', 'Begining'],
                    ['Inventory', 'Inventory'],
                    ['InventoryByStore', 'Inventory By Store'],     
                    ['InventoryCounting', 'Inventory Counting'],
                    ['InventoryClosing', 'Inventory Closinng'],
                    ['InventoryReOrder', 'Inventory Re-Order'],
                    ['ItemClass', 'Inventory Class'],


                ]
            }),
            valueField: 'Id',
            displayField: 'Name',
           
        },  {
            xtype: 'hidden',
            name: 'ItemId'
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
            tpl:
                    '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">' +
                        '<p><h6 class="w3-text-teal w3-small "><span> ' + '{Name}' + '</span></h6></p>' +
                        '<p><h6 class="w3-text-teal w3-small "><span> ' + '{Code}' + '-' + '{PartNumber}' + '</span></h6></p>' +
                    '</span></div></tpl>', store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            totalProperty: 'total',
                            root: 'data',
                            fields: ['Id', 'Name', 'Code', 'PartNumber']
                        }),
                        api: { read: Item.GetItemBySearch }
                    }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                scope: this,
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('rptBincard-form').getForm();
                    form.findField('ItemId').setValue(rec.id);
                }
            }
        }, {
            hiddenName: 'StoreId',
            xtype: 'combo',
            fieldLabel: 'Store',
            typeAhead: true,
            width: 100,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            emptyText: '---Type to Search---',
            mode: 'remote',
            allowBlank: true,
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

            }
        }, {
            hiddenName: 'ItemCategoryId',
             xtype: 'combo',
            fieldLabel: 'item Category',
            triggerAction: 'all',
            mode: 'remote',
            editable: false,
            hidden: true,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: {
                    read: Psms.GetItemCategory
                }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
            }
        }, {
            hiddenName: 'FiscalYearId',
            xtype: 'combo',
            fieldLabel: 'Fiscal Year',
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
                api: {
                    read: Psms.GetFiscalYear
                }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
            }
        },{
            name: 'StartDate',
            xtype: 'datefield',
            fieldLabel: 'Start Date',
            width: 100,
            allowBlank: false,
           value: new Date(),
        }, {
            name: 'EndDate',
            xtype: 'datefield',
            fieldLabel: 'End Date',
            width: 100,
            allowBlank: false,
            value: new Date(),
        }],
        buttons: [{
            text: 'Preview',
            iconCls: 'icon-preview',
            handler: function () {
                var form = Ext.getCmp('rptBincard-form');
                form.getForm().submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        var iframePanel = Ext.getCmp('rptBincard-iframePanel');
                        var url = 'Reports/ErpReportViewer.aspx?rt=Bincard' + '&' + (new Date).getTime();
                        iframePanel.removeAll();
                        iframePanel.add(new Ext.erp.ux.common.IFrameComponent({ url: url }));
                        iframePanel.doLayout();
                    }
                });
            },
            scope: this
        }, {
            text: 'Cancel',
            iconCls: 'icon-exit',
            handler: function () {
                form = Ext.getCmp('rptBincard-form').getForm();
                form.reset();

            },
            scope: this
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.rptBincard.Form, Ext.form.FormPanel);
Ext.reg('rptBincard-form', Ext.erp.ux.rptBincard.Form);

/**
* @desc      General Ledger Report viewer panel
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.GeneralLedger
* @class     Ext.erp.ux.GeneralLedger.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.rptBincard.Panel = function (config) {
    Ext.erp.ux.rptBincard.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{}]
        }
    }, config));
}
Ext.extend(Ext.erp.ux.rptBincard.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Reports/ErpReportViewer.aspx';
        this.form = new Ext.erp.ux.rptBincard.Form();
        this.iframeComponent = new Ext.erp.ux.common.IFrameComponent({ url: this.url });
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                width: 350,
                collapsible: true,
                minSize: 100,
                maxSize: 500,
                split: true,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.form]
            }, {
                region: 'center',
                border: true,
                layout: 'fit',
                id: 'rptBincard-iframePanel',
                items: [this.iframeComponent]
            }]
        }];

        Ext.erp.ux.rptBincard.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptBincard-panel', Ext.erp.ux.rptBincard.Panel);
