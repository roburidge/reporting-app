

function createVisitArr(visitDataArr) {
	var visitY = parseInt(visitDataArr[0], 10) - 1;
	var visitM = parseInt(visitDataArr[1], 10) - 1;
	var visitD = parseInt(visitDataArr[2], 10);
	var visitNum = parseInt(visitDataArr[3], 10);
	currentVisits.push([Date.UTC(visitY, visitM, visitD), visitNum]);
}
function createVisitArr2(visitDataArr) {
	var visitY = parseInt(visitDataArr[0], 10);
	var visitM = parseInt(visitDataArr[1], 10) - 1;
	var visitD = parseInt(visitDataArr[2], 10);
	var visitNum = parseInt(visitDataArr[3], 10);
	oldVisits.push([Date.UTC(visitY, visitM, visitD), visitNum]);
}

function createVisitChart() {
	var d = new Date();
	d.setDate(d.getDate() - 30);
	//console.log(d.valueOf());
	$('#visits').highcharts({
		title: {
			text: 'Visitors'
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
			name: 'Current',
			data: currentVisits
		}, {
			name: 'Last Year',
			data: oldVisits
		}]
	});
	//currentVisits = [];
	//oldVisits = [];
}