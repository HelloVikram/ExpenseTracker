const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const expensecontroller=require('../controller/expense');

router.post('/expense/add-expense', authenticate.authenticate,expensecontroller.addExpense );

router.get('/expense/get-expense', authenticate.authenticate,expensecontroller.getExpense );

router.delete('/expense/delete-expense/:id',authenticate.authenticate,expensecontroller.deleteExpense );

router.get('/expense/details',authenticate.authenticate,expensecontroller.ispremium);

router.get('/expense/download',authenticate.authenticate,expensecontroller.downloadexpenses);


module.exports=router;