if( location.hash ){
  $(".menu li").removeClass("active");
	var nav = $("li."+location.hash.substr(1));
  nav.addClass("active");
}


(function($){

  var url1 = /(^|"|&lt;|\s)(www\..+?\..+?)(\s|&gt;|"|$)/g,
      url2 = /(^|"|&lt;|\s)(((https?|ftp):\/\/|mailto:).+?)(\s|&gt;|"|$)/g;

  $.fn.linkify = function () {
    return this.each(function () {
      var childNodes = this.childNodes,
          i = childNodes.length;
      while(i--)
      {
        var n = childNodes[i];
        if (n.nodeType == 3) {
          var html = n.nodeValue;
          if (/\S/.test(html))
          {
            html = html.replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/>/g, '&gt;')
                       .replace(url1, '$1<a class="linked" href="<``>://$2">[link]</a>$3')
                       .replace(url2, '$1<a class="linked" href="$2">[link]</a>$5')
                       .replace(/"<``>/g, '"http');
            $(n).after(html).remove();
          }
        }
        else if (n.nodeType == 1 && !/^(a|button|textarea)$/i.test(n.tagName)) {
          arguments.callee.call(n);
        }
      };
    });
  };

})(jQuery);



function render(el, entries){
  var ul = $("<ul class='bugs'>");
  for each( var entry in entries ){
    var li = $("<li><span class='for'/> <a/></li>");
    var a = li.find("a");
    a.text( entry.title ).attr("href", entry.link);      
    if( entry.assignee && !entry.assignee.length && !entry.assignee.match("nobody") ){
      var forEl = li.find(".for");
      assignedTo = entry.content.match(/Assignee[\s\S]*?>(.*)</i)[1];
      forEl.text(entry.assignee);
    }
    ul.append(li);
  }
  $(el).append(ul);
}

function renderByAssignee(el, entries){
  var bugs = {};
  for each( var entry in entries ){
    assignedTo = entry.content.match(/Assignee[\s\S]*?>(.*)</i)[1];
    if( bugs[assignedTo] == null ) bugs[assignedTo] = [];
    entry.assignee = assignedTo;
    bugs[assignedTo].push( entry );
  }
  
  for( var assignee in bugs ){
    var group = $("<div class='group'><div class='peep'/><div class='bugs'/></div>");
    group.find(".peep").text(assignee);
    var bugsEl = group.find(".bugs");
    render(bugsEl, bugs[assignee]);
    $(el).append(group);
  }
}

setTimeout(function(){
  var feed = new google.feeds.Feed("https://bugzilla.mozilla.org/buglist.cgi?bug_status=NEW&bug_status=ASSIGNED&classification=Other&component=TabCandy&email1=nobody&emailassigned_to1=1&emailtype1=notregexp&product=Mozilla%20Labs&query_format=advanced&title=Bug%20List&ctype=atom");
  feed.setNumEntries(20);
  feed.load(function(result) { renderByAssignee("#assigned", result.feed.entries) });

  var feed2 = new google.feeds.Feed("https://bugzilla.mozilla.org/buglist.cgi?bug_status=RESOLVED&bug_status=CLOSED&classification=Other&component=TabCandy&product=Mozilla%20Labs&query_format=advanced&resolution=FIXED&title=Bug%20List&ctype=atom");
  feed2.setNumEntries(10);
  feed2.load(function(result) { render("#fixed", result.feed.entries) });

  var feed3 = new google.feeds.Feed("https://bugzilla.mozilla.org/buglist.cgi?classification=Other&component=TabCandy&product=Mozilla%20Labs&query_format=advanced&title=Bug%20List&ctype=atom");
  feed3.setNumEntries(10);
  feed3.load(function(result) { render("#recent", result.feed.entries) });  
}, 500); 

$("<script/>").attr("src","http://azarask.in/projects/tabcandy/todo.php").appendTo("body");

function processItems(text){
  items = text.match(/\*.*/g);
  if( !items ) return [];
  var newItems = [];
  for(var i=0; i<items.length; i++){
    if( items[i].length > 5 ){
      newItems.push(items[i].substr(2));  
    }
  }
  return newItems;
}

function renderTodo(el, items){
  var ul = $("<ul class='todo'/>");
  for each( var item in items){
    $("<li/>").text(item).appendTo(ul);
  }
  $(el).append(ul);
}

function onTodoReady(data){
  var P1s = processItems(data.match(/== P1 ==([\s\S]*?)==/m)[1]);
  var P2s = processItems(data.match(/== P2 ==([\s\S]*?)==/m)[1]);
  var P3s = processItems(data.match(/== P3 ==([\s\S]*?)==/m)[1]);
    
  renderTodo("#P1s", P1s);
  renderTodo("#P2s", P2s);  
  renderTodo("#P3s", P3s);
  
  $(".todo").linkify();
}