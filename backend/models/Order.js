
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure this is defined
  caterer: { type: String, required: true },
  date: { type: Date, required: true },
  selectedItems: [{ category: String, name: String }]
});

module.exports = mongoose.model('Order', orderSchema);
