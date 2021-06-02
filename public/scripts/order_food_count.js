/* eslint-disable no-undef */

const cart = localStorage.getItem("cart");

if (!cart) {
  localStorage.setItem('cart', JSON.stringify({}));
}


$(document).ready(function() {

  $('#counter-form').submit((event) => {
    event.preventDefault();
  });

  $('.count-button-plus').click(function() {

    const $id = $(this).next();
    const $price = $id.next();
    const $time = $price.next();

    const id = $id.val();
    const price = $price.val();
    const time = $time.val();

    const addObj = {id, price, time, qty: 1};

    const cart1 = localStorage.getItem('cart');

    const parsedCart = JSON.parse(cart1);

    console.log('parsed cart', parsedCart);

    if (!parsedCart[id]) {
      parsedCart[id] = addObj;

    } else {
      parsedCart[id].qty ++;
    }

    localStorage.setItem('cart', JSON.stringify(parsedCart));

    console.log(localStorage);
    console.log(parsedCart);

  });

  $('.count-button-minus').click(function() {

    const id = $('.id').val();

    const cart1 = localStorage.getItem('cart');

    const parsedCart = JSON.parse(cart1);

    if (!parsedCart[id]) {
      parsedCart[id] = null;

    } else {
      parsedCart[id].qty --;
    }

    console.log(parsedCart);
  });


  $('.submit-order').click(function() {

    const cart1 = localStorage.getItem('cart');

    $.ajax({
      type: 'POST',
      url: '/api/orders',
      dataType: 'JSON'
    })
      .then();

  });

});
