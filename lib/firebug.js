
/**
 * This module is based on: http://code.google.com/p/fbug/source/browse/examples/firebug1.9/HelloWorldReloaded/
 */

var WINDOWS = require("windows").browserWindows,
    UNLOAD = require("unload"),
    TIMERS = require("timers");


var factories = {
        module: [],
        panel: []
    },
    /**
     * QUESTION: Best Practice?
     * 
     * The following two variables keep track of the module and panel instances for
     * each window which are needed to remove the module or panel again.
     * 
     * Instead we could store the module and panel instances in [jetpack]window.__firebug.modules
     * and [jetpack]window.__firebug.panels
     */
    windows = [],
    windowInstances = {};


/**
 * Public API
 */

exports.registerModuleFactory = function(factory)
{
    factories.module.push(factory);
    attach(undefined, ["module", factory]);
}

exports.registerPanelFactory = function(factory)
{
    factories.panel.push(factory);
    attach(undefined, ["panel", factory]);
}

exports.internal = {
    attach: function()
    {
        attach();
    },
    unattach: function()
    {
        unattach();
    }
}



/**
 * Track windows to attach modules and panels. This is necessary as every new
 * window gets its own `Firebug` instance.
 */

WINDOWS.on("open", attach);
UNLOAD.when(function()
{
    unattach();
});

function attach(window, factory)
{
	var i;

    // if no `window` object we call ourselves for every window
    if (typeof window === "undefined")
    {
        for (i in WINDOWS)
        {
            attach(WINDOWS[i], factory);
        }       
        return;
    }

    // TODO: Remove this once we have a workaround
    if (typeof window.unsafeWindow === "undefined")
    {
        throw new Error("`window` object from addon-sdk/windows module must have `unsafeWindow` property!");
    }

    if (typeof window.unsafeWindow.Firebug === "undefined")
    {
        return;
    }
    
    // The "Firebug" object may be defined while we have an incomplete "FBL" object.
    // We thus wait for the complete FPL API before proceeding.
    if (typeof window.unsafeWindow.FBL === "undefined" || typeof window.unsafeWindow.FBL.extend === "undefined")
    {
    	TIMERS.setTimeout(function()
    	{
    		attach(window, factory);
    	}, 100);
        return;
    }

    // if no `factory` object we call ourselves for every module and panel
    if (typeof factory === "undefined")
    {
        for (i in factories.module)
        {
            attach(window, ["module", factories.module[i]]);
        }       
        for (i in factories.panel)
        {
            attach(window, ["panel", factories.panel[i]]);
        }       
        return;
    }
    
    var obj;

    try
    {
        obj = factory[1](window.unsafeWindow, window.unsafeWindow.Firebug, window.unsafeWindow.FBL, window.unsafeWindow.FBTrace);
    }
    catch(e)
    {
        console.error("Error calling " + factory[0] + " factory: " + e, e);
    }
    
    try
    {
        // Register module/panel with Firebug
        window.unsafeWindow.Firebug["register" + factory[0].charAt(0).toUpperCase() + factory[0].slice(1)](obj);
    
        if (factory[0] === "panel")
        {
            window.unsafeWindow.Firebug.chrome.syncMainPanels();
        }
    }
    catch(e)
    {
        console.error("Error attaching " + factory[0] + " module: " + e, e);
    }
    
    var index = windows.indexOf(window);
    if (index === -1)
    {
        windows.push(window);
        index = windows.length-1;
        window.on("close", function()
        {
            unattach(window);
        });
    }
    if (!windowInstances["i"+index])
    {
        windowInstances["i"+index] = [];
    }
    windowInstances["i"+index].push([factory[0], obj]);
}


function unattach(window)
{
	var i,
		inst;

    // if no `window` object we call ourselves for every window
    if (typeof window === "undefined")
    {
        for (i in WINDOWS)
        {
            unattach(WINDOWS[i]);
        }       
        return;
    }

    // TODO: Remove this once we have a workaround
    if (typeof window.unsafeWindow === "undefined")
        throw new Error("`window` object from addon-sdk/windows module must have `unsafeWindow` property!");

    if (typeof window.unsafeWindow.Firebug === "undefined")
    {
        return;
    }
    
    var index = windows.indexOf(window);
    if (index === -1)
    {
        return;
    }
    
    try
    {
    	for (i in windowInstances["i"+index])
    	{
    		inst = windowInstances["i"+index][i];
	    	if (inst[0] === "panel")
	        {
	            // Make sure another panel is selected if the current one has been removed.
	            // xxxHonza: should be done automatically by Firebug
	            window.unsafeWindow.Firebug.chrome.selectPanel("html");
	        }

            // Unregister module/panel from Firebug
	    	window.unsafeWindow.Firebug["unregister" + inst[0].substring(0, 1).toUpperCase() + inst[0].substring(1, inst[0].length)](inst[1]);
    	}
    	
        window.unsafeWindow.Firebug.chrome.syncMainPanels();
    }
    catch(e)
    {
        console.error("Error unattaching " + inst[0] + " module: " + e, e);
    }

    delete windowInstances["i"+index];
    delete windows.splice(index, 1);
}
