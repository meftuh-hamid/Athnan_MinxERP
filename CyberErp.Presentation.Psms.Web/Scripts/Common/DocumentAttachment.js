Ext.ns('Ext.erp.ux.documentAttachment');

/**
* @desc      documentAttachment form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.documentAttachment
* @class     Ext.erp.ux.documentAttachment.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.documentAttachment.Form = function (config) {
    Ext.erp.ux.documentAttachment.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: DocumentAttachment.Save
           },
        paramOrder: ['id'],
        defaults: {
            labelStyle: 'text-align:right;',
            anchor: '95%',
            bodyStyle: 'background-color:transparent;',
            msgTarget: 'side',
        },
        id: 'documentAttachment-form',
        padding: 5,
        labelWidth: 100,
        autoHeight: true,
        border: false,
        fileUpload: true,
        baseCls: 'x-plain',
        items: [{
            xtype: 'fileuploadfield',
            fieldLabel: 'File',
            emptyText: 'Select document',
            name: 'DocumentUrl',
            buttonText: 'Browse...',
            multiple: true,
            iconCls: 'icon-browse',
            listeners: {
                'fileselected': function (field, value) {

                }
            }
        }, ],
    }, config));
};
Ext.extend(Ext.erp.ux.documentAttachment.Form, Ext.form.FormPanel);
Ext.reg('documentAttachment-form', Ext.erp.ux.documentAttachment.Form);




/**
* @desc      documentAttachment registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @namespace Ext.erp.ux.documentAttachment
* @class     Ext.erp.ux.documentAttachment.Window
* @extends   Ext.Window
*/
Ext.erp.ux.documentAttachment.Window = function (config) {
    Ext.erp.ux.documentAttachment.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.ux.documentAttachment.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.documentAttachment.Form();
      

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
        Ext.erp.ux.documentAttachment.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var window = this;
        var targetgrid = this.targetGrid;
        var type = this.type;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({}) },
            success: function (form, action) {
                var file = action.result.file;
                var fileExtension=action.result.fileExtension;
                if (type == "Item") {
                    var parameter = 'width=300,height=400,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
                    globalWindow.open(('Calculation/Import.aspx?action=' + type + '&file=' + action.result.file + '&fileExtension=' + action.result.fileExtension), '_blank', "height=300,width=400");
                }
                else if (type == "Item Balance") {
                    var parameter = 'width=300,height=400,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
                    globalWindow.open(('Calculation/BalanceImport.aspx?action=' + type + '&file=' + action.result.file + '&fileExtension=' + action.result.fileExtension), '_blank', "height=300,width=400");
                }
                else if (type == "Physical Balance") {
                    var parameter = 'width=300,height=400,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
                    globalWindow.open(('Calculation/BalanceImport.aspx?action=' + type + '&file=' + action.result.file + '&fileExtension=' + action.result.fileExtension), '_blank', "height=300,width=400");
                }
                else if (type == "Purchase Plan")
                {
                    Ext.MessageBox.show({
                        msg: 'Please wait...',
                        width: 250,
                        wait: true,
                        waitConfig: { interval: 1000 }
                    });

                    PurchasePlan.Import(fileExtension, file, function (result) {
                        if (result.success) {
                            var selectedItems = result.data;
                            var gridDatastore = targetgrid.getStore();
                            var item = gridDatastore.recordType;

                            for (var i = 0; i < selectedItems.length; i++) {

                                var index = gridDatastore.findExact("ItemId", selectedItems[i].ItemId)
                                if (index == -1) {
                                    var p = new item({
                                        ItemId: selectedItems[i].ItemId,
                                        Name: selectedItems[i].Name,
                                        Code: selectedItems[i].Code,
                                        UnitId: selectedItems[i].UnitId,
                                        MeasurementUnit: selectedItems[i].MeasurementUnit,
                                        Quantity: selectedItems[i].Quantity,
                                        Supplier: selectedItems[i].Supplier,
                                        UnitCost: selectedItems[i].UnitCost,
                                    });

                                    var count = gridDatastore.getCount();
                                    gridDatastore.insert(count, p);
                                }

                            }
                            Ext.MessageBox.show({
                                title: 'Success',
                                msg: "Sucessfully Imported",
                                buttons: Ext.Msg.OK,
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
               
                window.close();
            },
            failure: function (form, action) {
                Ext.MessageBox.hide();

                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            },
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('documentAttachment-window', Ext.erp.ux.documentAttachment.Window);



