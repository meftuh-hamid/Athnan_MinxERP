Ext.ns('Ext.erp.ux.rptStockSummary');

/**
* @desc      General Ledger Report Criteria form
* @author    Meftuh Mohammed
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.erp.ux.rptStockSummary
* @class     Ext.erp.ux.rptStockSummary.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.rptStockSummary.Form = function (config) {
    Ext.erp.ux.rptStockSummary.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: ERPReport.SetBincardReportParam
        },
        defaults: {
            anchor: '95%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptStockSummary-form',
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
                    ['Transaction', 'Transaction'],
                    ['StockMovement', 'Stock Movement'],
                    ['StockMovementBySubCategory', 'Stock Movement By Sub Category'],
                    ['StockMovementByCategory', 'Stock Movement By Category'],
                    ['StockStatus', 'Stock Status'],
                    ['ObsoleteStock', 'Obsolete Stock'],
                    ['StockEvaluation', 'Stock Evaluation']
                      
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
                    var form = Ext.getCmp('rptStockSummary-form').getForm();
                    form.findField('ItemId').setValue(rec.id);
                }
            }
        }, {
            xtype: 'hidden',
            name: 'StoreId'
        }, {
            hiddenName: 'Store',
            xtype: 'combo',
            fieldLabel: 'Store',
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
                scope: this,
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('rptStockSummary-form').getForm();
                    form.findField('StoreId').setValue(rec.id);
                }
            }
        },  {
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
                var form = Ext.getCmp('rptStockSummary-form');
                form.getForm().submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        var iframePanel = Ext.getCmp('rptStockSummary-iframePanel');
                        var url = 'Reports/ErpReportViewer.aspx?rt=StockSummary' + '&' + (new Date).getTime();
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
                form = Ext.getCmp('rptStockSummary-form').getForm();
                form.reset();

            },
            scope: this
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.rptStockSummary.Form, Ext.form.FormPanel);
Ext.reg('rptStockSummary-form', Ext.erp.ux.rptStockSummary.Form);

/**
* @desc      General Ledger Report viewer panel
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.GeneralLedger
* @class     Ext.erp.ux.GeneralLedger.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.rptStockSummary.Panel = function (config) {
    Ext.erp.ux.rptStockSummary.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{}]
        }
    }, config));
}
Ext.extend(Ext.erp.ux.rptStockSummary.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Reports/ErpReportViewer.aspx';
        this.form = new Ext.erp.ux.rptStockSummary.Form();
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
                id: 'rptStockSummary-iframePanel',
                items: [this.iframeComponent]
            }]
        }];

        Ext.erp.ux.rptStockSummary.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptStockSummary-panel', Ext.erp.ux.rptStockSummary.Panel);
