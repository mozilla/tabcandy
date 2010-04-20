(function(context){
  
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
var win = windowMediator.getMostRecentWindow("navigator:browser");
var navBar = win.document.getElementById("nav-bar");
var orignalButtonImage = "chrome://tabcandy/content/img/shared/candybutton.png";


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
    image:   orignalButtonImage,
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
    _unreadCount: 0,
    
    // ----------
    // Variable: button
    // A getter that yields the toolbar button for direct manipulation. 
    get button(){
      return win.document.querySelector("#tabcandy-button");
    },

    _render: function(){
      var body = context.document.body;
      var img = new Image();
      img.src = orignalButtonImage;
      var canvas = context.document.createElement("canvas");
      body.appendChild(canvas);
      var ctx = canvas.getContext("2d");
      [canvas.width, canvas.height] = [img.width, img.height];
      ctx.drawImage(img,0,0);

      if( this._unreadCount >= 1 ){
        ctx.fillStyle = "rgb(0x26,0x26,0x26)";
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.arc(27,15,7,0,2*Math.PI, false);
        ctx.globalAlpha = .8;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.stroke();
      
        ctx.textAlign = "center";
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillText(this._unreadCount, 27,18);
      }
      
      var dataURL = canvas.toDataURL();    
      this.button.image = dataURL;
      body.removeChild(canvas);

    },

    // ----------
    // Variable: unread
    // A getter/setter that allows you to get/set the number of
    // "unread" tabs. This unread count gets displayed as a
    // badge in the TabCandy icon. Use it as such:
    // > Toolbar.unread += 1
    set unread(val){
      this._unreadCount = parseInt(val);
      this._render();
    },

    get unread(){ return this._unreadCount; }
  }  
  context.Toolbar = Toolbar;
  Toolbar._render();
}

})(window);