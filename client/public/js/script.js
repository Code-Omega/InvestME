$(document).ready(function () {
  $('#test').rssfeed('http://finance.yahoo.com/rss/headline?s=yhoo', {limit: 25, header:false});
});
