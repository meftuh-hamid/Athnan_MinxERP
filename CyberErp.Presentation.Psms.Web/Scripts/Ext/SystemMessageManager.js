Ext.namespace('Ext.erp.ux');

Ext.erp.ux.SystemMessageManager = function () {

    var _context = 'default';

    var _initDone = false;

    var _init = function () {
        var dlg = Ext.MessageBox.getDialog();
        dlg.on('hide', function () {
            dlg.el.removeClass([
                'msgbox-warning',
                'msgbox-prompt',
                'msgbox-question',
                'msgbox-info',
                'msgbox-error',
                'msgbox-critical',
                'msgbox-wait'
            ]);
        });

        Ext.MessageBox.CRITICAL = 'ext-mb-error';
        Ext.MessageBox.MISSING_RESPONSE = 'ext-mb-error';

        // sets the default to msgbox-error if no additional class was
        // specified, and adjusts the class of the used progressbar to the cls as
        // defined by the conjoon project
        dlg.on('show', function () {
            if (dlg.el.dom.className.indexOf('msgbox') == -1) {
                dlg.el.addClass('msgbox-error');
            }

            var el = Ext.DomQuery.selectNode('div[class*=x-progress-wrap]', dlg.el.dom);
            if (el) {
                Ext.fly(el).addClass('groupware-ProgressBar');
            }
        });

        // this will recompute the position on the screen based on the heigth/width
        // properties as specified in the css
        if (_context != 'iphone') {
            dlg.on('show', function () {
                var xy = dlg.el.getAlignToXY(document.body, 'c-c');
                var pos = dlg.el.translatePoints(xy[0], xy[1]);

                dlg.el.setLeftTop(pos.left, pos.top);
            });
        } else {
            // we will set a default height for the iphone
            // to 200 px for each Ext.MessageBox
            dlg.height = 200;
        }
    };

    return {



        /**
        * Sets the application context for the SystemMessageManager.
        * This is usually called upon application startup and only once during
        * application lifetime.
        *
        * @param {String} context
        */
        setContext: function (context) {
            if (!_initDone) {
                _init();
                _initDone = true;
            }

            _context = context;
        },

        /**
        * Shows a prompt dialog.
        *
        *
        */
        prompt: function (message, options) {
            var msg = Ext.MessageBox;

            var c = {};

            Ext.apply(c, message);

            c.msg = c.text;
            delete c.text;

            Ext.apply(c, {
                prompt: true,
                buttons: msg.OKCANCEL,
                icon: msg.QUESTION,
                cls: 'msgbox-prompt',
                width: 375
            });

            Ext.apply(c, options);
            this.show(c);
        },

        /**
        * Shows a dialog with an infinite loading progress bar.
        *
        * @param {Ext.erp.ux.SystemMessage} message
        * @param {Object} options
        */
        wait: function (message, options) {
            var msg = Ext.MessageBox;

            var c = {};

            Ext.apply(c, message);

            c.msg = c.text;
            delete c.text;

            Ext.apply(c, {
                buttons: false,
                cls: 'msgbox-wait',
                wait: true,
                draggable: false,
                progress: true,
                closable: false,
                width: 300
            });

            Ext.apply(c, options);
            this.show(c);
        },

        /**
        * Shows a confirm dialog.
        *
        * @param {Ext.erp.ux.SystemMessage} message
        * @param {Object} options
        */
        confirm: function (message, options) {
            var msg = Ext.MessageBox;

            var c = {};

            Ext.apply(c, message);

            c.msg = c.text;
            delete c.text;

            Ext.apply(c, {
                buttons: msg.YESNO,
                icon: msg.QUESTION,
                cls: 'msgbox-question',
                width: 400
            });

            Ext.apply(c, options);
            this.show(c);
        },

        /**
        * Hides any open dialog.
        */
        hide: function () {
            Ext.MessageBox.hide();
        },


        /**
        * Shows a dialog indicating an error happened.
        *
        * @param {Ext.erp.ux.SystemMessage} message
        * @param {Object} options
        */
        error: function (message, options) {
            var msg = Ext.MessageBox;

            var c = {};

            Ext.apply(c, message);

            c.msg = c.text;
            delete c.text;

            Ext.apply(c, {
                buttons: msg.OK,
                icon: msg.ERROR,
                cls: 'msgbox-error',
                width: 375
            });

            Ext.apply(c, options);
            this.show(c);
        },

        /**
        * Shows a system message using {Ext.Msg} taking the
        * context of the SystemMessageManager into account.
        *
        * @param {Object} config A configuration object to pass to
        * Ext.Msg.show()
        */
        show: function (config) {
            switch (_context) {
                case 'iphone':
                    Ext.apply(config, {
                        animEl: document
                    });
                    break;

                default:
                    break;
            }

            Ext.Msg.show(config);
        }
    };
} ();