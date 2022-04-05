

(function () {


    var oldSetActive = Ext.Window.prototype.setActive;

    var front = null;


    Ext.override(Ext.Window, {
        cls: 'blue-window-active',
        shadow: false,

        setActive: function (active) {            
            oldSetActive.call(this, active);

            if (active) {
                if (front && front != this && front.el)
                    front.removeClass('active-window');

                front = this;
                if (front.el)
                    front.addClass('active-window');
            }
        }
    });

})();