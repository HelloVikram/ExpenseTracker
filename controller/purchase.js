const premiumService = require('../services/premiumService');

const buypremium = async (req, res) => {
    try {
        const amount = 2500;
        const order = await premiumService.createRazorpayOrder(amount);
        await premiumService.createUserOrder(req.user, order.id);
        res.status(201).json({ order, key_id: process.env.RAZORPAY_KEY_ID });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updatepremiumuser = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await premiumService.findOrderById(order_id);

        await premiumService.updateOrderStatus(order, payment_id, 'Successfull');
        await premiumService.updateUserPremiumStatus(req.user, true);
        res.status(202).json({ success: true, message: "Transaction successfull" });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error while updating premium user' });
    }
};

const updatepremiumuseronfailure = async (req, res) => {
    try {
        const { order_id } = req.body;
        const order = await premiumService.findOrderById(order_id);

        await premiumService.updateOrderStatus(order, null, 'failure');
        res.status(201).json({ success: false, message: 'Transaction Failed' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error while updating premium user' });
    }
};

module.exports = {
    buypremium,
    updatepremiumuser,
    updatepremiumuseronfailure
};