Ext.ns('Ext.erp.ux.itemCategoryChange');

/**
* @desc      itemCategoryChange form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.itemCategoryChange
* @class     Ext.erp.ux.itemCategoryChange.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.itemCategoryChange.Form = function (config) {
    Ext.erp.ux.itemCategoryChange.Form.superclass.constructor.call(this, Ext.apply({
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
        id: 'itemCategoryChange-form',
        padding: 5,
        labelWidth: 100,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [ {
            hiddenName: 'ToItemCategoryId',
            xtype: 'combo',
            fieldLabel: 'To Item Category',
            typeAhead: true,
            width: 100,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            emptyText: '---Type to Search---',
            mode: 'remote',
            allowBlank: false,
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Code}   {Name} </span></h3> </div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name','Code']
                }),
                autoLoad: true,
                api: { read: Psms.GetItemCategoryBySearch }
            }),
            valueField: 'Id',
            displayField: 'Name',
            pageSize: 10, 
        }, ],
    }, config));
};
Ext.extend(Ext.erp.ux.itemCategoryChange.Form, Ext.form.FormPanel);
Ext.reg('itemCategoryChange-form', Ext.erp.ux.itemCategoryChange.Form);




/**
* @desc      itemCategoryChange registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @namespace Ext.erp.ux.itemCategoryChange
* @class     Ext.erp.ux.itemCategoryChange.Window
* @extends   Ext.Window
*/
Ext.erp.ux.itemCategoryChange.Window = function (config) {
    Ext.erp.ux.itemCategoryChange.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.ux.itemCategoryChange.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.itemCategoryChange.Form();
      

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
        Ext.erp.ux.itemCategoryChange.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var window = this;
        var toItemCategoryId = this.form.getForm().findField("ToItemCategoryId").getValue();
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        var window = this;
        Item.ChangeItemCategory(this.itemIds, toItemCategoryId, function (result) {
            if (result.success) {
                Ext.getCmp('item-paging').doRefresh();

                    Ext.MessageBox.show({
                    title: 'Success',
                    msg: "Data has been changed successfully",
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                    });
                    window.close();
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
Ext.reg('itemCategoryChange-window', Ext.erp.ux.itemCategoryChange.Window);



