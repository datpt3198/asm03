const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/products', shopController.getProducts);

router.get('/products/category', shopController.getCategory);

router.get('/products/pagination', shopController.getPagination);

router.get('/products/:prodId', shopController.getDetail);

router.get(
  '/carts',
  isAuth(['Admin', 'Customer', 'CS']),
  shopController.getCarts
);
// Cart
router.post('/carts/add', shopController.postAddToCart);

router.delete('/carts/delete/:query', shopController.deleteToCart);

router.put(
  '/carts/update',
  isAuth(['Admin', 'Customer', 'CS']),
  shopController.putToCart
);

router.post(
  '/email',
  isAuth(['Admin', 'Customer', 'CS']),
  shopController.postEmail
);

module.exports = router;