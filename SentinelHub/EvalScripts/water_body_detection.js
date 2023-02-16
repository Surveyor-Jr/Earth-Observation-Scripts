//VERSION=3
function setup() {
  return {
    input: ["B02", "B03", "dataMask"],
    output: { bands: 1 }
  }
}

function evaluatePixel(sample) {
  var NDWI = (sample.B03 - sample.B02) / (sample.B03 + sample.B02);
  var water = NDWI > 0.2 && sample.dataMask == 1;
  return [water];
}
