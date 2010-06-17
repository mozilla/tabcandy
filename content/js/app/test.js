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
 * The Original Code is test.js.
 *
 * The Initial Developer of the Original Code is
 * Ian Gilman <ian@iangilman.com>.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
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
// Title: test.js 

(function(){

var testsRun = 0;
var testsFailed = 0;

// ----------
function ok(value, message) {
  testsRun++;
  if(!value) {
    Utils.log('test failed: ' + message);
    testsFailed ++;
  }
}

// ----------
function is(actual, expected, message) {
  ok(actual == expected, message + '; actual = ' + actual + '; expected = ' + expected);
}

// ----------
function isnot(actual, unexpected, message) {
  ok(actual != unexpected, message + '; actual = ' + actual + '; unexpected = ' + unexpected);
}

// ##########
function TabStub() {
  this.mirror = {
    addOnClose: function() {},
    addSubscriber: function() {},
    removeOnClose: function() {}
  };
  
  this.url = '';
  this.close = function() {};
  this.focus = function() {};
}

// ----------
function test() {
  try {
    Utils.log('unit tests starting -----------');
    
    // ___ iQ
    var $div = iQ('<div>');
    ok($div, '$div');
    
    is($div.css('padding-left'), '0px', 'padding-left initial');
    var value = '10px';
    $div.css('padding-left', value);
    is($div.css('padding-left'), value, 'padding-left set');
  
    is($div.css('z-index'), 'auto', 'z-index initial');
    value = 50;
    $div.css('zIndex', value);
    is($div.css('z-index'), value, 'z-index set');
    is($div.css('zIndex'), value, 'zIndex set');
  
    // ___ TabItem
    var box = new Rect(10, 10, 100, 100);
    $div = iQ('<div>')
      .addClass('tab')
      .css({
        left: box.left, 
        top: box.top,
        width: box.width,
        height: box.height
      })
      .html('<div class="thumb" /><div class="tab-title" />')
      .appendTo('body');
      
    is($div.width(), box.width, 'widths match');
    is($div.height(), box.height, 'heights match');
    
    var tabItem = new TabItem($div.get(0), new TabStub());
    box = new Rect(20, 20, 200, 200);
    tabItem.setBounds(box); 
    ok(box.equals(tabItem.getBounds()), 'set/get match');
    tabItem.reloadBounds();
    var box2 = tabItem.getBounds();
    ok(box.equals(box2), 'reload match');   
    
    // ___ done
    Utils.log('unit tests done', testsRun, (testsFailed ? testsFailed + ' tests failed!!' : ''));
  } catch(e) {
    Utils.log(e);
  }
}

test();

})();
