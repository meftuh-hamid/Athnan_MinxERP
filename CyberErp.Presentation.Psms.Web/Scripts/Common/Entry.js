Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = 'Content/images/default/s.gif';
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Ext.QuickTips.init();
    var reception = Ext.erp.ux.Reception;
    reception.getInstance(false);
    reception.showLogin(reception.TYPE_LOGIN);
    Ext.Direct.on('exception', function (e) {
        var title = 'Direct Exception', message;
        if (Ext.isDefined(e.where)) {
            message = String.format('<b>{0}</b><p>The exception was thrown from {1}.{2}()</p><pre>{3}</pre>', Ext.util.Format.nl2br(e.message), e.action, e.method, e.where);
            var w = new Ext.Window({
                title: title,
                width: 600,
                height: 400,
                modal: true,
                layout: 'fit',
                border: false,
                maximizable: true,
                items: {
                    html: message,
                    autoScroll: true,
                    preventBodyReset: true,
                    bodyStyle: 'font-size:12px',
                    padding: 5
                },
                buttons: [{
                    text: 'OK',
                    handler: function () {
                        w.close();
                    }
                }],
                buttonAlign: 'center',
                defaultButton: 0
            }).show();
        } else {
            message = 'Error occured. Unable to process request.';
            Ext.Msg.alert(title, message);
        }
    });
});