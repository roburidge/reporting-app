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