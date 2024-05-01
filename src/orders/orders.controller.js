const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res) {
  res.json({ data: orders });
}

function create(req, res) {
  const {
    data: {
      id,
      deliverTo,
      mobileNumber,
      status,
      dishes = [({ id, name, description, image_url, price, quantity } = {})],
    } = {},
  } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };

  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
  console.log(newOrder);
}

function read(req, res) {
  const foundOrder = res.locals.order;
  res.json({ data: foundOrder });
}

function update(req, res) {
  const orderToUpdate = res.locals.order;
  const {
    data: {
      deliverTo,
      mobileNumber,
      status,
      dishes = [({ id, name, description, image_url, price, quantity } = {})],
    } = {},
  } = req.body;

  orderToUpdate.deliverTo = deliverTo;
  orderToUpdate.mobileNumber = mobileNumber;
  orderToUpdate.status = status;
  orderToUpdate.dishes = dishes;

  res.json({ data: orderToUpdate });
}

function destroy(req, res) {
  const { id } = res.locals.order;
  const index = orders.findIndex((order) => order.id === id);
  if (index > -1) {
    orders.splice(index, 1);
  }
  res.sendStatus(204);
}

//middleware functions-------------------------------
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Order must include a ${propertyName}` });
  };
}
function dishProperties(req, res, next) {
  const {
    data: {
      id,
      deliverTo,
      mobileNumber,
      status,
      dishes = ([{ name, description, image_url, price, quantity } = {}] = []),
    } = {},
  } = req.body;
  let testProperties = true;
  let errorDish;
  if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
    //if dishes is not an array or is empty array
    return next({ status: 400, message: `order must include a dish` });
  }

  for (let i in dishes) {
    // if it is an array, check quantity
    if (
      !dishes[i].quantity ||
      !Number.isInteger(dishes[i].quantity) ||
      dishes[i].quantity < 1
    ) {
      testProperties = false;
      errorDish = dishes[i].id;
    }
  }
  if (testProperties) {
    return next();
  } else {
    return next({
      status: 400,
      message: `dish ${errorDish} must have a quantity that is an integer greater than 0`,
    });
  }
}

function orderExists(req, res, next) {
  const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  next({
    status: 404,
    message: `Order id not found: ${req.params.orderId}`,
  });
}

function orderStatus(req, res, next) {
  const { id } = res.locals.order;
  const foundOrder = orders.find((order) => order.id === id);
  if (foundOrder.status !== "pending") {
    return next({
      status: 400,
      message: "An order cannot be deleted unless it is pending.",
    });
  }
  return next();
}

function matchIds(req, res, next) {
  const orderId = req.params.orderId;
  const {
    data: {
      id,
      deliverTo,
      mobileNumber,
      status,
      dishes = ([{ name, description, image_url, price, quantity } = {}] = []),
    } = {},
  } = req.body;
  if (!id || id === "" || id === null) {
    // if there is no ID, use the id from params
    return next();
  } else if (id && id !== orderId) {
    // if id isnt empyty, but doesnt match
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
    });
  } else {
    return next();
  }
}

function orderDelivered(req, res, next) {
  const order = res.locals.order;
  if (order.status === "delivered") {
    return next({
      status: 400,
      message: "A delivered order cannot be changed",
    });
  }
  return next();
}

function statusInvalid(req, res, next) {
  const {
    data: {
      id,
      deliverTo,
      mobileNumber,
      status,
      dishes = ([{ name, description, image_url, price, quantity } = {}] = []),
    } = {},
  } = req.body;
  if (
    status === "pending" ||
    status === "preparing" ||
    status === "out-for-delivery" ||
    status === "delivered"
  ) {
    return next();
  } else {
    return next({ status: 400, message: "Order status invalid" });
  }
}

module.exports = {
  list,
  create: [
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    dishProperties,
    create,
  ],

  read: [orderExists, read],
  update: [
    orderExists,
    matchIds,
    orderDelivered,
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    bodyDataHas("status"),
    statusInvalid,
    dishProperties,
    update,
  ],
  destroy: [orderExists, orderStatus, destroy],
};
