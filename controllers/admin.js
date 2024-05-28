const User = require('../models/user');
const Order = require('../models/order');
const bcrypt = require('bcryptjs');

exports.getHistoryAPI = async (req, res, next) => {
  const idUser = req.query.idUser;

  try {
    const orders = await Order.find({ idUser: idUser }).populate(
      'cart.productId'
    );

    res.status(200).json(orders);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const allOrder = await Order.find();
    res.status(200).json(allOrder);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getHistoryDetail = async (req, res, next) => {
  const idOrder = req.params.idOrder;

  if (!idOrder) {
    console.log(idOrder);
    next();
  }

  try {
    const order = await Order.findById(idOrder).populate('cart.productId');
    const detailCart = order.cart.map(item => ({
      idProduct: item.productId._id,
      nameProduct: item.productId.name,
      priceProduct: item.productId.price,
      img: item.productId.img1,
      count: item.count,
    }));

    res.status(200).json({ ...order._doc, cart: detailCart });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putUpdateUser = async (req, res, next) => {
  const idUser = req.query.idUser;
  const fullname = req.query.fullname;
  const phone = req.query.phone;
  const email = req.query.email;
  const password = req.query.password;
  const role = req.query.role;

  try {
    const user = await User.findById(idUser);
    if (!user) {
      const error = new Error('Could not find user.');
      err.statusCode = 404;
      throw error;
    }

    if (password) {
      const hashedPw = await bcrypt.hash(password, 12);
      user.password = hashedPw;
    }
    user._id = idUser;
    user.fullname = fullname;
    user.phone = phone;
    user.email = email;
    user.role = role;
    const result = await user.save();

    res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};