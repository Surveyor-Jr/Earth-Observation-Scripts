var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_8DAY_NDVI')
                  .filterDate('2019-01-01', '2019-12-31');
var colorized = dataset.select('NDVI');
var colorizedVis = {
  min: 0.0,
  max: 1.0,
  palette: [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
    '012E01', '011D01', '011301'
  ],
};
Map.setCenter(29.88738, -19.7248, 15);
Map.addLayer(colorized, colorizedVis, 'Colorized');

// Create a panel to hold the user interface widgets.
var panel = ui.Panel();
ui.root.insert(0, panel);


var exportButton = ui.Button('Export as TIFF', function() {
  exportImage();
});
panel.add(exportButton);

function exportImage() {
  var geometry = Map.drawingTools().addLayer();
  Map.drawingTools().setShape('polygon');
  
  // Wait for the user to draw a polygon
  Map.onClick(function (coords) {
  var bounds = ee.Geometry.Rectangle(coords.lon - 0.1, coords.lat - 0.1, coords.lon + 0.1, coords.lat + 0.1);
  geometry.setGeometry(bounds);
  Map.drawingTools().stop();
  Map.onClick(null);
  // Clip the image to the polygon and export as a TIFF
  var clipped = colorized.clip(geometry);
  Export.image.toDrive({
    image: clipped,
    description: 'ndvi_analysis',
    scale: 30,
    region: geometry.bounds(),
    fileFormat: 'GeoTIFF'
  });
  // Remove the geometry from the map
  Map.drawingTools().layers().remove(geometry);
  // Clear the user interface
  panel.clear();
  // Add the export button again
  panel.add(exportButton);
});

  // Add the geometry to the map
  Map.drawingTools().layers().add(geometry);
}
