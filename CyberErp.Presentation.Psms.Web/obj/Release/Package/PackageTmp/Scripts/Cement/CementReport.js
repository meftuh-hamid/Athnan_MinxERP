Ext.ns('Ext.erp.ux.rptCementReport');

/**
* @desc      General Ledger Report Criteria form

* @copyright (c) 2012, 
* @date      April 24, 2012
* @namespace Ext.erp.ux.rptCementReport
* @class     Ext.erp.ux.rptCementReport.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.rptCementReport.Form = function (config) {
    Ext.erp.ux.rptCementReport.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: ERPReport.SetBincardReportParam
        },
        defaults: {
            anchor: '95%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptCementReport-form',
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
                    ['Delivery', 'Delivery'],
                    ['Delivery By Customer', 'Delivery Customer'],
                    ['Delivery By Schedule', 'Delivery By Schedule'],
                ['Delivery By Balance', 'Delivery By Balance'], ]
            }),
            valueField: 'Id',
            displayField: 'Name',
           
        },  {
            xtype: 'hidden',
            name: 'ItemId'
        }, {
            xtype: 'hidden',
            name: 'Code'
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
                    fields: ['Id', 'Name','Code']
                }),
                api: { read: Item.GetSearchItems }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                scope: this,
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('rptCementReport-form').getForm();
                    form.findField('ItemId').setValue(rec.id);
                    form.findField('Code').setValue(rec.data['Code']);
                }
            }
        }, {
            xtype: 'hidden',
            name: 'SupplierId'
        }, {
            hiddenName: 'Supplier',
            xtype: 'combo',
            fieldLabel: 'Supplier',
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
                    fields: ['Id', 'Name', 'Code']
                }),
                api: { read: IP.GetSupplierBySearch }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                scope: this,
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('rptCementReport-form').getForm();
                    form.findField('SupplierId').setValue(rec.id);
                }
            }
        }, {
            xtype: 'hidden',
            name: 'CustomerId'
        }, {
            hiddenName: 'Customer',
            xtype: 'combo',
            fieldLabel: 'Customer',
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
                    fields: ['Id', 'Name', 'Code']
                }),
                api: { read: IP.GetCustomerBySearch }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                scope: this,
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('rptCementReport-form').getForm();
                    form.findField('CustomerId').setValue(rec.id);
                }
            }
        }, {
            xtype: 'hidden',
            name: 'StoreId'
        }, {
            hiddenName: 'Store',
            xtype: 'combo',
            fieldLabel: 'Location',
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
                api: { read: IP.GetStoreBySearch }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                scope: this,
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('rptCementReport-form').getForm();
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
                var form = Ext.getCmp('rptCementReport-form');
                form.getForm().submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        var iframePanel = Ext.getCmp('rptCementReport-iframePanel');
                        var url = 'Reports/ErpReportViewer.aspx?rt=CementReport' + '&' + (new Date).getTime();
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
                form = Ext.getCmp('rptCementReport-form').getForm();
                form.reset();

            },
            scope: this
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.rptCementReport.Form, Ext.form.FormPanel);
Ext.reg('rptCementReport-form', Ext.erp.ux.rptCementReport.Form);

/**
* @desc      General Ledger Report viewer panel
* @author    
* @copyright (c) 2010, 
* @date      November 01, 2010
* @namespace Ext.erp.ux.GeneralLedger
* @class     Ext.erp.ux.GeneralLedger.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.rptCementReport.Panel = function (config) {
    Ext.erp.ux.rptCementReport.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{}]
        }
    }, config));
}
Ext.extend(Ext.erp.ux.rptCementReport.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Reports/ErpReportViewer.aspx';
        this.form = new Ext.erp.ux.rptCementReport.Form();
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
                id: 'rptCementReport-iframePanel',
                items: [this.iframeComponent]
            }]
        }];

        Ext.erp.ux.rptCementReport.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptCementReport-panel', Ext.erp.ux.rptCementReport.Panel);
