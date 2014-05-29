var currentVisits,
		oldVisits;

// Execute this function when the 'Make API Call' button is clicked
function makeApiCall() {
	console.log('Starting Request Process...');
	queryAccounts();
}


function queryAccounts() {
	console.log('Querying Accounts.');

	// Get a list of all Google Analytics accounts for this user
	gapi.client.analytics.management.accounts.list().execute(handleAccounts);
}


function handleAccounts(results) {
	// remove any existing options
	removeSelectContent('#account-select');
	if (!results.code) {
		if (results && results.items && results.items.length) {

			var allAccounts = results.items;
			allAccounts.sort(compareNames);
			// get the first google analytics account from the re-ordered array
			var firstAccountId = allAccounts[0].id;


			// Add all account names to the account select
			for(var i=0; i < allAccounts.length; i++){
				$('#account-select').find('select.form-control').append('<option value="' + allAccounts[i].id + '">' + allAccounts[i].name + '</option>');
			}

			// Query for Web Properties
			queryWebproperties(firstAccountId);

		} else {
			console.log('No accounts found for this user.');
		}
	} else {
		console.log('There was an error querying accounts: ' + results.code + ' - ' + results.message);
	}
}


function queryWebproperties(accountId) {
	console.log('Querying Webproperties.');

	// Get a list of all the Web Properties for the account
	gapi.client.analytics.management.webproperties.list({'accountId': accountId}).execute(handleWebproperties);
}


function handleWebproperties(results) {
	// remove any existing options
	removeSelectContent('#property-select');
	if (!results.code) {
		if (results && results.items && results.items.length) {

			var allWebproperties = results.items;

			allWebproperties.sort(compareNames);

			// Get the first Google Analytics account
			var firstAccountId = allWebproperties[0].accountId;
			// Get the first Web Property ID
			var firstWebpropertyId = allWebproperties[0].id;

			// Add all property names to the property select
			for(var i=0; i < allWebproperties.length; i++){
				$('#property-select').find('select.form-control').append('<option value="' + allWebproperties[i].id + '">' + allWebproperties[i].name + '</option>');
			}

			// Query for Views (Profiles)
			queryProfiles(firstAccountId, firstWebpropertyId);

		} else {
			console.log('No webproperties found for this user.');
		}
	} else {
			console.log('There was an error querying webproperties: ' + results.message);
	}
}


function queryProfiles(accountId, webpropertyId) {
	console.log('Querying Views (Profiles).');

	// Get a list of all Views (Profiles) for the first Web Property of the first Account
	gapi.client.analytics.management.profiles.list({
			'accountId': accountId,
			'webPropertyId': webpropertyId
	}).execute(handleProfiles);
}


function handleProfiles(results) {
	// remove any existing options
	removeSelectContent('#view-select');
	if (!results.code) {
		if (results && results.items && results.items.length) {

			// Get the first View (Profile) ID
			var firstProfileId = results.items[0].id;

			var allProfiles = results.items;

			// Add all view names to the view select
			for(var i=0; i < allProfiles.length; i++){
				$('#view-select').find('select.form-control').append('<option value="' + allProfiles[i].id + '">' + allProfiles[i].name + '</option>');
			}

			// Query the Core Reporting API
			queryCoreReportingApi(firstProfileId);
			queryCoreReportingApi2(firstProfileId);

		} else {
			console.log('No views (profiles) found for this user.');
		}
	} else {
		console.log('There was an error querying views (profiles): ' + results.message);
	}
}


function queryCoreReportingApi(profileId) {
	console.log('Querying Core Reporting API.');

	// Use the Analytics Service Object to query the Core Reporting API
	gapi.client.analytics.data.ga.get({
		'ids': 'ga:' + profileId,
		'start-date': '30daysAgo',
		'end-date': 'yesterday',
		'metrics': 'ga:visits',
		'dimensions': 'ga:year,ga:month,ga:day'
	}).execute(handleCoreReportingResults);
}
function queryCoreReportingApi2(profileId) {
	console.log('2nd Querying Core Reporting API.');

	// Use the Analytics Service Object to query the Core Reporting API
	gapi.client.analytics.data.ga.get({
		'ids': 'ga:' + profileId,
		'start-date': '395daysAgo',
		'end-date': '366daysAgo',
		'metrics': 'ga:visits',
		'dimensions': 'ga:year,ga:month,ga:day'
	}).execute(handleCoreReportingResults2);
}

function handleCoreReportingResults(results) {
	if (results.error) {
		console.log('There was an error querying core reporting API: ' + results.message);

	} else {
		printResults(results);
	}
}
function handleCoreReportingResults2(results) {
	if (results.error) {
		console.log('There was an error querying core reporting API: ' + results.message);

	} else {
		printResults2(results);
	}
}


function printResults(results) {
	if (results.rows && results.rows.length) {
		console.log('View (Profile) Name: ', results.profileInfo.profileName);

		//console.log(results);

		currentVisits = [];
		
		for(var i=0; i<results.rows.length; i++){
			createVisitArr(results.rows[i]);
		}

		// createVisitChart(); //create the chart
	} else {
		console.log('No results found');
	}
}
function printResults2(results) {
	if (results.rows && results.rows.length) {
		console.log('View (Profile) Name: ', results.profileInfo.profileName);

		//console.log(results);

		oldVisits = [];
		
		for(var i=0; i<results.rows.length; i++){
			createVisitArr2(results.rows[i]);
		}

		createVisitChart();
	} else {
		console.log('No results found');
	}
}


function compareNames(a, b) {
	if (a.name.toLowerCase() > b.name.toLowerCase())
		return 1;
	if (a.name.toLowerCase() < b.name.toLowerCase())
		return -1;
	// a must be equal to b
	return 0;
}

function removeSelectContent(type) {
	$(type).find('select.form-control').contents().remove();
}


$('#account-select').on('change', 'select.form-control', function(e){
	queryWebproperties(this.options[e.target.selectedIndex].value);
});

$('#property-select').on('change', 'select.form-control', function(e){
	queryProfiles($('#account-select').find('select.form-control').val(), this.options[e.target.selectedIndex].value);
});

$('#view-select').on('change', 'select.form-control', function(e){
	queryCoreReportingApi(this.options[e.target.selectedIndex].value);
	queryCoreReportingApi2(this.options[e.target.selectedIndex].value);
});