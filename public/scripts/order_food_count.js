const cart = localStorage.getItem("cart");

if (!cart) {
  localStorage.setItem("cart", JSON.stringify({}));
}

$(document).ready(function () {
  $("#counter-form").submit((event) => {
    event.preventDefault();
  });

  $(".count-button-plus").click(function () {
    const $id = $(this).next();
    const $price = $id.next();
    const $time = $price.next();
    const id = $id.val();
    const price = $price.val();
    const time = $time.val();
    const addObj = { id, price, time, qty: 1 };
    const cart1 = localStorage.getItem("cart");
    const parsedCart = JSON.parse(cart1);

    if (!parsedCart[id]) {
      parsedCart[id] = addObj;
    } else {
      parsedCart[id].qty++;
    }

    localStorage.setItem("cart", JSON.stringify(parsedCart));

    if (parsedCart[id].qty <= 0) {
      $(".count-button-minus").prop("disabled", true);
    } else if (parsedCart[id].qty > 0) {
      $(".count-button-minus").removeAttr("disabled");
    }
  });

  $(".count-button-minus").click(function () {
    const $id2 = $(this).next();
    const $price2 = $id2.next();
    const $time2 = $price2.next();
    const id = $id2.val();
    const price = $price2.val();
    const time = $time2.val();
    const cart1 = localStorage.getItem("cart");
    const parsedCart = JSON.parse(cart1);

    if (!parsedCart[id]) {
      parsedCart[id] = null;
    } else {
      parsedCart[id].qty--;
    }

    localStorage.setItem("cart", JSON.stringify(parsedCart));

    if (parsedCart[id].qty <= 0) {
      $(".count-button-minus").prop("disabled", true);
    } else if (parsedCart[id].qty > 0) {
      $(".count-button-minus").removeAttr("disabled");
    }
  });

  $(".submit-order").click(function (event) {
    event.preventDefault();
    data = $("#cart");
    const cart = localStorage.getItem("cart");
    data.val(cart);
    $(".submit-order").submit();
  });

  $(".submit-order1").click(function () {
    console.log("local storage cart", localStorage.getItem("cart"));

    $.ajax({
      type: "POST",
      url: "/api/orders",
      data: JSON.parse(localStorage.getItem("cart")),
    }).then((res) => {
      console.log("res:", res);
    });
  });
});
