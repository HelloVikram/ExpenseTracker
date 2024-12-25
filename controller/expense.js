const expenseService = require('../services/expenseService');
const sequelize = require('../util/database');

const addExpense = async (req, res) => {
    const { amount, description, category } = req.body;
    const userId = req.user.id;

    const t = await sequelize.transaction();
    try {
        const expense = await expenseService.createExpense(amount, description, category, userId, t);
        const User = await expenseService.findUserById(userId, t);
        if (!User) throw new Error('User not found');

        const newTotalExpense = Number(User.totalExpense) + Number(amount);
        await expenseService.updateUserExpense(User, newTotalExpense, t);

        await t.commit();
        res.status(201).json({ success: true, message: 'Expense added successfully', response: expense });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ success: false, message: 'Error adding expense', error: err.message });
    }
};

const getExpense = async (req, res) => {
    const userId = req.user.id;
    const page = Number(req.query.page );
    const limit = Number(req.query.limit);
    const offset = (page - 1) * limit;

    try {
        const expenses = await expenseService.findExpenses(userId, limit, offset);
        const count = await expenseService.countExpenses(userId);

        res.status(200).json({
            data: expenses,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(400).json({ message: 'Error fetching expenses' });
    }
};

const deleteExpense = async (req, res) => {
    const eid = req.params.id;

    const t = await sequelize.transaction();
    try {
        const expense = await expenseService.findExpenseById(eid, req.user.id, t);
        if (!expense) throw new Error('Expense not found or unauthorized');

        const User = await expenseService.findUserById(req.user.id, t);
        const newTotalExpense = Number(User.totalExpense) - Number(expense.amount);

        await expenseService.deleteExpenseById(eid, req.user.id, t);
        await expenseService.updateUserExpense(User, newTotalExpense, t);

        await t.commit();
        res.status(200).json({ success: true, message: 'Expense deleted successfully' });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ success: false, message: 'Error deleting expense' });
    }
};

const ispremium = async (req, res) => {
    try {
        res.status(200).json({ ispremium: req.user.isPremium });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error checking premium status' });
    }
};

const downloadexpenses = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenses = await expenseService.findExpenses(userId, null, null);
        const stringifiedExpenses = JSON.stringify(expenses);
        const filename = `${userId}/${Date.now()}/expenses.txt`;
        const BUCKETName = process.env.BUCKET;
        console.log(BUCKETName);
        const fileUrl = await expenseService.uploadToS3(BUCKETName, filename, stringifiedExpenses);
        await expenseService.saveUrl(userId, fileUrl);

        const urls = await expenseService.getSavedUrls(userId);
        res.status(201).json({ fileUrl, urls, success: true });
    } catch (err) {
        res.status(500).json({ error: 'Error downloading expenses', success: false });
    }
};

module.exports = {
    addExpense,
    getExpense,
    deleteExpense,
    ispremium,
    downloadexpenses,
};