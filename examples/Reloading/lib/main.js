
var FIREBUG = require("jetpack-firebug/firebug"),
	TIMERS = require("timers");


var reloadCounter = 0;

FIREBUG.registerModuleFactory(function(Window, Firebug, FBL, FBTrace)
{
	Firebug.ReloadingModule = FBL.extend(Firebug.Module,
	{
	    dispatchName: "ReloadingModule",

	    initialize: function()
	    {
	        Firebug.Module.initialize.apply(this, arguments);

	        FBTrace.sysout("reloading.ReloadingModule.initialize;");
	    }
	});
	return Firebug.ReloadingModule;
});

FIREBUG.registerPanelFactory(function(Window, Firebug, FBL, FBTrace)
{
	Firebug.ReloadingPanel = function ReloadingPanel() {}
	Firebug.ReloadingPanel.prototype = FBL.extend(Firebug.Panel,
	{
	    name: "reloading",
	    title: "Reloading",
	    searchable: true,
	    dispatchName: "ReloadingPanel",

	    initialize: function(context, document)
	    {
	        Firebug.Panel.initialize.apply(this, arguments);

	        FBTrace.sysout("reloading.ReloadingPanel.initialize;");
	    },

	    show: function(state)
	    {
	        this.panelNode.innerHTML = [
	            '<h2>Reloading Hello World! Counter: ' + reloadCounter + '</h2>',
  	            '<p><a class="reload-link" href="#">Reload!</a></p>'
	        ].join("\n");

	        this.panelNode.getElementsByClassName("reload-link").item(0).addEventListener("click", function()
	        {
	        	reloadCounter++;

				FIREBUG.internal.unattach();

				TIMERS.setTimeout(function()
				{
					FIREBUG.internal.attach();
				}, 2000);

	        }, false);
	    }
	});	
	return Firebug.ReloadingPanel;
});


