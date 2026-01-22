const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const Review = require('./Review');

module.exports = (db) => ({
  User: new User(db),
  Product: new Product(db),
  Order: new Order(db),
  Review: new Review(db)
});