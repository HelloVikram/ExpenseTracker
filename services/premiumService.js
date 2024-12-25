const Razorpay = require('razorpay');
const Order = require('../models/orders');

const createRazorpayOrder = async (amount) => {
    const rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    return new Promise((resolve, reject) => {
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) return reject(err);
            resolve(order);
        });
    });
};

const createUserOrder = async (user, orderId) => {
    return await user.createOrder({ orderId, status: 'PENDING' });
};

const findOrderById = async (orderId) => {
    return await Order.findOne({ where: { orderId } });
};

const updateOrderStatus = async (order, paymentId, status) => {
    const updateData = { status };
    if (paymentId) updateData.paymentId = paymentId;
    return await order.update(updateData);
};

const updateUserPremiumStatus = async (user, isPremium) => {
    return await user.update({ isPremium });
};

module.exports = {
    createRazorpayOrder,
    createUserOrder,
    findOrderById,
    updateOrderStatus,
    updateUserPremiumStatus
};
