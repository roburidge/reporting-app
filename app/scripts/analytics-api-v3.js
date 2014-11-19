var visits,
    revenue,
    thisYear,
    lastYear,
    resultsArray;

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
      for(var i=0; i<allAccounts.length; i++){
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
      // queryCoreReportingApi(firstProfileId);

    } else {
      console.log('No views (profiles) found for this user.');
    }
  } else {
    console.log('There was an error querying views (profiles): ' + results.message);
  }
}

function queryCoreReportingApi(profileId) {
  console.log('Querying Core Reporting API.');







  var startDateElement = document.getElementById('input-start-date');
  var endDateElement = document.getElementById('input-end-date');

  if(startDateElement.value === '' || endDateElement.value === '') {

    var startDate = new Date();
    var endDate = new Date();
    startDate.setDate(startDate.getDate() - 32);
    endDate.setDate(endDate.getDate() - 1);

    var dd = startDate.getDate();
    var mm = startDate.getMonth()+1;
    var yyyy = startDate.getFullYear();

    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var humanStartDate = dd+'-'+mm+'-'+yyyy;

    startDateElement.value = humanStartDate;

    dd = endDate.getDate();
    mm = endDate.getMonth()+1;
    yyyy = endDate.getFullYear();

    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var humanEndDate = dd+'-'+mm+'-'+yyyy;

    endDateElement.value = humanEndDate;

  }

  var gaStartDate = startDateElement.value.split('-').reverse().join('-');
  var gaEndDate = endDateElement.value.split('-').reverse().join('-');

  var gaStartDateLastYear = gaStartDate.split('-');
  gaStartDateLastYear[0] = gaStartDateLastYear[0] - 1;
  gaStartDateLastYear = gaStartDateLastYear.join('-');

  var gaEndDateLastYear = gaEndDate.split('-');
  gaEndDateLastYear[0] = gaEndDateLastYear[0] - 1;
  gaEndDateLastYear = gaEndDateLastYear.join('-');

  var startDateArray = [gaStartDate, gaStartDateLastYear],
      endDateArray = [gaEndDate, gaEndDateLastYear];

  resultsArray = [];

  for (var sD = 0; sD < startDateArray.length; sD++) {

    (function (sD) {

      // Use the Analytics Service Object to query the Core Reporting API
      gapi.client.analytics.data.ga.get({
        'ids': 'ga:' + profileId,
        'start-date': startDateArray[sD],
        'end-date': endDateArray[sD],
        'metrics': 'ga:sessions,ga:transactionRevenue',
        'dimensions': 'ga:year,ga:month,ga:day',
        'segment': 'gaid::-5'
      }).execute(function putToVar(results) {
        resultsArray[sD] = results;
        console.log(resultsArray[sD].rows[0][3]);
      });

    })(sD);

  }

  function resultsArrayPopulated() {
    if(resultsArray[0] && resultsArray[1]) {
      console.log('Ready');
      handleCoreReportingResults(resultsArray);
    } else {
      console.log('Waiting');
      setTimeout(resultsArrayPopulated, 500);
    }
  }

  resultsArrayPopulated();

}

function handleCoreReportingResults(results) {
  if (results[0].error) {
    console.log('There was an error querying core reporting API: ' + results[0].message);

  } else if(results[1].error) {

    console.log('There was an error querying core reporting API: ' + results[1].message);

  } else {
    printResults(results);
  }
}


function printResults(results) {

  visits = [[], []],
  revenue = [[], []];

  for(var rA = 0; rA < resultsArray.length; rA++) {

    if (results[rA].rows && results[rA].rows.length) {
      console.log('View (Profile) Name: ', results[rA].profileInfo.profileName);
      
      for(var i=0; i < results[rA].rows.length; i++) {
        createVisitArr(results[rA].rows[i], rA);
        createRevenueArr(results[rA].rows[i], rA);
      }

    } else {
      console.log('No first year results found');
    }

  }

  //create the charts
  createVisitChart();
  createRevenueChart();

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

/*
$('#view-select').on('change', 'select.form-control', function(e){
  console.log(this.options);
  console.log(e);
  //queryCoreReportingApi(this.options[e.target.selectedIndex].value);
});
*/

$('#update-graph').on('click', function(e){
  e.preventDefault();
  var yourSelect = document.getElementById('select-view');
  queryCoreReportingApi(yourSelect.options[yourSelect.selectedIndex].value);
});




function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  // files is a FileList of File objects. List some properties.
  var f = files[0];
  var output = '<strong>' + f.name + '</strong> (' + f.type + ') - ' + f.size + ' bytes, last modified: ' + f.lastModifiedDate.toLocaleDateString();

  document.getElementById('list').innerHTML =  output ;

  var reader = new FileReader();

  // Closure to capture the file information.
  reader.onload = (function(theFile) {
    return function(e) {
      console.log(e.target.result);
    };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsText(f);

}

document.getElementById('projectedInputFile').addEventListener('change', handleFileSelect, false);