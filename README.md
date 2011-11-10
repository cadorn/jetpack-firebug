Firebug API for Jetpack
=======================

Use this package to build [Firebug Extensions](http://getfirebug.com/wiki/index.php/Firebug_Extensions) or interact with 
[Firebug](http://getfirebug.com/) from your [Add-on SDK based extensions](https://addons.mozilla.org/en-US/developers/builder).

Initial Objectives:

  * Register Firebug panels in restartless fashion
  * Register Firebug modules in restartless fashion
  * Log from jetpack extensions to Firebug Console
  * Log from jetpack extensions to Firebug Tracing Console


Requirements
============

  * Firefox 8+
  * [Firebug 1.9](http://getfirebug.com/releases/firebug/1.9/)
  * [Add-on SDK 1.2 (cadorns's branch)](https://github.com/cadorn/addon-sdk/)
    * Required patches from diff: [https://github.com/mozilla/addon-sdk/pull/157/files](https://github.com/mozilla/addon-sdk/pull/157/files)
      * `packages/addon-kit/lib/windows.js` - `get unsafeWindow() ...` - [https://bugzilla.mozilla.org/show_bug.cgi?id=676027](https://bugzilla.mozilla.org/show_bug.cgi?id=676027)
  * [FBTrace](http://getfirebug.com/wiki/index.php/FBTrace) (during development)

Examples
========

Sample jetpack extensions using this package are located in `./examples/`.

  * `HelloWorld` - Registering a panel to display *Hello World*.
  * `Reloading` - Test module and panel registration/removal

To run examples:

    cd /path/to/addon-sdk
    source bin/activate
    cd ./examples/*/
    cfx -b /Applications/Firefox.app/Contents/MacOS/firefox-bin --profiledir=./.ffprofile --package-path=../.. run
    // Install Firebug 1.9 and restart


TODO
====

Add-on SDK:

  * Land `get unsafeWindow() ...` for `packages/addon-kit/lib/windows.js` - [https://bugzilla.mozilla.org/show_bug.cgi?id=676027](https://bugzilla.mozilla.org/show_bug.cgi?id=676027)

Firebug (Tracking issue: [http://code.google.com/p/fbug/issues/detail?id=4977](http://code.google.com/p/fbug/issues/detail?id=4977)):

  * If Firebug is detached the panel's tab is not removed.
  * Panel tabs not being removed in extra browser windows if more than one browser window open.
  * "initialize" on panel is only called the first time it is registered. Not called when removed and re-registered with new instance using same name.
  * "initialize" on module is never called.
  * See: [http://code.google.com/p/fbug/issues/detail?id=4686](http://code.google.com/p/fbug/issues/detail?id=4686)
  * See: [http://code.google.com/p/fbug/source/browse/examples/firebug1.9/HelloWorldReloaded/readme.txt](http://code.google.com/p/fbug/source/browse/examples/firebug1.9/HelloWorldReloaded/readme.txt)


Author
======

This project is authored and maintained by [Christoph Dorn](http://www.christophdorn.com/).


License
=======

[MIT License](http://www.opensource.org/licenses/mit-license.php)

Copyright (c) 2011+ [Christoph Dorn](http://www.christophdorn.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
