Ext.ns('Ext.erp.ux.ProductionReport');

/**
* @desc      General Ledger Report Criteria form

* @copyright (c) 2012, 
* @date      April 24, 2012
* @namespace Ext.erp.ux.ProductionReport
* @class     Ext.erp.ux.ProductionReport.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.ProductionReport.Form = function (config) {
    Ext.erp.ux.ProductionReport.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: ERPReport.SetProductionReportParam
        },
        defaults: {
            anchor: '95%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptProductionReport-form',
        padding: 5,
        labelWidth: 110,
        autoHeight: true,
        border: false,
        width: 840,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        },{
            name: 'FiscalYearId',
            xtype: 'hidden'
        },{
            name: 'StoreId',
            xtype: 'hidden'
        }, {
            name: 'ItemId',
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
                    ['ProductionStatus', 'Production Order Vs Delivery'],
                    ['ProductionPlan', 'Production Plan'],
                    ['Production Delivery', 'Production Delivery'],
                    ['Production Full Status', 'Production Full Status']
                ]
            }),
            valueField: 'Id',
            displayField: 'Name',
           
        },
        {
            hiddenName: 'Store',
            xtype: 'combo',
            fieldLabel: 'Location',
            typeAhead: false,
            width: 100,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            emptyText: '---Type to Search---',
            mode: 'remote',
            allowBlank: true,
            hidden: false,
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
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
                    var form = Ext.getCmp('rptProductionReport-form').getForm();
                    form.findField('StoreId').setValue(rec.id);
                },
                change: function (cmb, newvalue, oldvalue) {
                    if (newvalue == "") {
                        var form = Ext.getCmp('rptProductionReport-form').getForm();
                        form.findField('StoreId').reset();

                    }
                }
            }
        },
         {
             hiddenName: 'ItemName',
             xtype: 'combo',
             fieldLabel: 'Item',
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
                     fields: ['Id', 'Code', 'Name']
                 }),
                 autoLoad: true,
                 api: { read: Psms.GetItemBySearch }
             }),
             valueField: 'Name',
             displayField: 'Name',
             pageSize: 10, listeners: {
                 select: function (cmb, rec, idx) {
                     var form = Ext.getCmp('rptProductionReport-form').getForm();
                     form.findField('ItemId').setValue(rec.id);
                 },
                 change: function (cmb, newvalue, oldvalue) {
                     if (newvalue == "") {
                         var form = Ext.getCmp('rptProductionReport-form').getForm();
                         form.findField('ItemId').reset();

                     }
                 }
             }
         },
        {
            hiddenName: 'ItemCategory',
            xtype: 'combo',
            fieldLabel: 'Item Category',
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
                    fields: ['Id', 'Code', 'Name']
                }),
                autoLoad: true,
                api: { read: Psms.GetItemCategoryBySearch }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10, 
        },
         {
             hiddenName: 'ItemMainCategory',
             xtype: 'combo',
             fieldLabel: 'Item Main Category',
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
                     fields: ['Id', 'Code', 'Name']
                 }),
                 autoLoad: true,
                 api: { read: Psms.GetItemCategoryBySearch }
             }),
             valueField: 'Name',
             displayField: 'Name',
             pageSize: 10,
         },
        {
            name: 'StartDate',
            xtype: 'datefield',
            fieldLabel: 'StartDate',
            width: 100,
            allowBlank: false,
            value: new Date(),
            maxValue: (new Date()).format('m/d/Y')
        }, {
            name: 'EndDate',
            xtype: 'datefield',
            fieldLabel: 'End Date',
            width: 100,
            allowBlank: false,
            value: new Date(),
            maxValue: (new Date()).format('m/d/Y')
        }
        ],
        buttons: [{
            text: 'Preview',
            iconCls: 'icon-preview',
            handler: function () {
                var form = Ext.getCmp('rptProductionReport-form');
                form.getForm().submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        var iframePanel = Ext.getCmp('rptProductionReport-iframePanel');
                        var url = 'Reports/ErpReportViewer.aspx?rt=ProductionStatus' + '&' + (new Date).getTime();
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
                form = Ext.getCmp('rptProductionReport-form').getForm();
                form.reset();

            },
            scope: this
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.ProductionReport.Form, Ext.form.FormPanel);
Ext.reg('rptProductionReport-form', Ext.erp.ux.ProductionReport.Form);

/**
* @desc      General Ledger Report viewer panel
* @author    
* @copyright (c) 2010, 
* @date      November 01, 2010
* @namespace Ext.erp.ux.GeneralLedger
* @class     Ext.erp.ux.GeneralLedger.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.ProductionReport.Panel = function (config) {
    Ext.erp.ux.ProductionReport.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{}]
        }
    }, config));
}
Ext.extend(Ext.erp.ux.ProductionReport.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Reports/ErpReportViewer.aspx';
        this.form = new Ext.erp.ux.ProductionReport.Form();
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
                id: 'rptProductionReport-iframePanel',
                items: [this.iframeComponent]
            }]
        }];

        Ext.erp.ux.ProductionReport.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptProductionReport-panel', Ext.erp.ux.ProductionReport.Panel);