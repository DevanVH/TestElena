window.onload = function () {
  // Configurar Paper.js con el canvas
  paper.setup(document.getElementById("canvas"));

  // Instalar Paper.js en el contexto global
  paper.install(window);

  var raster = new Raster({
    source: "./assets/img.jpg",
    smoothing: "off",
    onLoad: function () {
      // Escalar el raster para que ocupe todo el canvas
      raster.fitBounds(view.bounds, true);
    },
  });
  // Make the raster invisible:
  raster.visible = false;

  var lastPos = view.center;
  function moveHandler(event) {
    if (lastPos.getDistance(event.point) < 10) return;
    lastPos = event.point;

    var size = this.bounds.size.clone();
    var isLandscape = size.width > size.height;

    // Redondear el tamaño
    size.x = Math.ceil(size.x / (isLandscape ? 2 : 1));
    size.y = Math.ceil(size.y / (isLandscape ? 1 : 2));

    var path = new paper.Path.Rectangle({
      point: this.bounds.topLeft.floor(),
      size: size,
      onMouseMove: moveHandler,
    });
    path.fillColor = raster.getAverageColor(path);

    var newSize = new paper.Size(Math.floor(size.x), Math.floor(size.y));

    var path2 = new paper.Path.Rectangle({
      point: isLandscape
        ? this.bounds.topCenter.ceil()
        : this.bounds.leftCenter.ceil(),
      size: newSize,
      onMouseMove: moveHandler,
    });

    path2.fillColor = raster.getAverageColor(path2);
    this.remove();
  }
  function onResize(event) {
    project.activeLayer.removeChildren();

    // Transform the raster so that it fills the bounding rectangle
    // of the view:
    raster.fitBounds(view.bounds, true);

    // Create a path that fills the view, and fill it with
    // the average color of the raster:
    new Path.Rectangle({
      rectangle: view.bounds,
      fillColor: raster.getAverageColor(view.bounds),
      onMouseMove: moveHandler,
    });
  }

  onResize();
};
