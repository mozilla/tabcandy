(function(contentWindow){
  
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
var document = window.document;
var navBar = document.getElementById("nav-bar");

function openAndReuseOneTabPerURL(url) {
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                     .getService(Components.interfaces.nsIWindowMediator);
  var browserEnumerator = wm.getEnumerator("navigator:browser");

  // Check each browser instance for our URL
  var found = false;
  while (!found && browserEnumerator.hasMoreElements()) {
    var browserWin = browserEnumerator.getNext();
    var tabbrowser = browserWin.gBrowser;

    // Check each tab of this browser instance
    var numTabs = tabbrowser.browsers.length;
    for (var index = 0; index < numTabs; index++) {
      var currentBrowser = tabbrowser.getBrowserAtIndex(index);
      if (url == currentBrowser.currentURI.spec) {

        // The URL is already opened. Select this tab.
        tabbrowser.selectedTab = tabbrowser.tabContainer.childNodes[index];

        // Focus *this* browser-window
        browserWin.focus();

        found = true;
        break;
      }
    }
  }

  // Our URL isn't open. Open it now.
  if (!found) {
    var recentWindow = wm.getMostRecentWindow("navigator:browser");
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
  var id = 'tabcandy-' + options.id;  
  let button = window.document.querySelector("#" + id);
  if (button) button.parentNode.removeChild(button);
  
  button = window.document.createElement("toolbarbutton");
  button.setAttribute('label', options.label);
  button.setAttribute('tooltiptext', options.tooltip);
  button.setAttribute('image', options.image);
  button.setAttribute('id', id);
  button.style.opacity = .85;
  
  button.onclick = options.onclick
  button.onmouseover = function(){ button.style.opacity = 1.0 }
  button.onmouseout = function(){ button.style.opacity = .85 }  
  
  navBar.insertBefore(button, window.document.getElementById("urlbar-container"));
}

function doTabCandy(){
  openAndReuseOneTabPerURL("chrome://tabcandy/content/candies/revision-a/index.html");
  window.gBrowser.moveTabToStart();
  window.gBrowser.selectedTab.style.display = "none";  
}

createButton({
  label:   "TabCandy",
  image:   "chrome://tabcandy/content/img/shared/candybutton.png",
  id:      "tabcandy-button",
  tooltip: "Opens a visual tab interface. You can also use Command+1.",
  onclick: doTabCandy
});

})(window);