const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const purchasecontroller=require('../controller/purchase');

router.get('/purchase/buypremium',authenticate.authenticate,purchasecontroller.buypremium);

router.post('/purchase/updatepremiummembers',authenticate.authenticate,purchasecontroller.updatepremiumuser);

router.post('/purchase/updatepremiumuseronfailure',authenticate.authenticate,purchasecontroller.updatepremiumuseronfailure);

module.exports=router;