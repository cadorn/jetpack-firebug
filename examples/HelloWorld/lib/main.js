
var FIREBUG = require("jetpack-firebug/firebug");


FIREBUG.registerModuleFactory(function(Window, Firebug, FBL, FBTrace)
{
	Firebug.HelloWorldModule = FBL.extend(Firebug.Module,
	{
	    dispatchName: "HelloWorldModule",

	    initialize: function()
	    {
	        Firebug.Module.initialize.apply(this, arguments);

	        FBTrace.sysout("helloWorld.HelloWorldModule.initialize;");
	    }
	});
	return Firebug.HelloWorldModule;
});

FIREBUG.registerPanelFactory(function(Window, Firebug, FBL, FBTrace)
{
	Firebug.HelloWorldPanel = function HelloWorldPanel() {}
	Firebug.HelloWorldPanel.prototype = FBL.extend(Firebug.Panel,
	{
	    name: "helloWord",
	    title: "HelloWorld",
	    searchable: true,
	    dispatchName: "HelloWorldPanel",

	    initialize: function(context, document)
	    {
	        Firebug.Panel.initialize.apply(this, arguments);

	        FBTrace.sysout("helloWorld.HelloWorldPanel.initialize;");
	    },

	    show: function(state)
	    {
	        this.panelNode.innerHTML = "<h2>Hello World!</h2>";
	    }
	});	
	return Firebug.HelloWorldPanel;
});
