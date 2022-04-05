Ext.ns('Ext.ux.tree');
 
/**
 * Creates new ArrayTree
 * @constructor
 * @param {Object} config A config object
 */
Ext.ux.tree.ArrayTree = Ext.extend(Ext.tree.TreePanel, {

	// {{{
    // configurables
	collapseAllText:'Collapse All'
	
	/**
	 * @cfg {Object} defaultRootConfig Default configuration of root node 
	 * @private
	 */
    ,defaultRootConfig:{
		 loaded:true
		,expanded:true
		,leaf:false
		,id:Ext.id()
	}

	/**
	 * @cfg {Boolean} defaultTools true to create Expand All/Collapse All tools
	 */
	,defaultTools:true

	,expandAllText:'Expand All'

	/**
	 * @cfg {Object} expandedNodes keeps currently expanded nodes paths for state keeping
	 * @private
	 */
	,expandedNodes:{}

	/**
	 * @cfg {Object} rootConfig Configuration for the root node
	 */ 

	/**
	 * @cfg {Object} stateEvents allows us to keep expanded state
	 * @private
	 */
	,stateEvents:['expandnode', 'collapsenode']
	// }}}
	// {{{
    ,initComponent:function() {
        
		// create root config
		var rootConfig = Ext.apply(Ext.ux.util.clone(this.defaultRootConfig), this.rootConfig, {children:this.children});

		var config = {
			 root:new Ext.tree.AsyncTreeNode(rootConfig)
			,loader: new Ext.tree.TreeLoader({
				 preloadChildren:true
				,clearOnLoad:false
			})
			,sorter:this.sort ? new Ext.tree.TreeSorter(this) : undefined
		}; // eo config object

		if(this.defaultTools) {
			Ext.apply(config, {
				tools:[{
					 id:'minus'
					,qtip:this.collapseAllText
					,scope:this
					,handler:this.collapseAll
				},{
					 id:'plus'
					,qtip:this.expandAllText
					,scope:this
					,handler:this.expandAll
				}]
			});
		}
        
		// apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        Ext.ux.tree.ArrayTree.superclass.initComponent.apply(this, arguments);

		// handle expanded/collapsed state for state keeping
		if(false !== this.stateful) {
			this.on({
				 scope:this
				,beforeexpandnode:this.beforeExpandNode
				,beforecollapsenode:this.beforeCollapseNode
			});
		}
 
    } // e/o function initComponent
	// }}}
	// {{{
	/**
	 * @private
	 * Load root node on render. Required for upcoming Ext 2.2
	 */
	,onRender:function() {
		Ext.ux.tree.ArrayTree.superclass.onRender.apply(this, arguments);
		this.loader.load(this.root);
	} // eo function onRender
	// }}}
	// {{{
	/**
	 * restores tree state (expands nodes)
	 * @private
	 */
	,afterRender:function() {
		// call parent
		Ext.ux.tree.ArrayTree.superclass.afterRender.apply(this, arguments);

		// restore tree state
		//console.log(this.expandedNodes);
		for(var id in this.expandedNodes) {
			if(this.expandedNodes.hasOwnProperty(id)) {
				this.expandPath(this.expandedNodes[id]);
			}
		}
	} // eo function onRender
	// }}}
	// {{{
	/**
	 * saves path of the node
	 * @private
	 */
	,beforeExpandNode:function(n) {
		if(n.id) {
			this.expandedNodes[n.id] = n.getPath();
		}
	} // eo function beforeExpandNode
	// }}}
	// {{{
	/**
	 * deletes expanded state
	 */
	,beforeCollapseNode:function(n) {
		if(n.id) {
			delete(this.expandedNodes[n.id]);
			n.cascade(function(child) {
				if(child.id) {
					delete(this.expandedNodes[child.id]);
				}
			}, this);
		}
	} // eo function beforeCollapseNode
	 // }}}
	// {{{
	/**
	 * returns the expandedNodes hash
	 * @private
	 */
	,getState:function() {
		return {expandedNodes:this.expandedNodes};
	} // eo function getState
	// }}}

}); // eo extend
 
// register xtype
Ext.reg('arraytree', Ext.ux.tree.ArrayTree); 
 
// eof
