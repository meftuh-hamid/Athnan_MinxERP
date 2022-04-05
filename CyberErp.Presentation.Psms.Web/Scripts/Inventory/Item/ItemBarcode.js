Ext.ns('Ext.erp.ux.itemBarcode');

/**
* @desc      itemBarcode registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2020, 
* @date      January 27, 2011
* @namespace Ext.erp.ux.itemBarcode
* @class     Ext.erp.ux.itemBarcode.Window
* @extends   Ext.Window
*/
var mainWindow = window;
Ext.erp.ux.itemBarcode.Window = function (config) {
    Ext.erp.ux.itemBarcode.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 700,

        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {

                image = Ext.getCmp('photo-container');
                image.el.dom.src = '/Document/Barcode/' + this.itemId+".png" ;
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.itemBarcode.Window, Ext.Window, {
    initComponent: function () {
 
        this.items = [{
            xtype: 'panel',
            height: 350,
            cls: 'icon',
            renderTo: Ext.getBody(),
            title: 'Barcode Panel',
            items: [{
                xtype: 'box',
                id: 'photo-container',
                autoEl: {
                    tag: 'img',
                    id: 'barcode-photo',
                    height: 230,
                    width: 700,
                    src: 'Document/Barcode/Default.png?cd=' + new Date().getTime()
                }
            }]
        }];
        this.bbar = [{
            text: 'Print',
            iconCls: 'icon-preview',
            handler: this.onPrint,
            scope: this
        }, {
            text: 'QR',
            iconCls: 'icon-accept',
            handler: this.onQRSave,
            scope: this
        }, {
            text: 'Barcode',
            iconCls: 'icon-accept',
            handler: this.onBarcodeSave,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        this.tools = [{
            id: 'refresh',
            qtpsms: 'Reset',
            handler: function () {
                this.form.getForm().reset();
            },
            scope: this
        }];
        Ext.erp.ux.itemBarcode.Window.superclass.initComponent.call(this, arguments);
    },
    onQRSave: function () {
        var window = this;
        Item.GenerateBarCode(this.itemId,'QR', function (result) {
            if (result.success) {
                image = Ext.getCmp('photo-container');
                image.el.dom.src = '/Document/Barcode/' + window.itemId + ".png";

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
    },
    onBarcodeSave: function () {
        var window = this;
        Item.GenerateBarCode(this.itemId,'Barcode', function (result) {
            if (result.success) {
                image = Ext.getCmp('photo-container');
                image.el.dom.src = '/Document/Barcode/' + window.itemId + ".png";

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
    },
    onPrint: function () {

        var dvReport = document.getElementById("barcode-photo");

        var frame1 = dvReport.outerHTML;
        if (navigator.appName.indexOf("Internet Explorer") != -1) {
            frame1.name = frame1.id;
            window.frames[frame1.id].focus();
            window.frames[frame1.id].print();
        }
        else {
            var imgHtml = dvReport.outerHTML;

            var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');

            var strHtml = "<html>\n<head>\n <link rel=\"stylesheet\" type=\"text/css\" href=\"test.css\">\n</head><body onload='window.print();window.close()'><div style=\"testStyle\">\n" + imgHtml + "\n</div>\n</body>\n</html>";

            WindowObject.document.writeln(strHtml);
            WindowObject.document.close();
            WindowObject.focus();
        }
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('itemBarcode-window', Ext.erp.ux.itemBarcode.Window);
