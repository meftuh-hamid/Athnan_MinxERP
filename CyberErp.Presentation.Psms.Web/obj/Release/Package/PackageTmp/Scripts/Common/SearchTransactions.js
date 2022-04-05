Ext.ns('Ext.erp.ux.voucherSearch');
Ext.erp.ux.voucherSearch.Observable = new Ext.util.Observable();
Ext.erp.ux.voucherSearch.Observable.addEvents('searchvoucher');
Ext.erp.ux.voucherSearch.Observable.addEvents('searchvoucher1');

/**
* @desc      VoucherSearch form
* @namespace Ext.erp.ux.voucherSearch
* @class     Ext.erp.ux.voucherSearch.Form
* @extends   Ext.form.FormPanel
*/

Ext.apply(Ext.form.VTypes, {
    daterange: function (val, field) {
        var date = field.parseDate(val);
        if (!date) {
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            this.dateRangeMin = date;
        }
        return true;
    }
});

Ext.erp.ux.voucherSearch.Form = function (config) {
    Ext.erp.ux.voucherSearch.Form.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'voucherSearch-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'VoucherNo',
            xtype: 'textfield',
            fieldLabel: 'Voucher No'
        }, 
        {
            name: 'SearchText',
            xtype: 'textfield',
            fieldLabel: 'Search Text'
        }, {
            name: 'Status',
            xtype: 'textfield',
            fieldLabel: 'Status'
        }, {
            id: 'StartDate',
            name: 'StartDate',
            xtype: 'datefield',
            fieldLabel: 'Start Date',
            altFormats: 'c',
            editable: true,
            vtype: 'daterange',
            endDateField: 'EndDate',
            showToday: false
        }, {
            id: 'EndDate',
            name: 'EndDate',
            xtype: 'datefield',
            fieldLabel: 'End Date',
            altFormats: 'c',
            editable: true,
            vtype: 'daterange',
            startDateField: 'StartDate',
            showToday: false
        }, {
            name: 'Pending',
            xtype: 'checkbox',
            fieldLabel: 'Pending'
        }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.voucherSearch.Form, Ext.form.FormPanel);
Ext.reg('voucherSearch-form', Ext.erp.ux.voucherSearch.Form);

/**
* @desc      VoucherSearch form host window
* @namespace Ext.erp.ux.voucherSearch
* @class     Ext.erp.ux.voucherSearch.Window
* @extends   Ext.Window
*/
Ext.erp.ux.voucherSearch.Window = function (config) {
    Ext.erp.ux.voucherSearch.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 400,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
};
Ext.extend(Ext.erp.ux.voucherSearch.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.voucherSearch.Form();
        this.items = [this.form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Filter',
            iconCls: 'icon-filter',
            handler: this.onFilter,
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        var searchForm = this.form;
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                searchForm.getForm().reset();
            },
            scope: this
        }];
        Ext.erp.ux.voucherSearch.Window.superclass.initComponent.call(this, arguments);
    },
    onFilter: function (e) {
        var form = Ext.getCmp('voucherSearch-form').getForm();
        var result = {};
        result['status'] = form.findField('Status').getValue();
        result['referenceNo'] = form.findField('VoucherNo').getValue();
        result['tSearchText'] = form.findField('SearchText').getValue();
        result['searchText'] = form.findField('SearchText').getValue();
        result['startDate'] = form.findField('StartDate').getValue();
        result['endDate'] = form.findField('EndDate').getValue();
        result['pending'] = form.findField('Pending').getValue();
        if(this.action=='searcVoucher1')
            Ext.erp.ux.voucherSearch.Observable.fireEvent('searchvoucher1', result);
        else
            Ext.erp.ux.voucherSearch.Observable.fireEvent('searchvoucher', result);

    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('voucherSearch-window', Ext.erp.ux.voucherSearch.Window);
