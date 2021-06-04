const results = db.query(sql1, [])
.then(results => {let order_id = results.rows[0].id;
  console.log(order_id)

  const addOrder = [];

  for (let food_id in req.body) {
    const order_food_info = req.body[food_id];
    addOrder.push([
      // order_food_info.order_id,
     //this should become the order id
      order_id,
      order_food_info.id,
      order_food_info.qty,
      order_food_info.price
    ]);
    res.redirect('/api/summary/');
  }})