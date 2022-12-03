save = null;
if (document.body.type !== screen && document.body.clientWidth > 1400){
  $("#img-container").mouseenter(
    function(){
      if (save != null && save != undefined){
        save.kill();
      }

      save = new ImageZoom(document.getElementById("img-container"), {
        width: 456,
        height: 278,
        zoomWidth: 456,
        scale: 1,
        zoomStyle: 'width: 456px; height: 278px;',
        offset: {vertical: 0, horizontal: 50}
      });
    }
  );
}
