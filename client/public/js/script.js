$(document).ready(function () {
  //$('#test').rssfeed('http://finance.yahoo.com/rss/headline?s=^GSPC,^dji,^ixic', {limit: 100, header:false, content:false, media:false, date:false});
  $("#portbtn").click(function(e){
      $("#portfolio").fadeToggle("slow");
      e.stopPropagation();
  });
  $("#stockbtn").click(function(e){
      $("#stockbar").fadeToggle("slow");
      console.log("hithithithi");
      e.stopPropagation();
  });
  $("body").click(function(){
      $("#portfolio").fadeOut("slow");
      $("#stockbar").fadeOut("slow");
  });

});
