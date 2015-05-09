$(document).ready(function () {
  //$('#test').rssfeed('http://finance.yahoo.com/rss/headline?s=^GSPC,^dji,^ixic', {limit: 100, header:false, content:false, media:false, date:false});
  $("#portbtn").click(function(){
    $("#portfolio").fadeToggle("fast");
  });
});
