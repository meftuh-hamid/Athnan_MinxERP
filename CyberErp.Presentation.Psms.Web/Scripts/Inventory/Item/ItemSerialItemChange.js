Ext.ns('Ext.erp.ux.itemSerialItemChange');

/**
* @desc      itemSerialItemChange form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.itemSerialItemChange
* @class     Ext.erp.ux.itemSerialItemChange.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.itemSerialItemChange.Form = function (config) {
    Ext.erp.ux.itemSerialItemChange.Form.superclass.constructor.call(this, Ext.apply({
        api: {
          //  load: TenderSupplier.GetOffer,
          //  submit: TenderSupplier.SaveOffer
        },
        paramOrder: ['id'],
        defaults: {
            labelStyle: 'text-align:right;',
            anchor: '95%',
            bodyStyle: 'background-color:transparent;',
            msgTarget: 'side',
        },
        id: 'itemSerialItemChange-form',
        padding: 5,
        labelWidth: 100,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'ToItemId',
            xtype: 'hidden'
        }, {
            hiddenName: 'FromItemId',
            xtype: 'combo',
            fieldLabel: 'From Item',
            typeAhead: true,
            width: 100,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            emptyText: '---Type to Search---',
            mode: 'remote',
            allowBlank: false,
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
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
            valueField: 'Id',
            displayField: 'Name',
            pageSize: 10, 
        }, {
            hiddenName: 'ToItem',
            xtype: 'combo',
            fieldLabel: 'To Item',
            typeAhead: true,
            width: 100,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            emptyText: '---Type to Search---',
            mode: 'remote',
            allowBlank: false,
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
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
            valueField: 'Id',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('itemSerialItemChange-form').getForm();
                       form.findField("ToItemId").setValue(rec.id);
                },
            }
        }, ],
    }, config));
};
Ext.extend(Ext.erp.ux.itemSerialItemChange.Form, Ext.form.FormPanel);
Ext.reg('itemSerialItemChange-form', Ext.erp.ux.itemSerialItemChange.Form);




/**
* @desc      itemSerialItemChange registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @namespace Ext.erp.ux.itemSerialItemChange
* @class     Ext.erp.ux.itemSerialItemChange.Window
* @extends   Ext.Window
*/
Ext.erp.ux.itemSerialItemChange.Window = function (config) {
    Ext.erp.ux.itemSerialItemChange.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 400,

        autoHeight: true,
        closeAction: 'close',
        modal: true,
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
Ext.extend(Ext.erp.ux.itemSerialItemChange.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.itemSerialItemChange.Form();
      

        this.items = [this.form];
        this.bbar = [{
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
        Ext.erp.ux.itemSerialItemChange.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var window = this;
        var fromItemId = this.form.getForm().findField("FromItemId").getValue();
        var toItemId = this.form.getForm().findField("ToItemId").getValue();
        ItemSerial.ChangeItem(fromItemId, toItemId, function (result) {
            if (result.success) {
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
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('itemSerialItemChange-window', Ext.erp.ux.itemSerialItemChange.Window);



