console.log('\'Allo \'Allo!');

$.datepicker.setDefaults({
  dateFormat: 'dd-mm-yy'
});

$('#start-date').find('input.form-control').datepicker();

$('#end-date').find('input.form-control').datepicker();