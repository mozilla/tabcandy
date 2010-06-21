/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is toolbar-button.js.
 *
 * The Initial Developer of the Original Code is
 * Aza Raskin <aza@mozilla.com>
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * Ian Gilman <ian@iangilman.com>
 * Raymond Lee <raymond@appcoast.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

// **********
// Title: toolbar-button.js

(function(context){

var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
var win = windowMediator.getMostRecentWindow("navigator:browser");
var originalButtonImage = "chrome://tabcandy/content/img/core/candybutton.png";


function openAndReuseOneTabPerURL(url) {
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                     .getService(Components.interfaces.nsIWindowMediator);
  var recentWindow = wm.getMostRecentWindow("navigator:browser");

  var found = false;
  if(recentWindow) {
    var tabbrowser = recentWindow.gBrowser;

    // Check each tab of this browser instance
    var numTabs = tabbrowser.browsers.length;
    for (var index = 0; index < numTabs; index++) {
      var currentBrowser = tabbrowser.getBrowserAtIndex(index);
      if (url == currentBrowser.currentURI.spec) {

        // The URL is already opened. Select this tab.
        tabbrowser.selectedTab = tabbrowser.tabContainer.childNodes[index];

        found = true;
        break;
      }
    }
  }

  // Our URL isn't open. Open it now.
  if (!found) {
    if (recentWindow) {
      // Use an existing browser window
      recentWindow.delayedOpenTab(url, null, null, null, null);
    }
    else {
      // No browser windows are open, so open a new one.
      window.open(url);
    }
  }
}


function createButton(options){
  var navBar = win.document.getElementById("nav-bar");
  var button = win.document.querySelector("#" + options.id);
  if (button) button.parentNode.removeChild(button);

  button = win.document.createElement("toolbarbutton");
  button.setAttribute('label', options.label);
  button.setAttribute('tooltiptext', options.tooltip);
  button.setAttribute('image', options.image);
  button.setAttribute('id', options.id);
  button.style.opacity = .85;

  button.onclick = options.onclick;
  button.onmouseover = function(){ button.style.opacity = 1.0 }
  button.onmouseout = function(){ button.style.opacity = .85 }

  navBar.insertBefore(button, win.document.getElementById("urlbar-container"));
  return button;
}

function doTabCandy(){
  openAndReuseOneTabPerURL("chrome://tabcandy/content/index.html");
  win.gBrowser.moveTabToStart();
  win.gBrowser.selectedTab.style.display = "none";
}

// If this is being loaded in a XUL context (i.e., browser.xul)
// then create the tabcandy button. Otherwise, we'll just use be
// providing functions to fiddle with the button.
if( context.location.href.match(/\.xul/) ) {
  context.addEventListener(
    "load", function() {
      createButton({
        label:   "TabCandy",
        image:   originalButtonImage,
        id:      "tabcandy-button",
        tooltip: "Opens a visual tab interface. You can also use Command+1.",
        onclick: doTabCandy
      });
    }, false);

  win.gBrowser.openTabCandy = doTabCandy;
}
else {

  // ----------
  // Class: Toolbar
  // A singleton class available in the window namespace that lets you
  // manipulate the TabCandy toolbar button.
  Toolbar = {
    // ----------
    // Variable: button
    // A getter that yields the toolbar button for direct manipulation.
    get button(){
      return win.document.querySelector("#tabcandy-button");
    }
  }
  context.Toolbar = Toolbar;
}

})(window);