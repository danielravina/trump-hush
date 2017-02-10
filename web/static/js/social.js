function openwindow(url) {
  var w = 640
  var h = 360
  var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/2);
  NewWindow=window.open(url,'newWin','width='+w+',height='+h+',toolbar=No,top='+top+', left='+left+',location=No,scrollbars=no,status=No,fullscreen=No');
  NewWindow.focus();
  void(0);
}


$('a.external').click(function(e) {
  e.preventDefault()
  openwindow($(e.target).data('href'))
})
