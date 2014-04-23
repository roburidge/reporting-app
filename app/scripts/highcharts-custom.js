var visits = [];

function createVisitArr(visitNum) {
	var number = parseInt(visitNum, 10);
	visits.push(number);
}

function createVisitChart() {
	var d = new Date();
	d.setDate(d.getDate() - 30);
	console.log(d.valueOf());
	$('#visits').highcharts({
		title: {
			text: 'Visitors over time'
		},
		xAxis: {
			type: 'datetime'
		},
		yAxis: {
			title: {
				text: ''
			}
		},
		series: [{
			name: 'Visits',
			data: visits,
			pointStart: d.valueOf(),
			pointInterval: 1000 * 60 * 60 * 24 // one day
		}]
	});
}