window.addEvent('domready', function() {
  var myChart = new Chart.Bubble('grafo', {
    width: 300,
    height: 200,
    bubbleSize: 20
  });

  myChart.addBubble(10, 20, 30, '#f00', 'Bubble 1');
  myChart.addBubble(0, 40, 20, '#000', 'Bubble 2');

  myChart.redraw();
})


