
const express = require('express');
const { createOrder, getOrders, cancelOrder, editOrder } = require('../controllers/orderController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Correctly import the middleware

router.post('/', createOrder);
router.get('/', getOrders);
router.delete('/:id', authMiddleware, cancelOrder); // Cancel order
router.put('/:id', authMiddleware, editOrder); // Edit order

module.exports = router;
