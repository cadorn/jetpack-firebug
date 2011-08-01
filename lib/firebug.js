
var WINDOWS = require("windows").browserWindows,
    UNLOAD = require("unload");


var factories = {
        module: [],
        panel: []
    },
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
    // if no `window` object we call ourselves for every window
    if (typeof window === "undefined")
    {
        for each (var window in WINDOWS)
        {
            attach(window, factory);
        }       
        return;
    }

    // TODO: Remove this when addon-sdk is patched
    if (typeof window.unsafeWindow === "undefined")
        throw new Error("`window` object from addon-sdk/windows module must have `unsafeWindow` property!");

    // if no `factory` object we call ourselves for every module and panel
    if (typeof factory === "undefined")
    {
        for each (var func in factories.module)
        {
            attach(window, ["module", func]);
        }       
        for each (var func in factories.panel)
        {
            attach(window, ["panel", func]);
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
    // if no `window` object we call ourselves for every window
    if (typeof window === "undefined")
    {
        for each (var window in WINDOWS)
        {
            unattach(window);
        }       
        return;
    }

    // TODO: Remove this when addon-sdk is patched
    if (typeof window.unsafeWindow === "undefined")
        throw new Error("`window` object from addon-sdk/windows module must have `unsafeWindow` property!");

    var index = windows.indexOf(window);
    if (index === -1)
    {
        return;
    }
    
    try
    {
        for each (var inst in windowInstances["i"+index])
        {
            if (inst[0] === "panel")
            {
                // Make sure another panel is selected if the current one has been removed.
                // xxxHonza: should be done automatically by Firebug
                window.unsafeWindow.Firebug.chrome.selectPanel("html");
            }

            // Unregister module/panel from Firebug
            window.unsafeWindow.Firebug["unregister" + inst[0].charAt(0).toUpperCase() + inst[0].slice(1)](inst[1]);
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