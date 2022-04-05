Ext.ns("Ext.ux.renderer", "Ext.ux.grid");

Ext.ux.grid.ComboColumn = Ext.extend(Ext.grid.Column, {

    /**
    * @cfg {String} gridId
    *
    * The id of the grid this column is in. This is required to be able to refresh the view once the combo store has loaded
    */
    gridId: undefined,

    constructor: function (cfg) {
        Ext.ux.grid.ComboColumn.superclass.constructor.call(this, cfg);

        // Detect if there is an editor and if it at least extends a combobox, otherwise just treat it as a normal column and render the value itself
        this.renderer = (this.editor && this.editor.triggerAction) ? Ext.ux.renderer.ComboBoxRenderer(this.editor, this.gridId) : function (value) { return value; };
    }
});

Ext.grid.Column.types['combocolumn'] = Ext.ux.grid.ComboColumn;

/* a renderer that makes a editorgrid panel render the correct value */
Ext.ux.renderer.ComboBoxRenderer = function (combo, gridId) {
    /* Get the displayfield from the store or return the value itself if the record cannot be found */
    var getValue = function (value) {
        var idx = combo.store.find(combo.valueField, value);
        var rec = combo.store.getAt(idx);
        if (rec) {
            return rec.get(combo.displayField);
        }
        return value;
    }

    return function (value) {
        /* If we are trying to load the displayField from a store that is not loaded, add a single listener to the combo store's load event to refresh the grid view */
        if (combo.store.getCount() == 0 && gridId) {
            combo.store.on(
				'load',
				function () {
				    var grid = Ext.getCmp(gridId);
				    if (grid) {
				        grid.getView().refresh();
				    }
				},
				{
				    single: true
				}
			);
            return value;
        }

        return getValue(value);
    };
};