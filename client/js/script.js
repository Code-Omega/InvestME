$(document).ready(function () {
  //$('#test').rssfeed('http://finance.yahoo.com/rss/headline?s=^GSPC,^dji,^ixic', {limit: 100, header:false, content:false, media:false, date:false});
  $("#portbtn").click(function(e){
      $("#portfolio").fadeToggle("slow");
      e.stopPropagation();
  });
  $("#stockbtn").click(function(e){
      $("#stockbar").fadeToggle("slow");
      console.log("gjkahgkashgsjkagjksg");
      e.stopPropagation();
  });
  $("body").click(function(e){
<<<<<<< Updated upstream
    $("#portfolio").fadeOut("slow");
    if(e.target.nodeName!='P'){
=======
      console.log($(e.target));
      if(($(e.target.nodeName ).is("#portfolio"))){console.log("hello");}
      $("#portfolio").fadeOut("slow");
>>>>>>> Stashed changes
      $("#stockbar").fadeOut("slow");
    }
  });

});
