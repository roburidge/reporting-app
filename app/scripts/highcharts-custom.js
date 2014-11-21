var chartOptions = {
  chart: {
    renderTo: 'predicted-visits'
  },
  title: {
    text: 'Organic Visitors'
  },
  xAxis: {
    type: 'datetime',
    title: {
      text: 'Date'
    }
  },
  yAxis: {
    title:
{      text: 'Visits (per day)'
    },
    min: 0
  },
  series: []
};


function buildChart(csvData) {
  var lines = csvData.split('\n');
  
  $.each(lines, function(lineNo, line) {
    var items = line.split(',');
    var formattedItems = [Date.UTC(items[0], items[1], items[2]), parseFloat(items[3])];

    var series = {
      data: []
    };
    $.each(formattedItems, function(itemNo, item) {
      /*
      if (itemNo === 0) {
        series.name = item;
      } else { */
      series.data.push(parseFloat(item));
      //}
    });
    
    chartOptions.series.push(series);

  });

  // Create the chart
  var chart = new Highcharts.Chart(chartOptions);

}



$.get('data.csv', function(data) {
  // Split the lines
  var lines = data.split('\n');
  
  // Iterate over the lines and add categories or series
  $.each(lines, function(lineNo, line) {
      var items = line.split(',');
      
      // header line containes categories
      if (lineNo === 0) {
        $.each(items, function(itemNo, item) {
          if (itemNo > 0) {
            chartOptions.xAxis.categories.push(item);
          }
        });
      }
      
      // the rest of the lines contain data with their name in the first 
      // position
      else {
        var series = {
          data: []
        };
        $.each(items, function(itemNo, item) {
          if (itemNo === 0) {
            series.name = item;
          } else {
            series.data.push(parseFloat(item));
          }
        });
        
        chartOptions.series.push(series);
  
      }
      
    });
    
  // Create the chart
  var chart = new Highcharts.Chart(chartOptions);
});



/* VISITS
======================== */
function createVisitArr(visitDataArr, minusYear) {
  var visitY = parseInt(visitDataArr[0], 10) + (minusYear);
  var visitM = parseInt(visitDataArr[1], 10) - 1;
  var visitD = parseInt(visitDataArr[2], 10);
  var visitNum = parseInt(visitDataArr[3], 10);
  visits[minusYear].push([[visitY, visitM, visitD], visitNum]);
}

function createVisitChart() {

  for(var j = 0; j < 2; j++) {

    for (var i = 0; i < visits[j].length; i++) {
      console.log(visits[j][i][0]);
      visits[j][i][0] = Date.UTC(visits[j][i][0][0], visits[j][i][0][1], visits[j][i][0][2]);
    }

  }

  console.log('Visits array:');
  console.log(visits);

  var d = new Date();
  d.setDate(d.getDate() - 30);
  $('#visits').highcharts({
    title: {
      text: 'Organic Visitors'
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        text: 'Visits (per day)'
      },
      min: 0
    },
    tooltip: {
      xDateFormat: '%b %d',
      shared: true
    },
    series: [{
      name: 'This Year',
      data: visits[0]
    }, {
      name: 'Last Year',
      data: visits[1]
    }]
  });
}

/* REVENUE
======================== */
function createRevenueArr(revenueDataArr, minusYear) {
  var revenueY = parseInt(revenueDataArr[0], 10) + (minusYear);
  var revenueM = parseInt(revenueDataArr[1], 10) - 1;
  var revenueD = parseInt(revenueDataArr[2], 10);
  var revenueNum = parseInt(revenueDataArr[4], 10);
  revenue[minusYear].push([[revenueY, revenueM, revenueD], revenueNum]);
}

function createRevenueChart() {

  for(var j = 0; j < 2; j++) {

    for (var i = 0; i < revenue[j].length; i++) {
      revenue[j][i][0] = Date.UTC(revenue[j][i][0][0], revenue[j][i][0][1], revenue[j][i][0][2]);
    }

  }

  console.log('Revenue array:');
  console.log(revenue);

  var d = new Date();
  d.setDate(d.getDate() - 30);
  $('#revenue').highcharts({
    title: {
      text: 'Organic Revenue'
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        text: 'Revenue (per day)'
      },
      min: 0
    },
    tooltip: {
      xDateFormat: '%b %d',
      shared: true
    },
    series: [{
      name: 'This Year',
      data: revenue[0]
    }, {
      name: 'Last Year',
      data: revenue[1]
    }]
  });
}