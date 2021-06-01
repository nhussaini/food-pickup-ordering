$(document).ready(function() {

  $('#counter-form').submit((event) => {
    event.preventDefault();
  });

  let counter = $('#counter').val();

  $('.plus').click(function() {
    counter ++;
    $('.counter').val(counter);
  });

  $('.minus').click(function() {
    if (counter <= 0) {
      $('.counter').click().off();
    } else {
      counter --;
      $('.counter').val(counter);
    }

  });

});
