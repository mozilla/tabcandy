// Title: toolbar-button.js
(function(context){
  
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
var win = windowMediator.getMostRecentWindow("navigator:browser");
var navBar = win.document.getElementById("nav-bar");
var originalButtonImage = "chrome://tabcandy/content/img/shared/candybutton.png";


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
  let button = win.document.querySelector("#" + options.id);
  if (button) button.parentNode.removeChild(button);
  
  button = win.document.createElement("toolbarbutton");
  button.setAttribute('label', options.label);
  button.setAttribute('tooltiptext', options.tooltip);
  button.setAttribute('image', options.image);
  button.setAttribute('id', options.id);
  button.style.opacity = .85;
  
  button.onclick = options.onclick
  button.onmouseover = function(){ button.style.opacity = 1.0 }
  button.onmouseout = function(){ button.style.opacity = .85 }  
  
  navBar.insertBefore(button, win.document.getElementById("urlbar-container"));
  return button;
}

function doTabCandy(){
  openAndReuseOneTabPerURL("chrome://tabcandy/content/candies/revision-a/index.html");
  win.gBrowser.moveTabToStart();
  win.gBrowser.selectedTab.style.display = "none";  
}

// If this is being loaded in a XUL context (i.e., browser.xul)
// then create the tabcandy button. Otherwise, we'll just use be
// providing functions to fiddle with the button.
if( context.location.href.match(/\.xul/) ){
  createButton({
    label:   "TabCandy",
    image:   originalButtonImage,
    id:      "tabcandy-button",
    tooltip: "Opens a visual tab interface. You can also use Command+1.",
    onclick: doTabCandy
  });
  
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
    },
  }  
  context.Toolbar = Toolbar;
}

})(window);